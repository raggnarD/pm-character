import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, ResponsiveContainer } from 'recharts';
import { SoftSkill } from '../../types/skills';
import { motion } from 'framer-motion';

interface SoftSkillsSpiderProps {
    skills: SoftSkill[];
}

const SoftSkillsSpider: React.FC<SoftSkillsSpiderProps> = ({ skills }) => {
    // Format data for Recharts
    const chartData = skills.map(skill => ({
        skill: skill.name,
        value: skill.value,
        fullMark: 100,
        description: skill.description
    }));

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-black/90 border-2 border-[var(--color-border)] p-3 rounded-lg">
                    <p className="text-[var(--color-text)] font-semibold">{data.skill}</p>
                    <p className="text-[var(--color-accent)] text-sm">Value: {data.value}/100</p>
                    <p className="text-[var(--color-text)] text-xs mt-1 max-w-xs">{data.description}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full"
        >
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-4 text-center">
                Soft Skills
            </h2>

            <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={chartData}>
                    <PolarGrid stroke="var(--color-border)" strokeOpacity={0.3} />
                    <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: 'var(--color-text)', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: 'var(--color-text)', fontSize: 10 }}
                    />
                    <Radar
                        name="Skills"
                        dataKey="value"
                        stroke="var(--color-chartPrimary)"
                        fill="var(--color-chartPrimary)"
                        fillOpacity={0.5}
                        animationDuration={1000}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>

            {/* Mobile tap instructions */}
            <p className="text-[var(--color-text)] text-xs text-center mt-2 opacity-60 md:hidden">
                Tap on the chart for details
            </p>
        </motion.div>
    );
};

export default SoftSkillsSpider;
