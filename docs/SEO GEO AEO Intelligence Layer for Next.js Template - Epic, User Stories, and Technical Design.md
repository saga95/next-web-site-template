SEO / GEO / AEO Intelligence Layer for Next.js Template  
Epic, User Stories, and Technical Design

1\. Document Overview  
This document defines the product direction, epic scope, user stories, and technical design for an optional developer add-on to the next-web-site-template. The feature is intended to help developers improve SEO, GEO (Generative Engine Optimization), and AEO (Answer Engine Optimization) directly from their development environment using MCP-compatible tools such as VS Code with Copilot, Claude Code, and similar IDE agents.

The add-on will connect Ahrefs search intelligence with local codebase analysis to provide implementation-ready recommendations for websites built on top of the template. The main goal is to transform the template from a standard website starter into an SEO-aware development platform.

2\. Epic  
Epic Title  
Developer-Integrated SEO / GEO / AEO Intelligence Layer for Next.js Website Template

Epic Goal  
Enable developers using the next-web-site-template to improve SEO, GEO, and AEO directly within their development environment through an MCP-powered assistant integrated with Ahrefs data and local codebase analysis.

Problem Statement  
Developers building websites often have to switch between multiple tools such as Ahrefs, search consoles, audits, and content planning platforms. This creates friction and makes SEO-related improvements slow, inconsistent, and dependent on manual effort. In addition, many development workflows do not actively support GEO and AEO, which are becoming increasingly important as users discover content through AI-assisted search and answer experiences.

This leads to several issues:  
\- metadata is incomplete or weak  
\- heading structures are inconsistent  
\- internal linking is often overlooked  
\- schema markup opportunities are missed  
\- content is not optimized for answer-style discovery  
\- keyword opportunities are not translated into implementation work

Solution Overview  
Introduce an optional MCP-powered SEO Intelligence add-on to the template. The add-on will:  
\- use Ahrefs Public API as the external search intelligence source  
\- inspect the local codebase to understand actual page structure and implementation  
\- expose developer-facing tools through MCP  
\- provide actionable recommendations for SEO, GEO, and AEO improvements  
\- remain outside the production website runtime

Business Value  
This feature differentiates the template in the market by making it more than a standard website starter. It gives developers and agencies a workflow advantage by allowing them to improve discoverability from inside the IDE instead of jumping between disconnected tools. It also creates a pathway for future premium add-ons and integrations.

Target Users  
\- frontend developers  
\- fullstack developers  
\- agencies building client websites  
\- SaaS founders and indie hackers  
\- technical marketers working closely with development teams

In Scope  
\- optional MCP-powered developer add-on  
\- Ahrefs Public API integration  
\- local codebase analysis for page and content structure  
\- SEO, GEO, and AEO recommendation tools  
\- setup and documentation for supported IDE workflows

Out of Scope  
\- website-facing SEO dashboard for end users  
\- direct integration with Ahrefs hosted MCP endpoint  
\- production runtime dependency in the deployed website  
\- CMS workflows in the initial release  
\- automatic code modification in the initial release

Success Metrics  
\- adoption rate of the add-on among template users  
\- number of page audits executed per project  
\- increase in schema usage and metadata quality  
\- increase in internal linking recommendations applied  
\- developer feedback on usefulness and accuracy of recommendations

MVP Scope  
The first release should include:  
\- page audit  
\- keyword brief generation  
\- metadata rewrite suggestions  
\- schema suggestions  
\- internal linking recommendations  
\- basic GEO and AEO audits

Future Opportunities  
\- Google Search Console integration  
\- sitemap and robots analysis  
\- auto-fix or patch generation  
\- multilingual SEO support  
\- CMS integration  
\- historical audit snapshots

Definition of Done for Epic  
The epic is complete when:  
\- the custom MCP server can be started locally  
\- the template can register the server through mcp.json  
\- Ahrefs Public API integration works securely  
\- local file analysis works for supported page structures  
\- at least the defined MVP tools are functional  
\- documentation is complete  
\- the website template still works normally when the add-on is not configured

3\. User Stories  
Story 1: Support the SEO Intelligence Add-on as an Optional Feature  
As a developer using the template,  
I want the SEO Intelligence layer to be optional,  
so that I can use the core website template with or without the add-on.

Description  
The template must support the SEO Intelligence layer as a separate developer tool that does not affect the normal website runtime.

Acceptance Criteria  
\- a dedicated add-on folder exists outside the app runtime  
\- the website builds and runs without the add-on configured  
\- the feature can be enabled through configuration  
\- there is no production dependency on the add-on  
\- setup documentation explains how to enable and disable the feature

