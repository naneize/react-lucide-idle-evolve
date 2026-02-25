import { useGameStore } from '../../../store/useGameStore';
import { formatNumber } from '../../../utils/format';
import {
    calculateFinalAtk,
    calculateASPDMultiplier,
    calculateCritDamageMultiplier,
    calculateCritRateBonus
} from '../../../utils/gameCalculators';
import { initialPlayerStats } from '../../../data/initialState';

interface StatTabProps {
    nodes: any;
    player: any;
    equipment: any;
    unlockNode: (id: string) => void;
}

export function StatTab({ nodes, player, equipment, unlockNode }: StatTabProps) {
    const { monster } = useGameStore(); // Get monster from store
    const mainNodeIds = ['str_1', 'agi_1', 'dex_1', 'luk_1'];

    const getDetailedGainLabel = (node: any) => {
        const lvl = node.level || 0;
        const baseValue = node.value; // ใช้ค่าจริงจาก node.value แทน hardcoded 5

        // คำนวณส่วนต่าง (Gain) ของ Stat พื้นฐาน โดยใช้สูตรเดียวกับ Store เป๊ะๆ
        const currentBonus = baseValue * Math.pow(lvl, 1.3);
        const nextBonus = baseValue * Math.pow(lvl + 1, 1.3);
        const statGain = Math.round(nextBonus - currentBonus);

        // คำนวณค่าที่จะได้รับจริงโดยใช้สูตรเดียวกับ Store 100%
        const currentStr = player.str;
        const currentAgi = player.agi;
        const currentDex = player.dex;
        const currentLuk = player.luk;

        const nextStr = currentStr + statGain;
        const nextAgi = currentAgi + statGain;
        const nextDex = currentDex + statGain;
        const nextLuk = currentLuk + statGain;

        // คำนวณ Base Stats ปัจจุบันและถัดไป (เหมือน Store)
        const currentBaseAtk = initialPlayerStats.atk + ((currentStr - initialPlayerStats.str) * 2.5);
        const nextBaseAtk = initialPlayerStats.atk + ((nextStr - initialPlayerStats.str) * 2.5);

        const currentBaseAspd = initialPlayerStats.attackSpeed + ((currentAgi - initialPlayerStats.agi) * 0.04);
        const nextBaseAspd = initialPlayerStats.attackSpeed + ((nextAgi - initialPlayerStats.agi) * 0.04);

        const currentBaseCritDmg = 150 + ((currentDex - initialPlayerStats.dex) * 4);
        const nextBaseCritDmg = 150 + ((nextDex - initialPlayerStats.dex) * 4);

        const currentBaseCritRate = initialPlayerStats.critRate + ((currentLuk - initialPlayerStats.luk) * 0.8);
        const nextBaseCritRate = initialPlayerStats.critRate + ((nextLuk - initialPlayerStats.luk) * 0.8);

        // คำนวณ Final Stats ผ่าน Calculator ฟังก์ชันเหมือน Store
        const currentFinalAtk = calculateFinalAtk(currentBaseAtk, currentStr, equipment, monster.level);
        const nextFinalAtk = calculateFinalAtk(nextBaseAtk, nextStr, equipment, monster.level);
        const atkGain = Math.round(nextFinalAtk - currentFinalAtk);

        const currentFinalAspd = calculateASPDMultiplier(equipment, currentAgi) * currentBaseAspd;
        const nextFinalAspd = calculateASPDMultiplier(equipment, nextAgi) * nextBaseAspd;
        const aspdGain = nextFinalAspd - currentFinalAspd;

        const currentFinalCritDmg = currentBaseCritDmg * calculateCritDamageMultiplier(equipment, currentDex);
        const nextFinalCritDmg = nextBaseCritDmg * calculateCritDamageMultiplier(equipment, nextDex);
        const critDmgGain = Math.round(nextFinalCritDmg - currentFinalCritDmg);

        const currentFinalCritRate = Math.min(80, calculateCritRateBonus(equipment) + currentBaseCritRate);
        const nextFinalCritRate = Math.min(80, calculateCritRateBonus(equipment) + nextBaseCritRate);
        const critRateGain = nextFinalCritRate - currentFinalCritRate;

        const hpGain = Math.round(statGain * 15); // HP คงที่ 15 ต่อ STR

        const StatRow = ({ label, value, colorClass }: any) => (
            <div className="flex justify-between items-center w-full mb-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{label}</span>
                <span className={`text-[11px] font-black ${colorClass}`}>{value}</span>
            </div>
        );

        switch (node.type) {
            case 'STR':
                return (
                    <div className="w-full">
                        <StatRow label="STR" value={`+${statGain}`} colorClass="text-slate-600" />
                        <StatRow label="ATK" value={`+${atkGain}`} colorClass="text-rose-500" />
                        <StatRow label="HP" value={`+${hpGain}`} colorClass="text-emerald-500" />
                    </div>
                );
            case 'AGI':
                return (
                    <div className="w-full">
                        <StatRow label="AGI" value={`+${statGain}`} colorClass="text-slate-600" />
                        <StatRow label="SPD" value={`+${aspdGain.toFixed(2)}`} colorClass="text-amber-500" />
                    </div>
                );
            case 'DEX':
                return (
                    <div className="w-full">
                        <StatRow label="DEX" value={`+${statGain}`} colorClass="text-slate-600" />
                        <StatRow label="CDMG" value={`+${critDmgGain}%`} colorClass="text-sky-500" />
                    </div>
                );
            case 'LUK':
                return (
                    <div className="w-full">
                        <StatRow label="LUK" value={`+${statGain}`} colorClass="text-slate-600" />
                        <StatRow label="CRAT" value={`+${critRateGain.toFixed(1)}%`} colorClass="text-emerald-500" />
                    </div>
                );
            default: return null;
        }
    };

    const getNextCost = (node: any) => {
        const currentLevel = node.level || 0;
        return Math.round(node.cost * Math.pow(1.6, currentLevel));
    };

    return (
        <div className="h-full overflow-y-auto no-scrollbar p-4 pb-40">
            <div className="grid grid-cols-2 gap-3 max-w-[420px] mx-auto">
                {mainNodeIds.map((id) => {
                    const node = nodes[id];
                    const cost = getNextCost(node);
                    const canAfford = player.essence >= cost;
                    const themeColor = { STR: 'rose', AGI: 'amber', DEX: 'sky', LUK: 'emerald' }[node.type as 'STR' | 'AGI' | 'DEX' | 'LUK'] || 'slate';



                    return (
                        <div
                            key={id}
                            onClick={() => canAfford && unlockNode(id)}
                            className={`flex flex-col bg-white rounded-2xl p-3 border-2 transition-all active:scale-95 cursor-pointer shadow-sm ${canAfford ? `border-${themeColor}-100` : 'border-transparent opacity-80'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col">
                                    <span className={`text-[10px] font-black text-${themeColor}-600 uppercase italic`}>{node.name}</span>
                                    <span className="text-[7px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{node.type}</span>
                                </div>
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg bg-${themeColor}-50 text-${themeColor}-600`}>L.{node.level}</span>
                            </div>

                            <div className={`bg-${themeColor}-50/30 rounded-xl p-2 mb-3 border border-${themeColor}-50`}>
                                {getDetailedGainLabel(node)}
                            </div>

                            <div className={`w-full py-2.5 rounded-xl text-center transition-all ${canAfford ? `bg-${themeColor}-500 text-white shadow-lg` : 'bg-slate-100 text-slate-400'
                                }`}>
                                <span className="text-xs font-black tracking-tight">{formatNumber(cost)} <span className="text-[8px]">MANA</span></span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}