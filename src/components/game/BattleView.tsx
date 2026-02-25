import { Activity, Zap, Shield, Target, Flame } from 'lucide-react'
import { useGameStore } from '../../store/useGameStore'
import { MonsterView } from './MonsterView'
import type { CharacterStats } from '../../types/game'
import {
    calculateFinalAtk,
    calculateASPDMultiplier,
    calculateCritDamageMultiplier,
    calculateCritRateBonus
} from '../../utils/gameCalculators'
import { initialPlayerStats } from '../../data/initialState'

interface BattleViewProps {
    player: CharacterStats;
    battleLog: string[];
}

export function BattleView({ player, battleLog }: BattleViewProps) {
    const { equipment, monster } = useGameStore();

    // 🔍 คำนวณค่าพลังพื้นฐานจากไอเทมโดยใช้ Calculator Functions
    const baseAtk = initialPlayerStats.atk + ((player.str - initialPlayerStats.str) * 2.5);
    const baseAspd = initialPlayerStats.attackSpeed + ((player.agi - initialPlayerStats.agi) * 0.04);
    const baseCritDmg = 150 + ((player.dex - initialPlayerStats.dex) * 4);
    const baseCritRate = initialPlayerStats.critRate + ((player.luk - initialPlayerStats.luk) * 0.8);

    // คำนวณค่าพลังรวมจาก Calculator (เหมือนใน Store)
    const finalAtk = calculateFinalAtk(baseAtk, player.str, equipment, monster.level);
    const finalAspd = calculateASPDMultiplier(equipment, player.agi) * baseAspd;
    const finalCritDmg = baseCritDmg * calculateCritDamageMultiplier(equipment, player.dex);
    const finalCritRate = Math.min(80, calculateCritRateBonus(equipment) + baseCritRate);

    // คำนวณ Bonus % จาก Equipment แท้งจริง (รวม Milestone)
    const bonus = {
        atk: Math.round(((finalAtk - baseAtk) / baseAtk) * 100),
        aspd: Math.round(((finalAspd - baseAspd) / baseAspd) * 100),
        crat: Math.round(finalCritRate - baseCritRate),
        cdmg: Math.round(((finalCritDmg - baseCritDmg) / baseCritDmg) * 100)
    };

    return (
        <div className="p-3 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-40 bg-[#E0F2FE]">

            {/* 👾 Monster Stage */}
            <div className="bg-[#BAE6FD]/50 backdrop-blur-md rounded-[2.5rem] p-2 border-4 border-[#BAE6FD] shadow-xl relative overflow-hidden">
                <MonsterView />
            </div>

            {/* 🛡️ Player Status Card */}
            <div className="bg-[#BAE0FF]/60 backdrop-blur-md border-2 border-[#BAE0FF] rounded-[2.5rem] p-5 space-y-4 shadow-lg">

                {/* 1. HP Section */}
                <div className="space-y-1.5 px-1">
                    <div className="flex justify-between items-center text-[10px] font-black text-blue-500/70 uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <Activity size={12} className="text-emerald-500" />
                            <span>Vital Energy</span>
                        </div>
                        <span className="text-emerald-600 font-mono">
                            {Math.floor(player.hp).toLocaleString()} / {Math.floor(player.maxHp).toLocaleString()}
                        </span>
                    </div>
                    <div className="h-3 bg-[#D1E9FF] rounded-full overflow-hidden border border-[#E0F2FE]">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 transition-all duration-500"
                            style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                        />
                    </div>
                </div>

                {/* 2. Stats Grid Section: โชว์โบนัสจากไอเทมใหม่ครบทุกสาย */}
                <div className="grid grid-cols-2 gap-3">
                    <StatItem
                        icon={<Shield size={14} className="text-orange-400" />}
                        label="Power"
                        value={Math.round(player.atk)}
                        bonus={bonus.atk > 0 ? `(+${bonus.atk}%)` : undefined}
                    />
                    <StatItem
                        icon={<Zap size={14} className="text-emerald-400" />}
                        label="Swiftness"
                        value={`${player.attackSpeed.toFixed(1)}x`}
                        bonus={bonus.aspd > 0 ? `(+${bonus.aspd}%)` : undefined}
                    />
                    <StatItem
                        icon={<Target size={14} className="text-sky-500" />}
                        label="Focus"
                        value={`${player.critRate.toFixed(1)}%`}
                        bonus={bonus.crat > 0 ? `(+${bonus.crat}%)` : undefined}
                    />
                    <StatItem
                        icon={<Flame size={14} className="text-amber-500" />}
                        label="Burst"
                        value={`${Math.round(player.critDamage)}%`}
                        bonus={bonus.cdmg > 0 ? `(+${bonus.cdmg}%)` : undefined}
                    />
                </div>

                {/* 🛡️ Equipped Relics (Mini-view) - อัปเกรดให้โชว์ไอคอนไอเทมใหม่ */}
                <div className="flex justify-center flex-wrap gap-2 pt-1">
                    {Object.values(equipment).map((item: any) => item.level > 0 && (
                        <div key={item.id} className="flex items-center gap-1 bg-white/40 px-2 py-0.5 rounded-full border border-white/50 shadow-sm">
                            <span className="text-[8px]">
                                {item.id === 'void_blade' ? '⚔️' :
                                    item.id === 'aeon_clock' ? '⏳' :
                                        item.id === 'essence_ring' ? '💍' :
                                            item.id === 'wind_bow' ? '🏹' :
                                                item.id === 'hawkeye_eye' ? '🎯' : '🗡️'}
                            </span>
                            <span className="text-[7px] font-black text-slate-500">Lv.{item.level}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 📜 Battle Chronicles */}
            <div className="bg-[#BAE6FD]/40 backdrop-blur-sm rounded-[2.5rem] p-5 font-medium text-[10px] h-48 overflow-y-auto border-2 border-[#BAE6FD] flex flex-col-reverse no-scrollbar shadow-inner">
                {battleLog.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-blue-400/50 italic tracking-[0.2em] text-[8px]">Chronicle Idle...</div>
                ) : (
                    battleLog.map((log: string, i: number) => (
                        <div key={i} className={`mb-1.5 border-l-4 pl-3 py-1 rounded-r-lg ${log.includes('✨') ? 'border-amber-400 text-amber-700 bg-amber-100/40' :
                            log.includes('💥') ? 'border-rose-400 text-rose-600 bg-rose-100/40 font-black' :
                                log.includes('💎') ? 'border-sky-400 text-sky-600 bg-sky-100/40' :
                                    'border-blue-200 text-blue-700/60'
                            }`}>
                            {log}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

function StatItem({ icon, label, value, bonus }: { icon: React.ReactNode, label: string, value: string | number, bonus?: string }) {
    return (
        <div className="bg-[#D1E9FF]/70 p-3 rounded-2xl border border-[#E0F2FE] flex items-center gap-3 relative overflow-hidden group">
            <div className="shrink-0 transition-transform group-hover:scale-110">{icon}</div>
            <div className="flex flex-col">
                <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">{label}</p>
                <div className="flex items-baseline gap-1">
                    <p className="text-xs font-black text-slate-700 leading-none tracking-tight">{value}</p>
                    {bonus && (
                        <span className="text-[8px] font-black text-emerald-500 animate-pulse">
                            {bonus}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}