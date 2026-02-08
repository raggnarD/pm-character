import { SpriteStyle } from '../types/skills';

// Theme configurations for each sprite style
export const themes = {
    '8bit': {
        name: '8-bit',
        fontFamily: 'font-pixel',
        colors: {
            background: '#1a1a3e',
            border: '#4a9eff',
            text: '#ffffff',
            accent: '#ffd700',
            chartPrimary: '#00ffff',
            chartSecondary: '#00ff00',
            chartTertiary: '#ffff99',
        }
    },
    'ff7': {
        name: 'FF7',
        fontFamily: 'font-ff7',
        colors: {
            background: '#1a2a5e',
            backgroundLight: '#2a3a7e',
            border: '#ffd700',
            text: '#00ffff',
            textAlt: '#88ffff',
            accent: '#00ff88',
            chartPrimary: '#00ffff',
            chartSecondary: '#00ff88',
            chartTertiary: '#ff99cc',
        }
    },
    'ff7-rebirth': {
        name: 'FF7 Rebirth',
        fontFamily: 'font-rebirth',
        colors: {
            background: '#1a2433',
            backgroundOverlay: 'rgba(26, 36, 51, 0.85)',
            border: '#00ccdd',
            text: '#ffffff',
            textHighlight: '#88ddff',
            accent: '#00ccdd',
            chartPrimary: '#00ccdd',
            chartSecondary: '#88ddff',
            chartTertiary: '#ffffff',
        }
    }
};

export type ThemeConfig = typeof themes[SpriteStyle];
