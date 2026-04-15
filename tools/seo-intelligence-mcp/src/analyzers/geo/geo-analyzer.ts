import type { AuditFinding } from '../../shared/scoring.js';
import { extractHeadings } from '../page/heading-analyzer.js';

export interface GeoAnalysisResult {
  findings: AuditFinding[];
  topicClarity: 'strong' | 'moderate' | 'weak';
  summaryReadiness: 'strong' | 'moderate' | 'weak';
}

function hasTopicFraming(
  content: string,
  headings: { level: number; text: string }[]
): boolean {
  const h1 = headings.find(h => h.level === 1);
  if (!h1) return false;

  // Check if the first substantial paragraph relates to the H1 topic
  const lines = content.split('\n').filter(l => l.trim().length > 50);
  if (lines.length < 1) return false;

  const h1Words = h1.text
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 3);
  const firstParagraph = lines.slice(0, 3).join(' ').toLowerCase();

  return h1Words.some(word => firstParagraph.includes(word));
}

function hasSummaryReadySections(content: string): boolean {
  // Look for concise paragraphs (2-4 sentences, under 300 chars) that could be extracted
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  const conciseParagraphs = paragraphs.filter(p => {
    const sentences = p.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.length >= 1 && sentences.length <= 4 && p.length < 300;
  });

  return conciseParagraphs.length >= 2;
}

function hasEntityClarity(content: string): boolean {
  // Check for proper nouns, defined terms, or structured references
  const properNouns = content.match(/[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/g);
  const definedTerms = content.match(/["']([^"']+)["']/g);
  const hasStructuredRefs =
    content.includes('@type') || content.includes('schema.org');

  return (
    (properNouns?.length ?? 0) > 3 ||
    (definedTerms?.length ?? 0) > 2 ||
    hasStructuredRefs
  );
}

function hasDirectIntent(
  _content: string,
  headings: { level: number; text: string }[]
): boolean {
  // Check if headings directly address user intent
  const intentPatterns = [
    /^(how|what|why|when|where|which|who)\b/i,
    /\b(guide|tutorial|tips|steps|best practices)\b/i,
    /\b(vs|versus|comparison|difference|review)\b/i,
  ];

  return headings.some(h => intentPatterns.some(p => p.test(h.text)));
}

export function analyzeGeo(
  content: string,
  filePath: string
): GeoAnalysisResult {
  const headings = extractHeadings(content);
  const findings: AuditFinding[] = [];

  // Topic framing check
  const topicFramed = hasTopicFraming(content, headings);
  if (!topicFramed) {
    findings.push({
      category: 'geo',
      issue: 'Weak topic framing in opening content',
      severity: 'high',
      impact:
        'Generative engines need clear topic signals early in the content to form accurate summaries',
      action:
        'Ensure the first paragraph clearly states the page topic and aligns with the H1 heading',
      target: filePath,
    });
  }

  // Entity clarity check
  const entityClear = hasEntityClarity(content);
  if (!entityClear) {
    findings.push({
      category: 'geo',
      issue: 'Low entity clarity — few named entities or defined terms',
      severity: 'medium',
      impact:
        'Generative engines rely on clear entity references to build accurate knowledge representations',
      action:
        'Use specific names, brands, technologies, or defined terms instead of vague references',
      target: filePath,
    });
  }

  // Summary readiness check
  const summaryReady = hasSummaryReadySections(content);
  if (!summaryReady) {
    findings.push({
      category: 'geo',
      issue: 'No summary-ready content sections found',
      severity: 'medium',
      impact:
        'Concise, self-contained paragraphs are easier for AI to extract and cite',
      action:
        'Add 2-4 sentence paragraphs that stand alone as clear, factual summaries of key points',
      target: filePath,
    });
  }

  // Direct intent coverage
  const intentCovered = hasDirectIntent(content, headings);
  if (!intentCovered) {
    findings.push({
      category: 'geo',
      issue: 'Content does not directly address user intent through headings',
      severity: 'medium',
      impact:
        'Headings that match search intent help generative engines map content to queries',
      action:
        'Use question-based or intent-aligned headings (e.g., "How to...", "What is...", "Best practices for...")',
      target: filePath,
    });
  }

  // Contextual completeness — check for supporting details
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 300) {
    findings.push({
      category: 'geo',
      issue: `Thin content (${wordCount} words)`,
      severity: 'high',
      impact:
        'Thin pages are unlikely to be cited by generative engines, which prefer comprehensive coverage',
      action:
        'Expand content to cover the topic more thoroughly with at least 500+ words of substantive content',
      target: filePath,
    });
  }

  // Determine overall ratings
  const topicClarity: GeoAnalysisResult['topicClarity'] =
    topicFramed && entityClear
      ? 'strong'
      : topicFramed || entityClear
        ? 'moderate'
        : 'weak';
  const summaryReadiness: GeoAnalysisResult['summaryReadiness'] =
    summaryReady && intentCovered
      ? 'strong'
      : summaryReady || intentCovered
        ? 'moderate'
        : 'weak';

  return { findings, topicClarity, summaryReadiness };
}
