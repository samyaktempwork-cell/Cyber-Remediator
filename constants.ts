
import { Tier, Theme } from "./types";

export const DEFAULT_THEME: Theme = "light";

export const APP_NAME = 'Cyber Remediator';
export const DASHBOARD_NAME = 'Aegis Vizier';
export const BRAND_TAGLINE = 'Identity Exposure & Vulnerability Scanner';

export const MOCK_USERS: Record<string, { tier: Tier; name: string; password?: string }> = {
  "pro@aegis.com": { tier: "PRO", name: "Pro Analyst", password: "aegis@123" },
  "premium@aegis.com": { tier: "PREMIUM", name: "Enterprise Admin", password: "aegis@123" },
  "samyaktempwork@gmail.com": { tier: "PREMIUM", name: "Samyak Premium", password: "aegis@123" },
};

export const MOCK_BREACHES = [
  { id: 1, source: "Legacy CRM", date: "2023-11-12", severity: "CRITICAL", type: "Password Hash" },
  { id: 2, source: "Git Repo", date: "2024-01-05", severity: "HIGH", type: "API Keys" },
  { id: 3, source: "Email Svc", date: "2024-02-20", severity: "MEDIUM", type: "Customer List" },
  { id: 4, source: "Int. Wiki", date: "2024-03-10", severity: "LOW", type: "Internal Docs" },
  { id: 5, source: "AWS Bucket", date: "2024-03-15", severity: "CRITICAL", type: "Pernsonal Data" },
  { id: 6, source: "Dev Server", date: "2024-03-18", severity: "HIGH", type: "SSH Keys" },
  { id: 7, source: "Slack Token", date: "2024-03-19", severity: "MEDIUM", type: "Chat History" },
  { id: 8, source: "Old Analytics", date: "2024-03-20", severity: "LOW", type: "Metadata" },
];

export const KESTRA_YAML = `id: autonomous-remediate-exec
namespace: com.cyber.remedy
inputs:
  - name: identity
    type: STRING
  - name: script_content
    type: STRING

tasks:
  - id: compliance_log
    type: io.kestra.core.tasks.log.Log
    message: "Executing authorized remediation for {{ inputs.identity }}"

  - id: script_execution
    type: io.kestra.plugin.scripts.python.Script
    script: |
      import os
      # The AI generated script would be executed in a safe sandbox here
      print("Starting autonomous remediation logic...")
      print("Payload: {{ inputs.script_content }}")
      print("Security validation passed.")

  - id: verify_resolution
    type: io.kestra.core.tasks.flows.Pause
    delay: PT30S
    onCompletion:
      - id: notify_final
        type: io.kestra.plugin.notifications.mail.MailSend
        to: "{{ inputs.identity }}"
        subject: "Autonomous Remediation Complete"`;

export const DOCKER_COMPOSE = `version: "3"
services:
  kestra:
    image: kestra/kestra:latest
    ports:
      - "8080:8080"
    environment:
      KESTRA_CONFIGURATION: |
        kestra:
          server:
            basic-auth:
              enabled: false
    volumes:
      - ./kestra_data:/app/storage`;

export const CLINE_PROMPT = `Act as a Senior Vercel & Next.js Engineer.
I need you to implement the backend API route for my "Cyber Remediator" app.

Requirements:
1. Create a file 'app/api/remediate/route.ts'.
2. It should accept POST requests with { email, threatId }.
3. Authenticate the request using a custom header 'x-api-key'.
4. Trigger the Kestra Workflow ID 'cyber-remediator-ops' via Kestra's REST API.
5. Use the 'fetch' API to call Kestra running at 'http://localhost:8080'.
6. Return a JSON stream so the frontend can display real-time progress.

Stack: Next.js 14 (App Router), TypeScript, Kestra API.`;

export const VERCEL_JSON = `{
  "crons": [
    {
      "path": "/api/daily-scan",
      "schedule": "0 0 * * *"
    }
  ],
  "functions": {
    "app/api/**/*": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}`;
