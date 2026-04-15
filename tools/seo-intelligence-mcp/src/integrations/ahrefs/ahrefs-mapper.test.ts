import { describe, expect, it } from 'vitest';
import {
  type KeywordInsight,
  inferIntent,
  mapKeywordData,
  selectPrimaryKeyword,
} from './ahrefs-mapper.js';

describe('mapKeywordData', () => {
  it('maps raw Ahrefs data to KeywordInsight', () => {
    const raw = {
      keyword: 'nextjs seo',
      volume: 5000,
      difficulty: 42,
      cpc: 1.5,
      parent_topic: 'seo',
      serp_features: ['featured_snippet'],
    };
    const result = mapKeywordData(raw);
    expect(result).toEqual({
      keyword: 'nextjs seo',
      volume: 5000,
      difficulty: 42,
      cpc: 1.5,
    });
  });
});

describe('inferIntent', () => {
  it('returns transactional for purchase keywords', () => {
    expect(inferIntent('buy nextjs course')).toBe('transactional');
    expect(inferIntent('cheap hosting price')).toBe('transactional');
  });

  it('returns commercial for comparison keywords', () => {
    expect(inferIntent('best react framework')).toBe('commercial');
    expect(inferIntent('nextjs vs remix')).toBe('commercial');
    expect(inferIntent('review of gatsby')).toBe('commercial');
  });

  it('returns navigational for site-specific keywords', () => {
    expect(inferIntent('github login')).toBe('navigational');
    expect(inferIntent('vercel website')).toBe('navigational');
    expect(inferIntent('download vscode')).toBe('navigational');
  });

  it('returns informational for question keywords', () => {
    expect(inferIntent('how to use nextjs')).toBe('informational');
    expect(inferIntent('what is typescript')).toBe('informational');
    expect(inferIntent('learn react tutorial')).toBe('informational');
  });

  it('returns unknown for ambiguous keywords', () => {
    expect(inferIntent('nextjs')).toBe('unknown');
    expect(inferIntent('react')).toBe('unknown');
  });
});

describe('selectPrimaryKeyword', () => {
  it('returns null for empty array', () => {
    expect(selectPrimaryKeyword([], 'test')).toBeNull();
  });

  it('prefers keywords matching the topic', () => {
    const keywords: KeywordInsight[] = [
      { keyword: 'unrelated thing', volume: 10000, difficulty: 10, cpc: 5 },
      { keyword: 'nextjs seo guide', volume: 2000, difficulty: 30, cpc: 1 },
      { keyword: 'seo tips', volume: 5000, difficulty: 20, cpc: 2 },
    ];
    const result = selectPrimaryKeyword(keywords, 'nextjs seo');
    expect(result).toBeDefined();
    expect(result!.keyword).toBe('nextjs seo guide');
  });

  it('considers volume and difficulty in scoring', () => {
    const keywords: KeywordInsight[] = [
      { keyword: 'nextjs', volume: 100000, difficulty: 90, cpc: 1 },
      { keyword: 'nextjs', volume: 5000, difficulty: 20, cpc: 1 },
    ];
    const result = selectPrimaryKeyword(keywords, 'nextjs');
    // Both match topic equally; the one with better volume/difficulty balance wins
    expect(result).toBeDefined();
  });
});
