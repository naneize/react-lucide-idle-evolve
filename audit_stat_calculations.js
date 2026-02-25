// 🔍 AUDIT SCRIPT: ตรวจสอบความถูกต้องของการคำนวณ Stat
// จำลองการคำนวณจากเลเวล 10 ไป 11 ของ STR node

// ค่าคงที่จาก initialState
const initialPlayerStats = {
    str: 0,
    agi: 0,
    dex: 0,
    luk: 0,
    atk: 5,
    attackSpeed: 1.2,
    critRate: 10,
    critDamage: 150
};

const strNode = {
    id: "str_1",
    name: "Enhanced Muscle",
    type: 'STR',
    value: 2,  // ค่าจริงจาก initialState
    cost: 10,
    level: 10, // สมมติว่าอัปถึงเลเวล 10
    isUnlocked: true
};

const equipment = {
    void_blade: { level: 5, id: 'void_blade', name: 'Void Blade', description: '' },
    aeon_clock: { level: 3, id: 'aeon_clock', name: 'Aeon Clock', description: '' },
    essence_ring: { level: 2, id: 'essence_ring', name: 'Essence Ring', description: '' },
    wind_bow: { level: 4, id: 'wind_bow', name: 'Wind Bow', description: '' },
    hawkeye_eye: { level: 3, id: 'hawkeye_eye', name: 'Hawkeye Eye', description: '' },
    dragon_fang: { level: 2, id: 'dragon_fang', name: 'Dragon Fang', description: '' }
};

// คำนวณค่าปัจจุบันของ player (สมมติว่ามีจากการอัป STR 10 เลเวล)
const currentStr = initialPlayerStats.str + (strNode.value * Math.pow(10, 1.3));
console.log(`📊 Current STR: ${currentStr.toFixed(2)}`);

// 🧮 STAT TAB CALCULATION (UI Prediction)
console.log('\n=== STAT TAB CALCULATION (UI Prediction) ===');

const currentBonus = strNode.value * Math.pow(10, 1.3);
const nextBonus = strNode.value * Math.pow(11, 1.3);
const statGain = Math.round(nextBonus - currentBonus);

console.log(`Current Bonus: ${currentBonus.toFixed(2)}`);
console.log(`Next Bonus: ${nextBonus.toFixed(2)}`);
console.log(`Stat Gain (STR): ${statGain}`);

const nextStr = currentStr + statGain;

// Base Stats calculation
const currentBaseAtk = initialPlayerStats.atk + ((currentStr - initialPlayerStats.str) * 2.5);
const nextBaseAtk = initialPlayerStats.atk + ((nextStr - initialPlayerStats.str) * 2.5);

console.log(`Current Base ATK: ${currentBaseAtk.toFixed(2)}`);
console.log(`Next Base ATK: ${nextBaseAtk.toFixed(2)}`);

// Calculator Functions (สมมติว่ามีฟังก์ชันเหมือนจริง)
const calculateFinalAtk = (baseAtk, playerStr, equipment) => {
    const swordLevel = equipment.void_blade?.level || 0;
    const swordMultiplier = 1 + (swordLevel * 0.10);
    const milestoneBonus = 1 + (Math.floor(playerStr / 10) * 0.05);
    return Math.round(baseAtk * swordMultiplier * milestoneBonus);
};

const currentFinalAtk = calculateFinalAtk(currentBaseAtk, currentStr, equipment);
const nextFinalAtk = calculateFinalAtk(nextBaseAtk, nextStr, equipment);
const atkGain = Math.round(nextFinalAtk - currentFinalAtk);

console.log(`Current Final ATK: ${currentFinalAtk}`);
console.log(`Next Final ATK: ${nextFinalAtk}`);
console.log(`ATK Gain (UI Prediction): ${atkGain}`);

// 🏪 STORE CALCULATION (Actual Result)
console.log('\n=== STORE CALCULATION (Actual Result) ===');

// จำลอง unlockNode logic จาก Store
const updatedNodes = {
    "str_1": { ...strNode, level: 11 }
};

const bonus = Object.values(updatedNodes).reduce((acc, n) => {
    const lvl = n.level || 0;
    if (lvl === 0) return acc;
    const scalingValue = n.value * Math.pow(lvl, 1.3);
    
    if (n.type === 'STR') acc.str += scalingValue;
    return acc;
}, { str: 0, agi: 0, dex: 0, luk: 0 });

console.log(`Store Bonus STR: ${bonus.str.toFixed(2)}`);

const storeCurrentStr = initialPlayerStats.str + bonus.str;
const storeBaseAtk = initialPlayerStats.atk + (bonus.str * 2.5);
const storeFinalAtk = calculateFinalAtk(storeBaseAtk, storeCurrentStr, equipment);

console.log(`Store Current STR: ${storeCurrentStr.toFixed(2)}`);
console.log(`Store Base ATK: ${storeBaseAtk.toFixed(2)}`);
console.log(`Store Final ATK: ${storeFinalAtk}`);

// 🎯 COMPARISON
console.log('\n=== COMPARISON ===');
console.log(`UI Predicted STR Gain: ${statGain}`);
console.log(`Store Actual STR Gain: ${bonus.str.toFixed(2)}`);
console.log(`UI Predicted ATK Gain: ${atkGain}`);
console.log(`Store Actual ATK: ${storeFinalAtk}`);
console.log(`Difference: ${Math.abs(atkGain - (storeFinalAtk - currentFinalAtk))}`);

// 🔍 MILESTONE CHECK
console.log('\n=== MILESTONE CHECK ===');
console.log(`Current STR: ${currentStr} -> Milestone: ${Math.floor(currentStr / 10)} * 5% = ${Math.floor(currentStr / 10) * 0.05}`);
console.log(`Next STR: ${nextStr} -> Milestone: ${Math.floor(nextStr / 10)} * 5% = ${Math.floor(nextStr / 10) * 0.05}`);
