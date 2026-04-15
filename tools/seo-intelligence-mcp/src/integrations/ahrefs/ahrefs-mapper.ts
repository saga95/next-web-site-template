import type { AhrefsKeywordData } from './ahrefs-types.js';

export interface KeywordInsight {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
}

export interface KeywordBrief {
  primaryKeyword: KeywordInsight | null;
  relatedKeywords: KeywordInsight[];
  questionKeywords: KeywordInsight[];
  intent:
    | 'informational'
    | 'navigational'
    | 'transactional'
    | 'commercial'
    | 'unknown';
}

export interface DomainInsight {
  domain: string;
  topPages: Array<{
    url: string;
    traffic: number;
    topKeyword: string;
  }>;
  relatedTopics: string[];
}

export function mapKeywordData(data: AhrefsKeywordData): KeywordInsight {
  return {
    keyword: data.keyword,
    volume: data.volume,
    difficulty: data.difficulty,
    cpc: data.cpc,
  };
}

export function inferIntent(keyword: string): KeywordBrief['intent'] {
  const lower = keyword.toLowerCase();

  // Transactional signals
  if (
    /\b(buy|purchase|order|price|cheap|deal|discount|coupon|shop)\b/.test(lower)
  ) {
    return 'transactional';
  }

  // Commercial investigation
  if (/\b(best|top|review|compare|vs|alternative|recommend)\b/.test(lower)) {
    return 'commercial';
  }

  // Navigational signals
  if (/\b(login|sign in|official|website|app|download)\b/.test(lower)) {
    return 'navigational';
  }

  // Informational (default for questions and how-to)
  if (
    /\b(how|what|why|when|where|who|which|guide|tutorial|learn)\b/.test(lower)
  ) {
    return 'informational';
  }

  return 'unknown';
}

export function selectPrimaryKeyword(
  keywords: KeywordInsight[],
  topic: string
): KeywordInsight | null {
  if (keywords.length === 0) return null;

  // Prefer keywords that closely match the topic
  const topicWords = topic.toLowerCase().split(/\s+/);
  const scored = keywords.map(k => {
    const kWords = k.keyword.toLowerCase().split(/\s+/);
    const overlap = topicWords.filter(tw => kWords.includes(tw)).length;
    const relevance = overlap / Math.max(topicWords.length, 1);
    // Balance volume and relevance
    return {
      keyword: k,
      score: relevance * 100 + Math.log1p(k.volume) * 10 - k.difficulty * 0.5,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored[0].keyword;
}
