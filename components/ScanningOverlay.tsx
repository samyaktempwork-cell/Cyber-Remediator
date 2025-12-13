import React, { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { DASHBOARD_NAME } from "../constants";

export const ScanningOverlay = () => {
  const [log, setLog] = useState(`Initializing ${DASHBOARD_NAME} Protocol...`);
  
  useEffect(() => {
    const logs = [
      "Securing Tunnel...",
      "Resolving DNS...",
      "Querying Dark Web Nodes...",
      "Matching Hash Signatures...",
      "Analyzing Social Graph...",
      "Retrieving HIBP Data...",
      "Detecting Exposed API Keys...",
      "Found Critical Vulnerabilities...",
      "Compiling Intelligence Report..."
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setLog(logs[i]);
        i++;
      }
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    // CHANGE: Used 'fixed inset-0' to lock it to the screen viewport
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 z-50 transition-colors duration-300">
      <Loader className="w-12 h-12 text-cyan-600 dark:text-cyan-500 animate-spin mb-8" />
      <div className="font-mono text-cyan-600 dark:text-cyan-400 text-lg mb-2 font-bold uppercase tracking-widest">{log}</div>
      <div className="w-64 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-cyan-600 dark:bg-cyan-500 animate-progress origin-left"></div>
      </div>
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 3.5s linear forwards;
        }
      `}</style>
    </div>
  );
};