Story 2: Register a Custom MCP Server in the Template  
As a developer,  
I want the project to register a custom MCP server,  
so that IDE agents such as VS Code Copilot and Claude Code can use the tools.

Description  
The template must include MCP configuration that allows supported IDE environments to discover and invoke the SEO Intelligence server.

Acceptance Criteria  
\- mcp.json includes the custom server definition  
\- the configuration works in local development  
\- the server can be started through a documented command  
\- environment variables are supported securely  
\- usage examples are documented

Story 3: Integrate Ahrefs Public API Securely  
As a developer,  
I want the add-on to securely connect to Ahrefs Public API,  
so that recommendations can use trusted search intelligence data.

Description  
The integration must use Ahrefs Public API only. API credentials must remain server-side and must never be exposed to the browser runtime.

Acceptance Criteria  
\- Ahrefs API key is loaded through environment variables  
\- the key is not exposed in frontend bundles or browser calls  
\- API failures return clear developer-facing messages  
\- rate limits and invalid credentials are handled gracefully  
\- the integration exists in a dedicated service layer

Story 4: Analyze the Local Codebase for SEO-Relevant Structure  
As a developer,  
I want the system to inspect my local project files,  
so that recommendations are based on the actual implementation in the codebase.

Description  
The analyzer must inspect page routes, metadata, schema markup, internal links, images, and content structure in the project.

Acceptance Criteria  
\- the analyzer can inspect page routes in the template  
\- the analyzer can detect metadata configuration  
\- the analyzer can inspect heading structure  
\- the analyzer can detect schema presence when applicable  
\- the analyzer can inspect internal links  
\- the analyzer returns normalized output for downstream tools

Story 5: Audit a Page for SEO Readiness  
As a developer,  
I want to audit a page for SEO issues,  
so that I can quickly identify missing metadata, weak structure, and content gaps.

Description  
The page audit tool should analyze a selected page and return prioritized findings and recommendations.

Acceptance Criteria  
\- the tool checks title, description, heading hierarchy, alt text presence, internal links, and schema coverage  
\- findings are categorized by severity  
\- recommendations are file-aware and actionable  
\- output is readable within IDE assistant responses  
\- the audit works against a single selected page or file

Story 6: Generate a Keyword Brief Using Ahrefs Data  
As a developer,  
I want a keyword brief for a topic or page,  
so that I can align implementation with real search demand and search intent.

Description  
The keyword brief tool should provide target keyword suggestions, supporting keywords, question queries, and likely search intent.

Acceptance Criteria  
\- the tool accepts a topic, domain, or page context  
\- the tool returns a primary keyword recommendation  
\- the tool returns related keywords and question queries where available  
\- the tool explains likely search intent  
\- the output is implementation-focused

Story 7: Suggest Improved Metadata for a Page  
As a developer,  
I want the system to suggest better metadata,  
so that I can improve search visibility and click-through rate.

Description  
Based on page content and Ahrefs keyword intelligence, the tool should suggest improved page title and meta description options.

Acceptance Criteria  
\- the tool suggests at least one improved page title  
\- the tool suggests at least one improved meta description  
\- suggestions align with page intent and content  
\- suggestions avoid keyword stuffing  
\- output includes where to apply the change in the codebase

Story 8: Suggest Schema Markup Opportunities  
As a developer,  
I want relevant schema suggestions,  
so that I can improve structured discoverability and answer engine readiness.

Description  
The tool should inspect page content and context to identify appropriate schema types and starter structures.

Acceptance Criteria  
\- the tool identifies relevant schema types such as FAQ, Article, Organization, Breadcrumb, Service, or LocalBusiness when applicable  
\- the tool explains why each schema type is recommended  
\- the tool provides implementation guidance or starter JSON-LD  
\- irrelevant schema types are not recommended

Story 9: Suggest Internal Linking Opportunities  
As a developer,  
I want internal linking suggestions,  
so that I can improve site discoverability and topical authority.

Description  
The add-on should scan routes and page relationships to identify relevant internal links to add.

Acceptance Criteria  
\- the tool detects related pages in the project  
\- the tool suggests source and target page relationships  
\- the output includes anchor text direction  
\- recommendations avoid irrelevant or broken suggestions  
\- recommendations are relevant to the selected page topic

Story 10: Audit a Page for GEO Readiness  
As a developer,  
I want to assess a page for GEO readiness,  
so that the content is more understandable and usable by generative engines.

Description  
The GEO audit should evaluate whether the page has clear topical framing, entity clarity, and summary-friendly structure.

