export type OperationMode = "SIMULATION" | "REAL";
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
  // Flexible to handle both "source" (from repo) and "name" (from mock)
  source?: string;
  name?: string; 
  status: string; // Flexible to handle 'active' (lowercase) or 'ACTIVE' (uppercase)
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
  // Combined types to support both legacy Mocks (ROOT/THREAT) and new Repo (USER/BREACH)
  type: 'USER' | 'BREACH' | 'EXPOSURE' | 'RISK' | 'ROOT' | 'THREAT'; 
  severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  source?: string;
  iconType?: string;
  date?: string;
  x?: number; // Optional for auto-layout
  y?: number;
  vx?: number;
  vy?: number;
  color?: string; // Added for compatibility with ThreatVisualizer
}

export interface GraphEdge {
  id: string;
  source: string | number;
  target: string | number;
  type?: 'RADIAL' | 'MESH'; // Made optional for compatibility
  animated?: boolean;
}

export interface SecurityGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  riskScore: number;
}