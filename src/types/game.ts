import Decimal from 'decimal.js';

export interface CharacterStats {
  str: Decimal;      // Strength - Physical damage
  agi: Decimal;      // Agility - Attack speed & dodge
  vit: Decimal;      // Vitality - HP & defense
  dex: Decimal;      // Dexterity - Critical hit & accuracy
  hp: Decimal;       // Current Health Points
  maxHp: Decimal;    // Maximum Health Points
  stamina: Decimal;  // Current Stamina
  maxStamina: Decimal; // Maximum Stamina
  level: number;     // Character level
  exp: Decimal;      // Current Experience
  expToNext: Decimal; // Experience needed for next level
}

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  desc: string; // Short description for UI
  icon: string;
  type: 'str' | 'agi' | 'vit' | 'dex' | 'ultimate';
  level: number;
  maxLevel: number;
  cost: Decimal;
  requirements: string[];
  position: { x: number; y: number };
  isUnlocked: boolean;
  effects: {
    str?: Decimal;
    agi?: Decimal;
    vit?: Decimal;
    dex?: Decimal;
    special?: string;
  };
}

export interface GameState {
  // Player Stats
  player: CharacterStats;

  // Game State
  isGameRunning: boolean;
  currentTab: 'training' | 'skills' | 'stats';
  lastUpdate: number;

  // Training System
  trainingTimer: number;
  autoTrainingTimer: number;
  trainingProgress: Decimal;
  currentTraining: 'str' | 'agi' | 'vit' | 'dex';

  // Skill Tree
  skillNodes: Record<string, SkillNode>;
  totalSkillPoints: number;
  availableSkillPoints: number;

  // UI State
  floatingNumbers: FloatingNumber[];
  selectedNode: SkillNode | null;
  animations: AnimationState;
}

export interface FloatingNumber {
  id: string;
  value: string;
  type: 'damage' | 'exp' | 'gold' | 'heal' | 'stat';
  x: number;
  y: number;
  timestamp: number;
}

export interface AnimationState {
  buttonPress: Record<string, boolean>;
  screenShake: number;
}

export type GameStore = GameState & {
  // Actions
  startGame: () => void;
  stopGame: () => void;
  train: (stat: 'str' | 'agi' | 'vit' | 'dex', isManual?: boolean) => void;
  setCurrentTraining: (stat: 'str' | 'agi' | 'vit' | 'dex') => void;
  gainExp: (amount: Decimal) => void;
  levelUp: () => void;
  unlockSkillNode: (nodeId: string) => void;
  addFloatingNumber: (value: string, type: FloatingNumber['type'], x: number, y: number) => void;
  switchTab: (tab: GameState['currentTab']) => void;
  updateButtonPress: (buttonId: string, isPressed: boolean) => void;
  setSelectedNode: (node: SkillNode | null) => void;
};
