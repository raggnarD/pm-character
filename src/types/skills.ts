// Sprite style types
export type SpriteStyle = '8bit' | 'ff7' | 'ff7-rebirth';

// Skill interfaces
export interface SoftSkill {
    name: string;
    value: number; // 0-100
    description: string; // For tooltips
}

export interface HardSkill {
    name: string;
    value: number; // 0-100
    description: string; // For tooltips
}

export interface SkillsData {
    softSkills: SoftSkill[];
    hardSkills: HardSkill[];
}

// Theme colors interface
export interface ThemeColors {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
}
