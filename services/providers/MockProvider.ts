
import { ISecurityProvider } from "../interfaces/ISecurityProvider";
import { SecurityGraph, LogEntry, Tier, GraphNode, GraphEdge, ScanInput, IntelligenceReport } from "../../types";
import { MOCK_BREACHES } from "../../constants";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockProvider implements ISecurityProvider {
  async performScan(identity: string) {
    await delay(2500);
    return {
      success: true,
      breachCount: MOCK_BREACHES.length
    };
  }

  async scanIdentity(input: ScanInput): Promise<IntelligenceReport> {
    await delay(2000);
    
    switch(input.type) {
        case 'EMAIL':
            return {
                success: true,
                riskScore: 85,
                foundBreaches: MOCK_BREACHES.length,
                summary: `Email ${input.value} found in major breaches. Password rotation recommended.`,
                details: { type: 'Email Exposure', confidence: 0.98 }
            };
        case 'MOBILE':
            return {
                success: true,
                riskScore: 55,
                foundBreaches: 2,
                summary: `Phone ${input.value} linked to suspicious SMS campaigns.`,
                details: { type: 'SMS Phishing', confidence: 0.75 }
            };
        case 'SOCIAL':
            return {
                success: true,
                riskScore: 35,
                foundBreaches: 1,
                summary: `Handle ${input.value} has high public visibility on 4 platforms.`,
                details: { type: 'OSINT Footprint', confidence: 0.85 }
            };
        default:
            return { success: false, riskScore: 0, foundBreaches: 0, summary: "Unknown input type", details: {} };
    }
  }

  async getThreatGraph(identity: string): Promise<SecurityGraph> {
    await delay(800);
    const severityWeight = { "CRITICAL": 3, "HIGH": 2, "MEDIUM": 1, "LOW": 0 };
    const sortedBreaches = [...MOCK_BREACHES].sort((a, b) => 
        (severityWeight[b.severity as keyof typeof severityWeight] || 0) - 
        (severityWeight[a.severity as keyof typeof severityWeight] || 0)
    );

    const centerX = 50;
    const centerY = 50;
    const nodes: GraphNode[] = [{ id: "root-user", label: "IDENTITY ROOT", type: "USER", x: centerX, y: centerY }];
    const edges: GraphEdge[] = [];

    const breachNodes: GraphNode[] = sortedBreaches.map((b, i) => {
        const angle = (i / sortedBreaches.length) * 2 * Math.PI;
        const radius = 30 + Math.random() * 10;
        return {
            id: b.id,
            label: b.source,
            subLabel: b.type,
            type: "BREACH",
            severity: b.severity as any,
            source: b.source,
            iconType: b.source,
            date: b.date,
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        };
    });

    nodes.push(...breachNodes);

    breachNodes.forEach(node => {
        edges.push({
            id: `edge-root-${node.id}`,
            source: "root-user",
            target: node.id,
            type: "RADIAL",
            animated: true
        });
    });

    return { nodes, edges, riskScore: 85 };
  }

  async triggerRemediation(identity: string, tier: Tier, onLog: (log: LogEntry) => void, onComplete: () => void) {
    const logs = [
      { message: "Initializing Workflow Context...", type: "info" },
      { message: "Authenticating with Vault...", type: "info" },
      { message: "Retrieving secrets for rotation...", type: "warning" },
      { message: "Connecting to AWS IAM...", type: "info" },
      { message: "Rotating Access Key ID: AKIA***************", type: "success" },
      { message: "Updating Service Configuration...", type: "info" },
      { message: "Verifying new credentials...", type: "info" },
      { message: "Notification sent to security admin.", type: "success" },
      { message: "Workflow 'cyber-remediator-ops' finished.", type: "success" }
    ];

    for (const log of logs) {
      await delay(800);
      onLog({
        timestamp: new Date().toLocaleTimeString(),
        message: log.message,
        type: log.type as any
      });
    }
    onComplete();
  }
}
