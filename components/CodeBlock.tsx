import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

export const CodeBlock = ({ label, code, language }: { label: string, code: string, language: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-950 rounded-lg border border-slate-300 dark:border-slate-800 overflow-hidden text-xs mb-4">
      <div className="flex justify-between items-center px-3 py-2 bg-slate-200 dark:bg-slate-900 border-b border-slate-300 dark:border-slate-800">
        <span className="font-mono text-slate-600 dark:text-slate-400 font-bold">{label}</span>
        <button onClick={handleCopy} className="text-slate-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      <div className="p-3 overflow-x-auto custom-scrollbar">
        <pre className="font-mono text-slate-700 dark:text-slate-300 whitespace-pre">{code}</pre>
      </div>
    </div>
  );
};
