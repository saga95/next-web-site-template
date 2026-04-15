import type { AuditFinding } from '../../shared/scoring.js';
import { extractHeadings } from '../page/heading-analyzer.js';

export interface AeoAnalysisResult {
  findings: AuditFinding[];
  hasDirectAnswers: boolean;
  hasFaqOpportunities: boolean;
  snippetReadiness: 'strong' | 'moderate' | 'weak';
}

function findDirectAnswerBlocks(content: string): number {
  // Look for concise definition-style or answer-style paragraphs
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  let count = 0;

  for (const p of paragraphs) {
    const trimmed = p.trim();
    // Short, declarative paragraphs that could serve as direct answers
    if (
      trimmed.length > 30 &&
      trimmed.length < 300 &&
      (trimmed.match(/\bis\b/i) ||
        trimmed.match(/\bare\b/i) ||
        trimmed.match(/\bmeans\b/i) ||
        trimmed.match(/\brefers to\b/i))
    ) {
      count++;
    }
  }

  return count;
}

function findFaqOpportunities(
  content: string,
  headings: { level: number; text: string; line: number }[]
): { questions: string[]; hasExplicitFaq: boolean } {
  const questions: string[] = [];
  let hasExplicitFaq = false;

  // Check headings for question patterns
  for (const h of headings) {
    if (h.text.endsWith('?')) {
      questions.push(h.text);
    }
    if (/\bfaq\b/i.test(h.text) || /frequently asked/i.test(h.text)) {
      hasExplicitFaq = true;
    }
  }

  // Check content for question patterns not in headings
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.endsWith('?') &&
      trimmed.length > 15 &&
      trimmed.length < 200 &&
      !questions.includes(trimmed)
    ) {
      // Look for Q&A patterns like "Q:", "Question:", bold questions, etc.
      if (/^[QA*#>\-]/.test(trimmed) || /^\*\*/.test(trimmed)) {
        questions.push(
          trimmed.replace(/^[QA*#>\-\s:]+/, '').replace(/\*\*/g, '')
        );
      }
    }
  }

  return { questions, hasExplicitFaq };
}

function hasSnippetFriendlyFormatting(content: string): boolean {
  // Check for elements that help featured snippets
  const hasLists = /(<[uo]l|<li|^[-*]\s|^\d+\.\s)/im.test(content);
  const hasTables = /<table/i.test(content) || /\|.*\|.*\|/.test(content);
  const hasNumberedSteps =
    /step\s*\d/i.test(content) || /^\d+\.\s/m.test(content);
  const hasDefinitions = /\b(is|are|refers to|means|defined as)\b/i.test(
    content
  );

  return hasLists || hasTables || hasNumberedSteps || hasDefinitions;
}

export function analyzeAeo(
  content: string,
  filePath: string
): AeoAnalysisResult {
  const headings = extractHeadings(content);
  const findings: AuditFinding[] = [];

  // Direct answer blocks
  const directAnswerCount = findDirectAnswerBlocks(content);
  const hasDirectAnswers = directAnswerCount > 0;

  if (!hasDirectAnswers) {
    findings.push({
      category: 'aeo',
      issue: 'No direct answer blocks found',
      severity: 'high',
      impact:
        'Answer engines prioritize content that directly answers questions in concise paragraphs',
      action:
        'Add concise answer paragraphs (1-3 sentences) that directly define or explain key concepts early in the content',
      target: filePath,
    });
  }

  // FAQ opportunities
  const faqResult = findFaqOpportunities(content, headings);
  const hasFaqOpportunities = faqResult.questions.length > 0;

  if (!faqResult.hasExplicitFaq && faqResult.questions.length >= 2) {
    findings.push({
      category: 'aeo',
      issue: `${faqResult.questions.length} question-style headings found but no dedicated FAQ section`,
      severity: 'medium',
      impact:
        'Consolidating Q&A into an FAQ section with FAQPage schema improves answer engine visibility',
      action:
        'Consider adding a dedicated FAQ section with structured Q&A pairs and FAQPage schema markup',
      target: filePath,
    });
  }

  if (faqResult.questions.length === 0) {
    findings.push({
      category: 'aeo',
      issue: 'No question-based headings or FAQ content found',
      severity: 'medium',
      impact: 'Question-based headings match how users query answer engines',
      action:
        'Add headings that pose common user questions (e.g., "What is...?", "How do I...?") and answer them directly below',
      target: filePath,
    });
  }

  // Snippet-friendly formatting
  const snippetFriendly = hasSnippetFriendlyFormatting(content);

  if (!snippetFriendly) {
    findings.push({
      category: 'aeo',
      issue: 'No snippet-friendly formatting found',
      severity: 'medium',
      impact:
        'Lists, tables, and numbered steps are preferred formats for featured snippets',
      action:
        'Add structured content using ordered/unordered lists, tables, or numbered steps to improve snippet eligibility',
      target: filePath,
    });
  }

  // Heading clarity for answer matching
  const questionHeadings = headings.filter(h => h.text.endsWith('?'));
  const clearHeadings = headings.filter(h =>
    /^(how|what|why|when|where|which|who|can|do|does|is|are)\b/i.test(h.text)
  );

  if (questionHeadings.length === 0 && clearHeadings.length === 0) {
    findings.push({
      category: 'aeo',
      issue: 'No answer-intent headings found',
      severity: 'low',
      impact:
        'Answer engines match headings to user queries — question-style headings improve alignment',
      action:
        'Rewrite some headings as questions that users would ask, then provide clear answers below each',
      target: filePath,
    });
  }

  // Overall snippet readiness
  const snippetReadiness: AeoAnalysisResult['snippetReadiness'] =
    hasDirectAnswers && snippetFriendly
      ? 'strong'
      : hasDirectAnswers || snippetFriendly
        ? 'moderate'
        : 'weak';

  return {
    findings,
    hasDirectAnswers,
    hasFaqOpportunities,
    snippetReadiness,
  };
}
