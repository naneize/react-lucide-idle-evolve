import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { formatNumber } from '../utils/format';
import { Zap, Gem, Wind, Crosshair, Sword, Clover } from 'lucide-react';

interface PassiveCardProps {
  type: keyof ReturnType<typeof useGameStore.getState>['passives'];
  icon: React.ReactNode;
  name: string;
  color: string;
  glowColor: string;
}

const PassiveCard: React.FC<PassiveCardProps> = ({ type, icon, name, color, glowColor }) => {
  const { passives } = useGameStore();
  const passive = passives[type];
  const progress = (passive.essence / passive.requiredEssence) * 100;

  // Calculate current bonus based on passive type and level
  const getCurrentBonus = () => {
    const level = passive.level;
    switch (type) {
      case 'attack':
        return `${(level * 0.2).toFixed(1)}%`;
      case 'mana':
        return `${(level * 0.3).toFixed(1)}%`;
      case 'speed':
        return `${(level * 0.15).toFixed(1)}%`;
      case 'critRate':
        return `${(level * 0.1).toFixed(1)}%`;
      case 'critDamage':
        return `${(level * 0.5).toFixed(1)}%`;
      case 'luck':
        return `${(level * 0.05).toFixed(1)}%`;
      default:
        return '0%';
    }
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-md border-2 border-sky-100 rounded-4xl p-4 overflow-hidden group hover:border-sky-200 transition-all duration-300 shadow-lg">
      {/* Glow Effect */}
      <div
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Name */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="p-3 rounded-xl bg-linear-to-br from-sky-50 to-sky-100 border border-sky-200"
            style={{ color }}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-slate-800 font-black text-sm uppercase tracking-wider">{name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Level</span>
              <span
                className="text-lg font-black"
                style={{ color }}
              >
                {passive.level}
              </span>
              <span className="text-[8px] text-slate-400">∞</span>
            </div>
            {/* Current Bonus Display */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">Current Bonus:</span>
              <span
                className="text-sm font-black animate-pulse"
                style={{
                  color: passive.level > 0 ? color : '#64748b',
                  textShadow: passive.level > 0 ? `0 0 8px ${glowColor}` : 'none'
                }}
              >
                {getCurrentBonus()}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Essence Flow</span>
            <span className="text-[8px] font-mono text-slate-500">
              {formatNumber(passive.essence)} / {formatNumber(passive.requiredEssence)}
            </span>
          </div>
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden border border-sky-100">
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${Math.min(100, progress)}%`,
                backgroundColor: color,
                backgroundImage: `linear-gradient(90deg, ${color}88, ${color})`,
                boxShadow: progress >= 100 ? `0 0 10px ${glowColor}` : 'none'
              }}
            />
          </div>
          {progress >= 100 && (
            <div className="text-center mt-2">
              <span className="text-[9px] font-black text-sky-600 uppercase tracking-[0.2em] animate-bounce">
                ⚡ READY TO EVOLVE!
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const PassiveTab: React.FC = () => {
  const passiveConfigs = [
    {
      type: 'attack' as const,
      icon: <Zap size={20} />,
      name: 'Attack',
      color: '#ef4444',
      glowColor: '#ef444480'
    },
    {
      type: 'mana' as const,
      icon: <Gem size={20} />,
      name: 'Mana',
      color: '#3b82f6',
      glowColor: '#3b82f680'
    },
    {
      type: 'speed' as const,
      icon: <Wind size={20} />,
      name: 'Speed',
      color: '#10b981',
      glowColor: '#10b98180'
    },
    {
      type: 'critRate' as const,
      icon: <Crosshair size={20} />,
      name: 'Crit Rate',
      color: '#f59e0b',
      glowColor: '#f59e0b80'
    },
    {
      type: 'critDamage' as const,
      icon: <Sword size={20} />,
      name: 'Crit Damage',
      color: '#8b5cf6',
      glowColor: '#8b5cf680'
    },
    {
      type: 'luck' as const,
      icon: <Clover size={20} />,
      name: 'Luck',
      color: '#22c55e',
      glowColor: '#22c55e80'
    }
  ];

  return (
    <div className="h-full overflow-y-auto no-scrollbar p-4 pb-40 bg-[#E0F2FE]">
      <div className="max-w-105 mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-3xl font-black text-slate-800 mb-2 uppercase tracking-[0.2em]">Infinite Passives</h1>
          <p className="text-slate-600 text-sm">Upgrade your abilities infinitely with essence drops</p>
        </div>

        {/* Passive Grid */}
        <div className="grid grid-cols-1 gap-4">
          {passiveConfigs.map((config) => (
            <PassiveCard
              key={config.type}
              type={config.type}
              icon={config.icon}
              name={config.name}
              color={config.color}
              glowColor={config.glowColor}
            />
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-sky-50/50 backdrop-blur-sm border border-sky-100 rounded-4xl p-6">
          <h2 className="text-slate-800 font-black mb-4 text-lg uppercase tracking-[0.2em]">How it works:</h2>
          <ul className="text-slate-600 text-sm space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-sky-500">•</span>
              <span>Defeat monsters to collect passive essence</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500">•</span>
              <span>Each passive requires essence to level up</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500">•</span>
              <span>Level requirement: 10 + (current level × 2)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-500">•</span>
              <span>Bonuses: ATK +0.2%, Crit Rate +0.1%, Crit Damage +0.5% per level</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
