import { useGameStore } from '../../store/useGameStore'
import { getMonsterEvolution } from '../../data/monsterEvolution'
import { calculateManaPerHit, calculateManaOnKill } from '../../utils/gameCalculators'
import { formatNumber } from '../../utils/format';
import React, { useEffect, useRef } from 'react'

// ✅ กำหนด Type สำหรับตัวเลขดาเมจ
interface DamageNumber {
    id: number;
    value: number;
    isCrit: boolean;
    isManual: boolean;
    x: number;
    isMiss?: boolean;
}

export function MonsterView() {
    const {
        monster,
        player,
        equipment,
        passives,
        manualAttack,
        battleTimer,
        missTrigger,
        maxBattleTime
    } = useGameStore();

    const [damages, setDamages] = React.useState<DamageNumber[]>([]);
    const lastHpRef = useRef(monster.hp);

    useEffect(() => {
        // 1. เช็คว่าเป็นการตีวืด (Miss) หรือไม่ 
        const isMissedHit = monster.hp === lastHpRef.current && missTrigger > 0;

        if (monster.hp < lastHpRef.current || isMissedHit) {
            const damageDealt = Math.floor(lastHpRef.current - monster.hp);

            if (isMissedHit || (damageDealt > 0 && damageDealt < monster.maxHp)) {
                const id = Date.now() + Math.random();

                const isCritHit = !isMissedHit && damageDealt > player.atk * 1.6;
                const isManualHit = !isMissedHit && damageDealt > player.atk * 1.2 && damageDealt < player.atk * 1.6;

                const newDamage: DamageNumber = {
                    id,
                    value: damageDealt,
                    isCrit: isCritHit,
                    isManual: isManualHit,
                    isMiss: isMissedHit,
                    x: Math.random() * 80 - 40
                };

                setDamages(prev => [...prev.slice(-10), newDamage]);

                setTimeout(() => {
                    setDamages(prev => prev.filter(d => d.id !== id));
                }, 800);
            }
        }
        lastHpRef.current = monster.hp;
    }, [monster.hp, player.atk, monster.maxHp, missTrigger]);

    const evo = getMonsterEvolution(monster.level) || {
        stage: 1,
        name: "Primordial Droplet",
        color: "#38bdf8"
    };

    const hpPercentage = Math.max(0, (monster.hp / monster.maxHp) * 100);

    const getPassiveIcon = (type: string) => {
        switch (type) {
            case 'HARD_SKIN': return '🛡️';
            case 'DODGE': return '💨';
            case 'REFLECT': return '🪞';
            case 'REGEN': return '💖';
            default: return '✨';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-4 px-4 select-none relative">
            {/* 🏷️ ชื่อและเลเวลมอนสเตอร์ */}
            <div className="text-center mb-6 animate-in fade-in slide-in-from-top duration-700">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-slate-800 text-white text-[9px] font-black rounded-md tracking-tighter">
                        STAGE {evo.stage}
                    </span>
                    <span className="text-[10px] font-bold text-sky-600 uppercase tracking-[0.2em]">
                        Level {monster.level}
                    </span>
                </div>
                <h2 className="text-3xl font-black italic uppercase text-slate-800 tracking-tighter leading-none transition-all duration-500"
                    style={{ color: monster.hp <= 0 ? '#cbd5e1' : 'inherit' }}>
                    {evo.name}
                </h2>

                {monster.passive && monster.passive !== 'NONE' && (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500 rounded-full shadow-[0_0_15px_rgba(244,63,94,0.4)] animate-bounce-subtle">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                            {getPassiveIcon(monster.passive)} {monster.passive.replace('_', ' ')}
                        </span>
                    </div>
                )}
            </div>

            {/* ⏳ Battle Timer Section */}
            <div className="w-full max-w-[320px] mb-6 font-mono">
                {(() => {
                    const rawPercentage = maxBattleTime > 0 ? (battleTimer / maxBattleTime) * 100 : 0;
                    const displayPercentage = Math.min(100, Math.max(0, rawPercentage));

                    return (
                        <div className="flex flex-col gap-3">
                            {/* กรอบแสดงผลคู่: Digital Timer & Stability Amber Box */}
                            <div className="flex items-center justify-between gap-4">
                                {/* Digital Countdown (Left) */}
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-slate-500 uppercase tracking-[0.2em] mb-1">Time Remaining</span>
                                    <span className={`text-4xl font-black leading-none transition-all duration-300 ${battleTimer < 5 ? 'text-red-500 animate-pulse' : 'text-cyan-400'
                                        }`} style={{ textShadow: battleTimer < 5 ? '0 0 15px rgba(239, 68, 68, 0.5)' : 'none' }}>
                                        {Math.max(0, battleTimer).toFixed(1)}
                                        <span className="text-sm ml-1 opacity-50">s</span>
                                    </span>
                                </div>

                                {/* 🛡️ Stability Box (Amber Style - Right) */}
                                <div className="bg-amber-50/50 px-3 py-2 rounded-xl border border-amber-100/50 text-right backdrop-blur-sm flex items-center gap-3">
                                    <div className="flex flex-col items-end">
                                        <p className="text-[7px] font-black text-amber-500 uppercase tracking-tighter leading-none mb-1">
                                            Stability (AGI)
                                        </p>
                                        <p className={`text-lg font-black leading-none ${displayPercentage < 20 ? 'text-red-500' : 'text-slate-700'
                                            }`}>
                                            {displayPercentage.toFixed(0)}%
                                        </p>
                                    </div>
                                    <div className={`w-1.5 h-8 rounded-full bg-slate-200 relative overflow-hidden`}>
                                        <div
                                            className={`absolute bottom-0 w-full transition-all duration-500 ${displayPercentage < 20 ? 'bg-red-500' : 'bg-amber-500'
                                                }`}
                                            style={{ height: `${displayPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Critical Alert Message */}
                            {battleTimer < 5 && (
                                <div className="text-center animate-bounce">
                                    <span className="text-[9px] text-red-500 font-black uppercase tracking-[0.3em]">
                                        ⚠️ WARNING: SEQUENCE TERMINATING
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })()}
            </div>

            {/* ตัวมอนสเตอร์ (คลิกเพื่อโจมตี) */}
            <div
                onClick={() => manualAttack()}
                className="relative group cursor-pointer active:scale-95 transition-transform duration-75"
                style={{ touchAction: 'manipulation' }}
            >
                <div
                    className="absolute inset-0 rounded-full blur-[60px] opacity-40 animate-pulse transition-colors duration-1000"
                    style={{ backgroundColor: evo.color }}
                />

                <div
                    className="relative w-32 h-32 flex items-center justify-center transition-all duration-1000 ease-in-out"
                    style={{ transform: `scale(${1 + (evo.stage * 0.1)})` }}
                >
                    <div
                        className="w-32 h-32 rounded-[2.5rem] border-4 flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-2xl transition-all duration-500"
                        style={{
                            borderColor: evo.color,
                            boxShadow: `0 0 30px ${evo.color}44`
                        }}
                    >
                        <span className="text-6xl drop-shadow-md transition-all duration-500">
                            {evo.stage === 1 && '💧'}
                            {evo.stage === 2 && '💠'}
                            {evo.stage === 3 && '💎'}
                            {evo.stage === 4 && '🔱'}
                            {evo.stage >= 5 && '🌌'}
                        </span>
                    </div>
                </div>

                {/* 💥 ส่วนแสดงเลขดาเมจ */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    {damages.map(dmg => (
                        <div
                            key={dmg.id}
                            className={`absolute font-black animate-damage-up select-none transition-all
                                ${dmg.isMiss
                                    ? 'text-rose-400 text-2xl italic opacity-90 z-30'
                                    : dmg.isCrit
                                        ? 'text-amber-400 text-4xl z-20'
                                        : dmg.isManual
                                            ? 'text-sky-400 text-3xl z-10'
                                            : 'text-slate-200 text-3xl opacity-80'
                                }`}
                            style={{
                                left: `calc(50% + ${dmg.x}px)`,
                                top: '30%',
                                textShadow: dmg.isMiss ? 'none' : '2px 2px 0px rgba(0,0,0,0.8)'
                            }}
                        >
                            {dmg.isMiss ? <>💨 MISS</> : (
                                <>{dmg.isCrit && '💥'}{dmg.isManual && !dmg.isCrit && '✨'}{Math.floor(dmg.value)}</>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* 🩸 หลอดเลือด (HP Bar) */}
            <div className="mt-12 w-full max-w-[280px]">
                <div className="flex justify-between items-end mb-1 px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vitality</span>
                    <span className="text-xs font-black text-slate-700">
                        {Math.floor(monster.hp).toLocaleString()} / {monster.maxHp.toLocaleString()}
                    </span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden border border-white shadow-inner p-[1px]">
                    <div
                        className="h-full transition-all duration-500 ease-out rounded-full"
                        style={{
                            width: `${hpPercentage}%`,
                            backgroundColor: evo.color,
                            backgroundImage: `linear-gradient(90deg, ${evo.color}88, ${evo.color})`,
                            boxShadow: `0 0 10px ${evo.color}66`
                        }}
                    />
                </div>
            </div>

            {/* 💎 รางวัลมานา (Mana Rewards) */}
            <div className="mt-6 w-full max-w-[280px]">
                <div className="flex flex-row gap-2 justify-between">
                    <div className="flex-1 bg-gradient-to-r from-sky-400/20 to-sky-400/10 border border-sky-200 rounded-xl p-2.5 flex flex-col items-center justify-center">
                        <span className="text-[8px] font-black text-sky-500 uppercase tracking-widest mb-1">Per Hit</span>
                        <span className="text-sm font-black text-slate-700 leading-none">
                            {formatNumber(calculateManaPerHit(monster.level, equipment, player.luk, passives))}
                        </span>
                        <span className="text-[7px] text-slate-500 mt-0.5 opacity-50">MANA FLOW</span>
                    </div>

                    <div className="flex-1 bg-gradient-to-r from-amber-400/20 to-amber-400/10 border border-amber-200 rounded-xl p-2.5 flex flex-col items-center justify-center">
                        <span className="text-[8px] font-black text-amber-600 uppercase tracking-widest mb-1">On Kill</span>
                        <span className="text-sm font-black text-slate-700 leading-none">
                            {formatNumber(calculateManaOnKill(monster.level, equipment, player.luk, passives))}
                        </span>
                        <span className="text-[7px] text-slate-500 mt-0.5 opacity-50">CORE ESSENCE</span>
                    </div>
                </div>
            </div>
        </div>
    )
}