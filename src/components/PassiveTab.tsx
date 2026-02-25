import React from 'react';
import { useGameStore } from '../store/useGameStore';
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
    <div className="relative bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 overflow-hidden group hover:border-slate-700 transition-all duration-300">
      {/* Glow Effect */}
      <div
        className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Icon and Name */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="p-2 rounded-xl"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">{name}</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Level</span>
              <span
                className="font-black text-lg"
                style={{ color }}
              >
                {passive.level}
              </span>
              <span className="text-xs text-slate-500">∞</span>
            </div>
            {/* Current Bonus Display */}
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-500">Current Bonus:</span>
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
        <div className="space-y-1">
          <div className="flex justify-between items-end">
            <span className="text-xs text-slate-500">Essence</span>
            <span className="text-xs font-mono text-slate-400">
              {passive.essence}/{passive.requiredEssence}
            </span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${Math.min(100, progress)}%`,
                backgroundColor: color,
                boxShadow: progress >= 100 ? `0 0 10px ${glowColor}` : 'none'
              }}
            />
          </div>
          {progress >= 100 && (
            <div className="text-center">
              <span className="text-xs font-bold text-white animate-pulse">
                ⚡ READY TO LEVEL UP!
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
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">Infinite Passives</h1>
          <p className="text-slate-400 text-sm">Upgrade your abilities infinitely with essence drops</p>
        </div>

        {/* Passive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-xl p-4">
          <h2 className="text-white font-bold mb-2">How it works:</h2>
          <ul className="text-slate-400 text-sm space-y-1">
            <li>• Defeat monsters to collect passive essence</li>
            <li>• Each passive requires essence to level up</li>
            <li>• Level requirement: 10 + (current level × 2)</li>
            <li>• Bonuses: ATK +0.2%, Crit Rate +0.1%, Crit Damage +0.5% per level</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
