import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import Decimal from 'decimal.js';
import type { GameStore, FloatingNumber, SkillNode } from '../types/game';
import { getSkillNodes } from '../data/skillData.js';
import { formatNumber } from '../utils/gameCalculators.js';

// Set Decimal.js precision for game calculations
Decimal.set({ precision: 20, rounding: Decimal.ROUND_DOWN });

// Initial player stats
const createInitialPlayer = () => ({
  str: new Decimal(10),
  agi: new Decimal(10),
  vit: new Decimal(10),
  dex: new Decimal(10),
  hp: new Decimal(100),
  maxHp: new Decimal(100),
  stamina: new Decimal(100),
  maxStamina: new Decimal(100),
  level: 1,
  exp: new Decimal(0),
  expToNext: new Decimal(100),
});

export const useGameStore = create<GameStore>()(
  subscribeWithSelector((set, get) => ({
    // Player Stats
    player: createInitialPlayer(),

    // Game State
    isGameRunning: false,
    currentTab: 'training',
    lastUpdate: Date.now(),

    // Skill Tree
    skillNodes: getSkillNodes(),
    totalSkillPoints: 0,
    availableSkillPoints: 0,

    // Training System
    trainingTimer: 0,
    autoTrainingTimer: 0,
    trainingProgress: new Decimal(0),
    currentTraining: 'str',

    // UI State
    floatingNumbers: [],
    selectedNode: null,
    animations: {
      buttonPress: {},
      screenShake: 0,
    },

    // Actions
    startGame: () => {
      set({ isGameRunning: true, lastUpdate: Date.now() });
    },

    stopGame: () => {
      set({ isGameRunning: false });
    },


    // Training Actions
    train: (stat: 'str' | 'agi' | 'vit' | 'dex', isManual = false) => {
      const state = get();
      if (!state.isGameRunning) return;

      const player = state.player;
      const trainingMultiplier = isManual ? 2 : 1;

      // Calculate training gain based on current stat
      const baseGain = new Decimal(1).times(trainingMultiplier);
      const statGain = baseGain.times(Decimal.max(0.1, player[stat].div(100)));

      // Apply stat gain
      set(state => ({
        player: {
          ...state.player,
          [stat]: player[stat].plus(statGain)
        }
      }));

      // Add floating number
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      get().addFloatingNumber(`+${statGain.toFixed(2)} ${stat.toUpperCase()}`, 'stat', centerX, centerY);

      // Gain some experience from training
      const expGain = new Decimal(5).times(trainingMultiplier);
      get().gainExp(expGain);
      get().addFloatingNumber(`+${expGain.toFixed(0)} EXP`, 'exp', centerX, centerY - 30);

      // Trigger button animation
      get().updateButtonPress('train', true);
      setTimeout(() => get().updateButtonPress('train', false), 100);
    },

    setCurrentTraining: (stat: 'str' | 'agi' | 'vit' | 'dex') => {
      set({ currentTraining: stat });
    },

    gainExp: (amount) => {
      const state = get();
      let newExp = state.player.exp.plus(amount);
      let newLevel = state.player.level;
      let newExpToNext = state.player.expToNext;
      let skillPointsGained = 0;

      // Check for level up
      while (newExp.greaterThanOrEqualTo(newExpToNext)) {
        newExp = newExp.minus(newExpToNext);
        newLevel++;
        skillPointsGained++;
        newExpToNext = new Decimal(100).times(new Decimal(1.5).pow(newLevel - 1));
      }

      // Update player stats on level up
      if (skillPointsGained > 0) {
        const hpIncrease = new Decimal(10).times(skillPointsGained);
        const staminaIncrease = new Decimal(5).times(skillPointsGained);

        set(state => ({
          player: {
            ...state.player,
            level: newLevel,
            exp: newExp,
            expToNext: newExpToNext,
            maxHp: state.player.maxHp.plus(hpIncrease),
            hp: state.player.hp.plus(hpIncrease),
            maxStamina: state.player.maxStamina.plus(staminaIncrease),
            stamina: state.player.stamina.plus(staminaIncrease),
          },
          totalSkillPoints: state.totalSkillPoints + skillPointsGained,
          availableSkillPoints: state.availableSkillPoints + skillPointsGained,
        }));
      } else {
        set(state => ({
          player: { ...state.player, exp: newExp }
        }));
      }
    },

    levelUp: () => {
      const state = get();
      get().gainExp(state.player.expToNext);
    },

    unlockSkillNode: (nodeId) => {
      const state = get();
      const node = state.skillNodes[nodeId];

      console.log('🔓 Attempting to unlock node:', nodeId);
      console.log('📊 Available skill points:', state.availableSkillPoints);
      console.log('📋 Node data:', node);

      // 1. Check if node exists
      if (!node) {
        console.log('❌ Node not found');
        return;
      }

      // 2. Check if already unlocked or at max level
      if (node.isUnlocked) {
        console.log('❌ Node already unlocked');
        return;
      }
      if (node.level >= node.maxLevel) {
        console.log('❌ Node at max level');
        return;
      }

      // 3. Check if player has enough skill points
      if (state.availableSkillPoints <= 0) {
        console.log('❌ Not enough skill points');
        return;
      }

      // 4. Check requirements (except for awakening node)
      const canUnlock = node.requirements.every(reqId => {
        const reqNode = state.skillNodes[reqId];
        const isReqUnlocked = reqNode?.isUnlocked;
        console.log(`🔗 Requirement ${reqId}:`, isReqUnlocked ? '✅ Unlocked' : '❌ Locked');
        return isReqUnlocked;
      });

      if (!canUnlock) {
        console.log('❌ Requirements not met');
        return;
      }

      console.log('✅ All conditions met, unlocking node...');

      // 5. Apply unlock
      const updateTimestamp = Date.now();

      set(state => ({
        skillNodes: {
          ...state.skillNodes,
          [nodeId]: {
            ...node,
            level: node.level + 1,
            isUnlocked: true,
            _lastUpdated: updateTimestamp,
          }
        },
        availableSkillPoints: state.availableSkillPoints - 1,
        _lastUpdate: updateTimestamp,
      }));

      // 6. Apply skill effects to player stats
      const effects = node.effects;
      if (effects.str || effects.agi || effects.vit || effects.dex) {
        set(state => ({
          player: {
            ...state.player,
            str: effects.str ? state.player.str.plus(effects.str) : state.player.str,
            agi: effects.agi ? state.player.agi.plus(effects.agi) : state.player.agi,
            vit: effects.vit ? state.player.vit.plus(effects.vit) : state.player.vit,
            dex: effects.dex ? state.player.dex.plus(effects.dex) : state.player.dex,
          }
        }));
      }

      console.log('🎉 Node unlocked successfully!');
      console.log('💰 Remaining skill points:', state.availableSkillPoints - 1);
    },

    addFloatingNumber: (value, type, x, y) => {
      const id = Math.random().toString(36).substr(2, 9);
      const floatingNumber: FloatingNumber = {
        id,
        value,
        type,
        x: x + (Math.random() - 0.5) * 50,
        y,
        timestamp: Date.now(),
      };

      set(state => ({
        floatingNumbers: [...state.floatingNumbers, floatingNumber]
      }));

      // Remove floating number after animation
      setTimeout(() => {
        set(state => ({
          floatingNumbers: state.floatingNumbers.filter(fn => fn.id !== id)
        }));
      }, 2000);
    },

    switchTab: (tab) => {
      set({ currentTab: tab });
    },

    updateButtonPress: (buttonId, isPressed) => {
      set(state => ({
        animations: {
          ...state.animations,
          buttonPress: {
            ...state.animations.buttonPress,
            [buttonId]: isPressed,
          },
        }
      }));
    },

    setSelectedNode: (node: SkillNode | null) => {
      set({ selectedNode: node });
    },
  }))
);


// Auto-training system
setInterval(() => {
  const state = useGameStore.getState();
  if (state.isGameRunning && state.currentTab === 'training') {
    const trainingSpeed = 1 / (1 + state.player.vit.div(30).toNumber()); // VIT affects training recovery
    state.autoTrainingTimer += trainingSpeed;

    if (state.autoTrainingTimer >= 1) {
      state.train(state.currentTraining, false); // Auto train
      useGameStore.setState({ autoTrainingTimer: 0 });
    }
  }
}, 1000);

// Clean up old floating numbers
setInterval(() => {
  const state = useGameStore.getState();
  const now = Date.now();
  const filtered = state.floatingNumbers.filter(fn => now - fn.timestamp < 2000);

  if (filtered.length !== state.floatingNumbers.length) {
    useGameStore.setState({ floatingNumbers: filtered });
  }
}, 500);
