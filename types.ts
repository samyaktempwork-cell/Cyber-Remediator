
export type Tier = "FREE" | "PRO" | "PREMIUM";
export type UserPlan = Tier;
export type AppMode = "LANDING" | "SCANNING" | "DASHBOARD";
export type Theme = "dark" | "light";

export type Message = {
  role: "user" | "model" | "system";
  text: string;
};

export type LogEntry = {
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
};

// --- Scanning Types ---

export type ScanInputType = 'EMAIL' | 'MOBILE' | 'SOCIAL';

export interface ScanInput {
  type: ScanInputType;
  value: string;
}

export interface SourceStatus {
  source: string;
  status: 'ACTIVE' | 'SKIPPED' | 'ERROR';
  reason?: string;
}

export interface IntelligenceReport {
  riskScore: number;
  summary: string;
  foundBreaches: number;
  details: {
    sources?: SourceStatus[];
    [key: string]: any;
  };
  success: boolean;
  graphData?: SecurityGraph;
}

// --- Remediation Types ---

export interface RemediationOutcome {
  type: 'TEXT' | 'SCRIPT' | 'EXECUTION';
  content: string;
  steps?: string[];
}

// --- Graph API Types ---

export interface GraphNode {
  id: string | number;
  label: string;
  subLabel?: string;
  type: 'USER' | 'BREACH' | 'EXPOSURE' | 'RISK';
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  source?: string;
  iconType?: string;
  date?: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphEdge {
  id: string;
  source: string | number;
  target: string | number;
  type: 'RADIAL' | 'MESH';
  animated?: boolean;
}

export interface SecurityGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  riskScore: number;
}
