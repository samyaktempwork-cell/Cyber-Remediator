
import { ISecurityProvider } from "../interfaces/ISecurityProvider";
import { SecurityGraph, LogEntry, Tier, ScanInput, IntelligenceReport } from "../../types";
import { scanEmail } from "../integrations/emailScanner";
import { scanMobile } from "../integrations/mobileScanner";
import { scanSocial } from "../integrations/socialScanner";
import { RealDataMapper } from "../mappers/RealDataMapper";

export class RealProvider implements ISecurityProvider {
  private lastGraph: SecurityGraph | null = null;

  async performScan(identity: string) {
    console.log("Real mode: Scanning", identity);
    return { success: true, breachCount: 5 };
  }

  async scanIdentity(input: ScanInput): Promise<IntelligenceReport> {
    console.log(`Real Mode: Routing scan for ${input.type}`);
    let report: IntelligenceReport;

    switch (input.type) {
      case 'EMAIL': 
        report = await scanEmail(input.value);
        break;
      case 'MOBILE': 
        report = await scanMobile(input.value);
        break;
      case 'SOCIAL': 
        report = await scanSocial(input.value);
        break;
      default: 
        throw new Error(`Unsupported scan type: ${input.type}`);
    }

    // Use Mapper to generate structured Graph Data
    const graph = RealDataMapper.mapToGraph(input.value, input.type, report);
    this.lastGraph = graph;
    report.graphData = graph;

    return report;
  }

  async getThreatGraph(identity: string): Promise<SecurityGraph> {
    if (this.lastGraph) return this.lastGraph;

    // Zero-state default if no scan has been performed yet
    return { 
      nodes: [{ id: "root-user", label: identity.toUpperCase(), subLabel: "Identity Root", type: "USER", x: 50, y: 50 }], 
      edges: [], 
      riskScore: 0 
    };
  }

  async triggerRemediation(identity: string, tier: Tier, onLog: (log: LogEntry) => void, onComplete: () => void) {
    onLog({ timestamp: new Date().toLocaleTimeString(), message: "Connecting to Production Kestra Node...", type: "info" });
    
    try {
      const response = await fetch('/api/remediate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-api-key': 'live-demonstration-key' 
        },
        body: JSON.stringify({ email: identity, threatId: 'ALL' })
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);
        
        for (const line of lines) {
          try {
            const log = JSON.parse(line);
            onLog(log);
          } catch (e) {
            console.error("Error parsing stream log", e);
          }
        }
      }
      onComplete();
    } catch (error) {
      onLog({ timestamp: new Date().toLocaleTimeString(), message: `Remediation Failed: ${error}`, type: "error" });
      onComplete();
    }
  }
}
