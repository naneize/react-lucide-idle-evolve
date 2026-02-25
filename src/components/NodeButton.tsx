import { Lock, Sword, Zap, Target, Sparkles } from 'lucide-react'

interface NodeButtonProps {
    node: any;
    currentEssence: number;
    isSelected: boolean;
    allNodes: any;
}

export function NodeButton({ node, currentEssence, isSelected, allNodes }: NodeButtonProps) {
    const isParentUnlocked = node.requiredNodes?.every((id: string) => allNodes[id]?.isUnlocked) ?? true;
    const isUnlocked = node.level > 0;

    // 🎯 1. ใช้สูตรคำนวณราคาแบบเดียวกับ StatTab และ Store (ใส่ Math.round)
    const currentCost = Math.round(node.cost * Math.pow(1.6, node.level || 0));
    const canAfford = currentEssence >= currentCost;

    const renderIcon = () => {
        const iconProps = {
            size: 42,
            className: `transition-all duration-500 ${isUnlocked ? 'opacity-80 scale-110' : 'opacity-20'}`
        };

        switch (node.type) {
            case 'STR': return <Sword {...iconProps} className={`${iconProps.className} text-rose-500`} />;
            case 'AGI': return <Zap {...iconProps} className={`${iconProps.className} text-amber-500`} />;
            case 'DEX': return <Target {...iconProps} className={`${iconProps.className} text-sky-500`} />;
            case 'LUK': return <Sparkles {...iconProps} className={`${iconProps.className} text-emerald-500`} />;
            default: return null;
        }
    };

    return (
        <div className={`
            aspect-square rounded-[2rem] border-2 flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden
            ${isUnlocked
                ? 'bg-white/60 border-white shadow-inner'
                : 'bg-slate-100/50 border-slate-200/50 opacity-60'
            }
            ${isSelected ? 'ring-4 ring-sky-400/30 border-sky-400 scale-105 z-10' : ''}
            ${canAfford && !isUnlocked ? 'cursor-pointer' : ''}
        `}>

            {/* 🔴 Locked Overlay */}
            {!isParentUnlocked && (
                <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[1px] z-20 flex items-center justify-center">
                    <Lock size={16} className="text-slate-400" />
                </div>
            )}

            {/* 🧬 Central Icon */}
            <div className="relative z-10 flex flex-col items-center pointer-events-none">
                {renderIcon()}

                {/* 📊 Level Badge: แสดงเป็นจุดเล็กๆ หรือเลขจางๆ เพื่อไม่ให้บังรูปหลัก */}
                <div className={`mt-2 px-2 py-0.5 rounded-full transition-colors ${canAfford ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                    <span className="text-[8px] font-black uppercase tracking-tighter">
                        {isUnlocked ? `Rank ${node.level}` : canAfford ? 'Ready' : 'Locked'}
                    </span>
                </div>
            </div>

            {/* ✨ Ready to Upgrade Effect: วงแหวนจะขึ้นต่อเมื่อเงินพอและราคาตรงกับ Store เป๊ะๆ */}
            {canAfford && isParentUnlocked && (
                <div className="absolute inset-0 border-[3px] border-sky-400/50 rounded-[2rem] animate-[ping_2s_infinite] opacity-20" />
            )}

            {/* 🌊 Glass Reflection */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/10 via-transparent to-white/5 pointer-events-none" />
        </div>
    );
}