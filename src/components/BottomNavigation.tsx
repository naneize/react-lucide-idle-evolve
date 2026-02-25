import { motion } from 'framer-motion';
import { Sword, BookOpen, BarChart3, Heart } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export const BottomNavigation = () => {
  const { currentTab, switchTab } = useGameStore();

  const tabs = [
    { id: 'training' as const, label: 'Training', icon: Sword },
    { id: 'skills' as const, label: 'Skills', icon: BookOpen },
    { id: 'stats' as const, label: 'Stats', icon: BarChart3 },
  ];

  return (
    <div className="bg-gradient-to-t from-slate-900 to-slate-800 border-t-2 border-yellow-600/30 backdrop-blur-lg">
      <div className="flex justify-around items-center py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => switchTab(tab.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${isActive
                  ? 'text-yellow-400 bg-yellow-600/20'
                  : 'text-gray-400 hover:text-gray-300'
                }`}
            >
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-6 h-6" />
              </motion.div>
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
