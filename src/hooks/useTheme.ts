import { useState, useEffect } from 'react';
import { SpriteStyle } from '../types/skills';
import { themes } from '../styles/themes';

export const useTheme = () => {
    const [activeTheme, setActiveTheme] = useState<SpriteStyle>('8bit');

    useEffect(() => {
        // Apply CSS variables to root element based on active theme
        const theme = themes[activeTheme];
        const root = document.documentElement;

        // Set CSS custom properties
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Set font family class
        root.className = theme.fontFamily;
    }, [activeTheme]);

    return {
        activeTheme,
        setActiveTheme,
        currentTheme: themes[activeTheme]
    };
};
