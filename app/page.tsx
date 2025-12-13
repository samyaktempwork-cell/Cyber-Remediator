"use client";
import React, { useState, useEffect, useMemo } from "react";
import { GoogleGenAI } from "@google/genai";
import { Shield, Sun, Moon } from "lucide-react";

// Types & Config
import { Tier, AppMode, Theme, Message, LogEntry, SecurityGraph, GraphNode, ScanInput, IntelligenceReport, SourceStatus, ScanInputType } from "../types";
import { DEFAULT_THEME, DASHBOARD_NAME } from "../constants";

// Services
import { AuthService } from "../services/authService";
import { ServiceFactory, OperationMode } from "../services/ServiceFactory";
import { RemediationOrchestrator } from "../services/remediation/RemediationOrchestrator";

// Components
import { LandingPage } from "../components/LandingPage";
import { ScanningOverlay } from "../components/ScanningOverlay";
import { UpgradeModal } from "../components/UpgradeModal";
import { ThreatVisualizer } from "../components/ThreatVisualizer";
import { IntelligenceCore } from "../components/IntelligenceCore";
import { RemediationConsole } from "../components/RemediationConsole";
import { ConfigPanel } from "../components/ConfigPanel";

// FIXED: Import ModeContext instead of exporting it
import { ModeContext } from "../components/ModeContext";

