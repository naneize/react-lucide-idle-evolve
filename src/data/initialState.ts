import { type CharacterStats, type SkillNode } from '../types/game'

// 🛡️ สเตตัสเริ่มต้นของผู้เล่น (Balanced for Fast Start)
export const initialPlayerStats: CharacterStats = {
    str: 0,
    agi: 0,
    dex: 0,
    luk: 0,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    atk: 5,
    attackSpeed: 1.2,
    critRate: 10,
    critDamage: 150,
    essence: 100,
    level: 1,
}

// 👾 ข้อมูลมอนสเตอร์ตัวแรก (The Hook Target)
export const initialMonsterStats = {
    name: "Crystalline Slime",
    hp: 30,
    maxHp: 30,
    level: 1,
    rewardEssence: 15,
    stage: 1,
}

// 🌳 Core Evolution Modules (Cost-Value Balanced)
export const initialNodes: Record<string, SkillNode> = {
    "str_1": {
        id: "str_1",
        name: "Enhanced Muscle",
        description: "ปรับแต่งเส้นใยกล้ามเนื้อเพื่อเพิ่ม ATK และ Max HP",
        type: 'STR',
        value: 2,
        cost: 10,
        level: 0,
        isUnlocked: false,
        requiredNodes: [],
    },

    "agi_1": {
        id: "agi_1",
        name: "Rapid Reflex",
        description: "เร่งการตอบสนองของระบบประสาทเพื่อเพิ่ม Attack Speed",
        type: 'AGI',
        value: 1,
        cost: 10,
        level: 0,
        isUnlocked: false,
        requiredNodes: [],
    },

    "dex_1": {
        id: "dex_1",
        name: "Neural Precision",
        description: "ปรับจูนความแม่นยำของประสาทสัมผัสเพื่อเพิ่ม Crit Damage",
        type: 'DEX',
        value: 1,
        cost: 10,
        level: 0,
        isUnlocked: false,
        requiredNodes: [],
    },

    "luk_1": {
        id: "luk_1",
        name: "Fortune Core",
        description: "ปรับแต่งยีนแห่งโชคลาภเพื่อเพิ่ม Crit Rate และ Bonus Essence",
        type: 'LUK',
        value: 1,
        cost: 10,
        level: 0,
        isUnlocked: false,
        requiredNodes: [],
    }
}