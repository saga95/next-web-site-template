export interface AhrefsKeywordsResponse {
  keywords: AhrefsKeywordData[];
}

export interface AhrefsKeywordData {
  keyword: string;
  volume: number;
  difficulty: number;
  cpc: number;
  parent_topic?: string;
  serp_features?: string[];
}

export interface AhrefsRelatedKeywordsResponse {
  keywords: AhrefsKeywordData[];
}

export interface AhrefsQuestionKeywordsResponse {
  keywords: AhrefsKeywordData[];
}

export interface AhrefsDomainOverviewResponse {
  domain: string;
  organic_traffic: number;
  organic_keywords: number;
  domain_rating: number;
  top_pages?: AhrefsTopPage[];
}

export interface AhrefsTopPage {
  url: string;
  organic_traffic: number;
  organic_keywords: number;
  top_keyword: string;
}

export interface AhrefsErrorResponse {
  error: string;
  message?: string;
}
