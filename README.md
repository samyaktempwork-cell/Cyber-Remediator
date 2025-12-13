# 🛡️ Cyber Remediator: Aegis Vizier Protocol
> **The Final Mile of Identity Defense: From Detection to Autonomous Remediation**

[![Gemini 2.5](https://img.shields.io/badge/AI-Gemini_2.5_Flash-blueviolet?style=for-the-badge&logo=google-gemini)](https://ai.google.dev/)
[![Kestra](https://img.shields.io/badge/Workflow-Kestra_v0.17-purple?style=for-the-badge&logo=kestra)](https://kestra.io/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel_Edge-black?style=for-the-badge&logo=vercel)](https://vercel.com/)
[![Cline](https://img.shields.io/badge/Engineering-Cline_AI-emerald?style=for-the-badge)](https://cline.bot/)

##  Vision & Context
In the current cybersecurity landscape, "knowing you are breached" is no longer enough. The gap between **Identity Exposure** (the discovery) and **Remediation** (the fix) is where most damage occurs. 

**Cyber Remediator** (Public Interface) and **Aegis Vizier Protocol** (Internal Orchestrator) provide an end-to-end solution. It doesn't just scan for leaks; it executes the recovery. By combining LLM-powered reasoning (**Gemini 2.5**) with enterprise-grade workflow orchestration (**Kestra**), we've built a "Final Mile" platform for digital identity protection.

---

##  3-Tier "Command & Control" Structure
The platform operates on a strict Role-Based Access Control (RBAC) model, designed to demonstrate enterprise scalability and monetization strategies.

| Feature | **Tier 1: FREE (Public)** | **Tier 2: PRO (Analyst)** | **Tier 3: PREMIUM (Enterprise)** |
| :--- | :--- | :--- | :--- |
| **Intelligence** | Static Exposure Checks | Deep OSINT (Email/Mobile) | Real-time Global Attack Graph |
| **Mapping** | Fixed Risk Summary | Interactive SVG Radial Maps | Multi-Vector Force Graphs |
| **Remediation** | Manual Checklists | **AI-Generated CLI Scripts** | **Autonomous Kestra Execution** |
| **Response Engine** | Gemini 2.5 Flash | Gemini 2.5 Pro (via Cline) | Fine-tuned Oumi Agents |
| **Priority** | Standard (Rate Limited) | High Priority (Low Latency) | Ultra-Low Latency Edge-Only |
| **Compliance** | Basic Disclaimer | Article 17 Consent Guard | Full Audit Logging & Cloud Sync |

---

##  Technical Infrastructure Deep-Dive

### 1. Kestra Orchestration & Cloud Sync (`/backend/flow.yaml`)
We utilize **Kestra** as our heavy-duty state machine. Unlike simple scripts, Kestra handles:
- **Task Switching:** Dynamically branching workflows based on real-time risk scores.
- **Autonomous Remediation:** Rotating AWS IAM keys, triggering GDPR "Right to Erasure" requests, and updating blocklists.
- **CI/CD Integration:** A specialized `deploy_to_cloud` task that uses the Kestra API to synchronize local remediation blueprints with enterprise cloud clusters.

### 2. Cline AI: The Autonomous Script Engineer
Integrated into the **PRO** tier, **Cline AI** acts as a virtual site reliability engineer. When a breach is identified, Cline analyzes the specific threat vector and generates a tailored remediation script (Python, Bash, or Terraform) that the user can execute immediately.

### 3. Vercel Edge & NDJSON Streaming (`/app/api/remediate`)
The bridge between the frontend and the heavy backend orchestration:
- **Live Logging:** Using the Vercel Edge Runtime, we stream logs from Kestra execution nodes to the UI terminal in **NDJSON** format, providing zero-latency feedback during high-stakes security operations.
- **Serverless Crons:** Automated daily scans are scheduled via `vercel.json` to ensure continuous monitoring.

---

##  Compliance: The "Aegis Vizier" Consent Guard
Security requires authority. The **Aegis Vizier Protocol** enforces a mandatory **Consent Guard**.
- **Legal Authorization:** Before any "Write" operation (e.g., rotating keys, deleting data), the user must explicitly authorize the protocol.
- **Visual Lock:** The remediation console remains in a "Grayscale Lock" state until compliance standards are met, preventing accidental or unauthorized triggers.

---

## 🔄 Operational Realms

###  Simulation Mode (Safe Harbor)
- **Use Case:** Demonstrations, Training, and UI/UX testing.
- **Logic:** Powered by `MockProvider.ts`, utilizing `constants.ts` to simulate complex threat landscapes without incurring API costs or infrastructure risk.

###  Real Mode (Live Battle)
- **Use Case:** Production-ready identity protection.
- **Integrations:** 
  - **Hunter.io / EmailRep:** Live breach data.
  - **NumVerify:** Mobile line intelligence.
  - **Kestra API:** Actual execution of Python/AWS/Mail tasks.
  - **Gemini Live:** Real-time conversational intelligence for threat analysis.

---

## 📂 Folder Directory Structure
```text
.
├── app/api/remediate/   # Vercel Edge Route (The NDJSON Streaming Bridge)
├── backend/             # Infrastructure Layer
│   ├── flow.yaml        # Kestra Workflow Blueprint (with Cloud Sync task)
│   └── docker-compose   # Containerized Stack (Postgres/Kestra)
├── components/          # Presentation Layer
│   ├── ThreatVisualizer # The "War Room" HUD (SVG Attack Surface Graph)
│   ├── IntelligenceCore # Gemini 2.5 AI Agent Interface
│   ├── RemediationConsole # Real-time Kestra Worker Terminal
│   ├── ConsentGuard     # Compliance & Legal Authorization Logic
│   └── ConfigPanel      # RBAC & Infrastructure Blueprint Viewer
├── services/            # Logic & Strategy Layer
│   ├── ServiceFactory   # Strategy Pattern for Mock/Real Mode Injection
│   ├── providers/       # MockProvider (Fast) vs RealProvider (Live API)
│   ├── mappers/         # RealDataMapper (Normalization of OSINT JSON)
│   └── remediation/     # The Orchestrator for 3-tier logic execution
├── config.ts            # Dynamic Service Registry & API Flag Logic
├── constants.ts         # Branding, Mock Data, and Technical Blueprints
└── README.md            # You are here.
```

---

##  Setup & Experience

1. **Deploy Local Orchestration:**
   ```bash
   cd backend && docker-compose up -d
   # Access Kestra UI at http://localhost:8080
   ```

2. **Configure Environment:**
   Set `API_KEY` (Gemini) in your environment. Use `VITE_ENABLE_HUNTER=true` for live OSINT lookups.

3. **Initiate Protocol:**
   - Scan an identity on the Landing Page.
   - Enter the **Aegis Vizier** Command Center.
   - Authorize via the **Consent Guard**.
   - Watch the **Kestra** logs stream in real-time as the identity is secured.

---

**Architected with Precision by Samyakkumar Jain.**  
*Cyber Remediator: Because Detection is not Defense.*
