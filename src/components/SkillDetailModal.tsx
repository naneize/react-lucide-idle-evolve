import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Zap, Shield, Target, Star, X, ArrowUp } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { SkillNode } from '../types/game';

const ICONS: Record<string, any> = {
  str: Sword,
  agi: Zap,
  vit: Shield,
  dex: Target,
  ultimate: Star,
};

const STAT_COLORS: Record<string, string> = {
  str: 'text-red-400 border-red-400/30',
  agi: 'text-green-400 border-green-400/30',
  vit: 'text-blue-400 border-blue-400/30',
  dex: 'text-purple-400 border-purple-400/30',
  special: 'text-yellow-400 border-yellow-400/30',
};

const STAT_NAMES: Record<string, string> = {
  str: 'Strength',
  agi: 'Agility',
  vit: 'Vitality',
  dex: 'Dexterity',
  special: 'Special',
};

interface SkillDetailModalProps {
  node: SkillNode | null;
  onClose: () => void;
}

export const SkillDetailModal = ({ node, onClose }: SkillDetailModalProps) => {
  const unlockSkillNode = useGameStore((state) => state.unlockSkillNode);
  const availableSkillPoints = useGameStore((state) => state.availableSkillPoints);
  const skillNodes = useGameStore((state) => state.skillNodes);

  if (!node) return null;

  const Icon = ICONS[node.type] || Star;
  const isUnlocked = node.isUnlocked;
  const isMaxLevel = node.level >= node.maxLevel;

  // Check if can unlock
  const canUnlock = !isUnlocked &&
    availableSkillPoints > 0 &&
    node.requirements.every((reqId: string) => {
      const reqNode = skillNodes[reqId];
      return reqNode?.isUnlocked;
    });

  const handleUpgrade = () => {
    if (canUnlock) {
      unlockSkillNode(node.id);
      onClose();
    }
  };

  const formatEffectValue = (key: string, value: any): string => {
    if (key === 'special') return String(value);
    return `+${value}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-slate-900 border border-yellow-600/30 rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center border-2 ${
                isUnlocked ? 'border-yellow-400' : 'border-slate-600'
              }`}>
                <Icon size={24} className={isUnlocked ? 'text-yellow-400' : 'text-slate-400'} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-yellow-400">{node.name}</h2>
                <div className="text-sm text-slate-400 capitalize">{node.type}</div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Description */}
          <div className="mb-6">
            <p className="text-slate-300 text-sm leading-relaxed">{node.description}</p>
            <p className="text-slate-400 text-xs mt-2 italic">{node.desc}</p>
          </div>

          {/* Status Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <ArrowUp size={16} />
              Status Effects
            </h3>
            <div className="space-y-2">
              {Object.entries(node.effects).map(([key, value]) => (
                <div
                  key={key}
                  className={`flex justify-between items-center p-2 rounded-lg border ${STAT_COLORS[key] || STAT_COLORS.special} bg-slate-800/50`}
                >
                  <span className="text-sm font-medium">
                    {STAT_NAMES[key] || key}
                  </span>
                  <span className="text-sm font-bold">
                    {formatEffectValue(key, value)}
                  </span>
                </div>
              ))}
              {Object.keys(node.effects).length === 0 && (
                <div className="text-slate-500 text-sm italic">No status effects</div>
              )}
            </div>
          </div>

          {/* Requirements */}
          {node.requirements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">Requirements</h3>
              <div className="space-y-1">
                {node.requirements.map((reqId) => {
                  const reqNode = skillNodes[reqId];
                  const isReqMet = reqNode?.isUnlocked;
                  return (
                    <div
                      key={reqId}
                      className={`text-xs flex items-center gap-2 ${
                        isReqMet ? 'text-green-400' : 'text-slate-500'
                      }`}
                    >
                      <span>{isReqMet ? '✓' : '○'}</span>
                      <span>{reqNode?.name || reqId}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current Status */}
          <div className="mb-6 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Status:</span>
              <span className={`font-semibold ${
                isUnlocked ? 'text-green-400' : canUnlock ? 'text-yellow-400' : 'text-slate-500'
              }`}>
                {isUnlocked ? `Unlocked (Level ${node.level}/${node.maxLevel})` : 
                 canUnlock ? 'Ready to Unlock' : 'Locked'}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-slate-400">Cost:</span>
              <span className="text-yellow-400 font-semibold">1 SP</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span className="text-slate-400">Available SP:</span>
              <span className={`font-semibold ${
                availableSkillPoints > 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {availableSkillPoints}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleUpgrade}
              disabled={!canUnlock || isMaxLevel}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                canUnlock && !isMaxLevel
                  ? 'bg-gradient-to-r from-yellow-600 to-amber-600 text-white hover:from-yellow-500 hover:to-amber-500 shadow-lg hover:shadow-yellow-500/25'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isUnlocked ? (isMaxLevel ? 'Max Level' : 'Upgrade') : 'Unlock'}
              <ArrowUp size={16} />
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-lg bg-slate-700 text-slate-300 font-semibold hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
