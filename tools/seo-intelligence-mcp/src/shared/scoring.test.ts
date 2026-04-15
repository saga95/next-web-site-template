import { describe, expect, it } from 'vitest';
import {
  type AuditFinding,
  buildAuditScore,
  calculateCategoryScore,
  calculateOverallScore,
} from '../shared/scoring.js';

describe('calculateCategoryScore', () => {
  it('returns max score when no findings', () => {
    const result = calculateCategoryScore('metadata', []);
    expect(result.score).toBe(100);
    expect(result.maxScore).toBe(100);
    expect(result.category).toBe('metadata');
    expect(result.findings).toHaveLength(0);
  });

  it('deducts for critical findings', () => {
    const findings: AuditFinding[] = [
      {
        category: 'metadata',
        issue: 'Missing title',
        severity: 'critical',
        impact: 'Bad',
        action: 'Fix',
      },
    ];
    const result = calculateCategoryScore('metadata', findings);
    expect(result.score).toBe(75); // 100 - 25
  });

  it('deducts for high findings', () => {
    const findings: AuditFinding[] = [
      {
        category: 'metadata',
        issue: 'Short title',
        severity: 'high',
        impact: 'Bad',
        action: 'Fix',
      },
    ];
    const result = calculateCategoryScore('metadata', findings);
    expect(result.score).toBe(85); // 100 - 15
  });

  it('deducts for medium findings', () => {
    const findings: AuditFinding[] = [
      {
        category: 'metadata',
        issue: 'Long title',
        severity: 'medium',
        impact: 'Minor',
        action: 'Fix',
      },
    ];
    const result = calculateCategoryScore('metadata', findings);
    expect(result.score).toBe(92); // 100 - 8
  });

  it('deducts for low findings', () => {
    const findings: AuditFinding[] = [
      {
        category: 'metadata',
        issue: 'Missing OG',
        severity: 'low',
        impact: 'Minor',
        action: 'Fix',
      },
    ];
    const result = calculateCategoryScore('metadata', findings);
    expect(result.score).toBe(97); // 100 - 3
  });

  it('accumulates deductions from multiple findings', () => {
    const findings: AuditFinding[] = [
      {
        category: 'metadata',
        issue: 'A',
        severity: 'critical',
        impact: '',
        action: '',
      },
      {
        category: 'metadata',
        issue: 'B',
        severity: 'high',
        impact: '',
        action: '',
      },
      {
        category: 'metadata',
        issue: 'C',
        severity: 'medium',
        impact: '',
        action: '',
      },
    ];
    const result = calculateCategoryScore('metadata', findings);
    expect(result.score).toBe(52); // 100 - 25 - 15 - 8
  });

  it('floors score at 0', () => {
    const findings: AuditFinding[] = Array.from({ length: 5 }, (_, i) => ({
      category: 'metadata',
      issue: `Issue ${i}`,
      severity: 'critical' as const,
      impact: '',
      action: '',
    }));
    const result = calculateCategoryScore('metadata', findings);
    expect(result.score).toBe(0); // 100 - (5 * 25) = -25, clamped to 0
  });

  it('supports custom maxScore', () => {
    const result = calculateCategoryScore('metadata', [], 50);
    expect(result.score).toBe(50);
    expect(result.maxScore).toBe(50);
  });
});

describe('calculateOverallScore', () => {
  it('returns 100 for no categories', () => {
    expect(calculateOverallScore([])).toBe(100);
  });

  it('averages category scores proportionally', () => {
    const categories = [
      { category: 'a', score: 80, maxScore: 100, findings: [] },
      { category: 'b', score: 60, maxScore: 100, findings: [] },
    ];
    expect(calculateOverallScore(categories)).toBe(70);
  });

  it('handles categories with different max scores', () => {
    const categories = [
      { category: 'a', score: 50, maxScore: 50, findings: [] },
      { category: 'b', score: 50, maxScore: 100, findings: [] },
    ];
    // (50 + 50) / (50 + 100) = 100/150 ≈ 67
    expect(calculateOverallScore(categories)).toBe(67);
  });
});

describe('buildAuditScore', () => {
  it('builds a complete audit score', () => {
    const categories = [
      { category: 'metadata', score: 85, maxScore: 100, findings: [] },
      { category: 'structure', score: 70, maxScore: 100, findings: [] },
    ];
    const score = buildAuditScore(categories);
    expect(score.overall).toBe(78); // (85 + 70) / 200 * 100
    expect(score.categories).toHaveLength(2);
  });
});