Acceptance Criteria  
\- the tool checks for clear topic framing  
\- the tool checks for direct coverage of user intent  
\- the tool checks for entity and context clarity  
\- the tool checks for concise, summary-ready sections  
\- the output contains concrete recommendations

Story 11: Audit a Page for AEO Readiness  
As a developer,  
I want to assess a page for AEO readiness,  
so that the page can better support answer-style search experiences.

Description  
The AEO audit should identify direct answer blocks, FAQ opportunities, and snippet-friendly structure.

Acceptance Criteria  
\- the tool checks for direct answer sections  
\- the tool checks for FAQ opportunities  
\- the tool checks for heading clarity and answer formatting  
\- the tool suggests snippet-friendly rewrites when needed  
\- the output is actionable

Story 12: Provide Developer-Friendly Errors and Fallbacks  
As a developer,  
I want clear errors and graceful fallback behavior,  
so that I can still use the system even when setup is incomplete or external data is unavailable.

Description  
The system must handle missing API keys, unavailable Ahrefs responses, unsupported files, and partial analyses without crashing.

Acceptance Criteria  
\- missing environment variables return clear setup guidance  
\- unsupported file contexts return a helpful explanation  
\- external API failures return readable messages  
\- partial local analysis can still run when Ahrefs is unavailable  
\- logs support debugging without exposing secrets

Story 13: Document Setup and Usage for Developers  
As a developer,  
I want clear documentation,  
so that I can enable the add-on quickly and use it effectively.

Description  
The feature must include setup instructions, environment variables, commands, IDE compatibility notes, sample prompts, and troubleshooting guidance.

Acceptance Criteria  
\- setup steps are documented  
\- required environment variables are documented  
\- supported IDEs are documented  
\- supported tools are documented  
\- sample prompts are included  
\- troubleshooting guidance is included

Story 14: Keep the Add-on Modular for Future Integrations  
As a product owner,  
I want the architecture to remain modular,  
so that future integrations can be added without major refactoring.

Description  
The system should support future expansion such as Google Search Console integration, sitemap validators, content connectors, and patch generation.

Acceptance Criteria  
\- Ahrefs integration is isolated behind a service or adapter layer  
\- analyzer modules are separated from tool transport and output formatting  
\- new tools can be added without breaking existing tools  
\- major internal contracts are documented

4\. Technical Design  
4.1 Objective  
Build an optional MCP-powered developer add-on for next-web-site-template that helps developers improve SEO, GEO, and AEO from inside IDE environments such as VS Code and Claude Code.

The add-on must:  
\- use Ahrefs Public API  
\- analyze local project files  
\- expose IDE-callable tools through MCP  
\- remain outside the production website runtime

4.2 Design Principles  
\- optional: the template must work without the add-on  
\- secure: no API secrets in the frontend runtime  
\- modular: analyzers, integrations, and transport must be separated  
\- actionable: outputs must tell developers what to change and where  
\- extensible: future integrations should be possible without redesigning the foundation

4.3 Proposed Folder Structure  
next-web-site-template/  
 mcp.json  
 tools/  
 seo-intelligence-mcp/  
 package.json  
 tsconfig.json  
 src/  
 index.ts  
 config/  
 env.ts  
 mcp/  
 register-tools.ts  
 types.ts  
 integrations/  
 ahrefs/  
 ahrefs-client.ts  
 ahrefs-types.ts  
 ahrefs-mapper.ts  
 analyzers/  
 page/  
 page-analyzer.ts  
 metadata-analyzer.ts  
 heading-analyzer.ts  
 internal-link-analyzer.ts  
 schema-analyzer.ts  
 image-alt-analyzer.ts  
 geo/  
 geo-analyzer.ts  
 aeo/  
 aeo-analyzer.ts  
 engines/  
 page-audit-engine.ts  
 keyword-brief-engine.ts  
 metadata-engine.ts  
 schema-engine.ts  
 internal-link-engine.ts  
 shared/  
 logger.ts  
 errors.ts  
 file-utils.ts  
 scoring.ts  
 recommendations.ts  
 README.md

4.4 High-Level Architecture  
The system will follow this flow:  
IDE Agent (Copilot / Claude Code)  
→ MCP Client  
→ Custom MCP Server  
→ Tool Registration Layer  
→ Engine Layer  
→ Analyzer Layer and Ahrefs Integration Layer  
→ Developer-facing recommendations

Layer Responsibilities  
Tool Registration Layer  
\- exposes MCP tools  
\- validates input payloads  
\- formats output for IDE responses

