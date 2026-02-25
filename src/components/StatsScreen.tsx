import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Zap, Shield, Target, Star, TrendingUp, Award, Crown, Sparkles, Flame } from 'lucide-react';
import { useGameStore } from '../store/gameStore.js';
import { formatNumber } from '../utils/gameCalculators.js';

export const StatsScreen = () => {
  const { player, levelUp, currentTraining, availableSkillPoints, totalSkillPoints } = useGameStore();

  const expPercentage = player.exp.div(player.expToNext).times(100).toNumber();
  const canLevelUp = player.exp.greaterThanOrEqualTo(player.expToNext);

  // Calculate Combat Power
  const totalStats = player.str.plus(player.agi).plus(player.vit).plus(player.dex);
  const combatPower = totalStats.times(player.level).times(10); // Formula: totalStats * level * 10

  // Character Title System
  const getCharacterTitle = (level: number) => {
    if (level >= 100) return { title: 'Legendary Knight', icon: Crown, color: 'text-yellow-400' };
    if (level >= 75) return { title: 'Royal Paladin', icon: Crown, color: 'text-purple-400' };
    if (level >= 50) return { title: 'Elite Knight', icon: Crown, color: 'text-blue-400' };
    if (level >= 30) return { title: 'Warrior', icon: Shield, color: 'text-green-400' };
    if (level >= 20) return { title: 'Squire', icon: Shield, color: 'text-yellow-400' };
    if (level >= 10) return { title: 'Adventurer', icon: Star, color: 'text-orange-400' };
    return { title: 'Novice', icon: Star, color: 'text-gray-400' };
  };

  const characterTitle = getCharacterTitle(player.level);
  const TitleIcon = characterTitle.icon;

  // Calculate gains per second for each stat
  const getGainsPerSecond = (statId: 'str' | 'agi' | 'vit' | 'dex') => {
    const baseGain = 1; // 1 gain per second
    const statValue = player[statId].toNumber();
    const actualGain = Math.max(0.1, baseGain * (statValue / 100)); // Scales with stat
    return actualGain;
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    color, 
    subtext, 
    statId,
    gainsPerSecond 
  }: any) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 rounded-xl border border-slate-600/30 backdrop-blur-sm relative overflow-hidden"
    >
      {/* Subtle glow effect for active training */}
      {currentTraining === statId && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-orange-400/5"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      <div className="flex items-center gap-3 mb-2">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-gray-300 text-sm">{label}</span>
      </div>
      
      <div className="text-white font-bold text-lg">{formatNumber(value, 1)}</div>
      
      {/* Gains per second display */}
      {gainsPerSecond && (
        <div className="text-xs mt-1">
          <span className={currentTraining === statId ? 'text-green-400 font-semibold' : 'text-gray-500'}>
            +{gainsPerSecond.toFixed(2)}/s
          </span>
        </div>
      )}
      
      {subtext && <div className="text-gray-400 text-xs mt-1">{subtext}</div>}
    </motion.div>
  );

  return (
    <div className="p-4 space-y-6 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      
      {/* Combat Power Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-slate-800/95 to-purple-800/95 p-6 rounded-xl border-2 border-yellow-600/40 backdrop-blur-md shadow-2xl relative overflow-hidden"
      >
        {/* Animated glow background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-amber-500/10 to-yellow-400/10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        <div className="relative z-10">
          {/* Character Title and Level */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <TitleIcon className={`w-8 h-8 ${characterTitle.color}`} />
                <motion.div
                  className="absolute -inset-1 bg-yellow-400/20 rounded-full blur-sm"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <div>
                <h3 className={`text-xl font-bold font-serif ${characterTitle.color}`}>
                  {characterTitle.title}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-yellow-400">Level {player.level}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-purple-400">{availableSkillPoints} SP</span>
                </div>
              </div>
            </div>
          </div>

          {/* Combat Power Display */}
          <div className="text-center py-4">
            <div className="text-sm text-gray-400 mb-1 uppercase tracking-wider">Combat Power</div>
            <motion.div
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {formatNumber(combatPower, 0)}
            </motion.div>
            <div className="text-xs text-gray-500 mt-1">
              Total Stats × Level × 10
            </div>
          </div>
        </div>
      </motion.div>

      {/* Experience & Level Up Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 p-4 rounded-xl border-2 border-yellow-600/30 backdrop-blur-sm"
      >
        <div className="space-y-4">
          {/* Experience Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-300">
              <span>Experience Progress</span>
              <span>{formatNumber(player.exp, 0)} / {formatNumber(player.expToNext, 0)}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden relative">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 rounded-full relative"
                style={{ width: `${expPercentage}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Animated glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
              
              {/* Percentage indicator */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-white font-semibold drop-shadow-lg">
                  {expPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Smart Level Up Button */}
          <div className="text-center">
            <AnimatePresence>
              {canLevelUp ? (
                <motion.button
                  key="level-up-ready"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ 
                    scale: [1, 1.05, 1], 
                    opacity: 1,
                    boxShadow: ['0 0 0 0 rgba(251, 191, 36, 0.7)', '0 0 20px 5px rgba(251, 191, 36, 0)', '0 0 0 0 rgba(251, 191, 36, 0.7)']
                  }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ 
                    scale: { duration: 1.5, repeat: Infinity },
                    boxShadow: { duration: 1.5, repeat: Infinity }
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={levelUp}
                  className="relative bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900 px-6 py-3 rounded-lg font-bold text-sm shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>LEVEL UP!</span>
                    <Sparkles className="w-4 h-4" />
                  </div>
                  
                  {/* Pulsing glow overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-amber-500/30 rounded-lg"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.button>
              ) : (
                <motion.button
                  key="level-up-disabled"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  disabled
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 px-6 py-3 rounded-lg font-bold text-sm cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    <span>Level {player.level}</span>
                  </div>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Core Stats Grid with Gains */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 p-4 rounded-xl border-2 border-yellow-600/30 backdrop-blur-sm"
      >
        <h4 className="text-yellow-400 font-bold font-serif mb-4 flex items-center gap-2">
          <Sword className="w-4 h-4" />
          Core Attributes
        </h4>

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={Sword}
            label="Strength"
            value={player.str}
            color="text-red-400"
            subtext="Physical Power"
            statId="str"
            gainsPerSecond={getGainsPerSecond('str')}
          />
          <StatCard
            icon={Zap}
            label="Agility"
            value={player.agi}
            color="text-yellow-400"
            subtext="Speed & Evasion"
            statId="agi"
            gainsPerSecond={getGainsPerSecond('agi')}
          />
          <StatCard
            icon={Shield}
            label="Vitality"
            value={player.vit}
            color="text-green-400"
            subtext="Health & Defense"
            statId="vit"
            gainsPerSecond={getGainsPerSecond('vit')}
          />
          <StatCard
            icon={Target}
            label="Dexterity"
            value={player.dex}
            color="text-blue-400"
            subtext="Precision & Critical"
            statId="dex"
            gainsPerSecond={getGainsPerSecond('dex')}
          />
        </div>
      </motion.div>

      {/* Health & Stamina */}
      <motion.div
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 p-4 rounded-xl border-2 border-yellow-600/30 backdrop-blur-sm"
      >
        <h4 className="text-yellow-400 font-bold font-serif mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Vitality
        </h4>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Health Points</span>
              <span>{formatNumber(player.hp, 0)} / {formatNumber(player.maxHp, 0)}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full"
                style={{ width: `${(player.hp.div(player.maxHp).times(100)).toNumber()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-300 mb-1">
              <span>Stamina</span>
              <span>{formatNumber(player.stamina, 0)} / {formatNumber(player.maxStamina, 0)}</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"
                style={{ width: `${(player.stamina.div(player.maxStamina).times(100)).toNumber()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ancient Seals (Achievements) */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-slate-800/80 to-purple-800/80 p-4 rounded-xl border-2 border-yellow-600/30 backdrop-blur-sm"
      >
        <h4 className="text-yellow-400 font-bold font-serif mb-4 flex items-center gap-2">
          <Award className="w-4 h-4" />
          Ancient Seals
        </h4>

        <div className="grid grid-cols-2 gap-4">
          {/* Level Achievement Seal */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative bg-gradient-to-br from-orange-600/20 to-red-600/20 p-4 rounded-xl border-2 border-orange-600/40 backdrop-blur-sm"
          >
            {/* Seal decoration */}
            <div className="absolute inset-0 border-2 border-orange-600/20 rounded-xl">
              <div className="absolute top-1 left-1 w-2 h-2 bg-orange-400 rounded-full opacity-60" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-orange-400 rounded-full opacity-60" />
              <div className="absolute bottom-1 left-1 w-2 h-2 bg-orange-400 rounded-full opacity-60" />
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-orange-400 rounded-full opacity-60" />
            </div>
            
            <div className="relative z-10 text-center">
              <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
              <div className="text-orange-300 font-bold text-lg">{player.level}</div>
              <div className="text-orange-400 text-xs">Level Achieved</div>
            </div>
          </motion.div>

          {/* Skill Points Seal */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative bg-gradient-to-br from-purple-600/20 to-blue-600/20 p-4 rounded-xl border-2 border-purple-600/40 backdrop-blur-sm"
          >
            {/* Seal decoration */}
            <div className="absolute inset-0 border-2 border-purple-600/20 rounded-xl">
              <div className="absolute top-1 left-1 w-2 h-2 bg-purple-400 rounded-full opacity-60" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-purple-400 rounded-full opacity-60" />
              <div className="absolute bottom-1 left-1 w-2 h-2 bg-purple-400 rounded-full opacity-60" />
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-purple-400 rounded-full opacity-60" />
            </div>
            
            <div className="relative z-10 text-center">
              <Star className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <div className="text-purple-300 font-bold text-lg">{totalSkillPoints}</div>
              <div className="text-purple-400 text-xs">Skill Points Earned</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
