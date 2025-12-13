export type AppMode = "LANDING" | "SCANNING" | "DASHBOARD";
export type OperationMode = "SIMULATION" | "REAL";
export type Tier = "FREE" | "PRO";
export type ScanInputType = "EMAIL" | "MOBILE" | "SOCIAL";
export type Theme = "light" | "dark";

export interface ScanInput {
  type: ScanInputType;
  value: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: "ROOT" | "THREAT" | "BREACH" | "USER";
  color?: string;
  x?: number;
  y?: number;
}

export interface SecurityGraph {
  nodes: GraphNode[];
  edges: any[];
  riskScore: number;
}

export interface IntelligenceReport {
  success: boolean;
  riskScore: number;
  foundBreaches: number;
  summary: string;
  details?: { sources: SourceStatus[] };
  graphData?: SecurityGraph;
}

export interface SourceStatus {
  name: string;
  status: "active" | "inactive" | "warning";
}

export interface Message {
  role: "user" | "model" | "system";
  text: string;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
}