import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

export const FloatingNumbers = () => {
  const { floatingNumbers } = useGameStore();

  const getNumberColor = (type: string) => {
    switch (type) {
      case 'damage':
        return 'text-red-400';
      case 'exp':
        return 'text-purple-400';
      case 'gold':
        return 'text-yellow-400';
      case 'heal':
        return 'text-green-400';
      case 'stat':
        return 'text-cyan-400';
      default:
        return 'text-white';
    }
  };

  const getNumberSize = (type: string) => {
    switch (type) {
      case 'damage':
        return 'text-2xl font-bold';
      case 'exp':
      case 'gold':
        return 'text-lg font-semibold';
      case 'heal':
        return 'text-xl font-bold';
      default:
        return 'text-lg';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {floatingNumbers.map((number) => (
          <motion.div
            key={number.id}
            initial={{
              opacity: 1,
              y: 0,
              scale: 0.5,
            }}
            animate={{
              opacity: 0,
              y: -100,
              scale: 1.2,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              ease: 'easeOut',
            }}
            className={`absolute ${getNumberColor(number.type)} ${getNumberSize(number.type)}`}
            style={{
              left: `${number.x}px`,
              top: `${number.y}px`,
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            }}
          >
            {number.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
