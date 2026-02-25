import type { EquipmentId, EquipmentState } from './equipment';

export interface CharacterStats {
    str: number;
    agi: number;
    dex: number;
    luk: number;
    hp: number;
    maxHp: number;
    mp: number; // เพิ่มไว้เผื่อระบบ Skill ในอนาคต
    maxMp: number;
    atk: number;
    attackSpeed: number;
    critRate: number;    // % โอกาสติดคริ
    critDamage: number;  // % ความแรงคริ
    essence: number;
    level: number;
}

export interface SkillNode {
    id: string;
    name: string;
    description: string;
    // ✨ ปรับปรุง Type ให้ตรงกับโหนด 4 สายที่เรามีจริง
    type: 'STR' | 'AGI' | 'DEX' | 'LUK' | 'ULTIMATE';
    value: number;        // ค่าพื้นฐานที่ใช้คำนวณ Scaling
    cost: number;         // Base Cost
    level: number;        // เลเวลปัจจุบันของโหนด
    isUnlocked: boolean;
    requiredNodes: string[];
}

export interface MonsterData {
    name: string;
    hp: number;
    maxHp: number;
    level: number;
    rewardEssence: number;
    stage: number;
    passive?: 'NONE' | 'HARD_SKIN' | 'REFLECT' | 'DODGE' | 'REGEN' | string;
}

export interface PassiveSkill {
    level: number;
    essence: number;
    requiredEssence: number;
}

export interface GameState {
    player: CharacterStats;
    monster: MonsterData;

    battleTimer: number;
    maxBattleTime: number;

    damageBuffer: number;

    soulShards: number;
    equipment: EquipmentState;
    buyEquipment: (equipId: EquipmentId) => void;

    missTrigger: number;

    nodes: Record<string, SkillNode>;
    battleLog: string[];
    isGameRunning: boolean;
    playerAttackTimer: number;
    regenTimer: number;
    totalEssenceEarned: number;
    totalMonstersKilled: number;

    // Infinite Passives System
    passives: {
        attack: PassiveSkill;
        mana: PassiveSkill;
        speed: PassiveSkill;
        critRate: PassiveSkill;
        critDamage: PassiveSkill;
        luck: PassiveSkill;
    };
    addPassiveEssence: (type: keyof GameState['passives'], amount: number) => void;
}

export interface GameActions {
    // 🕹️ System Actions
    startGame: () => void;
    stopGame: () => void;
    resetGame: () => void;
    addBattleLog: (message: string) => void;

    // ⚔️ Combat Actions
    playerAttack: (isManual?: boolean) => void;
    manualAttack: () => void;

    // 🌳 Evolution Actions
    unlockNode: (nodeId: string) => void;
}

export type GameStore = GameState & GameActions;