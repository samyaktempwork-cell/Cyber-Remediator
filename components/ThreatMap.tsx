
import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Network, User, ShieldCheck, 
  Database, GitBranch, Mail, FileText, Cloud, Server, MessageSquare, BarChart
} from "lucide-react";
import { Theme, SecurityGraph, GraphNode, GraphEdge } from "../types";

// Icon Mapping Helper
const getIconForSource = (source: string = "") => {
  const s = source.toLowerCase();
  if (s.includes("git")) return GitBranch;
  if (s.includes("email")) return Mail;
  if (s.includes("wiki") || s.includes("docs")) return FileText;
  if (s.includes("aws") || s.includes("cloud") || s.includes("bucket")) return Cloud;
  if (s.includes("server") || s.includes("dev")) return Server;
  if (s.includes("slack") || s.includes("chat")) return MessageSquare;
  if (s.includes("analytics")) return BarChart;
  if (s.includes("crm")) return User;
  return Database;
};

interface ThreatMapProps {
    graphData: SecurityGraph | null;
    onSelect: (b: any) => void;
    riskScore: number;
    theme: Theme;
}

export const ThreatMap = ({ graphData, onSelect, riskScore, theme }: ThreatMapProps) => {
  const [rotation, setRotation] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const requestRef = useRef<number>(0);
  
  // Animation Loop for Smooth Orbiting
  useEffect(() => {
    const animate = () => {
      if (!isPaused) {
        setRotation(prev => (prev + 0.04) % 360);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    if (riskScore > 10) {
        requestRef.current = requestAnimationFrame(animate);
    }
    return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [riskScore, isPaused]);

  // Generate lateral mesh edges between outer nodes for better visual "threat surface"
  const meshEdges = useMemo(() => {
    if (!graphData || graphData.nodes.length < 3) return [];
    const outerNodes = graphData.nodes.filter(n => n.type !== 'USER');
    const edges: GraphEdge[] = [];
    
    for (let i = 0; i < outerNodes.length; i++) {
        const nextIdx = (i + 1) % outerNodes.length;
        edges.push({
            id: `mesh-${outerNodes[i].id}-${outerNodes[nextIdx].id}`,
            source: outerNodes[i].id,
            target: outerNodes[nextIdx].id,
            type: 'MESH',
            animated: Math.random() > 0.5
        });
    }
    return edges;
  }, [graphData]);

  if (!graphData || !graphData.nodes.length) {
      return (
        <div className="relative w-full h-full bg-slate-50/50 dark:bg-slate-900/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner flex items-center justify-center">
             <div className="text-center">
                <div className="relative inline-block mb-4">
                    <ShieldCheck className="w-20 h-20 text-emerald-500 opacity-50 animate-pulse" />
                    <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full"></div>
                </div>
                <h2 className="text-xl font-black text-emerald-600 dark:text-emerald-500 tracking-widest uppercase italic">SYSTEM SECURE</h2>
                <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase tracking-tighter">Aegis Guard Active</p>
            </div>
        </div>
      );
  }

  const centerX = 50;
  const centerY = 50;

  const rotatePoint = (x: number, y: number, angleDeg: number) => {
      const angleRad = angleDeg * (Math.PI / 180);
      const cos = Math.cos(angleRad);
      const sin = Math.sin(angleRad);
      const dx = x - centerX;
      const dy = y - centerY;
      return {
          x: centerX + (dx * cos - dy * sin),
          y: centerY + (dx * sin + dy * cos)
      };
  };

  const displayNodes = graphData.nodes.map(node => {
      const pos = node.type === 'USER' 
        ? { x: centerX, y: centerY } 
        : rotatePoint(node.x || 50, node.y || 50, rotation);
      return { ...node, ...pos };
  });

  const allEdges = [...graphData.edges, ...meshEdges];

  const displayEdges = allEdges.map(edge => {
      const sourceNode = displayNodes.find(n => n.id === edge.source);
      const targetNode = displayNodes.find(n => n.id === edge.target);
      return { ...edge, sourceNode, targetNode };
  }).filter(e => e.sourceNode && e.targetNode);

  return (
    <div 
        className="relative w-full h-full bg-slate-50/50 dark:bg-slate-900/50 rounded-xl overflow-hidden border-none shadow-inner group/map select-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
    >
      {/* HUD Info */}
      <div className="absolute top-6 left-6 z-40 bg-white/90 dark:bg-slate-950/90 p-3 rounded-lg border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-xl pointer-events-none transition-transform group-hover/map:-translate-y-1">
        <h3 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] flex items-center mb-1">
          <Network className="w-3 h-3 mr-2 text-rose-600 dark:text-rose-500 animate-pulse" />
          Neural Surface
        </h3>
        <div className="flex gap-4">
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]"></div>
                <span className="text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300">VECTORS: {graphData.nodes.length - 1}</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]"></div>
                <span className="text-[9px] font-mono font-bold text-slate-600 dark:text-slate-300">LINKS: {displayEdges.length}</span>
            </div>
        </div>
      </div>
      
      {/* Background Digital Grid */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{ 
             backgroundImage: `radial-gradient(${theme === 'dark' ? '#1e293b' : '#e2e8f0'} 1.5px, transparent 1.5px)`, 
             backgroundSize: '40px 40px' 
           }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>

      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          
          <linearGradient id="radialGrad" x1="0%" y1="0%" x2="100%" y2="0%">
             <stop offset="0%" stopColor={theme === 'dark' ? '#f43f5e' : '#e11d48'} stopOpacity="0.8" />
             <stop offset="100%" stopColor={theme === 'dark' ? '#0ea5e9' : '#0284c7'} stopOpacity="0.2" />
          </linearGradient>

          <mask id="edgeMask">
             <rect width="100" height="100" fill="white" />
          </mask>
        </defs>

        {displayEdges.map((edge) => {
            const sx = edge.sourceNode!.x;
            const sy = edge.sourceNode!.y;
            const tx = edge.targetNode!.x;
            const ty = edge.targetNode!.y;
            
            // Create organic curved path
            // Control point for quadratic curve pushes slightly towards center if mesh, or away if radial
            const mx = (sx + tx) / 2;
            const my = (sy + ty) / 2;
            const dx = tx - sx;
            const dy = ty - sy;
            const dist = Math.sqrt(dx*dx + dy*dy);
            
            // Offset for curve
            const curveOffset = edge.type === 'RADIAL' ? 0 : 2; 
            const cx = mx + (dy / dist) * curveOffset;
            const cy = my - (dx / dist) * curveOffset;
            
            const pathData = `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;

            return (
                <g key={edge.id} className="transition-opacity duration-500">
                    {/* The Connection Glow */}
                    <path 
                        d={pathData}
                        fill="none"
                        stroke={edge.type === 'RADIAL' ? (theme === 'dark' ? '#f43f5e' : '#e11d48') : (theme === 'dark' ? '#334155' : '#cbd5e1')}
                        strokeWidth={edge.type === 'RADIAL' ? "0.4" : "0.1"}
                        opacity={edge.type === 'RADIAL' ? "0.3" : "0.15"}
                        filter="url(#glow)"
                        className={edge.animated ? "dash-flow" : ""}
                        strokeDasharray={edge.animated ? "4,2" : ""}
                    />
                    
                    {/* Secondary Path for Mesh highlight */}
                    {edge.type === 'MESH' && (
                        <path 
                            d={pathData}
                            fill="none"
                            stroke={theme === 'dark' ? '#0ea5e9' : '#0284c7'}
                            strokeWidth="0.05"
                            opacity="0.1"
                        />
                    )}
                    
                    {/* Animated Packets */}
                    {edge.animated && (
                        <circle r="0.4" fill={edge.type === 'RADIAL' ? '#f43f5e' : '#0ea5e9'}>
                            <animateMotion 
                                dur={`${4 + (Math.random() * 3)}s`} 
                                repeatCount="indefinite"
                                path={pathData}
                            />
                            <animate attributeName="r" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
                        </circle>
                    )}
                </g>
            );
        })}
      </svg>

      {/* Interactive Nodes Layer */}
      {displayNodes.map((node) => {
          if (node.type === 'USER') {
              return (
                <div 
                    key={node.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                    <div className="relative group/user">
                        {/* Pulse Rings */}
                        <div className="absolute inset-0 rounded-full bg-cyan-500/20 animate-ping opacity-20"></div>
                        <div className="absolute inset-0 rounded-full bg-rose-500/10 animate-ping opacity-10" style={{ animationDelay: '1s' }}></div>
                        
                        <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-950 border-4 border-slate-200 dark:border-slate-800 shadow-[0_0_50px_rgba(244,63,94,0.15)] flex items-center justify-center relative z-10 transition-transform duration-500 group-hover/user:scale-110">
                            {/* Scanning Radar Overlay */}
                            <div className="absolute inset-0 rounded-full overflow-hidden">
                                <div className="absolute top-1/2 left-1/2 w-full h-[2px] bg-rose-500/30 origin-left animate-spin" style={{ animationDuration: '4s' }}></div>
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-pulse"></div>
                            </div>
                            <User className="w-10 h-10 text-slate-800 dark:text-slate-100 relative z-20" />
                            
                            {/* Orbital Indicators */}
                            <div className="absolute -inset-2 border border-slate-300 dark:border-slate-700 rounded-full border-dashed animate-spin-slow opacity-30"></div>
                        </div>
                    </div>
                </div>
              );
          }

          const Icon = getIconForSource(node.iconType);
          
          return (
            <div
                key={node.id}
                onClick={() => onSelect(node)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                style={{ 
                    left: `${node.x}%`, 
                    top: `${node.y}%`,
                }}
            >
                {/* Floating motion wrap */}
                <div className="animate-float" style={{ animationDelay: `${Math.random() * 5}s`, animationDuration: `${3 + Math.random() * 3}s` }}>
                    <div 
                        className={`
                            relative flex items-center justify-center rounded-xl backdrop-blur-xl border shadow-xl transition-all duration-500
                            group-hover:scale-125 group-hover:shadow-[0_0_30px_currentColor] group-hover:-translate-y-2
                            ${node.severity === 'CRITICAL' 
                                ? 'border-rose-500 bg-rose-500/10 text-rose-600 dark:text-rose-500 w-11 h-11' 
                                : node.severity === 'HIGH' 
                                    ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-500 w-10 h-10' 
                                    : 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-500 w-9 h-9'}
                        `}
                        style={{ transform: `rotate(${-rotation}deg)` }}
                    >
                        <Icon className="w-1/2 h-1/2 transition-transform duration-300 group-hover:rotate-12" />
                        
                        {/* Severity Notification Badge */}
                        <div className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-lg flex items-center justify-center ${
                            node.severity === 'CRITICAL' ? 'bg-rose-500' : 
                            node.severity === 'HIGH' ? 'bg-amber-500' : 'bg-cyan-500'
                        }`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                        </div>
                    </div>

                    {/* Pop Label */}
                    <div className={`
                        absolute top-full left-1/2 -translate-x-1/2 mt-5 whitespace-nowrap px-3 py-1.5 rounded-lg
                        bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md
                        opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 pointer-events-none z-50
                        flex flex-col items-center
                    `}
                    style={{ transform: `translateX(-50%) rotate(${-rotation}deg)` }}
                    >
                        <span className={`text-[10px] font-black tracking-tight ${node.severity === 'CRITICAL' ? 'text-rose-600' : 'text-slate-700 dark:text-slate-100'}`}>
                            {node.label}
                        </span>
                        <span className="text-[8px] text-slate-400 uppercase font-mono tracking-tighter">{node.subLabel}</span>
                        <div className="absolute -top-1 w-2 h-2 bg-white dark:bg-slate-950 border-t border-l border-slate-200 dark:border-slate-800 transform rotate-45"></div>
                    </div>
                </div>
            </div>
          );
      })}
    </div>
  );
};
