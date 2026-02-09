import { motion } from 'framer-motion';

const STATS = [
    { name: 'Communication', value: 110 },
    { name: 'Leadership', value: 75 },
    { name: 'Problem-Solving', value: 89 },
    { name: 'Adaptability', value: 77 },
    { name: 'Emotional Intelligence', value: 92 },
    { name: 'Charisma (Pre-Caffeine)', value: 1 },
    { name: 'Slack Willpower: Unread Mentions', value: 3 },
    { name: 'Planning & Organization', value: 84 },
    { name: 'Technical Reasoning', value: 95 },
    { name: 'Eye for Design', value: 88 },
    { name: 'Magic (Hand Wavy)', value: 3 },
    { name: 'Stakeholder Management', value: 75 },
    { name: 'AI Tool Skills', value: 65 },
    { name: 'Clarity Projection (Simplification)', value: 95 },
    { name: 'Luck: Deployment Day', value: 2 },
] as const;

const BAR_MAX = 100;

export default function CharacterStats() {
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
                <ul className="flex flex-col gap-3 pl-8 ml-2" style={{ paddingRight: '2rem' }}>
                    {STATS.map(({ name, value }) => (
                        <li key={name} className="flex flex-col gap-1">
                            <div className="flex justify-between items-baseline text-sm gap-4">
                                <span className="text-[var(--color-text)] font-medium">{name}</span>
                                <span className="text-[var(--color-accent)] font-semibold tabular-nums shrink-0" style={{ paddingRight: '1.5rem' }}>
                                    {value}
                                </span>
                            </div>
                            <div
                                className="h-2 rounded-full bg-black/30 border border-[var(--color-border)] overflow-hidden"
                                role="progressbar"
                                aria-valuenow={value}
                                aria-valuemin={0}
                                aria-valuemax={BAR_MAX}
                            >
                                <div
                                    className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-500"
                                    style={{ width: `${Math.min(BAR_MAX, value)}%` }}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
}
