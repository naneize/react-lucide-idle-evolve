// src/components/game/evolution/ShopTab.tsx

import type { EquipmentId, EquipmentState } from '../../../types/equipment';
import { calculateEquipmentCost } from '../../../utils/gameCalculators';
import { formatNumber } from '../../../utils/format';

interface ShopTabProps {
    equipment: EquipmentState;
    soulShards: number;
    buyEquipment: (id: EquipmentId) => void;
}

export function ShopTab({ equipment, soulShards, buyEquipment }: ShopTabProps) {
    if (!equipment) return null;

    // ฟังก์ชันช่วยเลือกไอคอนให้ตรงกับ ID ของไอเทม
    const getItemIcon = (id: string) => {
        switch (id) {
            case 'void_blade': return '⚔️';
            case 'aeon_clock': return '⏳';
            case 'wind_bow': return '🏹';
            case 'dragon_fang': return '🦷';
            case 'hawkeye_eye': return '👁️';
            case 'wisdom_ring': return '💍';
            default: return '💎';
        }
    };

    return (
        /* ✅ เพิ่ม touch-pan-y เพื่อให้เลื่อนบนมือถือลื่นไหล */
        <div className="h-full overflow-y-auto no-scrollbar touch-pan-y px-6 pt-4 pb-40">
            <div className="max-w-[360px] mx-auto">
                <h3 className="text-indigo-900 font-black text-[10px] uppercase tracking-[0.2em] mb-8 opacity-50 text-center">
                    Ancient Artifacts
                </h3>

                <div className="grid grid-cols-2 gap-x-4 gap-y-12">
                    {Object.values(equipment).map((item) => {
                        // 💰 ใช้ฟังก์ชันรวม calculateEquipmentCost ตัวคูณ 1.8 ตามมาตรฐาน
                        // ราคาเริ่มต้น 1 และจะค่อยๆ แพงขึ้นตามเลเวล
                        const cost = calculateEquipmentCost(item.level);
                        const canAfford = soulShards >= cost;

                        return (
                            <div key={item.id} className="flex flex-col items-center">
                                <div className="flex justify-between w-full px-1 mb-2 items-end">
                                    <h5 className="text-[9px] font-black text-slate-800 uppercase italic leading-none tracking-tighter truncate w-[70%]">
                                        {item.name}
                                    </h5>
                                    <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-1 rounded border border-indigo-100">
                                        LV.{item.level}
                                    </span>
                                </div>

                                {/* ✅ ปุ่มซื้อที่ครอบคลุมทั้ง Card */}
                                <button
                                    onClick={() => buyEquipment(item.id as EquipmentId)}
                                    disabled={!canAfford}
                                    className={`relative aspect-square w-full bg-white/90 border-2 shadow-lg rounded-[2rem] flex flex-col items-center justify-center p-4 transition-all active:scale-95 group outline-none ${canAfford
                                        ? 'border-indigo-100 hover:border-indigo-300'
                                        : 'border-slate-200 opacity-80'
                                        }`}
                                >
                                    <div className="text-3xl mb-1 group-hover:rotate-12 transition-transform pointer-events-none">
                                        {getItemIcon(item.id)}
                                    </div>

                                    <p className="text-[7px] font-bold text-indigo-400 text-center leading-tight px-2 uppercase pointer-events-none h-6 flex items-center">
                                        {item.description}
                                    </p>

                                    {/* ส่วนแสดงราคา Soul Shards */}
                                    <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl text-[10px] font-black shadow-lg border-2 whitespace-nowrap flex items-center gap-1 transition-all ${canAfford
                                        ? 'bg-indigo-600 text-white border-white shadow-indigo-200 scale-105'
                                        : 'bg-slate-300 text-slate-500 border-slate-200'
                                        }`}>
                                        <span>{formatNumber(cost)}</span>
                                        <span className="text-[10px]">💎</span>
                                    </div>
                                </button>

                                <p className="mt-8 text-[7px] font-bold text-indigo-700/30 uppercase tracking-[0.2em]">
                                    Artifact Upgrade
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}