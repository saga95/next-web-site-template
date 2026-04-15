export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface AuditFinding {
  category: string;
  issue: string;
  severity: Severity;
  impact: string;
  action: string;
  target?: string;
}

export interface CategoryScore {
  category: string;
  score: number;
  maxScore: number;
  findings: AuditFinding[];
}

export interface AuditScore {
  overall: number;
  categories: CategoryScore[];
}

const SEVERITY_WEIGHT: Record<Severity, number> = {
  critical: 25,
  high: 15,
  medium: 8,
  low: 3,
};

export function calculateCategoryScore(
  category: string,
  findings: AuditFinding[],
  maxScore = 100
): CategoryScore {
  const deductions = findings.reduce(
    (sum, f) => sum + SEVERITY_WEIGHT[f.severity],
    0
  );
  const score = Math.max(0, maxScore - deductions);

  return { category, score, maxScore, findings };
}

export function calculateOverallScore(categories: CategoryScore[]): number {
  if (categories.length === 0) return 100;

  const totalScore = categories.reduce((sum, c) => sum + c.score, 0);
  const totalMax = categories.reduce((sum, c) => sum + c.maxScore, 0);

  return totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 100;
}

export function buildAuditScore(categories: CategoryScore[]): AuditScore {
  return {
    overall: calculateOverallScore(categories),
    categories,
  };
}
