import React from 'react';
import { SpriteStyle } from '../../types/skills';
import { motion } from 'framer-motion';

interface SpriteViewProps {
    activeStyle: SpriteStyle;
}

const SpriteView: React.FC<SpriteViewProps> = ({ activeStyle }) => {
    // Placeholder content until sprites are provided
    const placeholderText = {
        '8bit': '8-bit Sprite',
        'ff7': 'FF7 Sprite',
        'ff7-rebirth': 'FF7 Rebirth Sprite'
    };

    return (
        <motion.div
            key={activeStyle}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center w-full h-64 md:h-96 rounded-lg border-4 border-[var(--color-border)] bg-[var(--color-background)] p-8"
        >
            <div className="text-center">
                <div className="text-4xl md:text-6xl mb-4">👤</div>
                <p className="text-[var(--color-text)] text-sm md:text-base">
                    {placeholderText[activeStyle]}
                </p>
                <p className="text-[var(--color-text)] opacity-60 text-xs mt-2">
                    Coming Soon
                </p>
            </div>
        </motion.div>
    );
};

export default SpriteView;
