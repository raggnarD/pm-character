import { SpriteStyle } from '../types/skills';

// Theme configurations for each sprite style
export const themes = {
    '8bit': {
        name: 'Vintage',
        fontFamily: 'font-pixel',
        colors: {
            background: '#454545',
            border: '#ffd700',
            text: '#ffd700',
            accent: '#ffd700',
            chartPrimary: '#ffd700',
            chartSecondary: '#ffed4e',
            chartTertiary: '#ffb700',
        }
    },
    'ff7': {
        name: 'Classic',
        fontFamily: 'font-ff7',
        colors: {
            background: '#454545',
            backgroundLight: '#505050',
            border: '#ffd700',
            text: '#ffd700',
            textAlt: '#ffed4e',
            accent: '#ffd700',
            chartPrimary: '#ffd700',
            chartSecondary: '#ffed4e',
            chartTertiary: '#ffb700',
        }
    },
    'ff7-rebirth': {
        name: 'Modern',
        fontFamily: 'font-rebirth',
        colors: {
            background: '#454545',
            backgroundOverlay: 'rgba(58, 58, 58, 0.9)',
            border: '#ffd700',
            text: '#ffd700',
            textHighlight: '#ffed4e',
            accent: '#ffd700',
            chartPrimary: '#ffd700',
            chartSecondary: '#ffed4e',
            chartTertiary: '#ffb700',
        }
    }
};

export type ThemeConfig = typeof themes[SpriteStyle];
