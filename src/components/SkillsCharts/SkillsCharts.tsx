import React from 'react';
import { SkillsData } from '../../types/skills';
import SoftSkillsSpider from './SoftSkillsSpider';
import HardSkillsBars from './HardSkillsBars';

interface SkillsChartsProps {
    skillsData: SkillsData;
}

const SkillsCharts: React.FC<SkillsChartsProps> = ({ skillsData }) => {
    return (
        <div className="w-full p-4 md:p-6 space-y-8">
            {/* Soft Skills Spider Chart */}
            <div className="bg-[var(--color-background)] bg-opacity-50 rounded-lg p-4 md:p-6 border-2 border-[var(--color-border)]">
                <SoftSkillsSpider skills={skillsData.softSkills} />
            </div>

            {/* Hard Skills Bar Chart */}
            <div className="bg-[var(--color-background)] bg-opacity-50 rounded-lg p-4 md:p-6 border-2 border-[var(--color-border)]">
                <HardSkillsBars skills={skillsData.hardSkills} />
            </div>
        </div>
    );
};

export default SkillsCharts;
