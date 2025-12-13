
import { SecurityGraph, GraphNode, GraphEdge, IntelligenceReport, ScanInputType } from "../../types";

export class RealDataMapper {
  /**
   * Transforms API details into a consistent graph structure.
   */
  static mapToGraph(identity: string, type: ScanInputType, report: IntelligenceReport): SecurityGraph {
    const centerX = 50;
    const centerY = 50;
    
    // 1. Initialize Root User Node
    const nodes: GraphNode[] = [
      { id: "root-user", label: identity.toUpperCase(), subLabel: "Identity Root", type: "USER", x: centerX, y: centerY }
    ];
    const edges: GraphEdge[] = [];

    // 2. Handle Zero-State / Clean Result
    if (report.foundBreaches === 0) {
      return { nodes, edges, riskScore: 5 };
    }

    // 3. Map Intelligence Details to Nodes
    const details = report.details;
    const entities: any[] = [];

    // Mapping Rules by Input Type
    if (type === 'EMAIL') {
      // Logic for Hunter/EmailRep breaches
      const breachSources = details.sources?.filter((s: any) => s.status === 'ACTIVE') || [];
      breachSources.forEach((s: any, i: number) => {
        entities.push({
          id: `email-breach-${i}`,
          label: s.source === 'Hunter.io' ? 'LinkedIn Dump' : 'Breach Detected',
          subLabel: 'Data Leak',
          type: 'BREACH',
          severity: 'CRITICAL',
          source: s.source
        });
      });
    } else if (type === 'SOCIAL') {
      // Logic for Google OSINT exposure
      const platforms = details.platformsFound || [];
      platforms.forEach((p: string, i: number) => {
        entities.push({
          id: `social-exp-${i}`,
          label: p,
          subLabel: 'Public Exposure',
          type: 'EXPOSURE',
          severity: 'MEDIUM',
          source: 'Google OSINT'
        });
      });
    } else if (type === 'MOBILE') {
      // Logic for NumVerify risk
      if (details.lineType === 'Virtual') {
        entities.push({
          id: `mobile-risk-0`,
          label: 'Virtual/VoIP Line',
          subLabel: 'Suspicious Carrier',
          type: 'RISK',
          severity: 'HIGH',
          source: 'NumVerify'
        });
      }
    }

    // 4. Position Entities in an Orbit and create Edges
    entities.forEach((entity, i) => {
      const angle = (i / entities.length) * 2 * Math.PI;
      const radius = 30;
      
      const node: GraphNode = {
        ...entity,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        iconType: entity.source
      };
      
      nodes.push(node);
      edges.push({
        id: `edge-root-${node.id}`,
        source: "root-user",
        target: node.id,
        type: "RADIAL",
        animated: true
      });
    });

    return { nodes, edges, riskScore: report.riskScore };
  }
}
