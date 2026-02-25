// src/data/origins.ts
export interface Origin {
  id: string;
  name: string;
  icon: string;
  description: string;
  baseStats: {
    str: number;
    agi: number;
    int: number;
    essenceMultiplier: number; // โบนัสการหาแต้ม
  };
}

export const origins: Origin[] = [
  {
    id: 'beast',
    name: 'Wild Beast',
    icon: '🐺',
    description: 'เน้นพละกำลังทางกายภาพ (STR+5, Multiplier x1.0)',
    baseStats: { str: 15, agi: 10, int: 5, essenceMultiplier: 1.0 }
  },
  {
    id: 'wraith',
    name: 'Shadow Wraith',
    icon: '👻',
    description: 'เน้นความรวดเร็วและการหลบหลีก (AGI+5, Multiplier x1.2)',
    baseStats: { str: 5, agi: 15, int: 10, essenceMultiplier: 1.2 }
  },
  {
    id: 'spirit',
    name: 'Ancient Spirit',
    icon: '🔮',
    description: 'เน้นพลังจิตและการวิวัฒนาการ (INT+5, Multiplier x1.5)',
    baseStats: { str: 5, agi: 5, int: 20, essenceMultiplier: 1.5 }
  }
];