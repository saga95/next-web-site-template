import { describe, expect, it } from 'vitest';
import {
  findingsToRecommendations,
  formatAuditReport,
} from '../shared/recommendations.js';
import type { AuditFinding, AuditScore } from '../shared/scoring.js';

describe('findingsToRecommendations', () => {
  it('sorts by severity: critical > high > medium > low', () => {
    const findings: AuditFinding[] = [
      {
        category: 'a',
        issue: 'Low issue',
        severity: 'low',
        impact: '',
        action: '',
      },
      {
        category: 'b',
        issue: 'Critical issue',
        severity: 'critical',
        impact: '',
        action: '',
      },
      {
        category: 'c',
        issue: 'Medium issue',
        severity: 'medium',
        impact: '',
        action: '',
      },
      {
        category: 'd',
        issue: 'High issue',
        severity: 'high',
        impact: '',
        action: '',
      },
    ];
    const recs = findingsToRecommendations(findings);
    expect(recs[0].priority).toBe('critical');
    expect(recs[1].priority).toBe('high');
    expect(recs[2].priority).toBe('medium');
    expect(recs[3].priority).toBe('low');
  });

  it('maps findings to recommendations', () => {
    const findings: AuditFinding[] = [
      {
        category: 'metadata',
        issue: 'Missing title',
        severity: 'critical',
        impact: 'Very bad',
        action: 'Add a title',
        target: 'index.tsx',
      },
    ];
    const recs = findingsToRecommendations(findings);
    expect(recs).toHaveLength(1);
    expect(recs[0].issue).toBe('Missing title');
    expect(recs[0].impact).toBe('Very bad');
    expect(recs[0].action).toBe('Add a title');
    expect(recs[0].target).toBe('index.tsx');
  });

  it('returns empty array for no findings', () => {
    expect(findingsToRecommendations([])).toHaveLength(0);
  });
});

describe('formatAuditReport', () => {
  it('generates markdown report with score and categories', () => {
    const score: AuditScore = {
      overall: 85,
      categories: [
        { category: 'metadata', score: 90, maxScore: 100, findings: [] },
        { category: 'structure', score: 80, maxScore: 100, findings: [] },
      ],
    };
    const recs = [
      {
        priority: 'high' as const,
        issue: 'Short title',
        impact: 'Bad CTR',
        action: 'Lengthen title',
        target: 'index.tsx',
      },
    ];
    const report = formatAuditReport('/pages/index.tsx', score, recs);
    expect(report).toContain('## SEO Audit Report: /pages/index.tsx');
    expect(report).toContain('**Overall Score: 85/100**');
    expect(report).toContain('**metadata**: 90/100');
    expect(report).toContain('**structure**: 80/100');
    expect(report).toContain('[HIGH] Short title');
    expect(report).toContain('**Impact**: Bad CTR');
    expect(report).toContain('**Action**: Lengthen title');
  });

  it('shows "No issues found" when no recommendations', () => {
    const score: AuditScore = {
      overall: 100,
      categories: [],
    };
    const report = formatAuditReport('page.tsx', score, []);
    expect(report).toContain('No issues found');
  });

  it('uses correct emoji for score ranges', () => {
    const score: AuditScore = {
      overall: 60,
      categories: [
        { category: 'good', score: 90, maxScore: 100, findings: [] },
        { category: 'ok', score: 60, maxScore: 100, findings: [] },
        { category: 'bad', score: 30, maxScore: 100, findings: [] },
      ],
    };
    const report = formatAuditReport('page.tsx', score, []);
    expect(report).toContain('✅ **good**');
    expect(report).toContain('⚠️ **ok**');
    expect(report).toContain('❌ **bad**');
  });
});
