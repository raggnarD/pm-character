import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { HardSkill } from '../../types/skills';
import { motion } from 'framer-motion';

interface HardSkillsBarsProps {
    skills: HardSkill[];
}

const HardSkillsBars: React.FC<HardSkillsBarsProps> = ({ skills }) => {
    // Format data for Recharts
    const chartData = skills.map(skill => ({
        name: skill.name,
        value: skill.value,
        description: skill.description
    }));

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-black/90 border-2 border-[var(--color-border)] p-3 rounded-lg">
                    <p className="text-[var(--color-text)] font-semibold">{data.name}</p>
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
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full"
        >
            <h2 className="text-xl md:text-2xl font-bold text-[var(--color-text)] mb-4 text-center">
                Hard Skills
            </h2>

            <ResponsiveContainer width="100%" height={350}>
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
                >
                    <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fill: 'var(--color-text)', fontSize: 12 }}
                    />
                    <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: 'var(--color-text)', fontSize: 12 }}
                        width={110}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar
                        dataKey="value"
                        fill="var(--color-chartPrimary)"
                        animationDuration={1000}
                        animationBegin={200}
                        radius={[0, 8, 8, 0]}
                    >
                        {chartData.map((_entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill="var(--color-chartPrimary)"
                                opacity={0.8}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            {/* Mobile tap instructions */}
            <p className="text-[var(--color-text)] text-xs text-center mt-2 opacity-60 md:hidden">
                Tap on bars for details
            </p>
        </motion.div>
    );
};

export default HardSkillsBars;