Engine Layer  
\- coordinates analyzers and Ahrefs integration  
\- calculates findings and priorities  
\- creates final recommendation payloads

Analyzer Layer  
\- reads project files  
\- extracts metadata, headings, links, schema, images, and structure  
\- performs GEO and AEO-specific checks

Ahrefs Integration Layer  
\- authenticates with Ahrefs Public API  
\- retrieves keyword and search intelligence data  
\- maps external responses to internal models

Shared Utilities  
\- logging  
\- error handling  
\- scoring  
\- recommendation formatting  
\- file path and content helpers

4.5 Runtime Model  
This add-on is a developer-side service and is not part of the deployed Next.js application runtime.

Execution Modes  
\- local development mode via tsx  
\- built mode via Node execution on compiled output

Suggested Scripts  
\- seo:mcp:dev  
\- seo:mcp:build  
\- seo:mcp:start

4.6 MCP Registration  
The template root should include an mcp.json entry for the custom server.

Recommended Configuration Shape  
\- server name: seo-intelligence  
\- command: node  
\- args: built server entrypoint  
\- environment variables: Ahrefs API key and optional config  
\- allowed tools: page_audit, keyword_brief, metadata_rewrite, schema_suggestion, internal_link_opportunities, geo_audit, aeo_audit

4.7 Environment Variables  
Required  
\- AHREFS_API_KEY  
\- AHREFS_BASE_URL

Optional  
\- SEO_MCP_LOG_LEVEL  
\- SEO_MCP_TIMEOUT_MS  
\- SEO_MCP_CACHE_TTL

Rules  
\- environment variables must be loaded server-side only  
\- secrets must never be exposed to browser code  
\- validation should occur on server startup

4.8 Core Tools for MVP  
Tool 1: page_audit  
Purpose  
Audit a selected page or file for SEO readiness.

Inputs  
\- filePath  
\- optional route  
\- optional targetKeyword

Outputs  
\- overall score  
\- issue list by severity  
\- metadata gaps  
\- heading observations  
\- schema observations  
\- internal linking observations  
\- prioritized recommendations

Tool 2: keyword_brief  
Purpose  
Generate a keyword brief using Ahrefs data for a topic, page, or domain context.

Inputs  
\- topic  
\- optional domain  
\- optional pageType

Outputs  
\- primary keyword  
\- secondary keywords  
\- question keywords  
\- likely intent  
\- recommendation summary

Tool 3: metadata_rewrite  
Purpose  
Suggest improved metadata for a selected page.

Inputs  
\- filePath  
\- optional targetKeyword  
\- optional brandName

Outputs  
\- suggested page title  
\- suggested meta description  
\- optional social metadata guidance  
\- rationale for the improvement

Tool 4: schema_suggestion  
Purpose  
Suggest relevant schema markup opportunities.

Inputs  
\- filePath  
\- optional pageType

Outputs  
\- recommended schema types  
\- reasoning  
\- starter JSON-LD structure  
\- implementation notes

Tool 5: internal_link_opportunities  
Purpose  
Suggest internal link opportunities across project routes and related content.

Inputs  
\- filePath  
\- optional routeScope

Outputs  
\- suggested source-to-target relationships  
\- rationale  
\- anchor text direction

Tool 6: geo_audit  
Purpose  
Assess a page for GEO readiness.

Inputs  
\- filePath

Outputs  
\- GEO findings  
\- entity clarity observations  
\- summary-readiness suggestions  
\- content structure improvements

Tool 7: aeo_audit  
Purpose  
Assess a page for AEO readiness.

Inputs  
\- filePath

Outputs  
\- direct answer opportunities  
\- FAQ opportunities  
\- heading and snippet recommendations

4.9 Codebase Analysis Design  
Supported Areas  
The analyzer should inspect:  
\- Next.js route files  
\- page-level metadata exports  
\- layout-level metadata where relevant  
\- schema insertion points  
\- route relationships  
\- page content blocks  
\- internal links  
\- image alt text usage

Analyzer Modules  
Metadata Analyzer  
Checks title presence, description presence, weak patterns, and consistency.

Heading Analyzer  
Checks H1 presence, hierarchy quality, vague headings, and topic alignment.

Internal Link Analyzer  
Checks related route opportunities, missing contextual links, and weak linking density.

Schema Analyzer  
Checks for existing schema and identifies missing opportunities based on page type.

Image Alt Analyzer  
Checks missing alt text and low-quality alt text patterns.

GEO Analyzer  
Checks topic framing, summary potential, contextual completeness, and entity clarity.

