import Decimal from 'decimal.js';
import type { SkillNode } from '../types/game.js';

// Grid Layout Configuration
const GRID_X = {
  STR: 0,
  AGI: 200,
  VIT: 400,
  DEX: 600,
} as const;

const GRID_Y = {
  TIER_1: 0,
  TIER_2: 150,
  TIER_3: 300,
} as const;

// Helper function to create skill node
const createSkillNode = (
  id: string,
  name: string,
  desc: string,
  type: 'str' | 'agi' | 'vit' | 'dex' | 'ultimate',
  x: number,
  y: number,
  requirements: string[] = [],
  effects: Record<string, number> = {},
  isUnlocked: boolean = false
): SkillNode => ({
  id,
  name,
  description: desc,
  desc,
  icon: type === 'str' ? '⚔️' : type === 'agi' ? '⚡' : type === 'vit' ? '🛡️' : type === 'dex' ? '🎯' : '⭐',
  type,
  level: 0,
  maxLevel: type === 'ultimate' ? 1 : 5,
  cost: new Decimal(1),
  requirements,
  position: { x, y },
  isUnlocked,
  effects: Object.keys(effects).reduce((acc, key) => {
    if (key === 'special') {
      (acc as any).special = String(effects[key]);
    } else {
      (acc as any)[key] = new Decimal(effects[key]);
    }
    return acc;
  }, {} as { str?: Decimal; agi?: Decimal; vit?: Decimal; dex?: Decimal; special?: string; }),
});

// Skill Tree Data Structure
export const skillData: Record<string, SkillNode> = {
  // Center Node - Starting Point
  'awakening': createSkillNode(
    'awakening',
    'Awakening',
    'The beginning of your journey',
    'ultimate',
    300,
    -150,
    [],
    {},
    true
  ),

  // STR Column (x: 0)
  'str-basic': createSkillNode(
    'str-basic',
    'Basic Strength',
    'Fundamental physical power',
    'str',
    GRID_X.STR,
    GRID_Y.TIER_1,
    ['awakening'],
    { str: 5 }
  ),
  'str-advanced': createSkillNode(
    'str-advanced',
    'Advanced Might',
    'Enhanced muscular strength',
    'str',
    GRID_X.STR,
    GRID_Y.TIER_2,
    ['str-basic'],
    { str: 10 }
  ),
  'str-master': createSkillNode(
    'str-master',
    'Master Force',
    'Ultimate physical dominance',
    'str',
    GRID_X.STR,
    GRID_Y.TIER_3,
    ['str-advanced'],
    { str: 25 }
  ),

  // AGI Column (x: 200)
  'agi-basic': createSkillNode(
    'agi-basic',
    'Basic Agility',
    'Fundamental speed and reflex',
    'agi',
    GRID_X.AGI,
    GRID_Y.TIER_1,
    ['awakening'],
    { agi: 5 }
  ),
  'agi-advanced': createSkillNode(
    'agi-advanced',
    'Advanced Swiftness',
    'Enhanced movement speed',
    'agi',
    GRID_X.AGI,
    GRID_Y.TIER_2,
    ['agi-basic'],
    { agi: 10 }
  ),
  'agi-master': createSkillNode(
    'agi-master',
    'Master Velocity',
    'Ultimate speed mastery',
    'agi',
    GRID_X.AGI,
    GRID_Y.TIER_3,
    ['agi-advanced'],
    { agi: 25 }
  ),

  // VIT Column (x: 400)
  'vit-basic': createSkillNode(
    'vit-basic',
    'Basic Vitality',
    'Fundamental health and defense',
    'vit',
    GRID_X.VIT,
    GRID_Y.TIER_1,
    ['awakening'],
    { vit: 5 }
  ),
  'vit-advanced': createSkillNode(
    'vit-advanced',
    'Advanced Endurance',
    'Enhanced defensive capabilities',
    'vit',
    GRID_X.VIT,
    GRID_Y.TIER_2,
    ['vit-basic'],
    { vit: 10 }
  ),
  'vit-master': createSkillNode(
    'vit-master',
    'Master Resilience',
    'Ultimate defensive mastery',
    'vit',
    GRID_X.VIT,
    GRID_Y.TIER_3,
    ['vit-advanced'],
    { vit: 25 }
  ),

  // DEX Column (x: 600)
  'dex-basic': createSkillNode(
    'dex-basic',
    'Basic Dexterity',
    'Fundamental precision and accuracy',
    'dex',
    GRID_X.DEX,
    GRID_Y.TIER_1,
    ['awakening'],
    { dex: 5 }
  ),
  'dex-advanced': createSkillNode(
    'dex-advanced',
    'Advanced Precision',
    'Enhanced accuracy and critical chance',
    'dex',
    GRID_X.DEX,
    GRID_Y.TIER_2,
    ['dex-basic'],
    { dex: 10 }
  ),
  'dex-master': createSkillNode(
    'dex-master',
    'Master Accuracy',
    'Ultimate precision mastery',
    'dex',
    GRID_X.DEX,
    GRID_Y.TIER_3,
    ['dex-advanced'],
    { dex: 25 }
  ),
};

// Helper functions for skill data
export const getSkillNodes = () => {
  return skillData;
};

export const getSkillNode = (id: string): SkillNode | undefined => {
  return skillData[id];
};

export const getSkillNodesByType = (type: string): SkillNode[] => {
  return Object.values(skillData).filter(node => node.type === type);
};

export const getUnlockedNodes = (): SkillNode[] => {
  return Object.values(skillData).filter(node => node.isUnlocked);
};

export const getAvailableNodes = (currentNodes: Record<string, SkillNode>): SkillNode[] => {
  return Object.values(skillData).filter(node => {
    if (node.isUnlocked) return false;

    // Check if all requirements are met
    return node.requirements.every(reqId => {
      const reqNode = currentNodes[reqId];
      return reqNode?.isUnlocked;
    });
  });
};
