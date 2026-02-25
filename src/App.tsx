import { useState } from 'react'
import { useGameStore } from './store/useGameStore'
import { BattleView } from './components/game/BattleView'
import { EvolutionView } from './components/game/evolution/EvolutionView'
import { PassiveTab } from './components/PassiveTab'
import {
  Play, Pause, Sword, Shield, Sparkles, Compass, Star
} from 'lucide-react'

function App() {
  const [activeTab, setActiveTab] = useState<'battle' | 'evolution' | 'passives'>('battle')

  const {
    player, nodes, battleLog,
    isGameRunning, startGame, stopGame, unlockNode, soulShards, equipment, buyEquipment
  } = useGameStore()

  const manaMult = (equipment.essence_ring.level * 5);

  return (
    /** 🌍 Outer Wrapper: พื้นหลังภายนอก */
    <div className="h-[100dvh] bg-[#BAE6FD] flex justify-center overflow-hidden selection:bg-sky-500/30">

      {/* 📱 Mobile Frame: สีฟ้าท้องฟ้าอ่อนนุ่มนวล (#E0F2FE) */}
      <div className="w-full max-w-[480px] h-full bg-[#E0F2FE] text-slate-700 font-sans flex flex-col relative shadow-[0_20px_100px_rgba(0,100,200,0.15)] border-x border-sky-100">

        {/* 🔝 Global Header */}
        <header className="bg-white/30 backdrop-blur-xl border-b border-sky-200/50 p-5 flex justify-between items-center z-30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-sky-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200">
              <Compass size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800 italic leading-none">FANTASY_EVO</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isGameRunning ? 'bg-emerald-500 animate-pulse' : 'bg-sky-400/50'}`} />
                <p className="text-[9px] font-black text-sky-600 tracking-widest uppercase">{isGameRunning ? 'Exploring' : 'Standby'}</p>
              </div>
            </div>
          </div>

          {/* 💰 Currency Group: แสดงทั้ง Mana และ Shards */}
          <div className="flex flex-col gap-1.5">

            {/* Essence Counter (Mana) */}
            <div className="bg-sky-50/50 px-3 py-1.5 rounded-xl border border-sky-100/50 text-right backdrop-blur-sm flex items-center gap-3 justify-end">
              <div className="flex flex-col items-end">
                <p className="text-[7px] font-black text-sky-500 uppercase tracking-tighter leading-none mb-1">
                  Stored Mana
                </p>
                <div className="flex items-baseline gap-1.5">
                  <p className="text-sm font-black text-slate-700 leading-none">
                    {Math.floor(player.essence).toLocaleString()}
                  </p>

                  {/* ✅ โชว์โบนัสถ้าเลเวลแหวนมากกว่า 0 */}
                  {manaMult > 0 && (
                    <span className="text-[9px] font-black text-emerald-500 animate-pulse">
                      +{manaMult}%
                    </span>
                  )}
                </div>
              </div>
              <Sparkles size={14} className="text-amber-500 shrink-0" />
            </div>

            {/* ✨ Soul Shard Counter (New!) */}
            <div className="bg-indigo-50/50 px-3 py-1.5 rounded-xl border border-indigo-100/50 text-right backdrop-blur-sm flex items-center gap-3 justify-end">
              <div className="flex flex-col items-end">
                <p className="text-[7px] font-black text-indigo-500 uppercase tracking-tighter leading-none mb-1">Soul Shards</p>
                <p className="text-sm font-black text-indigo-900 leading-none">
                  {soulShards.toLocaleString()}
                </p>
              </div>
              {/* ใช้ Emoji หรือ Icon ที่ดูพรีเมียม */}
              <span className="text-xs shrink-0">💎</span>
            </div>

          </div>
        </header>

        {/* 🕹️ Content Switcher: สลับหน้าจอระหว่าง Adventure, Awaken และ Passives */}
        <main className="flex-1 overflow-y-auto no-scrollbar pb-32">
          {activeTab === 'battle' ? (
            <BattleView player={player} battleLog={battleLog} />
          ) : activeTab === 'evolution' ? (
            <EvolutionView
              nodes={nodes}
              player={player}
              unlockNode={unlockNode}
              // 💎 เพิ่ม 3 บรรทัดนี้เข้าไปครับ
              soulShards={soulShards}
              equipment={equipment}
              buyEquipment={buyEquipment}
            />
          ) : (
            <PassiveTab />
          )}
        </main>

        {/* ⚓ Bottom Navigation: ปรับใหม่ให้เตี้ยลงและไม่บังหน้าจอ */}
        <nav className="absolute bottom-4 left-4 right-4 bg-white/60 backdrop-blur-2xl border border-sky-100/50 rounded-[2rem] px-3 py-3 flex justify-around items-center z-50 shadow-lg">

          <NavButton
            active={activeTab === 'battle'}
            onClick={() => setActiveTab('battle')}
            icon={<Sword size={20} />}
            label="Adventure"
          />

          {/* 🔘 Play/Pause Button */}
          <div className="relative flex justify-center items-center">
            <button
              onClick={isGameRunning ? stopGame : startGame}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 border-4 border-[#E0F2FE] ${isGameRunning ? 'bg-rose-400' : 'bg-sky-500'
                }`}
            >
              {isGameRunning ?
                <Pause fill="white" size={20} className="text-white" /> :
                <Play fill="white" size={20} className="text-white ml-1" />
              }
            </button>
          </div>

          <NavButton
            active={activeTab === 'evolution'}
            onClick={() => setActiveTab('evolution')}
            icon={<Shield size={20} />}
            label="Awaken"
          />

          {/* 🌟 Passives Tab Button - Integrated into bottom nav */}
          <NavButton
            active={activeTab === 'passives'}
            onClick={() => setActiveTab('passives')}
            icon={<Star size={20} />}
            label="Passives"
          />
        </nav>
      </div>
    </div>
  )
}

/** 🛠️ NavButton Component: เวอร์ชันปรับจูนขนาดให้เข้ากับดีไซน์ใหม่ */
function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 transition-all flex-1 py-1 ${active ? 'text-sky-600' : 'text-sky-400/50'
        }`}
    >
      {/* ส่วนไอคอน: ปรับ scale ให้เล็กลงนิดนึงเวลา active จะได้ไม่ไปเบียดขอบ */}
      <div className={`transition-all duration-300 ${active ? 'scale-105 -translate-y-0.5' : 'scale-100'}`}>
        {icon}
      </div>

      {/* ส่วนข้อความ: ใช้ขนาดเล็กพิเศษเพื่อความกริบ */}
      <span className="text-[8px] font-black uppercase tracking-[0.15em] leading-none">
        {label}
      </span>

      {/* จุดบอกสถานะ: ปรับให้เล็กลงและอยู่ชิดขึ้น */}
      {active && (
        <div className="w-1 h-1 bg-sky-500 rounded-full mt-0.5 animate-in zoom-in duration-300" />
      )}
    </button>
  )
}

export default App;