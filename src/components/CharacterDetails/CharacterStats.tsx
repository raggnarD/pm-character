import { motion } from 'framer-motion';
import Tooltip from '../Tooltip';

const STATS = [
    { name: 'Communication', value: 110, tooltip: 'Clear written and verbal communication with stakeholders and teams.' },
    { name: 'Leadership', value: 75, tooltip: 'Guiding teams and decisions toward outcomes.' },
    { name: 'Problem-Solving', value: 89, tooltip: 'Breaking down ambiguity and finding actionable solutions.' },
    { name: 'Adaptability', value: 77, tooltip: 'Adjusting to changing priorities and constraints.' },
    { name: 'Emotional Intelligence', value: 92, tooltip: "Reading and responding to others' emotions and motivations." },
    { name: 'Charisma (Pre-Caffeine)', value: 1, tooltip: 'Persuasion and presence before the first coffee.' },
    { name: 'Slack Willpower: Unread Mentions', value: 3, tooltip: 'Resisting the urge to check every notification.' },
    { name: 'Planning & Organization', value: 84, tooltip: 'Structuring work, timelines, and dependencies.' },
    { name: 'Technical Reasoning', value: 95, tooltip: 'Understanding systems, tradeoffs, and technical constraints.' },
    { name: 'Eye for Design', value: 88, tooltip: 'Judging UX, clarity, and visual consistency.' },
    { name: 'Magic (Hand Wavy)', value: 3, tooltip: 'Selling something beyond what is planned and over promising.' },
    { name: 'Stakeholder Management', value: 75, tooltip: 'Aligning and communicating with different stakeholders.' },
    { name: 'AI Tool Skills', value: 65, tooltip: 'Using AI-assisted tools effectively every day to be more productive.' },
    { name: 'Clarity Projection (Simplification)', value: 95, tooltip: 'Turning complexity into clear, simple messages.' },
    { name: 'Luck: Deployment Day', value: 2, tooltip: 'Banking on luck to deliver results.' },
];

const BAR_MAX = 100;

export default function CharacterStats() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            className="font-panel-body bg-[var(--color-background)]"
            style={{ marginTop: '2rem' }}
        >
            <div className="p-5 lg:p-6 flex flex-col gap-4">
                <h3 className="font-panel-title text-base lg:text-lg font-semibold text-[var(--color-accent)] pt-2 pb-1 mb-4 tracking-wide">
                    Stats
                </h3>
                <ul className="flex flex-col gap-3 pl-8 ml-2" style={{ paddingRight: '2rem' }}>
                    {STATS.map(({ name, value, tooltip }) => (
                        <li key={name} className="flex flex-col gap-1">
                            <div className="flex justify-between items-baseline text-sm gap-4">
                                <Tooltip content={tooltip}>
                                    <span className="text-[var(--color-text)] font-medium">{name}</span>
                                </Tooltip>
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
