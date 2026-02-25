import { motion, AnimatePresence } from 'framer-motion';
import { Sword, Zap, Shield, Target, TrendingUp, Sparkles, Star } from 'lucide-react';
import { useGameStore } from '../store/gameStore.js';
import { formatNumber } from '../utils/gameCalculators.js';

export const TrainingScreen = () => {
  const {
    player,
    currentTraining,
    train,
    setCurrentTraining,
    autoTrainingTimer,
    animations,
    addFloatingNumber
  } = useGameStore();

  const stats = [
    { id: 'str' as const, name: 'Strength', icon: Sword, color: 'red', description: 'Physical Power' },
    { id: 'agi' as const, name: 'Agility', icon: Zap, color: 'yellow', description: 'Speed & Evasion' },
    { id: 'vit' as const, name: 'Vitality', icon: Shield, color: 'green', description: 'Health & Defense' },
    { id: 'dex' as const, name: 'Dexterity', icon: Target, color: 'blue', description: 'Precision & Critical' },
  ];

  // Calculate EXP progress
  const expProgress = player.exp.div(player.expToNext).times(100).toNumber();
  const getProgressPercentage = () => Math.min(100, autoTrainingTimer * 100);

  // Calculate gains per second for each stat
  const getGainsPerSecond = (statId: 'str' | 'agi' | 'vit' | 'dex') => {
    const baseGain = 1; // 1 gain per second
    const statValue = player[statId].toNumber();
    const actualGain = Math.max(0.1, baseGain * (statValue / 100)); // Scales with stat
    return actualGain;
  };

  // Calculate current training gains per second
  const currentGainsPerSecond = getGainsPerSecond(currentTraining);
  const currentExpPerSecond = 5; // 5 EXP per second

  // Handle manual training with visual feedback
  const handleManualTrain = (event: React.MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.top + buttonRect.height / 2;

    // Add floating numbers at button position
    const statGain = getGainsPerSecond(currentTraining) * 2; // 2x for manual
    const expGain = currentExpPerSecond * 2;

    addFloatingNumber(`+${statGain.toFixed(1)} ${currentTraining.toUpperCase()}`, 'stat', centerX, centerY - 20);
    addFloatingNumber(`+${expGain} EXP`, 'exp', centerX, centerY - 40);

    // Trigger training
    train(currentTraining, true);

    // Trigger button animation
    useGameStore.getState().updateButtonPress('train', true);
    setTimeout(() => useGameStore.getState().updateButtonPress('train', false), 100);
  };

  // Handle stat card click
  const handleStatCardClick = (statId: 'str' | 'agi' | 'vit' | 'dex', event: React.MouseEvent<HTMLButtonElement>) => {
    setCurrentTraining(statId);

    // Add small floating feedback
    const cardRect = event.currentTarget.getBoundingClientRect();
    const centerX = cardRect.left + cardRect.width / 2;
    const centerY = cardRect.top + cardRect.height / 2;

    addFloatingNumber('SELECTED', 'stat', centerX, centerY - 10);
  };

  return (
    <div className="p-4 space-y-6 min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">

      {/* Global EXP Bar - Top of Screen */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-10 bg-gradient-to-r from-slate-800/95 to-purple-800/95 p-4 rounded-xl border-2 border-yellow-600/40 backdrop-blur-md shadow-2xl"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-400 font-bold font-serif">Level {player.level}</span>
          </div>
          <div className="text-right">
            <div className="text-yellow-400 font-bold">
              {formatNumber(player.exp, 0)} / {formatNumber(player.expToNext, 0)} EXP
            </div>
            <div className="text-xs text-gray-400">
              {expProgress.toFixed(1)}% to next level
            </div>
          </div>
        </div>

        {/* Main EXP Bar */}
        <div className="relative">
          <div className="w-full bg-slate-700 rounded-full h-4 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-full relative overflow-hidden"
              style={{ width: `${expProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>

          {/* EXP gain indicators - moved inside the bar */}
          <div className="absolute inset-0 flex items-center justify-between px-3">
            <span className="text-white text-xs font-semibold drop-shadow-lg">
              +{currentExpPerSecond}/s
            </span>
            <AnimatePresence>
              {currentTraining && (
                <motion.span
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-white text-xs font-semibold drop-shadow-lg"
                >
                  {currentTraining.toUpperCase()}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>



      {/* Auto Training Progress - Enhanced */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-slate-700/80 to-purple-700/80 p-4 rounded-xl border border-yellow-600/20 backdrop-blur-sm relative overflow-hidden"
      >
        {/* Flash effect when progress completes */}
        <AnimatePresence>
          {getProgressPercentage() >= 100 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-yellow-400/20 pointer-events-none"
            />
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mb-2">
          <span className="text-yellow-400 font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            Auto Training
          </span>
          <span className="text-xs text-green-400">
            +{currentGainsPerSecond.toFixed(2)}/s
          </span>
        </div>

        <div className="w-full bg-slate-600 rounded-full h-3 mb-2 relative overflow-hidden">
          <motion.div
            className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 h-3 rounded-full relative"
            style={{ width: `${getProgressPercentage()}%` }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.3 }}
          >
            {/* Pulse effect for active training */}
            <motion.div
              className="absolute inset-0 bg-white/20"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </div>

        <div className="text-xs text-gray-400 flex justify-between">
          <span>Currently training: <span className="text-yellow-400">{currentTraining.toUpperCase()}</span></span>
          <span>{getProgressPercentage().toFixed(0)}%</span>
        </div>
      </motion.div>

      {/* Stats Training Cards with Gains Display */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isActive = currentTraining === stat.id;
          const statValue = player[stat.id].toNumber();
          const gainsPerSecond = getGainsPerSecond(stat.id);

          return (
            <motion.button
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => handleStatCardClick(stat.id, e)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 relative overflow-hidden ${isActive
                ? 'border-yellow-400 bg-gradient-to-br from-yellow-600/20 to-orange-600/20 shadow-lg shadow-yellow-400/20'
                : 'border-slate-600 bg-gradient-to-br from-slate-700/50 to-slate-800/50 hover:border-slate-500'
                }`}
            >
              {/* Shake animation for active training */}
              <AnimatePresence>
                {isActive && animations.buttonPress['train'] && (
                  <motion.div
                    initial={{ x: 0 }}
                    animate={{ x: [-2, 2, -2, 2, 0] }}
                    exit={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-yellow-400/10 pointer-events-none"
                  />
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-6 h-6 text-${stat.color}-400`} />
                <motion.div
                  animate={{
                    scale: animations.buttonPress[stat.id] ? 0.8 : 1,
                  }}
                  transition={{ duration: 0.1 }}
                >
                  <span className={`text-xs font-bold text-${stat.color}-400`}>
                    {stat.name}
                  </span>
                </motion.div>
              </div>

              <div className="text-left">
                <div className={`text-lg font-bold text-${stat.color}-400`}>
                  {formatNumber(statValue, 1)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {stat.description}
                </div>

                {/* Gains per second display */}
                <div className="mt-2 text-xs">
                  {isActive ? (
                    <span className="text-green-400 font-semibold">
                      +{gainsPerSecond.toFixed(2)}/s
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      +{gainsPerSecond.toFixed(2)}/s
                    </span>
                  )}
                </div>
              </div>

              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-2 right-2"
                >
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Manual Training Button - Enhanced */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleManualTrain}
        className={`w-full p-4 rounded-xl font-bold shadow-lg transition-all duration-200 relative overflow-hidden ${player.stamina.greaterThanOrEqualTo(10)
          ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 hover:shadow-yellow-500/25'
          : 'bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed'
          }`}
        disabled={player.stamina.lessThan(10)}
      >
        {/* Glow effect when enabled */}
        {player.stamina.greaterThanOrEqualTo(10) && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div className="relative flex items-center justify-center space-x-2">
          <TrendingUp className="w-5 h-5" />
          <span>Train {currentTraining.toUpperCase()} (2x)</span>
          <span className="text-xs opacity-75">
            Cost: 10 Stamina
          </span>
        </div>
      </motion.button>

      {/* Training Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-r from-slate-800/60 to-purple-800/60 p-3 rounded-lg border border-slate-600/30"
      >
        <div className="text-xs text-gray-400 space-y-1">
          <div>• Manual training gives 2x gains</div>
          <div>• Auto-trains continuously when active</div>
          <div>• Higher stats = slower but better gains</div>
          <div>• VIT improves auto-training speed</div>
        </div>
      </motion.div>
    </div>
  );
};
