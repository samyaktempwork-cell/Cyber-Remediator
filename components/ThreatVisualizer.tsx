import React from "react";
import { Activity, RefreshCcw, AlertTriangle, ShieldAlert, Clock, X } from "lucide-react";
import { ThreatMap } from "./ThreatMap";
import { Theme, SecurityGraph, GraphNode } from "../types";

interface ThreatVisualizerProps {
  riskScore: number;
  isRefreshing: boolean;
  graphData: SecurityGraph | null;
  onSelect: (node: any) => void;
  selectedNode: GraphNode | null;
  onCloseNodeDetails: () => void;
  onRefresh: () => void;
  theme: Theme;
}

export const ThreatVisualizer = ({ 
  riskScore, 
  isRefreshing, 
  graphData, 
  onSelect, 
  selectedNode,
  onCloseNodeDetails,
  onRefresh, 
  theme 
}: ThreatVisualizerProps) => {
  const getRiskColor = (score: number) => 
    score >= 80 ? "text-rose-600 dark:text-rose-500" : 
    score < 20 ? "text-emerald-600 dark:text-emerald-500" : 
    "text-amber-500 dark:text-amber-400";

  // Calculate Metrics
  const totalBreaches = graphData?.nodes.filter(n => n.type === 'BREACH').length || 0;
  const severityCounts = {
    CRITICAL: graphData?.nodes.filter(n => n.severity === 'CRITICAL').length || 0,
    HIGH: graphData?.nodes.filter(n => n.severity === 'HIGH').length || 0,
    MEDIUM: graphData?.nodes.filter(n => n.severity === 'MEDIUM').length || 0,
    LOW: graphData?.nodes.filter(n => n.severity === 'LOW').length || 0,
  };

  return (
    <div className="dashboard-card h-full relative flex flex-col border-t-4 border-t-rose-500">
      <div className="card-header z-10 shrink-0 flex justify-between items-center gap-4">
        <div className="flex items-center gap-3">
            <h2 className="font-bold flex items-center gap-2 text-rose-600 dark:text-rose-500 whitespace-nowrap">
               <Activity className="w-5 h-5" /> THREAT VISUALIZER
            </h2>
            <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 transition-all focus:outline-none"
                title="Rescan for updates"
            >
                <RefreshCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
        </div>
        <div className={`text-xl font-mono font-bold whitespace-nowrap ${getRiskColor(riskScore)}`}>
          RISK: {riskScore}/100
        </div>
      </div>
      
      <div className="flex-1 relative min-h-0 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden rounded-b-xl flex">
         
         {/* Map Area */}
         <div className={`flex-1 h-full transition-opacity duration-500 ${isRefreshing ? 'opacity-50 blur-sm' : 'opacity-100'} relative`}>
            <ThreatMap graphData={graphData} onSelect={onSelect} riskScore={riskScore} theme={theme} />
            
             {isRefreshing && (
                 <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                     <div className="text-rose-600 dark:text-rose-400 font-mono text-xs bg-white/80 dark:bg-slate-950/80 px-3 py-1 rounded border border-rose-500/30 shadow-lg">
                         SCANNING NETWORK NODES...
                     </div>
                 </div>
             )}
         </div>

         {/* Dashboard HUD Overlay (Right Side) */}
         {graphData && !isRefreshing && (
           <div className="absolute top-4 right-4 bottom-4 w-64 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden z-40 transition-transform">
              
              {selectedNode ? (
                  <div className="flex flex-col h-full animate-in slide-in-from-right duration-200">
                    <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
                        <h3 className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2">
                            Threat Detail
                        </h3>
                        <button onClick={onCloseNodeDetails} className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-colors">
                            <X className="w-3 h-3 text-slate-500" />
                        </button>
                    </div>
                    <div className="p-5 overflow-y-auto custom-scrollbar">
                        <div className={`text-xs font-bold px-2 py-1 rounded inline-block mb-3 ${
                             selectedNode.severity === 'CRITICAL' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                             selectedNode.severity === 'HIGH' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                             'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400'
                        }`}>
                            {selectedNode.severity || 'UNKNOWN'} SEVERITY
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-tight mb-1">{selectedNode.label}</h2>
                        <p className="text-xs text-slate-500 font-mono mb-4">{selectedNode.subLabel}</p>
                        
                        <div className="space-y-3">
                            <div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Detected</div>
                                <div className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Clock className="w-3 h-3" /> {selectedNode.date || 'N/A'}
                                </div>
                            </div>
                            <div>
                                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Source Vector</div>
                                <div className="text-sm text-slate-700 dark:text-slate-300">
                                    {selectedNode.source || 'Unknown'}
                                </div>
                            </div>
                            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    AI Analysis indicates a potential vulnerability. Review graph topology for impact radius.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
              ) : (
                <>
                  <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                      <h3 className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2">
                        <ShieldAlert className="w-3 h-3" /> Risk Dashboard
                      </h3>
                  </div>
                  
                  <div className="px-5 py-4 flex-1 overflow-y-auto custom-scrollbar">
                      
                      {/* Summary Counters */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-rose-50 dark:bg-rose-900/10 p-2 rounded border border-rose-100 dark:border-rose-900/30 text-center">
                              <div className="text-lg font-bold text-rose-600 dark:text-rose-500">{severityCounts.CRITICAL}</div>
                              <div className="text-[9px] font-bold text-rose-400 uppercase">Critical</div>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-900/10 p-2 rounded border border-amber-100 dark:border-amber-900/30 text-center">
                              <div className="text-lg font-bold text-amber-600 dark:text-amber-500">{severityCounts.HIGH}</div>
                              <div className="text-[9px] font-bold text-amber-400 uppercase">High</div>
                          </div>
                      </div>

                      {/* Severity Bar */}
                      <div className="mb-6">
                          <div className="flex justify-between text-[9px] font-bold text-slate-400 mb-1 uppercase">
                              <span>Severity Distribution</span>
                              <span>{totalBreaches} Vectors</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                              <div style={{ width: `${(severityCounts.CRITICAL / totalBreaches) * 100}%` }} className="bg-rose-500 h-full"></div>
                              <div style={{ width: `${(severityCounts.HIGH / totalBreaches) * 100}%` }} className="bg-amber-500 h-full"></div>
                              <div style={{ width: `${(severityCounts.MEDIUM / totalBreaches) * 100}%` }} className="bg-cyan-500 h-full"></div>
                              <div style={{ width: `${(severityCounts.LOW / totalBreaches) * 100}%` }} className="bg-slate-400 h-full"></div>
                          </div>
                      </div>

                      {/* Timeline */}
                      <div>
                          <h4 className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                              <Clock className="w-3 h-3" /> Detection Timeline
                          </h4>
                          <div className="space-y-3 relative pl-2">
                              {/* Timeline Line */}
                              <div className="absolute top-2 bottom-2 left-[5px] w-px bg-slate-200 dark:bg-slate-800"></div>

                              {graphData.nodes
                                .filter(n => n.type === 'BREACH')
                                .slice(0, 5) // Show top 5
                                .map((node) => (
                                  <div key={node.id} className="relative pl-4 cursor-pointer group" onClick={() => onSelect(node)}>
                                      <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-950 ${
                                          node.severity === 'CRITICAL' ? 'bg-rose-500' :
                                          node.severity === 'HIGH' ? 'bg-amber-500' :
                                          'bg-cyan-500'
                                      }`}></div>
                                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                          {node.label}
                                      </div>
                                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                          {node.date || "Unknown Date"} • {node.subLabel}
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
                </>
              )}
           </div>
         )}
      </div>
    </div>
  );
};