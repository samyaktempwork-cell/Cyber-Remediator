import { IntelligenceReport, ScanInput, SecurityGraph } from "../../types";

export interface ISecurityProvider {
  scanIdentity(input: ScanInput): Promise<IntelligenceReport>;
  getThreatGraph(identity: string): Promise<SecurityGraph>;
}