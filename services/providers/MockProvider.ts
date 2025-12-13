import { ISecurityProvider } from "../interfaces/ISecurityProvider";
import { IntelligenceReport, ScanInput, SecurityGraph, GraphNode } from "../../types";

export class MockProvider implements ISecurityProvider {
  async scanIdentity(input: ScanInput): Promise<IntelligenceReport> {
    // Simulate "Network Latency" to make it look real
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      success: true,
      riskScore: 85,
      foundBreaches: 3,
      summary: `Simulation: Detected 3 critical exposures for ${input.value}`,
      details: {
        sources: [
          { name: "Dark Web", status: "active" },
          { name: "Public Leaks", status: "warning" },
          { name: "Social Graph", status: "inactive" },
        ],
      },
    };
  }

  async getThreatGraph(identity: string): Promise<SecurityGraph> {
    // Hardcoded graph data for visualization demo
    return {
      riskScore: 85,
      edges: [], // We will populate edges in Stage 3
      nodes: [
        { id: "root", label: identity, type: "ROOT", x: 400, y: 300, color: "#ef4444" },
        { id: "t1", label: "PwndDB Breach", type: "BREACH", x: 600, y: 200, color: "#f97316" },
        { id: "t2", label: "Phishing Target", type: "THREAT", x: 200, y: 400, color: "#eab308" },
        { id: "t3", label: "Exposed API", type: "THREAT", x: 500, y: 500, color: "#eab308" },
      ] as GraphNode[],
    };
  }
}