AEO Analyzer  
Checks direct answers, FAQ potential, answer formatting, and snippet-friendly sections.

4.10 Ahrefs Integration Design  
Client Responsibilities  
The Ahrefs integration layer should:  
\- authenticate requests  
\- construct request payloads  
\- normalize external responses  
\- handle timeouts and failures  
\- return simplified internal models to the engine layer

Recommended Pattern  
\- raw Ahrefs responses should not be returned directly to tool consumers  
\- response mappers should convert external data into internal models  
\- engines should combine Ahrefs data with local analysis results

Example Internal Models  
KeywordBrief  
\- primaryKeyword  
\- relatedKeywords  
\- questionKeywords  
\- intent

DomainInsight  
\- domain  
\- topPages  
\- relatedTopics

4.11 Scoring and Recommendation Model  
Each audit should produce:  
\- overall score  
\- category scores  
\- prioritized actions

Suggested Categories  
\- metadata  
\- structure  
\- schema  
\- internal linking  
\- GEO  
\- AEO

Priority Levels  
\- Critical  
\- High  
\- Medium  
\- Low

Recommendation Format  
Each recommendation should contain:  
\- issue  
\- impact  
\- action  
\- target file or location when known

4.12 Error Handling  
The server must handle:  
\- missing API key  
\- Ahrefs API unavailable  
\- unsupported file type  
\- file not found  
\- partial analysis only  
\- parsing failures

Error Behavior  
\- return readable developer-facing messages  
\- never crash due to a single failed tool call  
\- redact secrets from logs  
\- allow partial local analysis where possible

4.13 Logging  
Logging should support:  
\- startup validation  
\- tool invocation traces  
\- external API success and failure states  
\- analyzer failures

Logging must not expose:  
\- API keys  
\- raw authorization headers  
\- unnecessary file content

4.14 Security Considerations  
\- secrets stored only in environment variables  
\- no browser exposure of external API credentials  
\- no imports from the MCP server into frontend runtime code  
\- no production dependency on the local MCP service  
\- file access should be sanitized to avoid unintended traversal outside repo scope

4.15 Performance Considerations  
\- limit analysis scope to target file plus relevant related context  
\- support caching for Ahrefs responses where appropriate  
\- avoid full-project scans unless explicitly requested  
\- set reasonable timeouts for external calls

4.16 Testing Strategy  
Unit Tests  
\- analyzers  
\- response mappers  
\- scoring logic  
\- recommendation formatting  
\- error handling

Integration Tests  
\- Ahrefs client with mocked responses  
\- MCP tool registration and invocation  
\- end-to-end audit flow using sample template pages

Manual Validation  
\- VS Code Copilot MCP workflow  
\- Claude Code MCP workflow where supported  
\- template behavior with and without environment configuration

4.17 Documentation Deliverables  
The add-on should include:  
\- setup guide  
\- environment variable documentation  
\- command reference  
\- supported IDE notes  
\- supported tool reference  
\- sample prompts  
\- known limitations  
\- troubleshooting guide

4.18 Risks and Mitigations  
Risk: API rate limits or quota issues  
Mitigation: caching, clear error handling, fallback to local-only analysis

Risk: recommendations become too generic  
Mitigation: tie outputs to concrete files, routes, and implementation details

Risk: developer adoption is low  
Mitigation: provide good defaults, simple prompts, and clear documentation

Risk: performance slows down local development workflows  
Mitigation: keep analysis scoped and optimize external call handling

4.19 Implementation Phases  
Phase 1: Foundation  
\- create add-on folder structure  
\- create server bootstrap  
\- register MCP tools  
\- validate environment handling

Phase 2: Core Analysis  
\- implement metadata, heading, internal link, and schema analyzers  
\- implement basic recommendation engine

Phase 3: Ahrefs Integration  
\- implement Ahrefs client and response mapping  
\- implement keyword brief generation  
\- combine local and external insights

Phase 4: GEO and AEO Audits  
\- implement GEO and AEO analyzers  
\- expose geo_audit and aeo_audit tools

Phase 5: Hardening and Documentation  
\- testing  
\- optimization  
\- sample prompts  
\- full developer documentation

5\. Final Product Direction  
This feature should be treated as a strategic differentiator for the template. The long-term value is not simply exposing Ahrefs data to developers. The real value is helping developers turn search intelligence and codebase context into implementation-ready SEO, GEO, and AEO improvements directly inside their IDE.

By combining local analysis, Ahrefs-backed insight, and MCP-based workflows, the next-web-site-template can evolve from a standard starter into an intelligent development platform for discoverability-focused websites.
