import type { EquipmentState } from "../types/equipment";

export type PassiveType = 'NONE' | 'HARD_SKIN' | 'REFLECT' | 'DODGE' | 'REGEN';

/**
 * 🛡️ ระบบ Passive ของมอนสเตอร์ (ปรับปรุงใหม่พร้อมระบบ Accuracy)
 * @param playerDex - ค่า DEX ของผู้เล่นใช้สำหรับเพิ่มความแม่นยำ
 */
export const applyMonsterPassive = (originalDamage: number,
    monster: any,
    playerDex: number = 0,

) => {

    let finalDamage = originalDamage;
    let effectMessage = "";

    // ถ้าไม่มีสกิล ให้ผ่านไปเลย
    if (!monster.passive || monster.passive === 'NONE') return { finalDamage, effectMessage };

    switch (monster.passive) {
        case 'HARD_SKIN':
            // รับดาเมจได้ไม่เกิน 20% ของเลือดสูงสุด (กันพวก One-hit kill)
            const limit = monster.maxHp * 0.20;
            if (finalDamage > limit) {
                finalDamage = limit;
                effectMessage = "🛡️ Skin Hardened!";
            }
            break;

        case 'DODGE':
            // 🎯 ระบบ Accuracy: ยิ่ง DEX สูง โอกาสหลบของมอนสเตอร์ยิ่งลดลง
            // โอกาสหลบพื้นฐาน 15% (0.15)
            const baseDodgeChance = 0.15;
            // ทุกๆ 10 DEX จะลดโอกาสหลบลง 1% (ปรับได้ตามความเหมาะสม)
            const accuracyBonus = playerDex * 0.001;
            const finalDodgeChance = Math.max(0.02, baseDodgeChance - accuracyBonus); // ขั้นต่ำมอนยังหลบได้ 2%

            if (Math.random() < finalDodgeChance) {
                finalDamage = 0;
                effectMessage = "💨 Miss!";
            }
            break;

        case 'REFLECT':
            // สะท้อนดาเมจ 10% (ส่งข้อมูลกลับไปให้ Store จัดการเลือดผู้เล่น)
            effectMessage = "🪞 Reflecting!";
            break;

        case 'REGEN':
            // (เตรียมไว้สำหรับอนาคต) มอนสเตอร์ฟื้นเลือด
            effectMessage = "💖 Regenerating...";
            break;
    }

    return { finalDamage, effectMessage };
};

export const calculateMonsterMaxHp = (level: number) => {
    // สมมติฐาน: เลเวล 1 = 100, เพิ่มขึ้น 12% ทุกเลเวล (ลดจาก 18% เพื่อ balance)
    return Math.floor(100 * Math.pow(1.12, level - 1));
};

export const calculateMaxBattleTime = (level: number, equipment: EquipmentState) => {
    const baseTime = 15;
    const levelBonus = level * 0.5;

    // 🛡️ จำกัดเวลาพื้นฐานไว้ไม่เกิน 40 วินาที ก่อนไปคูณกับนาฬิกา
    const rawTime = Math.min(40, baseTime + levelBonus);

    const timeDilation = calculateTimeDilation(equipment);

    // ⏰ Battle Time Cap: จำกัดเวลาสูงสุดไว้ที่ 300 วินาที (5 นาที) เพื่อป้องกันการบังคับให้ผู้เล่นเบื่อ
    return Math.min(300, rawTime * timeDilation);
};

/**
 * ⚔️ Void Blade: เพิ่ม ATK เป็น %
 */
export const calculateFinalAtk = (baseAtk: number, playerStr: number, equipment: EquipmentState, monsterLevel: number = 1) => {
    const swordLevel = equipment.void_blade?.level || 0;
    const swordMultiplier = 1 + (swordLevel * 0.10);

    // 🎯 ใส่พนักงานคนนี้ลงไปทำงานตรงนี้ครับ!
    const milestoneBonus = 1 + (Math.floor(playerStr / 10) * 0.05);

    // 🚀 Level Bonus: เพิ่มดาเมจตามเลเวลมอนสเตอร์ +2% ต่อเลเวล
    const levelBonus = 1 + (monsterLevel * 0.02);

    // และเอาไปคูณในผลลัพธ์สุดท้าย
    return Math.round(baseAtk * swordMultiplier * milestoneBonus * levelBonus);
};

/**
 * ⏳ Aeon Clock: ชะลอเวลา
 */