// --- Main Application Component ---
export default function App() {
  // --- State ---
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);
  const [appMode, setAppMode] = useState<AppMode>("LANDING");
  const [opMode, setOpMode] = useState<OperationMode>("SIMULATION");
  const [targetIdentity, setTargetIdentity] = useState("");
  const [targetType, setTargetType] = useState<ScanInputType>("EMAIL");
  const [lastReport, setLastReport] = useState<IntelligenceReport | null>(null);
  
  // RBAC State
  const [tier, setTier] = useState<Tier>("FREE");
  const [userLicenseTier, setUserLicenseTier] = useState<Tier>("FREE");
  const [authError, setAuthError] = useState("");
  
  const [configTab, setConfigTab] = useState<"SETTINGS" | "BLUEPRINTS">("SETTINGS");
  const [blueprintCategory, setBlueprintCategory] = useState<"KESTRA" | "DOCKER" | "CLINE" | "VERCEL">("KESTRA");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [riskScore, setRiskScore] = useState(85);
  const [isRemediating, setIsRemediating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isSystemSecured, setIsSystemSecured] = useState(false);
  const [graphData, setGraphData] = useState<SecurityGraph | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [activeSources, setActiveSources] = useState<SourceStatus[]>([]);

  const provider = ServiceFactory.getProvider(opMode);
  const remediator = useMemo(() => new RemediationOrchestrator(), []);

  useEffect(() => {
    const root = document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const addLog = (message: string, type: LogEntry["type"] = "info") => {
    setLogs((prev) => [...prev, { timestamp: new Date().toLocaleTimeString(), message, type }]);
  };

  const handleStartScan = async (scanInput: ScanInput) => {
    setTargetIdentity(scanInput.value);
    setTargetType(scanInput.type);
    setAppMode("SCANNING");
    
    try {
      const report = await provider.scanIdentity(scanInput);
      
      if(report.success) {
        setAppMode("DASHBOARD");
        setLastReport(report);
        
        const graph = report.graphData || await provider.getThreatGraph(scanInput.value);
        setGraphData(graph);
        setRiskScore(report.riskScore);
        setActiveSources(report.details?.sources || []);
        initDashboard(scanInput.value, report);
      } else {
        setAppMode("LANDING");
        setAuthError("Failed to initiate scan.");
      }
    } catch (e) {
      console.error(e);
      setAppMode("LANDING");
      setAuthError("Scanning engine error.");
    }
  };

  const handleLogin = async (email: string, password?: string) => {
    const user = AuthService.login(email, password);
    if (user) {
        setAuthError("");
        setTargetIdentity(email);
        setTargetType("EMAIL");
        setAppMode("DASHBOARD");
        setTier(user.tier);
        setUserLicenseTier(user.tier);
        setIsSystemSecured(false);
        
        const graph = await provider.getThreatGraph(email);
        setGraphData(graph);
        setRiskScore(graph.riskScore);
        setActiveSources([]);
        const initialReport = { 
            foundBreaches: graph.nodes.length - 1, 
            summary: "Session restored from authenticated vault.",
            details: { sources: [] },
            riskScore: graph.riskScore,
            success: true,
            graphData: graph
        } as IntelligenceReport;
        setLastReport(initialReport);
        initDashboard(email, initialReport);
    } else {
        setAuthError("Invalid credentials. Please verify email and password.");
    }
  };

  const handleLogout = () => {
    setAppMode("LANDING");
    setTier("FREE");
    setTargetIdentity("");
    setMessages([]);
    setLogs([]);
    setGraphData(null);
    setIsSystemSecured(false);
    setActiveSources([]);
    setLastReport(null);
  };

  const initDashboard = (identity: string, report: IntelligenceReport) => {
      setLogs([
        { timestamp: new Date().toLocaleTimeString(), message: `${DASHBOARD_NAME} Protocol Initiated...`, type: "info" },
        { timestamp: new Date().toLocaleTimeString(), message: `Target Acquired: ${identity}`, type: "success" },
        { timestamp: new Date().toLocaleTimeString(), message: `Scan Complete. ${report.foundBreaches} Vectors Found.`, type: "warning" },
        { timestamp: new Date().toLocaleTimeString(), message: `Mode: ${opMode}`, type: "info" },
      ]);
      
      setMessages([
        {
          role: "model",
          text: `## Intelligence Report: ${identity}\n\n**Summary:** ${report.summary}\n\nDetected **${report.foundBreaches}** active vulnerabilities. ${DASHBOARD_NAME} visualization is now active. How should we proceed with remediation?`,
        },
      ]);
  };

  const handleManualRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    addLog(`Manual rescan initiated (${opMode})...`, "info");
    
    let graph;
    if (isSystemSecured) {
        graph = { nodes: [{ id: "root-user", label: "IDENTITY ROOT", type: "USER", x: 50, y: 50 } as GraphNode], edges: [], riskScore: 5 };
    } else {
        graph = await provider.getThreatGraph(targetIdentity);
    }
    
    setTimeout(() => {
      setIsRefreshing(false);
      setGraphData(graph);
      setRiskScore(graph.riskScore);
      setSelectedNode(null);
      addLog(isSystemSecured ? "Rescan complete. System is secure." : "Rescan complete. Landscape synced.", isSystemSecured ? "success" : "warning");
    }, 1200);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userText = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "mock-key" });
      const systemInstruction = `You are the ${DASHBOARD_NAME} Intelligence Agent. Mode: ${opMode}. Tier: ${tier}. Target: ${targetIdentity}. Analyze risk. Be technical, firm, and brief.`;
      
      if (!process.env.API_KEY) throw new Error("Missing API Key");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [...messages.slice(-5).map(m => ({ role: m.role === 'model' ? 'model' : 'user', parts: [{ text: m.text }] })), { role: "user", parts: [{ text: userText }] }],
        config: { systemInstruction }
      });
      setMessages((prev) => [...prev, { role: "model", text: response.text || "Error." }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "system", text: "AI Brain Unavailable." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerRemediation = async () => {
    if (tier === "FREE") { setShowUpgradeModal(true); return; }
    if (isRemediating || riskScore < 20 || !lastReport) return;

    setIsRemediating(true);
    addLog(`INITIATING ${DASHBOARD_NAME} REMEDIATION ORCHESTRATOR...`, "warning");
    
    try {
      const outcome = await remediator.run(
        targetIdentity, 
        targetType, 
        tier, 
        lastReport, 
        (log) => setLogs(prev => [...prev, log])
      );

      setRiskScore(5);
      setIsRemediating(false);
      setIsSystemSecured(true);
      setGraphData(prev => prev ? { ...prev, nodes: prev.nodes.filter(n => n.type === 'USER'), edges: [], riskScore: 5 } : null);
      
      let finalMsg = `**Remediation Protocol Finished.**\n\n`;
      if (outcome.type === 'SCRIPT') {
        finalMsg += `AI has generated the following response for you to apply:\n\n\`\`\`\n${outcome.content}\n\`\`\``;
      } else {
        finalMsg += outcome.content;
      }
      
      setMessages(prev => [...prev, { role: "model", text: finalMsg }]);
    } catch (err) {
      addLog("Remediation Orchestrator encountered a fatal error.", "error");
      setIsRemediating(false);
    }
  };

  if (appMode === "LANDING") {
    return (
      <ModeContext.Provider value={{ opMode, setOpMode }}>
        <LandingPage onScan={handleStartScan} onLogin={handleLogin} authError={authError} setAuthError={setAuthError} theme={theme} onToggleTheme={toggleTheme} />
      </ModeContext.Provider>
    );
  }

  if (appMode === "SCANNING") return <ScanningOverlay />;

  const dashboardNameParts = DASHBOARD_NAME.split(' ');

  return (
    <ModeContext.Provider value={{ opMode, setOpMode }}>
      <div className="h-screen w-full bg-slate-200 dark:bg-black text-slate-800 dark:text-slate-200 font-sans flex flex-col overflow-hidden transition-colors duration-300 relative">
        {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} onUpgrade={(t) => { setTier(t); setUserLicenseTier(t); setShowUpgradeModal(false); }} />}

        <div className="h-16 px-6 border-b border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0 shadow-sm z-50">
           <div className="flex items-center gap-3">
               <div className={`p-1.5 rounded-lg shadow-lg transition-colors duration-500 ${opMode === 'REAL' ? 'bg-rose-600' : 'bg-cyan-600'}`}>
                  <Shield className="w-5 h-5 text-white" />
               </div>
               <div>
                  <h1 className="text-lg font-black tracking-tight leading-none uppercase">
                    {dashboardNameParts[0]} <span className={`transition-colors duration-500 ${opMode === 'REAL' ? 'text-rose-500' : 'text-cyan-500'}`}>{dashboardNameParts[1]}</span>
                  </h1>
                  <div className={`text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5 transition-colors duration-500 ${opMode === 'REAL' ? 'text-rose-500' : 'text-cyan-500'}`}>& Remed Protocol</div>
               </div>
           </div>
           
           <div className="flex items-center gap-6">
               <div className={`px-3 py-1 rounded-full text-[10px] font-black border transition-all duration-500 ${
                 opMode === 'REAL' 
                 ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800' 
                 : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
               }`}>
                  {opMode} MODE
               </div>
               <button onClick={toggleTheme} className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
               </button>
               <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full animate-pulse ${opMode === 'REAL' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`}></span>
                  <span className="text-xs font-mono font-bold">LIVE</span>
               </div>
           </div>
        </div>

        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-12 grid-rows-2 gap-6 min-h-0">
          <div className="lg:col-span-8 h-full shadow-lg rounded-2xl overflow-hidden">
              <ThreatVisualizer riskScore={riskScore} isRefreshing={isRefreshing} graphData={graphData} onSelect={setSelectedNode} selectedNode={selectedNode} onCloseNodeDetails={() => setSelectedNode(null)} onRefresh={handleManualRefresh} theme={theme} />
          </div>
          <div className="lg:col-span-4 h-full shadow-lg rounded-2xl overflow-hidden">
              <IntelligenceCore targetIdentity={targetIdentity} messages={messages} isLoading={isLoading} input={input} setInput={setInput} handleSend={handleSend} sources={activeSources} />
          </div>
          <div className="lg:col-span-8 h-full shadow-lg rounded-2xl overflow-hidden">
              <RemediationConsole logs={logs} triggerRemediation={triggerRemediation} isRemediating={isRemediating} riskScore={riskScore} tier={tier} />
          </div>
          <div className="lg:col-span-4 h-full shadow-lg rounded-2xl overflow-hidden">
              <ConfigPanel configTab={configTab} setConfigTab={setConfigTab} tier={tier} userLicenseTier={userLicenseTier} onTierSwitchRequest={setTier} blueprintCategory={blueprintCategory} setBlueprintCategory={setBlueprintCategory} setAppMode={setAppMode} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </ModeContext.Provider>
  );
}