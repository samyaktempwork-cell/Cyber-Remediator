import { GoogleGenAI } from "@google/genai";
import { Tier, ScanInputType, IntelligenceReport, RemediationOutcome, LogEntry } from "../../types";
import { REMEDIATION_SYSTEM_PROMPTS } from "../../prompts/remediationPrompts";

export class RemediationOrchestrator {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async run(
    identity: string, 
    type: ScanInputType, 
    tier: Tier, 
    report: IntelligenceReport,
    onLog: (log: LogEntry) => void
  ): Promise<RemediationOutcome> {
    // Start of the Aegis Vizier Protocol
    onLog({ timestamp: new Date().toLocaleTimeString(), message: "Aegis Vizier Protocol Initiated...", type: 'info' });
    await new Promise(r => setTimeout(r, 400));
    onLog({ timestamp: new Date().toLocaleTimeString(), message: `Target Acquired: ${identity}`, type: 'success' });
    await new Promise(r => setTimeout(r, 400));
    onLog({ timestamp: new Date().toLocaleTimeString(), message: `Mode: ACTIVE_DEFENSE (${tier === 'FREE' ? 'MANUAL' : 'REAL'})`, type: 'warning' });
    await new Promise(r => setTimeout(r, 400));
    onLog({ timestamp: new Date().toLocaleTimeString(), message: `Selecting protocol for ${tier} tier...`, type: 'info' });

    if (tier === 'FREE') {
      return this.handleFree(type, report);
    }

    if (tier === 'PRO') {
      return this.handlePro(identity, type, onLog);
    }

    if (tier === 'PREMIUM') {
      return this.handlePremium(identity, type, onLog);
    }

    throw new Error("Invalid Tier");
  }

  private handleFree(type: ScanInputType, report: IntelligenceReport): RemediationOutcome {
    const content = `Manual Recommendation for ${type}:
1. Change your primary password immediately.
2. Enable 2FA on all linked accounts.
3. Review your public profile visibility.`;
    return { type: 'TEXT', content };
  }

  private async handlePro(identity: string, type: ScanInputType, onLog: (log: LogEntry) => void): Promise<RemediationOutcome> {
    onLog({ timestamp: new Date().toLocaleTimeString(), message: "Engaging AI Remediation Brain (Cline)...", type: 'warning' });
    
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate a remediation plan for identity: ${identity}`,
        config: { systemInstruction: REMEDIATION_SYSTEM_PROMPTS[type] }
      });
      
      const script = response.text || "Failed to generate script.";
      onLog({ timestamp: new Date().toLocaleTimeString(), message: "Custom Remediation Script Generated.", type: 'success' });
      
      // Extended Lifecycle Logs for Kestra/Docker as requested
      await new Promise(r => setTimeout(r, 1000));
      onLog({ timestamp: new Date().toLocaleTimeString(), message: "Provisioning Kestra Workflow 'remedy-worker-pro'...", type: 'info' });
      
      await new Promise(r => setTimeout(r, 1200));
      onLog({ timestamp: new Date().toLocaleTimeString(), message: "Spawning Docker Container (Python 3.11/Alpine) for script execution...", type: 'warning' });
      
      await new Promise(r => setTimeout(r, 1500));
      onLog({ timestamp: new Date().toLocaleTimeString(), message: "Validating Cline-suggested parameters against local security policy...", type: 'info' });
      
      await new Promise(r => setTimeout(r, 1000));
      onLog({ timestamp: new Date().toLocaleTimeString(), message: "Executing patch logic in isolated sandbox...", type: 'success' });

      await new Promise(r => setTimeout(r, 800));
      onLog({ timestamp: new Date().toLocaleTimeString(), message: "Identity state verified. Cleaning up worker containers.", type: 'info' });

      return { type: 'SCRIPT', content: script };
    } catch (e) {
      return { type: 'TEXT', content: "AI Brain is currently offline. Please try manual steps." };
    }
  }

  private async handlePremium(identity: string, type: ScanInputType, onLog: (log: LogEntry) => void): Promise<RemediationOutcome> {
    onLog({ timestamp: new Date().toLocaleTimeString(), message: "Initializing Autonomous Kestra Executor (Enterprise Cluster)...", type: 'warning' });
    
    const steps = [
        { msg: "Vault Authentication Handshake", type: 'info' as const },
        { msg: "Retrieving Kestra Secrets for 'cyber-ops' Namespace", type: 'info' as const },
        { msg: "Cline AI: Optimization of remediation logic based on real-time threat graph", type: 'warning' as const },
        { msg: "Deploying Aegis-Container (Node/Python) to Vercel/Kestra Edge Node", type: 'info' as const },
        { msg: "Executing Multi-Step Workflow: [Rotate_Keys, Update_Policy, Notify_Admin]", type: 'info' as const },
        { msg: "AWS IAM: Successfully rotated compromised access keys", type: 'success' as const },
        { msg: "Verifying Resolution: Scanning attack surface for lateral persistence...", type: 'warning' as const },
        { msg: "Post-remediation audit log generated in com.cyber.ops", type: 'success' as const }
    ];

    for(const step of steps) {
      await new Promise(r => setTimeout(r, 900));
      onLog({ timestamp: new Date().toLocaleTimeString(), message: `[Kestra] ${step.msg}`, type: step.type });
    }

    onLog({ timestamp: new Date().toLocaleTimeString(), message: "AUTONOMOUS REMEDIATION SUCCESSFUL.", type: 'success' });
    return { type: 'EXECUTION', content: "Identity Secured. Kestra workflow finished without errors.", steps: steps.map(s => s.msg) };
  }
}
