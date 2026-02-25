import type { EquipmentState } from '../types/equipment';

export const initialEquipment: EquipmentState = {
    void_blade: {
        id: 'void_blade',
        name: 'Void Blade',
        level: 0,
        description: 'เพิ่มพลังโจมตี (ATK) ขึ้น +10% ต่อเลเวล'
    },
    aeon_clock: {
        id: 'aeon_clock',
        name: 'Aeon Clock',
        level: 0,
        description: 'ชะลอการลดลงของเกจเวลา +15% ต่อเลเวล'
    },
    essence_ring: {
        id: 'essence_ring',
        name: 'Essence Ring',
        level: 0,
        description: 'เพิ่มมานา (Mana) ที่ได้รับ +5% ต่อเลเวล'
    },
    // 🏹 เพิ่มไอเทมสาย AGI
    wind_bow: {
        id: 'wind_bow',
        name: "Wind God's Bow",
        level: 0,
        description: 'เพิ่มความเร็วการโจมตี (ASPD) +3% ต่อเลเวล'
    },
    // 🎯 เพิ่มไอเทมสาย LUK
    hawkeye_eye: {
        id: 'hawkeye_eye',
        name: 'Hawkeye Eye',
        level: 0,
        description: 'เพิ่มโอกาสคริติคอล (Crit Rate) +2% ต่อเลเวล'
    },
    // 🗡️ เพิ่มไอเทมสาย DEX
    dragon_fang: {
        id: 'dragon_fang',
        name: 'Dragon Fang',
        level: 0,
        description: 'เพิ่มความแรงคริติคอล (Crit DMG) +10% ต่อเลเวล'
    }
} as EquipmentState;