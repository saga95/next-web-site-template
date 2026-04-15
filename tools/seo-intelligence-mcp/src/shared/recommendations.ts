import type { AuditFinding, AuditScore, Severity } from './scoring.js';

export interface Recommendation {
  priority: Severity;
  issue: string;
  impact: string;
  action: string;
  target?: string | undefined;
}

export function findingsToRecommendations(
  findings: AuditFinding[]
): Recommendation[] {
  const severityOrder: Severity[] = ['critical', 'high', 'medium', 'low'];

  return [...findings]
    .sort(
      (a, b) =>
        severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
    )
    .map(f => ({
      priority: f.severity,
      issue: f.issue,
      impact: f.impact,
      action: f.action,
      target: f.target,
    }));
}

export function formatAuditReport(
  pagePath: string,
  score: AuditScore,
  recommendations: Recommendation[]
): string {
  const lines: string[] = [];

  lines.push(`## SEO Audit Report: ${pagePath}`);
  lines.push('');
  lines.push(`**Overall Score: ${score.overall}/100**`);
  lines.push('');

  lines.push('### Category Scores');
  for (const cat of score.categories) {
    const emoji = cat.score >= 80 ? '✅' : cat.score >= 50 ? '⚠️' : '❌';
    lines.push(`- ${emoji} **${cat.category}**: ${cat.score}/${cat.maxScore}`);
  }
  lines.push('');

  if (recommendations.length === 0) {
    lines.push('No issues found. Great job!');
    return lines.join('\n');
  }

  lines.push('### Recommendations');
  lines.push('');

  for (const rec of recommendations) {
    const tag = `[${rec.priority.toUpperCase()}]`;
    lines.push(`#### ${tag} ${rec.issue}`);
    lines.push(`- **Impact**: ${rec.impact}`);
    lines.push(`- **Action**: ${rec.action}`);
    if (rec.target) {
      lines.push(`- **Location**: ${rec.target}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
