import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { Sword, Zap, Shield, Target, Star } from 'lucide-react';
import { useGameStore } from '../store/gameStore.js';

const ICONS: Record<string, any> = {
  str: Sword,
  agi: Zap,
  vit: Shield,
  dex: Target,
  ultimate: Star,
};

export const DiamondNode = ({ data }: any) => {
  const { nodeData } = data;
  const setSelectedNode = useGameStore((state) => state.setSelectedNode);
  const availableSkillPoints = useGameStore((state) => state.availableSkillPoints);
  const skillNodes = useGameStore((state) => state.skillNodes);

  const Icon = ICONS[nodeData.type] || Star;

  // ตรวจสอบเงื่อนไขว่าปลดล็อกได้หรือไม่
  const isUnlocked = nodeData.isUnlocked;

  // คำนวณว่าสามารถปลดล็อกได้หรือไม่
  const canUnlock = !isUnlocked &&
    availableSkillPoints > 0 &&
    nodeData.requirements.every((reqId: string) => {
      const reqNode = skillNodes[reqId];
      return reqNode?.isUnlocked;
    });

  const handleClick = () => {
    console.log('🖱️ DiamondNode clicked:', nodeData.id);
    console.log('🔍 Can unlock:', canUnlock);
    console.log('💰 Available points:', availableSkillPoints);

    // Always open modal when clicked
    setSelectedNode(nodeData);
  };

  return (
    <div className="relative">
      {/* Handles สำหรับเส้นโยง */}
      <Handle type="target" position={Position.Top} className="w-0 h-0 border-none opacity-0" />

      {/* Main Diamond Node */}
      <motion.div
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className={`w-14 h-14 rotate-45 border-2 flex items-center justify-center transition-all duration-500
          ${isUnlocked
            ? 'bg-gradient-to-br from-yellow-600 to-amber-900 border-yellow-400 shadow-[0_0_15px_rgba(251,191,36,0.6)]'
            : canUnlock
              ? 'bg-slate-700 border-green-400 cursor-pointer animate-pulse'
              : 'bg-slate-900 border-slate-700 opacity-60 grayscale cursor-not-allowed'
          }`}
      >
        <div className="-rotate-45 text-white">
          <Icon size={20} className={isUnlocked ? 'text-yellow-200' : 'text-slate-400'} />
        </div>
      </motion.div>


      {/* Simple Label */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-32 text-center pointer-events-none">
        <p className={`text-[10px] font-bold uppercase tracking-tighter ${isUnlocked ? 'text-yellow-400' : 'text-slate-500'}`}>
          {nodeData.name}
        </p>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-0 h-0 border-none opacity-0" />
    </div>
  );
};
