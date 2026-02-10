import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Tooltip from '../Tooltip';

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
import { GiRank3, GiHouse, GiMagicSwirl, GiEyeTarget, GiQuillInk, GiConcentrationOrb, GiConversation, GiFootsteps } from 'react-icons/gi';

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

const CLASS_TOOLTIP = 'The Fog-Piercer — Resolve, Perception, Insight';
const HOUSE_TOOLTIP = `"I pledge my technical insight to the service of the Sovereign User, for the system exists only to empower the human. I pledge to be the shield that guards against the 'Magic' of false promises and the sword that cuts through the fog."`;

const DETAILS = [
    { label: 'Class', value: 'Tech Paladin', tooltip: CLASS_TOOLTIP, glyph: <GiRank3 size={GLYPH_SIZE} /> },
    { label: 'House', value: 'Customer', tooltip: HOUSE_TOOLTIP, glyph: <GiHouse size={GLYPH_SIZE} /> },
] as const;

const SIGNATURE_MOVES = [
    {
        name: 'Dispel Ambiguity',
        description:
            'An AOE (Area of Effect) spell that instantly converts "I think we need..." into a Jira ticket with clear Acceptance Criteria.',
        glyph: <GiMagicSwirl size={GLYPH_SIZE} />,
        suffix: '(AOE)',
    },
    {
        name: 'Pivot of Grace (Tactical Mobility)',
        description:
            'Allows the entire team to change direction based on new data without losing more than 5% of their momentum or morale.',
        glyph: <GiFootsteps size={GLYPH_SIZE} />,
        suffix: null,
    },
];

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

type ExperienceBarProps = { hideLevelPercent?: boolean };

export function ExperienceBar({ hideLevelPercent }: ExperienceBarProps = {}) {
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
        <div className="mb-6 relative" style={{ backgroundColor: 'transparent' }}>
            <div className="flex justify-between items-baseline text-xs font-panel-body text-[var(--color-text)] opacity-90 mb-1 gap-2 whitespace-nowrap">
                <span className="flex items-baseline gap-1.5">
                    <span>Level {age}</span>
                    <AnimatePresence mode="wait">
                        {gain && (
                            <motion.span
                                key={gain.key}
                                className="text-sm font-bold text-[var(--color-accent)] font-panel-body"
                                style={{ paddingLeft: '0.5rem' }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4 }}
                            >
                                +{gain.value} exp
                            </motion.span>
                        )}
                    </AnimatePresence>
                </span>
                {!hideLevelPercent && (
                    <span className="tabular-nums text-[var(--color-accent)] shrink-0" style={{ paddingRight: '1.5rem' }}>{percent.toFixed(1)}% to next level</span>
                )}
            </div>
            <div className="w-full max-w-[260px] relative">
                <div
                    className="relative h-5 w-full rounded-sm overflow-hidden border border-[var(--color-border)]"
                    style={{ backgroundColor: 'transparent' }}
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Experience through the year"
                >
                    <motion.div
                        className="experience-bar-fill absolute left-0 top-0 bottom-0 rounded-l-sm"
                        style={{
                            width: `${percent}%`,
                            backgroundColor: 'var(--color-accent)',
                        }}
                        initial={false}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </div>
            </div>
            <div className="text-xs font-panel-body text-[var(--color-text)] opacity-75 mt-0.5">
                Current Location: Trials of Fire
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
            <span className="opacity-80">{label}:</span>
            <span style={{ marginLeft: '0.5rem' }}>
                <Tooltip content={tooltip}>
                    <span className="font-semibold text-[var(--color-accent)]">{value}</span>
                </Tooltip>
            </span>
        </div>
    );
}

interface CharacterDetailsProps {
    /** When true, hide the experience bar and render sections in mobile order (stacked). */
    variant?: 'desktop' | 'mobile';
}

