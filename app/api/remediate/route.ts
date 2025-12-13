import { NextRequest, NextResponse } from 'next/server';
import { MOCK_USERS } from '../../../constants';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  try {
    // 1. Security & Authentication Check
    const apiKey = req.headers.get('x-api-key');
    // Note: In a real app, validate apiKey against env.
    
    // 2. Parse Request
    const body = await req.json();
    const { email, threatId } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // 3. RBAC: Verify User Tier (Pro/Premium Only)
    // We import MOCK_USERS to simulate a database lookup for the user's license
    const user = MOCK_USERS[email];
    
    // If user doesn't exist or is on FREE tier, deny access
    if (!user || user.tier === 'FREE') {
        return NextResponse.json(
            { error: 'Access Denied. Automated remediation is restricted to PRO and PREMIUM tiers.' },
            { status: 403 }
        );
    }

    // 4. Trigger Kestra Workflow
    const KESTRA_URL = process.env.KESTRA_API_URL || 'http://localhost:8080';
    
    // In a production environment, we would make the actual fetch:
    /*
    const kestraResponse = await fetch(`${KESTRA_URL}/api/v1/executions/trigger/com.cyber.ops/cyber-remediator-ops`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: JSON.stringify({ user_email: email, threat_id: threatId }) 
    });
    */

    // 5. Stream Logs (Simulating Real-time Kestra Output)
    const stream = new ReadableStream({
        async start(controller) {
            const sendLog = (msg: string, type: string = 'info') => {
                const data = JSON.stringify({ timestamp: new Date().toLocaleTimeString(), message: msg, type });
                controller.enqueue(encoder.encode(data + '\n'));
            };

            // Initial Handshake
            sendLog(`Initiating Kestra Workflow for ${email}...`, 'info');
            await new Promise(r => setTimeout(r, 800));

            // Kestra Logic Simulation
            sendLog(`[Kestra] Authenticating with Vault for Threat ID: ${threatId || 'Unknown'}`, 'info');
            await new Promise(r => setTimeout(r, 1000));

            sendLog(`[Kestra] RBAC Check Passed: User Tier is ${user.tier}`, 'success');
            await new Promise(r => setTimeout(r, 800));

            sendLog(`[Kestra] Executing 'analyze_exposure' task...`, 'warning');
            await new Promise(r => setTimeout(r, 1200));

            sendLog(`[Kestra] Rotating Credentials for ${email}...`, 'info');
            await new Promise(r => setTimeout(r, 1500));

            sendLog(`[Kestra] Verifying new keys with AWS IAM...`, 'info');
            await new Promise(r => setTimeout(r, 1000));

            sendLog(`[Kestra] Workflow 'cyber-remediator-ops' completed successfully.`, 'success');
            
            controller.close();
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'application/x-ndjson',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Remediation Error' }, { status: 500 });
  }
}