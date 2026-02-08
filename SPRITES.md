# Adding Sprite Images

This guide explains how to add your character sprite images, GIFs, or videos to the portfolio.

## Directory Structure

Place your sprite files in the appropriate directories:

```
public/sprites/
├── 8bit/          # 8-bit style sprites
├── ff7/           # FF7 style sprites
└── ff7-rebirth/   # FF7 Rebirth style sprites
```

## Supported Formats

- **Images**: PNG, JPG, WebP, GIF
- **Videos**: MP4, WebM

## Recommended Sizes

- **8-bit**: 128x128 to 256x256 pixels (pixel art)
- **FF7**: 256x256 to 512x512 pixels
- **FF7 Rebirth**: 512x512 to 1024x1024 pixels (high resolution)

## Implementation Steps

### 1. Add Your Files

Copy your sprite files to the appropriate folders. For example:
- `public/sprites/8bit/character.gif`
- `public/sprites/ff7/character.png`
- `public/sprites/ff7-rebirth/character.mp4`

### 2. Update SpriteView Component

Edit `src/components/CharacterPicker/SpriteView.tsx`:

```typescript
const SpriteView: React.FC<SpriteViewProps> = ({ activeStyle }) => {
  // Define sprite paths
  const spritePaths = {
    '8bit': '/sprites/8bit/character.gif',
    'ff7': '/sprites/ff7/character.png',
    'ff7-rebirth': '/sprites/ff7-rebirth/character.mp4'
  };

  const isVideo = activeStyle === 'ff7-rebirth';

  return (
    <motion.div
      key={activeStyle}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center w-full h-64 md:h-96 rounded-lg border-4 border-[var(--color-border)] bg-[var(--color-background)] p-8"
    >
      {isVideo ? (
        <video
          src={spritePaths[activeStyle]}
          autoPlay
          loop
          muted
          className="max-w-full max-h-full object-contain"
        />
      ) : (
        <img
          src={spritePaths[activeStyle]}
          alt={`${activeStyle} sprite`}
          className="max-w-full max-h-full object-contain"
        />
      )}
    </motion.div>
  );
};
```

### 3. Test

Run the development server and switch between sprite styles to verify all sprites load correctly:

```bash
npm run dev
```

## Tips

- Use **GIFs** for animated 8-bit sprites
- Use **PNG** with transparency for FF7 sprites
- Use **MP4** for high-quality FF7 Rebirth animations
- Optimize file sizes for faster loading
- Test on mobile devices to ensure sprites display properly
