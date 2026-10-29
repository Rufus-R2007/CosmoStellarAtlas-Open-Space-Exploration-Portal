import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Network,
  List,
  Eye,
  ArrowRight,
  Globe,
  Rocket,
  Compass,
  CircleDot,
  RotateCcw,
} from 'lucide-react';
import { DiscoveryNode } from '../../../types';
import { discoveryGraphService } from '../services';

export const CosmicDiscoveryGraphSection: React.FC = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'canvas' | 'list'>('canvas');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-planet-mars');
  const [focusNeighborhood, setFocusNeighborhood] = useState<boolean>(false);

  const fullGraph = discoveryGraphService.getCompleteGraph();
  const activeGraph = focusNeighborhood && selectedNodeId
    ? discoveryGraphService.getNeighborhoodGraph(selectedNodeId, 1)
    : fullGraph;

  const selectedNode = fullGraph.nodes.find((n) => n.id === selectedNodeId) || fullGraph.nodes[0];

  // Connected edges for selected node
  const connectedEdges = fullGraph.edges.filter(
    (e) => e.sourceNodeId === selectedNode.id || e.targetNodeId === selectedNode.id
  );

  const getNodeColor = (type: DiscoveryNode['entityType']) => {
    switch (type) {
      case 'planet':
        return { stroke: '#06b6d4', fill: '#083344', text: '#22d3ee' }; // Cyan
      case 'mission':
        return { stroke: '#f59e0b', fill: '#451a03', text: '#fbbf24' }; // Gold
      case 'rover':
        return { stroke: '#10b981', fill: '#064e3b', text: '#34d399' }; // Emerald
      case 'asteroid':
        return { stroke: '#a855f7', fill: '#3b0764', text: '#c084fc' }; // Purple
      default:
        return { stroke: '#64748b', fill: '#0f172a', text: '#94a3b8' };
    }
  };

  const getNodeIcon = (type: DiscoveryNode['entityType']) => {
    switch (type) {
      case 'planet':
        return Globe;
      case 'mission':
        return Rocket;
      case 'rover':
        return Compass;
      case 'asteroid':
        return CircleDot;
      default:
        return Network;
    }
  };

  return (
    <div id="graph" className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Network className="h-4 w-4" />
            <span>Cross-Module Knowledge Topology</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight font-display">
            Cosmic Discovery Graph
          </h2>
        </div>

        {/* View Mode & Neighborhood Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-1.5 text-xs text-slate-300 cursor-pointer hover:border-slate-700">
            <input
              type="checkbox"
              checked={focusNeighborhood}
              onChange={(e) => setFocusNeighborhood(e.target.checked)}
              className="rounded accent-emerald-500"
            />
            <span>Focus 1-Hop Neighborhood</span>
          </label>

          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-950/60 p-1">
            <button
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'canvas'
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Interactive Graph</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Accessible List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Canvas or List + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graph Display Area (2 cols on desktop) */}
        <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-slate-950/80 p-2 overflow-hidden flex flex-col justify-between min-h-[500px]">
          {viewMode === 'canvas' ? (
            <div className="relative w-full h-[520px] overflow-auto">
              <svg
                viewBox="100 40 850 600"
                className="w-full h-full select-none"
                style={{ minWidth: '700px' }}
              >
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="6"
                    markerHeight="6"
                    refX="18"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 6 3, 0 6" fill="#475569" />
                  </marker>
                  <marker
                    id="arrowhead-active"
                    markerWidth="6"
                    markerHeight="6"
                    refX="18"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 6 3, 0 6" fill="#10b981" />
                  </marker>
                </defs>

                {/* Edges */}
                {activeGraph.edges.map((edge) => {
                  const source = fullGraph.nodes.find((n) => n.id === edge.sourceNodeId);
                  const target = fullGraph.nodes.find((n) => n.id === edge.targetNodeId);
                  if (!source || !target || source.x === undefined || source.y === undefined || target.x === undefined || target.y === undefined) {
                    return null;
                  }

                  const isConnectedToSelected =
                    edge.sourceNodeId === selectedNode.id || edge.targetNodeId === selectedNode.id;

                  return (
                    <g key={edge.id} className="transition-opacity">
                      <line
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke={isConnectedToSelected ? '#10b981' : '#334155'}
                        strokeWidth={isConnectedToSelected ? 2.5 : 1.2}
                        strokeDasharray={edge.relationshipType === 'orbital_flyby' ? '4 2' : undefined}
                        markerEnd={isConnectedToSelected ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                      />
                      {/* Midpoint Label on active edge */}
                      {isConnectedToSelected && (
                        <text
                          x={(source.x + target.x) / 2}
                          y={(source.y + target.y) / 2 - 6}
                          fill="#a7f3d0"
                          fontSize="9"
                          fontFamily="sans-serif"
                          textAnchor="middle"
                          className="font-mono bg-slate-900"
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {activeGraph.nodes.map((node) => {
                  const isSelected = node.id === selectedNode.id;
                  const colors = getNodeColor(node.entityType);
                  const isConnected = fullGraph.edges.some(
                    (e) =>
                      (e.sourceNodeId === selectedNode.id && e.targetNodeId === node.id) ||
                      (e.targetNodeId === selectedNode.id && e.sourceNodeId === node.id)
                  );

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer transition-transform duration-200"
                      transform={`translate(${node.x || 0}, ${node.y || 0})`}
                    >
                      {/* Outer Pulse ring on active selection */}
                      {isSelected && (
                        <circle
                          r="28"
                          fill="none"
                          stroke={colors.stroke}
                          strokeWidth="2"
                          strokeDasharray="4 2"
                          className="animate-spin"
                          style={{ animationDuration: '8s' }}
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        r={isSelected ? 20 : 16}
                        fill={colors.fill}
                        stroke={isSelected ? '#ffffff' : colors.stroke}
                        strokeWidth={isSelected ? 3 : 1.5}
                        className="hover:scale-110 transition-transform"
                      />

                      {/* Node Label Text */}
                      <text
                        y={isSelected ? 32 : 28}
                        textAnchor="middle"
                        fill={isSelected ? '#ffffff' : isConnected ? colors.text : '#cbd5e1'}
                        fontSize={isSelected ? '11' : '10'}
                        fontWeight={isSelected ? 'bold' : 'normal'}
                        className="font-sans pointer-events-none drop-shadow"
                      >
                        {node.label}
                      </text>

                      {/* Connection count badge */}
                      <circle
                        cx="12"
                        cy="-12"
                        r="6"
                        fill="#1e293b"
                        stroke={colors.stroke}
                        strokeWidth="1"
                      />
                      <text
                        x="12"
                        y="-10"
                        textAnchor="middle"
                        fontSize="7"
                        fill="#ffffff"
                        fontWeight="bold"
                        className="pointer-events-none font-mono"
                      >
                        {node.connectionCount || 1}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          ) : (
            /* Accessible Nested List View */
            <div className="p-4 space-y-4 max-h-[520px] overflow-y-auto">
              <p className="text-xs text-slate-400">
                Accessible list representation of the Cosmo Discovery Graph. Select any entity to inspect its relational graph neighbors.
              </p>
              <div className="space-y-2">
                {fullGraph.nodes.map((n) => {
                  const isSelected = n.id === selectedNode.id;
                  const Icon = getNodeIcon(n.entityType);
                  return (
                    <div
                      key={n.id}
                      onClick={() => setSelectedNodeId(n.id)}
                      className={`cursor-pointer rounded-xl border p-3 transition-colors ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-950/20 text-white'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 text-emerald-400" />
                          <span className="font-bold text-sm">{n.label}</span>
                          <span className="text-xs text-slate-400 font-mono">({n.subtitle})</span>
                        </div>
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                          {n.badge}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3 px-3 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" /> Planets
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Missions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Rovers
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-purple-400" /> Asteroids
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              Showing {activeGraph.nodes.length} Nodes • {activeGraph.edges.length} Edges
            </span>
          </div>
        </div>

        {/* Selected Node Inspector Panel */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/90 p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                {selectedNode.group.replace('_', ' ')}
              </span>
              <span className="text-xs font-mono text-slate-400">{selectedNode.badge}</span>
            </div>

            <h3 className="text-xl font-bold text-white mb-1 font-display">
              {selectedNode.label}
            </h3>
            <div className="text-xs text-slate-400 font-mono mb-4">{selectedNode.subtitle}</div>

            <div className="border-t border-slate-800/80 pt-3 mb-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Relational Connections ({connectedEdges.length})
              </h4>
              <div className="space-y-2">
                {connectedEdges.map((edge) => {
                  const isSource = edge.sourceNodeId === selectedNode.id;
                  const partnerNodeId = isSource ? edge.targetNodeId : edge.sourceNodeId;
                  const partner = fullGraph.nodes.find((n) => n.id === partnerNodeId);

                  return (
                    <div
                      key={edge.id}
                      onClick={() => partner && setSelectedNodeId(partner.id)}
                      className="cursor-pointer rounded-lg border border-slate-800/80 bg-slate-900/60 p-2.5 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-white mb-0.5">
                        <span>{partner?.label || partnerNodeId}</span>
                        <span className="text-[10px] font-mono text-emerald-400">{edge.label}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 leading-snug">
                        {edge.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-2">
            <button
              onClick={() => navigate(selectedNode.route)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all w-full"
            >
              <span>Explore in Dedicated Module</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setSelectedNodeId('node-planet-mars')}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-800 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset to Central Node (Mars)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

