import React from 'react';
import { SpriteStyle } from '../../types/skills';
import { motion } from 'framer-motion';

interface SpriteViewProps {
    activeStyle: SpriteStyle;
}

const SpriteView: React.FC<SpriteViewProps> = ({ activeStyle }) => {
    // Placeholder content for themes without sprites yet
    const placeholderText = {
        '8bit': 'Vintage Sprite',
        'ff7': 'Classic Sprite',
        'ff7-rebirth': 'Modern Sprite'
    };

    // Show GIF for Modern theme, placeholder for others
    const showModernSprite = activeStyle === 'ff7-rebirth';

    return (
        <motion.div
            key={activeStyle}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex items-start justify-start w-full h-full"
        >
            {showModernSprite ? (
                <img
                    src="sprites/ff7-rebirth/modern-sprite.gif"
                    alt="Modern Character Sprite"
                    className="h-full w-auto object-contain object-left"
                />
            ) : (
                <div className="text-center p-8">
                    <div className="text-4xl md:text-6xl mb-4">👤</div>
                    <p className="text-[var(--color-text)] text-sm md:text-base">
                        {placeholderText[activeStyle]}
                    </p>
                    <p className="text-[var(--color-text)] opacity-60 text-xs mt-2">
                        Coming Soon
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default SpriteView;
