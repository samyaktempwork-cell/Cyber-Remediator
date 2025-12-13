import { useRef, useEffect } from "react";
import { Cpu, Send, CheckCircle2, AlertCircle, CircleDashed } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Message, SourceStatus } from "../types";

interface IntelligenceCoreProps {
  targetIdentity: string;
  messages: Message[];
  isLoading: boolean;
  input: string;
  setInput: (v: string) => void;
  handleSend: () => void;
  sources?: SourceStatus[];
}

export const IntelligenceCore = ({ targetIdentity, messages, isLoading, input, setInput, handleSend, sources }: IntelligenceCoreProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => { 
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages]);

  return (
    <div className="dashboard-card h-full w-full flex flex-col overflow-hidden border-t-4 border-t-purple-500">
      <div className="card-header shrink-0 flex flex-col gap-2">
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
                <span className="font-bold text-purple-700 dark:text-purple-400 whitespace-nowrap uppercase tracking-tighter">Intelligence Center</span>
            </div>
            <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-slate-500 font-black block uppercase">GEMINI 2.5 FLASH</span>
            </div>
        </div>

        {/* Source Signals Checked */}
        {sources && sources.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-200 dark:border-slate-800">
             {sources.map((s, idx) => (
               <div key={idx} className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[9px] font-bold border ${
                 s.status === 'ACTIVE' 
                   ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400' 
                   : s.status === 'ERROR'
                   ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400'
                   : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
               }`} title={s.reason}>
                 {s.status === 'ACTIVE' && <CheckCircle2 className="w-2.5 h-2.5" />}
                 {s.status === 'ERROR' && <AlertCircle className="w-2.5 h-2.5" />}
                 {s.status === 'SKIPPED' && <CircleDashed className="w-2.5 h-2.5" />}
                 {s.source}
               </div>
             ))}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar min-h-0 bg-white dark:bg-slate-900 w-full">
        {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[95%] p-3 rounded-xl text-sm markdown-content ${
                msg.role === "user" 
                ? "bg-purple-100 dark:bg-purple-900/40 text-purple-900 dark:text-purple-100 border border-purple-200 dark:border-purple-500/30" 
                : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-sm"
            }`}>
                {msg.role === "model" ? (
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        return (
                          <code
                            className={`${className} ${
                              inline 
                                ? "bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded text-rose-500 font-bold" 
                                : "block bg-slate-200 dark:bg-slate-950 p-4 rounded-lg my-3 font-mono text-[11px] overflow-x-auto border border-slate-300 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 leading-tight shadow-inner"
                            }`}
                            {...props}
                          >
                            {children}
                          </code>
                        );
                      },
                      pre({ children }) {
                        return <div className="my-2 relative group">{children}</div>;
                      }
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                ) : (
                  msg.text
                )}
            </div>
            </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg w-fit animate-pulse border border-slate-200 dark:border-slate-700">
             <CircleDashed className="w-3 h-3 text-purple-500 animate-spin" />
             <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Core Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 w-full mt-auto">
        <div className="flex gap-2">
            <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md px-3 h-10 text-sm text-slate-900 dark:text-slate-200 focus:border-purple-500 focus:outline-none placeholder:text-[11px] placeholder:uppercase placeholder:font-bold placeholder:tracking-tighter"
            placeholder="Search risk vectors or request remediation..."
            />
            <button onClick={handleSend} disabled={isLoading} className="bg-purple-600 hover:bg-purple-500 text-white w-10 h-10 flex items-center justify-center rounded-md shrink-0 transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-500/20">
            <Send className="w-4 h-4" />
            </button>
        </div>
      </div>
    </div>
  );
};
