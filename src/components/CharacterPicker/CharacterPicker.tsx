import React from 'react';
import { SpriteStyle } from '../../types/skills';
import SpriteView from './SpriteView';
import { themes } from '../../styles/themes';

interface CharacterPickerProps {
    activeStyle: SpriteStyle;
    onStyleChange: (style: SpriteStyle) => void;
}

const CharacterPicker: React.FC<CharacterPickerProps> = ({ activeStyle, onStyleChange }) => {
    const spriteStyles: SpriteStyle[] = ['8bit', 'ff7', 'ff7-rebirth'];

    return (
        <div className="w-full p-4 md:p-6">
            {/* Tab buttons */}
            <div className="flex gap-2 mb-6 justify-center md:justify-start">
                {spriteStyles.map((style) => (
                    <button
                        key={style}
                        onClick={() => onStyleChange(style)}
                        className={`
              px-4 py-2 rounded-lg font-semibold text-sm md:text-base
              transition-all duration-300
              border-2
              ${activeStyle === style
                                ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)] scale-105'
                                : 'bg-transparent text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:scale-105'
                            }
            `}
                    >
                        {themes[style].name}
                    </button>
                ))}
            </div>

            {/* Sprite display */}
            <SpriteView activeStyle={activeStyle} />
        </div>
    );
};

export default CharacterPicker;
