import { create } from 'zustand'
import type { GameStore } from '../types/game'
import { initialPlayerStats, initialMonsterStats, initialNodes } from '../data/initialState'
import { playerAttackLogic } from './logic/combatActions';
import { initialEquipment } from '../data/equipmentData';
import type { EquipmentId, EquipmentState } from '../types/equipment';
import * as Calcs from '../utils/gameCalculators';

const initialMaxTime = Calcs.calculateMaxBattleTime(1, initialEquipment);

// Initial Passives State
const initialPassives = {
  attack: { level: 0, essence: 0, requiredEssence: 10 },
  mana: { level: 0, essence: 0, requiredEssence: 10 },
  speed: { level: 0, essence: 0, requiredEssence: 10 },
  critRate: { level: 0, essence: 0, requiredEssence: 10 },
  critDamage: { level: 0, essence: 0, requiredEssence: 10 },
  luck: { level: 0, essence: 0, requiredEssence: 10 },
};

export const useGameStore = create<GameStore>((set, get) => ({
  player: initialPlayerStats,
  monster: initialMonsterStats,
  nodes: initialNodes,
  soulShards: 0,
  battleTimer: initialMaxTime,
  maxBattleTime: initialMaxTime,
  missTrigger: 0,
  equipment: initialEquipment,
  passives: initialPassives,

  buyEquipment: (equipId: EquipmentId) => {
    const state = get();
    const currentEquip = state.equipment[equipId];

    if (!currentEquip) return;

    // 💎 ราคาแบบ Exponential - ใช้ฟังก์ชันรวม
    const cost = Calcs.calculateEquipmentCost(currentEquip.level);

    if (state.soulShards < cost) {
      get().addBattleLog(`💎 Soul Shards ไม่พอ (ต้องการ ${cost} Shards)`);
      return;
    }

    const updatedItem = {
      ...currentEquip,
      level: currentEquip.level + 1
    };

    const nextEquipmentState: EquipmentState = {
      ...state.equipment,
      [equipId]: updatedItem
    };

    // 📊 คำนวณ Stats ใหม่จากข้อมูล Base + ข้อมูลอุปกรณ์ใหม่ (nextEquipmentState)
    // ใช้ค่า STR ปัจจุบันจาก state.player.str ที่ยังไม่เปลี่ยนแปลง
    const baseAtk = initialPlayerStats.atk + ((state.player.str - initialPlayerStats.str) * 2.5);
    const currentStr = state.player.str; // เก็บค่า STR ปัจจุบันไว้

    const baseAspd = initialPlayerStats.attackSpeed + ((state.player.agi - initialPlayerStats.agi) * 0.04);
    const baseCritRate = initialPlayerStats.critRate + ((state.player.luk - initialPlayerStats.luk) * 0.8);
    const baseCritDmg = 150 + ((state.player.dex - initialPlayerStats.dex) * 4);

    // ⚔️ ATK: ส่ง baseAtk ที่คำนวณจาก STR ปัจจุบัน และ currentStr เข้าไป
    const finalAtk = Calcs.calculateFinalAtk(baseAtk, currentStr, nextEquipmentState, state.monster.level);

    // 🏹 ASPD (ต้องส่ง state.player.agi เข้าไปด้วย)
    const finalAspd = Calcs.calculateASPDMultiplier(nextEquipmentState, state.player.agi) * baseAspd;

    // 🎯 Crit Rate (อันนี้ไม่ต้องส่งเพิ่ม เพราะเราคุยกันว่าให้บวกตรงๆ ไม่ทำ Milestone)
    const finalCritRate = Math.min(80, Calcs.calculateCritRateBonus(nextEquipmentState) + baseCritRate);

    // 🗡️ Crit Damage (ต้องส่ง state.player.dex เข้าไปด้วย)
    const finalCritDmg = baseCritDmg * Calcs.calculateCritDamageMultiplier(nextEquipmentState, state.player.dex);
    set((s) => ({
      soulShards: s.soulShards - cost,
      equipment: nextEquipmentState,
      player: {
        ...s.player,
        atk: Math.round(finalAtk),
        attackSpeed: finalAspd,
        critRate: finalCritRate,
        critDamage: Math.round(finalCritDmg)
      }
    }));

    get().addBattleLog(`⚔️ อัปเกรด ${currentEquip.name} เป็น Lv.${updatedItem.level} (ใช้ ${cost} 💎)`);
  },

  unlockNode: (nodeId: string) => {
    const state = get();
    const node = state.nodes[nodeId];
    if (!node) return;

    // 🎯 Updated Node Cost: Include monster level factor for better scaling
    const currentCost = Math.round(node.cost * Math.pow(1.15, node.level || 0) * Math.pow(1.02, state.monster.level));

    if (state.player.essence < currentCost) {
      get().addBattleLog(`❌ Mana ไม่พอสำหรับการตื่นรู้`);
      return;
    }

    set((s) => {
      const updatedNodes = {
        ...s.nodes,
        [nodeId]: { ...node, level: (node.level || 0) + 1, isUnlocked: true }
      };

      // 1. คำนวณ Bonus Points จาก Nodes ทั้งหมด
      const bonus = Object.values(updatedNodes).reduce((acc, n) => {
        const lvl = n.level || 0;
        if (lvl === 0) return acc;
        const scalingValue = n.value * Math.pow(lvl, 1.3);

        if (n.type === 'STR') acc.str += scalingValue;
        if (n.type === 'AGI') acc.agi += scalingValue;
        if (n.type === 'DEX') acc.dex += scalingValue;
        if (n.type === 'LUK') acc.luk += scalingValue;
        return acc;
      }, { str: 0, agi: 0, dex: 0, luk: 0 });

      // 2. คำนวณ Base Stats ใหม่
      const currentStr = initialPlayerStats.str + bonus.str;
      const baseAtk = initialPlayerStats.atk + (bonus.str * 2.5);
      const baseAspd = initialPlayerStats.attackSpeed + (bonus.agi * 0.04);
      const baseCritDmg = 150 + (bonus.dex * 4);
      const baseCritRate = initialPlayerStats.critRate + (bonus.luk * 0.8);

      // 3. ใช้ Calcs คำนวณร่วมกับไอเทมปัจจุบัน (s.equipment) 
      // เพื่อให้ Stat เด้งขึ้นทันทีที่อัป Node
      // 1. คำนวณ STR Milestone (ใช้ currentStr ที่คุณเพิ่งบวกมา)
      const finalAtk = Calcs.calculateFinalAtk(baseAtk, currentStr, s.equipment, s.monster.level);

      // 2. คำนวณ AGI Milestone (ส่งค่า Agi รวมใหม่เข้าไป)
      const currentAgi = initialPlayerStats.agi + bonus.agi;
      const finalAspd = Calcs.calculateASPDMultiplier(s.equipment, currentAgi) * baseAspd;

      // 3. คำนวณ DEX Milestone (ส่งค่า Dex รวมใหม่เข้าไป)
      const currentDex = initialPlayerStats.dex + bonus.dex;
      const finalCritDmg = baseCritDmg * Calcs.calculateCritDamageMultiplier(s.equipment, currentDex);

      // 4. Crit Rate (ไม่ต้องมี Milestone เหมือนเดิม)
      const finalCritRate = Math.min(80, Calcs.calculateCritRateBonus(s.equipment) + baseCritRate);
      const newMaxHp = Math.round(initialPlayerStats.maxHp + (bonus.str * 15));

      return {
        nodes: updatedNodes,
        player: {
          ...s.player,
          str: initialPlayerStats.str + bonus.str,
          agi: initialPlayerStats.agi + bonus.agi,
          dex: initialPlayerStats.dex + bonus.dex,
          luk: initialPlayerStats.luk + bonus.luk,
          essence: s.player.essence - currentCost,
          maxHp: newMaxHp,
          hp: Math.min(s.player.hp, newMaxHp),
          atk: Math.round(finalAtk),
          attackSpeed: finalAspd,
          critDamage: Math.round(finalCritDmg),
          critRate: finalCritRate,
        }
      };
    });

    get().addBattleLog(`✨ Awakened: ${get().nodes[nodeId].name} LV.${get().nodes[nodeId].level}`);
  },

  // --- ส่วนของระบบ Game Loop (Start/Stop/Attack) คงเดิมตามที่คุณส่งมา ---
  dps: 0,
  damageBuffer: 0,
  battleLog: [],
  isGameRunning: false,
  playerAttackTimer: 0,
  regenTimer: 0,
  totalEssenceEarned: 0,
  totalMonstersKilled: 0,

  startGame: () => {
    if (get().isGameRunning) return;
    set({ isGameRunning: true, battleLog: ['🌲 เริ่มการเชื่อมต่อกับผลึกวิญญาณ...'] });

    const attackInterval = setInterval(() => {
      const state = get();
      if (!state.isGameRunning) { clearInterval(attackInterval); return; }

      const newAttackTimer = state.playerAttackTimer + (state.player.attackSpeed / 10);
      if (newAttackTimer >= 1) {
        get().playerAttack(false);
        set({ playerAttackTimer: 0 });
      } else {
        set({ playerAttackTimer: newAttackTimer });
      }
    }, 100);

    // ใน setInterval 100ms (รัน 10 ครั้งต่อวินาที)
    const battleInterval = setInterval(() => {
      const state = get();
      if (!state.isGameRunning) { clearInterval(battleInterval); return; }

      // 🕒 ลดลงวินาทีละ 0.1 หน่วย (เพราะรันทุก 100ms)
      // ตรงนี้ไม่ต้องเอาเลเวลมาหารแล้ว เพราะเราไปเพิ่มที่ MaxTime แทน
      const declinePerTick = 0.1;
      const newTimer = state.battleTimer - declinePerTick;

      if (newTimer <= 0) {
        // 🚨 แพ้! (ถอยหลัง 1 เลเวล)
        const fallbackLevel = Math.max(1, state.monster.level - 1);
        const newMaxHp = Calcs.calculateMonsterMaxHp(fallbackLevel);
        const newMaxTime = Calcs.calculateMaxBattleTime(fallbackLevel, state.equipment);

        set({
          battleTimer: newMaxTime, // รีเซ็ตเป็นเวลาของด่านใหม่
          maxBattleTime: newMaxTime,
          monster: {
            ...state.monster,
            level: fallbackLevel,
            maxHp: newMaxHp,
            hp: newMaxHp,
            passive: 'NONE'
          }
        });
        get().addBattleLog(`⚠️ เวลาหมด! ถอยกลับไป Level ${fallbackLevel}`);
      } else {
        set({ battleTimer: newTimer });
      }
    }, 100);
  },

  stopGame: () => set({ isGameRunning: false }),
  playerAttack: (isManual = false) => playerAttackLogic(get, set, isManual),
  manualAttack: () => {
    if (!get().isGameRunning) return;
    get().playerAttack(true);
  },
  addBattleLog: (message: string) => set((s) => ({
    battleLog: [message, ...s.battleLog].slice(0, 50)
  })),

  // Infinite Passives System
  addPassiveEssence: (type, amount) => set((state) => {
    const passive = state.passives[type];
    const newEssence = passive.essence + amount;

    // Check for level up
    if (newEssence >= passive.requiredEssence) {
      // Level up!
      const newLevel = passive.level + 1;
      const newRequiredEssence = 10 + (newLevel * 2);

      return {
        passives: {
          ...state.passives,
          [type]: {
            level: newLevel,
            essence: 0, // Reset essence after level up
            requiredEssence: newRequiredEssence
          }
        }
      };
    } else {
      // Just add essence
      return {
        passives: {
          ...state.passives,
          [type]: {
            ...passive,
            essence: newEssence
          }
        }
      };
    }
  }),

  resetGame: () => set({
    player: initialPlayerStats,
    monster: { ...initialMonsterStats, stage: 1 },
    nodes: initialNodes,
    equipment: initialEquipment,
    soulShards: 0,
    damageBuffer: 0,
    battleTimer: 0,
    isGameRunning: false,
    playerAttackTimer: 0,
    totalEssenceEarned: 0,
    totalMonstersKilled: 0,
    passives: initialPassives,
    battleLog: ['♻️ รีเซ็ตระบบ...']
  })
}));