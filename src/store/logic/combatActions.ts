import type { GameStore } from '../../types/game'
import { initialMonsterStats } from '../../data/initialState'
import { getMonsterEvolution } from '../../data/monsterEvolution'
import type { PassiveType } from '../../utils/gameCalculators';
import * as Calcs from '../../utils/gameCalculators';

export const playerAttackLogic = (get: () => GameStore, set: (updater: (prev: GameStore) => any) => void, isManual = false) => {
    const state = get();
    if (!state.isGameRunning || state.monster.hp <= 0) return;

    // 1. คำนวณดาเมจ (ลอจิคเดิมของคุณ)
    const critBonus = isManual ? 5 : 0;
    const dmgMultiplier = isManual ? 1.5 : 1;
    const isCrit = Math.random() * 100 < (state.player.critRate + critBonus);

    const baseDamage = isCrit
        ? state.player.atk * (state.player.critDamage / 100)
        : state.player.atk;

    const finalDamage = baseDamage * dmgMultiplier;

    // 💰 Instant Mana (Per Hit) - ใช้ Calculator ใหม่พร้อม Passive Bonus
    const instantMana = Calcs.calculateManaPerHit(state.monster.level, state.equipment, state.player.luk, state.passives);

    const { finalDamage: processedDamage, effectMessage }
        = Calcs.applyMonsterPassive(finalDamage, state.monster, state.player.dex);

    const newMonsterHp = Math.max(0, state.monster.hp - processedDamage);

    // แสดงข้อความจาก Passive (ถ้ามี) เช่น Miss! หรือ Skin Hardened!
    if (effectMessage === "💨 Miss!") {
        // 🔔 สั่งให้ missTrigger บวกเพิ่ม 1 (เป็นการกดกริ่งเรียก UI)
        set((state) => ({ missTrigger: state.missTrigger + 1 }));

        // บันทึกลง Battle Log ตามปกติของคุณ
        get().addBattleLog(effectMessage);

        return; // 🛑 สำคัญ: ต้องหยุดทำงานตรงนี้เลย เพราะเราตีไม่โดน (ไม่ต้องหักเลือด)
    }

    // --- 2. เข้าสู่ Logic การเช็คว่าตายหรือไม่ตาย ---
    if (newMonsterHp <= 0) {
        const currentMonsterLevel = state.monster.level;
        const isBossKilled = currentMonsterLevel % 5 === 0;

        // คำนวณรางวัล
        const shardReward = isBossKilled ? Math.max(1, Math.floor(currentMonsterLevel / 5)) : 0;
        const nextLevel = currentMonsterLevel + 1;

        // สุ่ม Passive ตัวถัดไป
        let nextPassive: PassiveType = 'NONE';
        if (nextLevel >= 20 && Math.random() < 0.3) {
            const passives: PassiveType[] = ['HARD_SKIN', 'DODGE', 'REFLECT'];
            nextPassive = passives[Math.floor(Math.random() * passives.length)];
        }


        const nextEvo = getMonsterEvolution(nextLevel);
        const currentEvo = getMonsterEvolution(currentMonsterLevel);
        // 💰 Kill Reward (On Kill) - ใช้ Calculator ใหม่พร้อม Passive Bonus
        const killReward = Calcs.calculateManaOnKill(state.monster.level, state.equipment, state.player.luk, state.passives);

        // 🎯 Infinite Passive Essence Drop
        const passiveTypes: (keyof typeof state.passives)[] = ['attack', 'mana', 'speed', 'critRate', 'critDamage', 'luck'];
        const randomPassiveType = passiveTypes[Math.floor(Math.random() * passiveTypes.length)];
        const passiveEssenceAmount = 1 + Math.floor(currentMonsterLevel / 10);

        const nextMaxTime = Calcs.calculateMaxBattleTime(nextLevel, state.equipment);
        const nextMaxHp = Calcs.calculateMonsterMaxHp(nextLevel);

        set((s) => ({
            monster: {
                ...s.monster,
                level: nextLevel,
                name: nextEvo.name,
                stage: nextEvo.stage,
                maxHp: nextMaxHp,
                passive: nextPassive,
                hp: nextMaxHp,
                rewardEssence: Math.round(initialMonsterStats.rewardEssence * Math.pow(1.15, nextLevel - 1))
            },
            soulShards: s.soulShards + shardReward,
            battleTimer: nextMaxTime,

            player: {
                ...s.player,
                essence: s.player.essence + killReward + (typeof instantMana !== 'undefined' ? instantMana : 0)
            },
            totalEssenceEarned: s.totalEssenceEarned + killReward + (typeof instantMana !== 'undefined' ? instantMana : 0),
            totalMonstersKilled: s.totalMonstersKilled + 1
        }));

        // 🎯 Add Passive Essence
        get().addPassiveEssence(randomPassiveType, passiveEssenceAmount);

        // Battle Log
        if (currentEvo.stage !== nextEvo.stage) {
            get().addBattleLog(`✨ วิวัฒนาการ! จาก [${currentEvo.name}] กลายเป็น [${nextEvo.name}]`);
        }
        if (shardReward > 0) {
            get().addBattleLog(`💎 🏆 ปราบ BOSS เลเวล ${currentMonsterLevel}! ได้รับ Soul Shard x${shardReward}`);
        }
        get().addBattleLog(`⚔️ พิชิต! +${killReward} Mana`);

        // Log passive essence drop
        const passiveNames = {
            attack: '⚡ Attack',
            mana: '💎 Mana',
            speed: '🌪️ Speed',
            critRate: '🎯 Crit Rate',
            critDamage: '⚔️ Crit Damage',
            luck: '🍀 Luck'
        };
        get().addBattleLog(`🌟 ${passiveNames[randomPassiveType]} Essence +${passiveEssenceAmount}`);

    } else {
        // 🛡️ กรณีมอนสเตอร์ยังไม่ตาย
        set((s) => ({
            monster: { ...s.monster, hp: newMonsterHp }, // ตอนนี้ใช้ newMonsterHp ได้แล้ว เพราะประกาศไว้ข้างบนสุด
            player: { ...s.player, essence: s.player.essence + (typeof instantMana !== 'undefined' ? instantMana : 0) },
            totalEssenceEarned: s.totalEssenceEarned + (typeof instantMana !== 'undefined' ? instantMana : 0)
        }));

        if (isManual) {
            get().addBattleLog(`⚔️ Strike! -${Math.floor(processedDamage)}`); // ใช้ processedDamage จะแม่นยำกว่า
        } else if (isCrit) {
            get().addBattleLog(`💥 CRIT! -${Math.floor(processedDamage)}`);
        }
    }



};