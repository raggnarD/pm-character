import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BIRTH_MONTH = 5;   // June (0-indexed)
const BIRTH_DAY = 27;

/** Progress through current year of life: 0 on birthday, 1 just before next birthday. */
function getYearProgress(): number {
    const now = new Date();
    const y = now.getFullYear();
    const lastBirthday = new Date(y, BIRTH_MONTH, BIRTH_DAY);
    if (now < lastBirthday) {
        lastBirthday.setFullYear(y - 1);
    }
    const nextBirthday = new Date(lastBirthday);
    nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    const elapsed = now.getTime() - lastBirthday.getTime();
    const yearLength = nextBirthday.getTime() - lastBirthday.getTime();
    return Math.min(1, Math.max(0, elapsed / yearLength));
}

function getCurrentAge(): number {
    const now = new Date();
    const birth = new Date(1986, BIRTH_MONTH, BIRTH_DAY);
    let age = now.getFullYear() - birth.getFullYear();
    if (now.getMonth() < birth.getMonth() || (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate())) {
        age -= 1;
    }
    return age;
}
import { GiRank3, GiHouse, GiMagicSwirl, GiEyeTarget, GiQuillInk, GiConcentrationOrb, GiConversation, GiHearts, GiWizardStaff } from 'react-icons/gi';

const GLYPH_SIZE = 18;
const GLYPH_CLASS = 'inline-block flex-shrink-0 text-[var(--color-accent)]';

function Glyph({ children }: { children: React.ReactNode }) {
    return (
        <span
            className={GLYPH_CLASS}
            style={{ fontSize: GLYPH_SIZE, marginRight: '12px' }}
            aria-hidden
        >
            {children}
        </span>
    );
}

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    className?: string;
}

const CURSOR_OFFSET = 12;
const VIEWPORT_PADDING = 20;

function Tooltip({ content, children, className = '' }: TooltipProps) {
    const [visible, setVisible] = useState(false);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    const handleMouseEnter = (e: React.MouseEvent) => {
        setMouse({ x: e.clientX, y: e.clientY });
        setVisible(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (visible) setMouse({ x: e.clientX, y: e.clientY });
    };

    const left = Math.max(VIEWPORT_PADDING, Math.min(mouse.x + CURSOR_OFFSET, window.innerWidth - 320));
    const top = Math.max(VIEWPORT_PADDING, Math.min(mouse.y + CURSOR_OFFSET, window.innerHeight - 280));

    return (
        <span
            className={`relative inline-flex items-center gap-1 cursor-help border-b border-dotted border-[var(--color-accent)] ${className}`}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="fixed z-50 min-w-[20rem] max-w-[calc(100vw-40px)] px-4 py-3 text-sm rounded-lg border-2 border-[var(--color-border)] text-[var(--color-text)] shadow-xl overflow-y-auto max-h-64 pointer-events-none"
                        style={{
                            backgroundColor: '#000',
                            left,
                            top,
                        }}
                    >
                        {content}
                    </motion.div>
                )}
            </AnimatePresence>
        </span>
    );
}

const CLASS_TOOLTIP = 'The Fog-Piercer — Resolve, Perception, Insight';
const HOUSE_TOOLTIP = `"I pledge my technical insight to the service of the Sovereign User, for the system exists only to empower the human. I pledge to be the shield that guards against the 'Magic' of false promises and the sword that cuts through the fog."`;

const DETAILS = [
    { label: 'Class', value: 'Tech Paladin', tooltip: CLASS_TOOLTIP, glyph: <GiRank3 size={GLYPH_SIZE} /> },
    { label: 'House', value: 'Customer', tooltip: HOUSE_TOOLTIP, glyph: <GiHouse size={GLYPH_SIZE} /> },
] as const;

const SIGNATURE_MOVE = {
    name: 'Dispel Ambiguity',
    description:
        'An AOE (Area of Effect) spell that instantly converts "I think we need..." into a Jira ticket with clear Acceptance Criteria.',
    glyph: <GiMagicSwirl size={GLYPH_SIZE} />,
};

