# React + TypeScript + Medieval Quest - Incremental RPG

A mobile-first responsive Incremental RPG built with React, TypeScript, Tailwind CSS 4.0, and Zustand. Features a medieval fantasy theme with parchment backgrounds, gold borders, and immersive gameplay mechanics.

## 🎮 Features

### Core Gameplay
- **Incremental Battle System**: Auto-attack and manual attack mechanics
- **Stat System**: STR, AGI, VIT, DEX stats using Decimal.js for precision
- **Stamina System**: Auto-regenerating stamina for special attacks
- **Experience & Leveling**: Progressive character development
- **Monster Progression**: Dynamic monster spawning with increasing difficulty

### Visual Design
- **Medieval Theme**: Parchment backgrounds with gold borders
- **Mobile-First**: Bottom navigation on mobile, card layout on desktop
- **Micro-interactions**: Framer Motion animations for button presses and floating numbers
- **Responsive Design**: Seamless experience across all devices

### Skill Tree System
- **Diamond-Shaped Nodes**: Visual skill tree with ancient map aesthetics
- **Progressive Unlocking**: Requirements-based skill acquisition
- **Stat Bonuses**: Each skill provides meaningful stat improvements
- **Ultimate Abilities**: Special powers for advanced builds

### Technical Features
- **Decimal.js Integration**: Precise mathematical calculations for large numbers
- **Zustand State Management**: Efficient and scalable state handling
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS 4.0**: Modern utility-first styling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
