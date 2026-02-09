import { useMemo } from 'react';
import { motion } from 'framer-motion';

const PLACEHOLDER_STATS = ['Stat 1', 'Stat 2', 'Stat 3', 'Stat 4', 'Stat 5', 'Stat 6'];

function randomValue() {
    return Math.floor(Math.random() * 101);
}

export default function CharacterStats() {
    const values = useMemo(
        () => PLACEHOLDER_STATS.map(() => randomValue()),
        []
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="font-panel-body mt-6 bg-[var(--color-background)]"
        >
            <div className="p-5 lg:p-6 flex flex-col gap-4">
                <h3 className="font-panel-title text-base lg:text-lg font-semibold text-[var(--color-accent)] pt-2 pb-1 mb-4 tracking-wide">
                    Stats
                </h3>
                <ul className="flex flex-col gap-3" style={{ paddingLeft: '2rem', marginLeft: '0.5rem' }}>
                    {PLACEHOLDER_STATS.map((name, i) => (
                        <li key={name} className="flex flex-col gap-1">
                            <div className="flex justify-between items-baseline text-sm">
                                <span className="text-[var(--color-text)] font-medium">{name}</span>
                                <span className="text-[var(--color-accent)] font-semibold tabular-nums">
                                    {values[i]}
                                </span>
                            </div>
                            <div
                                className="h-2 rounded-full bg-black/30 border border-[var(--color-border)] overflow-hidden"
                                role="progressbar"
                                aria-valuenow={values[i]}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <div
                                    className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                                    style={{ width: `${values[i]}%` }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
