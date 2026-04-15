import {
  type PageAnalysisOptions,
  analyzePage,
} from '../analyzers/page/page-analyzer.js';
import {
  findPageFiles,
  readFileContent,
  resolveSafePath,
} from '../shared/file-utils.js';
import { buildAuditScore, calculateCategoryScore } from '../shared/scoring.js';
import {
  findingsToRecommendations,
  formatAuditReport,
} from '../shared/recommendations.js';
import { createLogger } from '../shared/logger.js';
import { join } from 'node:path';

const logger = createLogger('engine:page-audit');

export interface PageAuditResult {
  filePath: string;
  score: ReturnType<typeof buildAuditScore>;
  recommendations: ReturnType<typeof findingsToRecommendations>;
  report: string;
}

export async function runPageAudit(
  filePath: string,
  projectRoot: string,
  options: PageAnalysisOptions = {}
): Promise<PageAuditResult> {
  const safePath = resolveSafePath(projectRoot, filePath);
  logger.info(`Running page audit on ${safePath}`);

  const content = await readFileContent(safePath);

  // Try to discover available routes for internal link checking
  if (!options.availableRoutes) {
    const pagesDir = join(projectRoot, 'src', 'pages');
    try {
      const pageFiles = await findPageFiles(pagesDir);
      options.availableRoutes = pageFiles.map(f => {
        const rel = f
          .replace(pagesDir, '')
          .replace(/\.(tsx?|jsx?)$/, '')
          .replace(/\/index$/, '/');
        return rel || '/';
      });
    } catch {
      logger.warn(
        'Could not discover page routes for internal link validation'
      );
    }
  }

  const analysis = analyzePage(content, safePath, options);

  // Build category scores
  const categories = [
    'metadata',
    'structure',
    'schema',
    'internal-linking',
    'images',
  ];
  const categoryScores = categories.map(cat => {
    const catFindings = analysis.findings.filter(f => f.category === cat);
    return calculateCategoryScore(cat, catFindings);
  });

  const score = buildAuditScore(categoryScores);
  const recommendations = findingsToRecommendations(analysis.findings);
  const report = formatAuditReport(filePath, score, recommendations);

  logger.info(
    `Page audit complete: score ${score.overall}/100, ${recommendations.length} recommendations`
  );

  return { filePath, score, recommendations, report };
}
