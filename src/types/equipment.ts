// 1. ขยาย ID ให้ครอบคลุมไอเทมใหม่
export type EquipmentId =
    | 'void_blade'
    | 'aeon_clock'
    | 'essence_ring'
    | 'wind_bow'      // 🏹 สาย AGI
    | 'hawkeye_eye'   // 🎯 สาย LUK
    | 'dragon_fang';  // 🗡️ สาย DEX

export interface Equipment {
    id: EquipmentId;
    name: string;
    level: number;
    description: string;
}

// 2. ระบุโครงสร้างใน State ให้ชัดเจน (Explicit Interface)
export interface EquipmentState {
    void_blade: Equipment;
    aeon_clock: Equipment;
    essence_ring: Equipment;
    wind_bow: Equipment;     // ✅ เพิ่มใหม่
    hawkeye_eye: Equipment;  // ✅ เพิ่มใหม่
    dragon_fang: Equipment;  // ✅ เพิ่มใหม่
}