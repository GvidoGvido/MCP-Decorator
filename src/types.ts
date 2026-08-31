export type DecoratorCategory =
  | "security"
  | "compression"
  | "domain"
  | "resilience"
  | "sandbox"
  | "prompt";

export interface Decorator {
  id: string;
  name: string;
  category: DecoratorCategory;
  description: string;
  enabled: boolean;
  isSteroid?: boolean;
  badge?: string;
  config: Record<string, any>;
}

export interface McpTool {
  id: string;
  name: string;
  description: string;
  category: string;
  inputSchema: Record<string, any>;
  sampleArgs: Record<string, any>;
  sampleRawResponse: Record<string, any> | string;
  suggestedPrompt: string;
}

export interface McpSource {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  category: "vcs" | "database" | "filesystem" | "monitoring" | "web" | "custom";
  tools: McpTool[];
  availableDecorators: Decorator[];
  systemDirectivesDefault?: string;
}

export interface RedactionItem {
  type: string;
  count: number;
  details: string;
  sample?: string;
}

export interface DomainEnrichment {
  key: string;
  title: string;
  summary: string;
  badge?: string;
}

export interface SecurityWarning {
  severity: "low" | "medium" | "high" | "blocked";
  title: string;
  message: string;
}

export interface PipelineStepTrace {
  stepId: string;
  stepName: string;
  category: DecoratorCategory;
  status: "applied" | "skipped" | "blocked";
  durationMs: number;
  diffSummary: string;
}

export interface DecorationResult {
  originalPayload: any;
  decoratedPayload: any;
  originalTokens: number;
  decoratedTokens: number;
  tokenSavingsPercent: number;
  originalByteSize: number;
  decoratedByteSize: number;
  estimatedLatencyOriginalMs: number;
  estimatedLatencyDecoratedMs: number;
  redactions: RedactionItem[];
  domainEnrichments: DomainEnrichment[];
  securityWarnings: SecurityWarning[];
  cacheStatus: "HIT" | "MISS" | "BYPASS";
  sandboxReport?: {
    safetyScore: number;
    sideEffects: string[];
    riskLevel: "safe" | "caution" | "critical";
  };
  pipelineSteps: PipelineStepTrace[];
  systemDirectivesApplied: string;
}

export interface LlmRunResult {
  text: string;
  estimatedTokens: number;
  latencyMs: number;
}

export interface LlmExecutionComparison {
  prompt: string;
  rawResult: LlmRunResult;
  decoratedResult: LlmRunResult;
  mode: "live_gemini" | "simulated_local";
  timestamp: string;
}

export interface TrendingMcpItem {
  id: string;
  name: string;
  repo: string;
  category: "database" | "devtools" | "ai_infra" | "security" | "cloud" | "productivity" | "search";
  stars: number;
  weeklyGrowthPercent: number;
  description: string;
  toolsCount: number;
  suggestedSteroids: string[];
  sampleTool: string;
  badge?: string;
  verified: boolean;
  author: string;
  scoutReasoning: string;
  sourceTemplate: McpSource;
}

export interface SwarmAgentFinding {
  agentId: string;
  agentName: string;
  agentRole: "security_guardian" | "domain_enricher" | "payload_distiller" | "verification_critic" | "ecosystem_scout" | "primary_reasoner";
  iconName: string;
  avatarColor: string;
  verdict: "safe" | "enriched" | "distilled" | "verified" | "actionable" | "scouted";
  durationMs: number;
  contribution: string;
  findings: string[];
  emittedLogs?: string[];
  inputSummary?: string;
  outputSummary?: string;
  metrics?: {
    inputTokens: number;
    outputTokens: number;
    reductionPercent: number;
  };
  recommendedTrendingMcp?: TrendingMcpItem;
}

export type SwarmAgent = SwarmAgentFinding;

export interface MultiAgentSwarmResult {
  prompt: string;
  swarmAgents: SwarmAgentFinding[];
  consensusVerdict: "SECURE_AND_ENRICHED" | "CRITICAL_GUARD_ACTIVATED" | "OPTIMIZED_EXECUTION";
  primaryReasonerOutput: string;
  rawSingleAgentOutput: string;
  tokensSavedTotal: number;
  totalSwarmLatencyMs: number;
  mode: "live_gemini" | "simulated_local";
  timestamp: string;
  rawTokensTotal?: number;
  decoratedTokensTotal?: number;
}
