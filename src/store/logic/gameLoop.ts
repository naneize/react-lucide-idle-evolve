// src/store/logic/gameLoop.ts
export const runGameLoop = (get: any, set: any) => {
    const state = get();
    if (!state.isGameRunning) return;

    // 🔄 1. Tick Update (รันทุก 100ms)
    set((prev: any) => {
        // --- ระบบ Passive Income (จากค่า INT) ---
        // ยิ่งฉลาด ยิ่งได้ Essence ไหลเข้าตัวเรื่อยๆ (เหมือน Cell to Singularity)
        const passiveEssenceGain = (prev.player.int * 0.05);

        // --- ระบบความเร็วการโจมตี (จากค่า AGI) ---
        // อัปเดต Timer ตาม Attack Speed
        const nextPlayerAttackTimer = prev.playerAttackTimer + (prev.player.attackSpeed / 10);

        // --- ระบบ Regen เลือดและมานา (อิงตามเวลา) ---
        let nextRegenTimer = prev.regenTimer + 0.1;
        let updatedPlayer = { ...prev.player };

        if (nextRegenTimer >= 1.0) { // ทุกๆ 1 วินาที
            nextRegenTimer = 0;
            // Regen เลือดพื้นฐาน
            updatedPlayer.hp = Math.min(prev.player.maxHp, prev.player.hp + 2);
            updatedPlayer.mp = Math.min(prev.player.maxMp, prev.player.mp + 1);
        }

        return {
            ...prev,
            player: {
                ...updatedPlayer,
                essence: prev.player.essence + passiveEssenceGain
            },
            playerAttackTimer: nextPlayerAttackTimer,
            regenTimer: nextRegenTimer,
            totalEssenceEarned: prev.totalEssenceEarned + passiveEssenceGain
        };
    });

    // ⚔️ 2. Execute Attack (เมื่อ Timer เต็ม 1.0)
    // ระบบจะสั่งโจมตีมอนสเตอร์อัตโนมัติ
    if (get().playerAttackTimer >= 1.0) {
        set((s: any) => ({ playerAttackTimer: s.playerAttackTimer - 1.0 }));
        state.playerAttack(); // เรียกฟังก์ชันที่เราแก้ไว้ใน combatActions
    }

    // 📈 3. เช็คเงื่อนไขพิเศษ (เช่น ถ้า Essence ถึงจุดที่กำหนด อาจจะแจ้งเตือน)
    // (สามารถเพิ่มเงื่อนไขการวิวัฒนาการขั้นต่อไปได้ที่นี่)
};