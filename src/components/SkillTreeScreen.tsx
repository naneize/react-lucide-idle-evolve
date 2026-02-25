import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type Node,
  type Edge,
  ConnectionMode,
  Panel,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DiamondNode } from './DiamondNode';
import { SkillDetailModal } from './SkillDetailModal';
import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';

const nodeTypes = { diamond: DiamondNode };

export const SkillTreeScreen = () => {
  const { skillNodes, availableSkillPoints, totalSkillPoints, selectedNode, setSelectedNode } = useGameStore();

  const nodes = useMemo(() => {
    return Object.values(skillNodes).map((node): Node => ({
      id: node.id,
      type: 'diamond',
      position: node.position,
      data: { nodeData: node },
    }));
  }, [skillNodes]);

  const flowEdges = useMemo(() => {
    const edgeList: Edge[] = [];
    Object.values(skillNodes).forEach((node) => {
      node.requirements.forEach((reqId) => {
        const targetUnlocked = node.isUnlocked;
        edgeList.push({
          id: `${reqId}-${node.id}`,
          source: reqId,
          target: node.id,
          type: 'default', // Changed from 'smoothstep' to 'default' for Bezier curves
          animated: targetUnlocked,
          style: {
            stroke: targetUnlocked ? '#fbbf24' : '#334155',
            strokeWidth: targetUnlocked ? 3 : 1.5,
            filter: targetUnlocked ? 'drop-shadow(0 0 5px #fbbf24)' : 'none',
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: targetUnlocked ? '#fbbf24' : '#334155',
          },
        });
      });
    });
    return edgeList;
  }, [skillNodes]);

  const closeModal = () => {
    setSelectedNode(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-screen md:h-[700px] relative bg-slate-950 flex flex-col"
    >
      {/* UI Overlay: Header */}
      <div className="z-10 bg-slate-900/80 backdrop-blur-md p-4 border-b border-yellow-600/30">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div>
            <h3 className="text-yellow-500 font-serif font-bold text-lg">Evolution Tree</h3>
            <p className="text-xs text-slate-400">ขยายสเตตัสเพื่อปลดล็อกขีดจำกัด</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-yellow-400">{availableSkillPoints} SP</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Available Points</div>
          </div>
        </div>
      </div>

      {/* React Flow Area */}
      <div className="flex-grow relative">
        <ReactFlow
          nodes={nodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          panOnDrag={true}
          panOnScroll={true}
          selectionOnDrag={false}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          zoomOnPinch={true}
          preventScrolling={true}
          className="bg-slate-950"
        >
          <Background color="#1e293b" gap={25} size={1} />

          <Controls
            showZoom={false}
            className="!bg-slate-800 !border-yellow-600/30 !fill-yellow-500"
          />

          <Panel position="bottom-left" className="m-4">
            <div className="bg-slate-900/90 border border-yellow-600/20 p-3 rounded-lg text-[10px] text-slate-400 space-y-2">
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-yellow-500 rounded-full shadow-[0_0_5px_#eab308]" /> Unlocked</div>
              <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full" /> Ready to Evolve</div>
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* Skill Detail Modal */}
      <SkillDetailModal node={selectedNode} onClose={closeModal} />
    </motion.div>
  );
};