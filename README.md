# PM Character Portfolio

An RPG-themed portfolio website showcasing Project Management skills through an interactive character interface.

## 🎮 Features

- **Three RPG Themes**: Switch between 8-bit, FF7, and FF7 Rebirth visual styles
- **Interactive Charts**: Radar chart for soft skills, horizontal bar chart for hard skills
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion powered transitions
- **Dynamic Theming**: Color palette changes based on selected sprite style

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📦 Deployment

Deploy to GitHub Pages:

```bash
npm run deploy
```

This will build the project and push to the `gh-pages` branch.

## 📝 Updating Content

### Adding Sprite Images

Place your sprite images/GIFs/videos in:
- `public/sprites/8bit/` - For 8-bit style sprites
- `public/sprites/ff7/` - For FF7 style sprites
- `public/sprites/ff7-rebirth/` - For FF7 Rebirth style sprites

Then update `src/components/CharacterPicker/SpriteView.tsx` to load the actual images.

### Updating Skill Values

Edit `src/data/skillsData.ts` and change the `value` fields (0-100) for each skill:

```typescript
{
  name: 'Communication',
  value: 85, // Change this value
  description: '...'
}
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Recharts** - Charts
- **Framer Motion** - Animations
- **React Icons** - Icons

## 📄 License

MIT