const PASSIVE_PERKS = [
    { name: 'True Sight', description: 'You see the hidden technical constraints that stakeholders usually miss.', glyph: <GiEyeTarget size={GLYPH_SIZE} /> },
    { name: 'Elegant Prose', description: 'Your documentation provides a +5 Buff to Engineer Morale.', glyph: <GiQuillInk size={GLYPH_SIZE} /> },
    { name: 'Aura of Alignment', description: 'Passively ensures that every technical discussion eventually circles back to the user\'s core problem. It automatically reduces the "Scope Creep" damage taken by the engineering team by 40% by filtering out features that don\'t serve the Sovereign User.', glyph: <GiConcentrationOrb size={GLYPH_SIZE} /> },
] as const;

const BONUS_TRAIT = {
    name: 'The Common Tongue (Communication)',
    description:
        'You translate the "Common Language" of the customer, into the "High Prose" of the engineering team and vice-versa.',
    glyph: <GiConversation size={GLYPH_SIZE} />,
};

/** Random experience gain +1 to +5043, weighted so smaller numbers are more common. */
function getRandomGain(): number {
    const r = Math.pow(Math.random(), 2);
    return Math.floor(r * 5043) + 1;
}

function ExperienceBar() {
    const [progress, setProgress] = useState(getYearProgress);
    const [gain, setGain] = useState<{ value: number; key: number } | null>(null);

    useEffect(() => {
        const scheduleNext = () => {
            const delayMs = 3000 + Math.random() * 2000;
            const id = setTimeout(() => {
                const next = getYearProgress();
                setProgress(next);
                setGain({ value: getRandomGain(), key: Date.now() });
                scheduleNext();
            }, delayMs);
            return id;
        };
        const id = scheduleNext();
        return () => clearTimeout(id);
    }, []);

    const age = getCurrentAge();
    const percent = Math.min(100, progress * 100);

    return (
        <div className="mb-6 relative" style={{ marginLeft: '3rem' }}>
            <div className="flex justify-between items-baseline text-xs font-panel-body text-[var(--color-text)] opacity-90 mb-1">
                <span>Level {age}</span>
            </div>
            <div className="w-full max-w-[260px] relative">
                <div
                    className="relative h-5 w-full rounded-sm overflow-hidden border border-[var(--color-border)]"
                    style={{ backgroundColor: 'rgba(60, 60, 60, 0.95)' }}
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Experience through the year"
                >
                    <motion.div
                        className="absolute left-0 top-0 bottom-0 rounded-l-sm"
                        style={{
                            width: `${percent}%`,
                            backgroundColor: 'var(--color-accent)',
                        }}
                        initial={false}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
                <AnimatePresence mode="wait">
                    {gain && (
                        <motion.div
                            key={gain.key}
                            className="absolute left-full top-1/2 -translate-y-1/2 ml-1 text-sm font-bold text-[var(--color-accent)] whitespace-nowrap"
                            initial={{ opacity: 0, y: 0, scale: 0.8 }}
                            animate={{ opacity: 1, y: -8, scale: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                        >
                            +{gain.value}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="text-xs font-panel-body text-[var(--color-text)] opacity-75 mt-0.5">
                Current Location: Trials of Fire
            </div>
        </div>
    );
}

const MAX_HP = 9999;
const MAX_MP = 680;
const BASE_HP = 7890;
const BASE_MP = 543;

/** Fluctuate value by ~5–10% of base (up or down), clamped to [0, max]. */
function fluctuate(current: number, base: number, max: number): number {
    const pct = 0.05 + Math.random() * 0.05; // 5–10% of base
    const delta = (Math.random() > 0.5 ? 1 : -1) * Math.round(base * pct);
    return Math.max(0, Math.min(max, current + delta));
}

function HPMPStats() {
    const [hp, setHp] = useState(BASE_HP);
    const [mp, setMp] = useState(BASE_MP);

    useEffect(() => {
        const interval = setInterval(() => {
            setHp((prev) => fluctuate(prev, BASE_HP, MAX_HP));
            setMp((prev) => fluctuate(prev, BASE_MP, MAX_MP));
        }, 2500 + Math.random() * 1500); // every ~2.5–4 s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mb-6 pl-8 ml-2 flex flex-col gap-2 font-panel-body text-sm text-[var(--color-text)]" style={{ paddingRight: '4rem' }}>
            <div className="flex items-center">
                <Glyph><GiHearts size={GLYPH_SIZE} /></Glyph>
                <span className="font-semibold text-[var(--color-accent)] w-8">HP</span>
                <span className="tabular-nums font-medium text-[var(--color-accent)]" style={{ paddingLeft: '1.5rem' }}>
                    {hp.toLocaleString()}/{MAX_HP.toLocaleString()}
                </span>
            </div>
            <div className="flex items-center">
                <Glyph><GiWizardStaff size={GLYPH_SIZE} /></Glyph>
                <span className="font-semibold text-[var(--color-accent)] w-8">MP</span>
                <span className="tabular-nums font-medium text-[var(--color-accent)]" style={{ paddingLeft: '1.5rem' }}>
                    {mp.toLocaleString()}/{MAX_MP.toLocaleString()}
                </span>
            </div>
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="font-panel-title text-base lg:text-lg font-semibold text-[var(--color-accent)] pt-2 pb-1 mb-4 tracking-wide">
            {children}
        </h3>
    );
}

function PanelItem({ label, value, tooltip, glyph }: { label: string; value: string; tooltip: string; glyph: React.ReactNode }) {
    return (
        <div className="font-panel-body text-sm text-[var(--color-text)] flex items-center">
            <Glyph>{glyph}</Glyph>
            <span className="opacity-80">{label}: </span>
            <Tooltip content={tooltip}>
                <span className="font-semibold text-[var(--color-accent)]">{value}</span>
            </Tooltip>
        </div>
    );
}

export default function CharacterDetails() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="character-details font-panel-body bg-[var(--color-background)]"
        >
            <div className="p-5 lg:p-6 flex flex-col gap-10">
                {/* Experience bar (level 0–60 from birthday) */}
                <ExperienceBar />

                {/* HP / MP (fluctuating) */}
                <HPMPStats />

                {/* Identity: Class & House */}
                <section>
                    <SectionTitle>Specialization</SectionTitle>
                    <div className="flex flex-col gap-1.5 pl-8 ml-2 pr-2">
                        {DETAILS.map(({ label, value, tooltip, glyph }) => (
                            <PanelItem key={label} label={label} value={value} tooltip={tooltip} glyph={glyph} />
                        ))}
                    </div>
                </section>

                {/* Signature Move */}
                <section>
                    <SectionTitle>Signature Move</SectionTitle>
                    <div className="flex flex-col gap-1 pl-8 ml-2 pr-2">
                        <p className="font-panel-body text-sm font-semibold text-[var(--color-textHighlight, var(--color-accent))] flex items-center">
                            <Glyph>{SIGNATURE_MOVE.glyph}</Glyph>
                            <Tooltip content={SIGNATURE_MOVE.description}>
                                {SIGNATURE_MOVE.name}
                            </Tooltip>
                        </p>
                    </div>
                </section>

                {/* Passive Perks */}
                <section>
                    <SectionTitle>Passive Perks</SectionTitle>
                    <ul className="flex flex-col gap-3 pl-8 ml-2 pr-2 list-none">
                        {PASSIVE_PERKS.map((perk) => (
                            <li key={perk.name} className="flex flex-col gap-0.5">
                                <span className="font-panel-body text-sm font-semibold text-[var(--color-textHighlight, var(--color-accent))] flex items-center">
                                    <Glyph>{perk.glyph}</Glyph>
                                    <Tooltip content={perk.description}>
                                        {perk.name}
                                    </Tooltip>
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Bonus Trait */}
                <section>
                    <SectionTitle>Bonus Trait</SectionTitle>
                    <div className="flex flex-col gap-1 pl-8 ml-2 pr-2">
                        <p className="font-panel-body text-sm font-semibold text-[var(--color-textHighlight, var(--color-accent))] flex items-center">
                            <Glyph>{BONUS_TRAIT.glyph}</Glyph>
                            <Tooltip content={BONUS_TRAIT.description}>
                                {BONUS_TRAIT.name}
                            </Tooltip>
                        </p>
                    </div>
                </section>
            </div>
        </motion.div>
    );
}
