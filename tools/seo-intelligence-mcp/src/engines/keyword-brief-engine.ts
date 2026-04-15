import {
  getKeywordMetrics,
  getQuestionKeywords,
  getRelatedKeywords,
  isAhrefsAvailable,
} from '../integrations/ahrefs/ahrefs-client.js';
import {
  type KeywordBrief,
  type KeywordInsight,
  inferIntent,
  mapKeywordData,
  selectPrimaryKeyword,
} from '../integrations/ahrefs/ahrefs-mapper.js';
import { createLogger } from '../shared/logger.js';

const logger = createLogger('engine:keyword-brief');

export interface KeywordBriefResult {
  topic: string;
  brief: KeywordBrief;
  dataSource: 'ahrefs' | 'local-only';
  report: string;
}

async function getAhrefsBrief(topic: string): Promise<KeywordBrief> {
  const [metricsResp, relatedResp, questionsResp] = await Promise.allSettled([
    getKeywordMetrics(topic),
    getRelatedKeywords(topic),
    getQuestionKeywords(topic),
  ]);

  const allKeywords: KeywordInsight[] = [];

  if (metricsResp.status === 'fulfilled') {
    allKeywords.push(...metricsResp.value.keywords.map(mapKeywordData));
  }

  const relatedKeywords: KeywordInsight[] =
    relatedResp.status === 'fulfilled'
      ? relatedResp.value.keywords.map(mapKeywordData)
      : [];

  const questionKeywords: KeywordInsight[] =
    questionsResp.status === 'fulfilled'
      ? questionsResp.value.keywords.map(mapKeywordData)
      : [];

  const primaryKeyword = selectPrimaryKeyword(
    [...allKeywords, ...relatedKeywords],
    topic
  );
  const intent = inferIntent(primaryKeyword?.keyword ?? topic);

  return {
    primaryKeyword,
    relatedKeywords: relatedKeywords.slice(0, 10),
    questionKeywords: questionKeywords.slice(0, 5),
    intent,
  };
}

function getLocalOnlyBrief(topic: string): KeywordBrief {
  return {
    primaryKeyword: {
      keyword: topic,
      volume: 0,
      difficulty: 0,
      cpc: 0,
    },
    relatedKeywords: [],
    questionKeywords: [],
    intent: inferIntent(topic),
  };
}

function formatKeywordBriefReport(result: KeywordBriefResult): string {
  const lines: string[] = [];
  const { brief } = result;

  lines.push(`## Keyword Brief: ${result.topic}`);
  lines.push('');
  lines.push(
    `**Data Source**: ${result.dataSource === 'ahrefs' ? 'Ahrefs API' : 'Local inference only (Ahrefs not configured)'}`
  );
  lines.push('');

  if (brief.primaryKeyword) {
    lines.push('### Primary Keyword');
    lines.push(`- **Keyword**: ${brief.primaryKeyword.keyword}`);
    if (result.dataSource === 'ahrefs') {
      lines.push(
        `- **Search Volume**: ${brief.primaryKeyword.volume.toLocaleString()}/month`
      );
      lines.push(`- **Difficulty**: ${brief.primaryKeyword.difficulty}/100`);
      lines.push(`- **CPC**: $${brief.primaryKeyword.cpc.toFixed(2)}`);
    }
    lines.push('');
  }

  lines.push(`### Search Intent: ${brief.intent}`);
  lines.push('');

  if (brief.relatedKeywords.length > 0) {
    lines.push('### Related Keywords');
    for (const kw of brief.relatedKeywords) {
      lines.push(
        `- "${kw.keyword}" (vol: ${kw.volume.toLocaleString()}, KD: ${kw.difficulty})`
      );
    }
    lines.push('');
  }

  if (brief.questionKeywords.length > 0) {
    lines.push('### Question Keywords');
    for (const kw of brief.questionKeywords) {
      lines.push(`- "${kw.keyword}" (vol: ${kw.volume.toLocaleString()})`);
    }
    lines.push('');
  }

  if (result.dataSource === 'local-only') {
    lines.push('### Note');
    lines.push(
      'This brief was generated without Ahrefs data. Set AHREFS_API_KEY to get real search volume, difficulty, and related keyword data.'
    );
  }

  return lines.join('\n');
}

export async function runKeywordBrief(
  topic: string,
  _domain?: string,
  _pageType?: string
): Promise<KeywordBriefResult> {
  logger.info(`Generating keyword brief for: ${topic}`);

  let brief: KeywordBrief;
  let dataSource: 'ahrefs' | 'local-only';

  if (isAhrefsAvailable()) {
    try {
      brief = await getAhrefsBrief(topic);
      dataSource = 'ahrefs';
      logger.info('Keyword brief generated from Ahrefs data');
    } catch (err) {
      logger.warn('Ahrefs unavailable, falling back to local-only brief');
      logger.error('Ahrefs error', err);
      brief = getLocalOnlyBrief(topic);
      dataSource = 'local-only';
    }
  } else {
    logger.info('Ahrefs not configured, generating local-only brief');
    brief = getLocalOnlyBrief(topic);
    dataSource = 'local-only';
  }

  const report = formatKeywordBriefReport({
    topic,
    brief,
    dataSource,
    report: '',
  });

  return { topic, brief, dataSource, report };
}
