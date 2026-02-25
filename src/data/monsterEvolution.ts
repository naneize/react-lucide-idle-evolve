// src/data/monsterEvolution.ts
export const getMonsterEvolution = (level: number) => {
    // 💧 ร่าง 1: เลเวล 1-10 (กำลังหัดเดิน)
    if (level <= 10) return { stage: 1, name: "Primordial Droplet", color: "#38bdf8" };

    // 💎 ร่าง 2: เลเวล 11-30 (เริ่มมีรูปร่าง) -> เลเวล 25 จะตกที่ร่างนี้!
    if (level <= 30) return { stage: 2, name: "Fragmented Sentinel", color: "#818cf8" };

    // 🛡️ ร่าง 3: เลเวล 31-70 (แข็งแกร่ง)
    if (level <= 70) return { stage: 3, name: "Crystal Juggernaut", color: "#fb7185" };

    // 🌀 ร่าง 4: เลเวล 71-150 (ข้ามมิติ)
    if (level <= 150) return { stage: 4, name: "Dimensional Guardian", color: "#34d399" };

    // 👑 ร่าง 5: เลเวล 151+ (จุดสูงสุด)
    return { stage: 5, name: "The Singularity", color: "#facc15" };
};