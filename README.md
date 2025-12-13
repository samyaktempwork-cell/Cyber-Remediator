# 🛡️ Cyber Remediator (Aegis Vizier Protocol)

> **Identity Exposure & Vulnerability Scanner**
> *Architected with Next.js 14, Tailwind CSS, and Enterprise Design Patterns.*

![Status](https://img.shields.io/badge/Status-Stage%201%3A%20Foundation-blue)
![Tech](https://img.shields.io/badge/Stack-Next.js_14_|_React_18_|_Tailwind-000000)

##  Project Overview
**Cyber Remediator** is a specialized security dashboard designed to detect and visualize identity exposure (email breaches, leaked API keys, and dark web hits). 

The core interface, **Aegis Vizier**, provides a "Glassmorphism" command center for security analysts to toggle between **Simulation Mode** (for safe demos) and **Real Mode** (live OSINT scanning).

##  Current Progress: Stage 1 (Foundation)
We are currently in **Phase 1** of development. The core infrastructure is live.

### ✅ Implemented Features
- **Next.js 14 App Router:** High-performance server-side rendering architecture.
- **Stability Engine:** Custom configuration pinning React 18 to ensure Vercel Edge compatibility.
- **Aegis UI System:** - "Cyber/Dark" theme with dynamic glassmorphism effects.
  - Fully responsive Landing Page with tabbed inputs (Email/Mobile/Social).
  - Configured `tailwind.config.ts` for deep folder scanning.
- **Type Safety:** Strict TypeScript interfaces for `ScanInput`, `Theme`, and `AppMode`.

---

##  Development Roadmap
We are building this system in 5 strategic stages:

- [x] **Stage 1: Foundation & UI** (Current)
- [ ] **Stage 2: Logic Core** (Strategy Pattern & Simulation Engine)
- [ ] **Stage 3: Aegis Dashboard** (Graph Visualization & Console)
- [ ] **Stage 4: Real World Integration** (API Gateway & Feature Flags)
- [ ] **Stage 5: Enterprise Automation** (Kestra Orchestration & Docker)

---

##  Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# 1. Clone the repository
git clone [https://github.com/YOUR_USERNAME/cyber-remediator.git](https://github.com/YOUR_USERNAME/cyber-remediator.git)

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev