import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { TrainingScreen } from './components/TrainingScreen.tsx';
import { SkillTreeScreen } from './components/SkillTreeScreen.tsx';
import { StatsScreen } from './components/StatsScreen.tsx';
import { BottomNavigation } from './components/BottomNavigation.tsx';
import { FloatingNumbers } from './components/FloatingNumbers.tsx';
import './App.css';

function App() {
  const { currentTab, isGameRunning, animations, startGame, switchTab } = useGameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Medieval parchment background effect */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjMUExQTFBIi8+CjxwYXRoIGQ9Ik0wIDMwSDYwTTMwIDBWNjAiIHN0cm9rZT0iIzJBMkEyQSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPC9zdmc+')] opacity-20"></div>

      {/* Gold border effect */}
      <div className="absolute inset-2 border-4 border-yellow-600/30 rounded-lg shadow-[inset_0_0_20px_rgba(251,191,36,0.1)] pointer-events-none"></div>

      {/* Screen shake effect */}
      <motion.div
        className="relative min-h-screen"
        animate={{
          x: animations.screenShake ? [0, -2, 2, -2, 2, 0] : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
      >
        {/* Main content area */}
        <main className="relative z-10 pb-20 md:pb-0 md:flex md:justify-center md:items-center md:min-h-screen">
          <div className="w-full max-w-md md:border-4 md:border-yellow-600/50 md:rounded-xl md:shadow-2xl md:bg-gradient-to-br md:from-slate-800/90 md:to-purple-800/90 md:p-4">

            {/* PC Navigation */}
            <div className="hidden md:block mb-4">
              <div className="bg-gradient-to-r from-slate-700/80 to-purple-700/80 p-2 rounded-lg border border-yellow-600/30">
                <div className="flex justify-around">
                  {[
                    { id: 'training' as const, label: 'Training', icon: '💪' },
                    { id: 'skills' as const, label: 'Skills', icon: '⚡' },
                    { id: 'stats' as const, label: 'Stats', icon: '📊' },
                  ].map((tab) => (
                    <motion.button
                      key={tab.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => switchTab(tab.id)}
                      className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 ${currentTab === tab.id
                        ? 'text-yellow-400 bg-yellow-600/20'
                        : 'text-gray-400 hover:text-gray-300'
                        }`}
                    >
                      <span className="text-xl mb-1">{tab.icon}</span>
                      <span className="text-xs font-medium">{tab.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab content */}
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[calc(100vh-5rem)] md:min-h-[600px]"
            >
              {currentTab === 'training' && <TrainingScreen />}
              {currentTab === 'skills' && <SkillTreeScreen />}
              {currentTab === 'stats' && <StatsScreen />}
            </motion.div>
          </div>
        </main>

        {/* Bottom Navigation (Mobile only) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-20">
          <BottomNavigation />
        </div>

        {/* Floating damage numbers */}
        <FloatingNumbers />

        {/* Game status overlay */}
        {!isGameRunning && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-gradient-to-br from-slate-800 to-purple-800 p-8 rounded-2xl border-4 border-yellow-600/50 text-center max-w-sm mx-4"
            >
              <h2 className="text-3xl font-bold text-yellow-400 mb-4 font-serif">Medieval Quest</h2>
              <p className="text-gray-300 mb-6">Begin your epic journey through the realm of endless battles!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-8 py-3 rounded-lg font-bold shadow-lg hover:shadow-yellow-500/25 transition-all duration-200"
              >
                Start Adventure
              </motion.button>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default App;