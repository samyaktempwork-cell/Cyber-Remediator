
import { SecurityGraph, LogEntry, Tier, ScanInput, IntelligenceReport } from "../../types";

export interface ISecurityProvider {
  /** @deprecated use scanIdentity */
  performScan(identity: string): Promise<{ success: boolean; breachCount: number }>;
  scanIdentity(input: ScanInput): Promise<IntelligenceReport>;
  getThreatGraph(identity: string): Promise<SecurityGraph>;
  triggerRemediation(
    identity: string, 
    tier: Tier, 
    onLog: (log: LogEntry) => void,
    onComplete: () => void
  ): Promise<void>;
}