export default function CharacterDetails({ variant = 'desktop' }: CharacterDetailsProps) {
    const isMobile = variant === 'mobile';

    const sectionsContent = (
        <>
            {/* Specialization */}
            <section className="min-w-0">
                <SectionTitle>Specialization</SectionTitle>
                <div className={`flex flex-col pl-6 md:pl-8 ml-2 pr-2`} style={{ gap: '1px' }}>
                    {DETAILS.map(({ label, value, tooltip, glyph }) => (
                        <PanelItem key={label} label={label} value={value} tooltip={tooltip} glyph={glyph} />
                    ))}
                </div>
            </section>
            {/* Passive Perks */}
            <section className="min-w-0">
                <SectionTitle>Passive Perks</SectionTitle>
                <ul className={`flex flex-col pl-6 md:pl-8 ml-2 pr-2 list-none`} style={{ gap: '1px' }}>
                    {PASSIVE_PERKS.map((perk) => (
                        <li key={perk.name} className="flex flex-col gap-0.5">
                            <span className="font-panel-body text-sm font-semibold text-[var(--color-textHighlight, var(--color-accent))] flex items-center">
                                <Glyph>{perk.glyph}</Glyph>
                                <span className="min-w-0 shrink">
                                    <Tooltip content={perk.description}>{perk.name}</Tooltip>
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </section>
            {/* Signature Move */}
            <section className="min-w-0">
                <SectionTitle>Signature Move</SectionTitle>
                <div className={`flex flex-col pl-6 md:pl-8 ml-2 pr-2`} style={{ gap: '1px' }}>
                    {SIGNATURE_MOVES.map((move) => (
                        <p key={move.name} className="font-panel-body text-sm font-semibold text-[var(--color-textHighlight, var(--color-accent))] flex items-center">
                            <Glyph>{move.glyph}</Glyph>
                            <span className="min-w-0 shrink">
                                <Tooltip content={move.description}>
                                    {move.name}{move.suffix ? ` ${move.suffix}` : ''}
                                </Tooltip>
                            </span>
                        </p>
                    ))}
                </div>
            </section>
            {/* Bonus Trait */}
            <section className="min-w-0">
                <SectionTitle>Bonus Trait</SectionTitle>
                <div className={`flex flex-col pl-6 md:pl-8 ml-2 pr-2`} style={{ gap: '1px' }}>
                    <p className="font-panel-body text-sm font-semibold text-[var(--color-textHighlight, var(--color-accent))] flex items-center">
                        <Glyph>{BONUS_TRAIT.glyph}</Glyph>
                        <span className="min-w-0 shrink">
                            <Tooltip content={BONUS_TRAIT.description}>{BONUS_TRAIT.name}</Tooltip>
                        </span>
                    </p>
                </div>
            </section>
        </>
    );

    if (isMobile) {
        return (
            <div className="character-details font-panel-body flex flex-col gap-6">
                {sectionsContent}
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
            className="character-details font-panel-body"
        >
            <div className="p-5 lg:p-6 flex flex-col" style={{ gap: '0.625rem' }}>
                <ExperienceBar hideLevelPercent={isMobile} />
                <div className="flex flex-row flex-wrap gap-8 items-start" style={{ marginTop: '0.5rem' }}>
                    <section className="min-w-0 flex-1">
                        <SectionTitle>Specialization</SectionTitle>
                        <div className="flex flex-col pl-8 ml-2 pr-2" style={{ gap: '1px' }}>
                            {DETAILS.map(({ label, value, tooltip, glyph }) => (
                                <PanelItem key={label} label={label} value={value} tooltip={tooltip} glyph={glyph} />
                            ))}
                        </div>
                    </section>
                    <section className="min-w-0 flex-1">
                        <SectionTitle>Signature Move</SectionTitle>
                        <div className="flex flex-col pl-8 ml-2 pr-2" style={{ gap: '1px' }}>
                            {SIGNATURE_MOVES.map((move) => (
                                <p key={move.name} className="font-panel-body text-sm font-semibold text-[var(--color-textHighlight, var(--color-accent))] flex items-center">
                                    <Glyph>{move.glyph}</Glyph>
                                    <span className="min-w-0 shrink">
                                        <Tooltip content={move.description}>
                                            {move.name}{move.suffix ? ` ${move.suffix}` : ''}
                                        </Tooltip>
                                    </span>
                                </p>
                            ))}
                        </div>
                    </section>
                </div>
                <div className="flex flex-row flex-wrap gap-8 items-start" style={{ marginTop: '0.875rem' }}>
                    <section className="min-w-0 flex-1">
                        <SectionTitle>Passive Perks</SectionTitle>
                        <ul className="flex flex-col pl-8 ml-2 pr-2 list-none" style={{ gap: '1px' }}>
                            {PASSIVE_PERKS.map((perk) => (
                                <li key={perk.name} className="flex flex-col gap-0.5">
                                    <span className="font-panel-body text-sm font-semibold text-[var(--color-textHighlight, var(--color-accent))] flex items-center">
                                        <Glyph>{perk.glyph}</Glyph>
                                        <span className="min-w-0 shrink">
                                            <Tooltip content={perk.description}>{perk.name}</Tooltip>
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                    <section className="min-w-0 flex-1">
                        <SectionTitle>Bonus Trait</SectionTitle>
                        <div className="flex flex-col pl-8 ml-2 pr-2" style={{ gap: '1px' }}>
                            <p className="font-panel-body text-sm font-semibold text-[var(--color-textHighlight, var(--color-accent))] flex items-center">
                                <Glyph>{BONUS_TRAIT.glyph}</Glyph>
                                <span className="min-w-0 shrink">
                                    <Tooltip content={BONUS_TRAIT.description}>{BONUS_TRAIT.name}</Tooltip>
                                </span>
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </motion.div>
    );
}
