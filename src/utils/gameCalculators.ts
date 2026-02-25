import Decimal from 'decimal.js';
import type { CharacterStats } from '../types/game';

// Calculate damage based on player stats
export const calculateDamage = (player: CharacterStats, isManual: boolean = false): Decimal => {
  const baseDamage = player.str.times(2); // STR contributes to base damage
  
  // Critical hit calculation
  const critChance = player.dex.div(100); // DEX affects crit chance
  const isCrit = Math.random() < critChance.toNumber();
  const critMultiplier = isCrit ? 2 : 1;
  
  // Manual attack bonus
  const manualBonus = isManual ? 1.5 : 1;
  
  // AGI affects attack speed multiplier
  const speedMultiplier = Decimal.max(1, player.agi.div(20));
  
  return baseDamage.times(critMultiplier).times(manualBonus).times(speedMultiplier);
};

// Calculate experience reward based on monster level
export const calculateExpReward = (monsterLevel: number): Decimal => {
  return new Decimal(monsterLevel * 10).times(new Decimal(1.2).pow(monsterLevel - 1));
};

// Calculate gold reward based on monster level
export const calculateGoldReward = (monsterLevel: number): Decimal => {
  return new Decimal(monsterLevel * 5).times(new Decimal(1.1).pow(monsterLevel - 1));
};

// Calculate stamina regeneration based on VIT
export const calculateStaminaRegen = (player: CharacterStats): Decimal => {
  return Decimal.max(1, player.vit.div(10));
};

// Calculate experience needed for next level
export const calculateExpToNext = (level: number): Decimal => {
  return new Decimal(100).times(new Decimal(1.5).pow(level - 1));
};

// Calculate max HP based on VIT
export const calculateMaxHp = (vit: Decimal): Decimal => {
  return new Decimal(100).plus(vit.times(10));
};

// Calculate max stamina based on VIT
export const calculateMaxStamina = (vit: Decimal): Decimal => {
  return new Decimal(100).plus(vit.times(5));
};

// Calculate damage reduction from VIT
export const calculateDamageReduction = (vit: Decimal): Decimal => {
  return Decimal.min(0.8, vit.div(100)); // Max 80% damage reduction
};

// Calculate dodge chance from AGI
export const calculateDodgeChance = (agi: Decimal): Decimal => {
  return Decimal.min(0.5, agi.div(50)); // Max 50% dodge chance
};

// Format decimal numbers for display
export const formatNumber = (num: Decimal | number, decimals: number = 0): string => {
  const decimal = num instanceof Decimal ? num : new Decimal(num);
  if (decimal.greaterThanOrEqualTo(1000000)) {
    return decimal.toNumber().toExponential(2);
  } else if (decimal.greaterThanOrEqualTo(1000)) {
    return decimal.toNumber().toLocaleString(undefined, { maximumFractionDigits: decimals });
  } else {
    return decimal.toFixed(decimals);
  }
};

// Calculate skill node cost scaling
export const calculateSkillCost = (baseCost: Decimal, level: number): Decimal => {
  return baseCost.times(new Decimal(1.5).pow(level));
};