export const calculateTimeDilation = (equipment: EquipmentState) => {
    const level = equipment.aeon_clock?.level || 0;
    return 1 + (level * 0.15);
};

/**
 * 💍 Essence Ring: เพิ่ม Mana เป็น %
 */
export const calculateManaMultiplier = (equipment: EquipmentState, playerLuk: number) => {
    const level = equipment.essence_ring?.level || 0;
    const itemBonus = 1 + (level * 0.05); // แหวน +5% ต่อเลเวล

    // 🍀 Milestone: ปรับเป็นทุก 10 LUK เพิ่ม 10% (เพื่อให้คนอยากอัป LUK มากขึ้น)
    const milestoneBonus = 1 + (Math.floor(playerLuk / 10) * 0.10);

    return itemBonus * milestoneBonus;
};

export const calculateManaPerHit = (monsterLevel: number, equipment: EquipmentState, playerLuk: number, passives?: any) => {
    const multiplier = calculateManaMultiplier(equipment, playerLuk);
    const passiveBonus = passives ? calculatePassiveManaBonus(passives) : 1;
    // ปรับฐานให้โตตามเลเวลมอนสเตอร์ชัดเจนขึ้น
    const base = 1 + (monsterLevel * 0.5);
    return Math.round(base * multiplier * passiveBonus);
};

export const calculateManaOnKill = (monsterLevel: number, equipment: EquipmentState, playerLuk: number, passives?: any) => {
    const multiplier = calculateManaMultiplier(equipment, playerLuk);
    const passiveBonus = passives ? calculatePassiveManaBonus(passives) : 1;
    // 🚀 ปรับอัตราเติบโตเป็น 1.20x เพื่อให้สเกลทันค่าอัปเกรดหลักล้านที่เลเวล 25
    const base = 20 * Math.pow(1.20, monsterLevel - 1);
    return Math.round(base * multiplier * passiveBonus);
};

/**
 * 🏹 Wind God's Bow: เพิ่มความเร็วโจมตี (ASPD)
 */
export const calculateASPDMultiplier = (equipment: EquipmentState, playerAgi: number) => {
    const level = equipment.wind_bow?.level || 0;
    const itemBonus = 1 + (level * 0.03);
    // 🏃 แถมโบนัส Milestone: ทุก 10 AGI ตีเร็วขึ้นอีก 3%
    const milestoneBonus = 1 + (Math.floor(playerAgi / 10) * 0.03);
    return itemBonus * milestoneBonus;
};

/**
 * 🎯 Hawkeye Eye: เพิ่ม Crit Rate (CRI%)
 */
export const calculateCritRateBonus = (equipment: EquipmentState) => {
    const level = equipment.hawkeye_eye?.level || 0;
    return level * 2; // +2% ต่อเลเวล
};

/**
 * 🗡️ Dragon Fang: เพิ่ม Crit Damage (CDMG%)
 */
export const calculateCritDamageMultiplier = (equipment: EquipmentState, playerDex: number) => {
    const level = equipment.dragon_fang?.level || 0;
    const itemBonus = 1 + (level * 0.10);
    // 🎯 แถมโบนัส Milestone: ทุก 10 DEX คริแรงขึ้นอีก 5%
    const milestoneBonus = 1 + (Math.floor(playerDex / 10) * 0.05);
    return itemBonus * milestoneBonus;
};

/**
 * 🌟 Infinite Passive Bonus Calculations
 */
export const calculatePassiveAttackBonus = (passives: any) => {
    return 1 + (passives.attack.level * 0.002); // +0.2% ต่อเลเวล
};

export const calculatePassiveCritRateBonus = (passives: any) => {
    return passives.critRate.level * 0.1; // +0.1% ต่อเลเวล
};

export const calculatePassiveCritDamageBonus = (passives: any) => {
    return 1 + (passives.critDamage.level * 0.005); // +0.5% ต่อเลเวล
};

export const calculatePassiveManaBonus = (passives: any) => {
    return 1 + (passives.mana.level * 0.01); // +1% ต่อเลเวล
};

/**
 * 💎 Equipment Cost Calculation
 * ราคาอุปกรณ์แบบ Exponential ใช้ตัวคูณ 1.8 ตามมาตรฐาน
 */
export const calculateEquipmentCost = (currentLevel: number) => {
    return Math.max(1, Math.floor(Math.pow(1.8, currentLevel)));
};