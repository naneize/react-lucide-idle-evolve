import { useState } from 'react';
import { StatTab } from './StatTab';
import { ShopTab } from './ShopTab';

interface EvolutionViewProps {
    nodes: any;
    player: any;
    soulShards: number;
    equipment: any;
    unlockNode: (id: string) => void;
    buyEquipment: (id: any) => void;
}

export function EvolutionView({
    nodes,
    player,
    soulShards,
    equipment,
    unlockNode,
    buyEquipment
}: EvolutionViewProps) {
    const [activeTab, setActiveTab] = useState<'stats' | 'shop'>('stats');

    return (
        <div className="flex flex-col h-full bg-[#D1E9FF] animate-in fade-in duration-500 overflow-hidden font-sans">

            {/* 🏆 High-End Dashboard Stats - แสดงความจริงจาก Store */}
            <div className="sticky top-0 bg-white/40 backdrop-blur-2xl z-20 p-4 border-b border-white/40 shadow-sm">
                <div className="grid grid-cols-4 gap-2">
                    {/* STR Container */}
                    <StatContainer
                        label="STR"
                        value={player.str}
                        subLabel="Atk"
                        subValue={Math.round(player.atk).toLocaleString()}
                        // ✅ ดึงเลเวลอุปกรณ์มาโชว์เพื่อความขลัง แต่เลข Atk หลักคือของจริงที่บวกแล้ว
                        level={equipment.void_blade.level}
                        color="rose"
                    />

                    {/* AGI Container */}
                    <StatContainer
                        label="AGI"
                        value={player.agi}
                        subLabel="Spd"
                        subValue={player.attackSpeed.toFixed(2)}
                        level={equipment.wind_bow.level}
                        color="amber"
                    />

                    {/* DEX Container */}
                    <StatContainer
                        label="DEX"
                        value={player.dex}
                        subLabel="Cdmg"
                        subValue={`${Math.round(player.critDamage)}%`}
                        level={equipment.dragon_fang.level}
                        color="blue"
                    />

                    {/* LUK Container */}
                    <StatContainer
                        label="LUK"
                        value={player.luk}
                        subLabel="Crat"
                        subValue={`${player.critRate.toFixed(1)}%`}
                        level={equipment.hawkeye_eye.level}
                        color="emerald"
                    />
                </div>
            </div>

            {/* 📑 Tab Switcher */}
            <div className="flex p-4 gap-3 bg-gradient-to-b from-white/20 to-transparent shrink-0">
                <button
                    onClick={() => setActiveTab('stats')}
                    className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${activeTab === 'stats'
                        ? 'bg-sky-500 text-white shadow-[0_8px_20px_rgba(14,165,233,0.3)] scale-[1.02] border-b-4 border-sky-700'
                        : 'bg-white/60 text-sky-900 border-b-4 border-slate-200 opacity-80'
                        }`}
                >
                    <span className="text-xs">🧬</span> EVOLUTION
                </button>
                <button
                    onClick={() => setActiveTab('shop')}
                    className={`flex-1 py-3.5 rounded-2xl text-[10px] font-black transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 ${activeTab === 'shop'
                        ? 'bg-indigo-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.3)] scale-[1.02] border-b-4 border-indigo-800'
                        : 'bg-white/60 text-indigo-900 border-b-4 border-slate-200 opacity-80'
                        }`}
                >
                    <span className="text-xs">💎</span> SOUL FORGE {soulShards > 0 && `(${soulShards})`}
                </button>
            </div>

            {/* 🌳 Content Area */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-b from-transparent to-white/30">
                <div className="absolute inset-0 overflow-y-auto no-scrollbar">
                    {activeTab === 'stats' ? (
                        <StatTab
                            nodes={nodes}
                            player={player}
                            equipment={equipment}
                            unlockNode={unlockNode}
                        />
                    ) : (
                        <ShopTab
                            equipment={equipment}
                            soulShards={soulShards}
                            buyEquipment={buyEquipment}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

/** 🛠️ Component ย่อย StatContainer - เน้นความอ่านง่ายและข้อมูลที่แม่นยำ */

function StatContainer({ label, value, subLabel, subValue, level, color }: any) {
    const theme: any = {
        rose: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
        amber: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
        blue: { text: 'text-sky-600', bg: 'bg-sky-50', border: 'border-sky-100' },
        emerald: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' }
    };

    const currentTheme = theme[color];

    return (
        <div className={`flex flex-col rounded-2xl border bg-white/90 p-2 shadow-sm ${currentTheme.border}`}>
            <div className="flex justify-between items-start mb-1">
                <span className={`text-[8px] font-black uppercase opacity-60 ${currentTheme.text}`}>{label}</span>
                {level > 0 && (
                    <span className="text-[6px] font-black text-slate-400">Lv.{level}</span>
                )}
            </div>

            {/* Main Value: ใช้ Math.round เพื่อให้เลขตรงกับปุ่มอัปเกรดเสมอ */}
            <div className="text-[12px] font-black text-slate-800 leading-none mb-2">
                {Math.round(value).toLocaleString()}
            </div>

            <div className={`w-full h-[1px] opacity-20 mb-1.5 ${currentTheme.bg.replace('bg-', 'bg-')}`} />

            {/* Sub Stats: พลังโจมตี/ความเร็ว ที่คำนวณมาแล้วจาก Store */}
            <div className="flex flex-col leading-none">
                <span className="text-[6px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">{subLabel}</span>
                <span className={`text-[9px] font-black truncate ${currentTheme.text}`}>{subValue}</span>
            </div>
        </div>
    );
}