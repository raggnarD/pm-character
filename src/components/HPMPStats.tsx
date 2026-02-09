import { useState, useEffect } from 'react';
import { GiHearts, GiWizardStaff } from 'react-icons/gi';

const GLYPH_SIZE = 18;
const MAX_HP = 9999;
const MAX_MP = 680;
const BASE_HP = 7890;
const BASE_MP = 543;

/** Fluctuate value by ~5–10% of base (up or down), clamped to [0, max]. */
function fluctuate(current: number, base: number, max: number): number {
    const pct = 0.05 + Math.random() * 0.05;
    const delta = (Math.random() > 0.5 ? 1 : -1) * Math.round(base * pct);
    return Math.max(0, Math.min(max, current + delta));
}

export default function HPMPStats() {
    const [hp, setHp] = useState(BASE_HP);
    const [mp, setMp] = useState(BASE_MP);

    useEffect(() => {
        const interval = setInterval(() => {
            setHp((prev) => fluctuate(prev, BASE_HP, MAX_HP));
            setMp((prev) => fluctuate(prev, BASE_MP, MAX_MP));
        }, 2500 + Math.random() * 1500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="mb-4 flex flex-col gap-2 font-panel-body text-sm text-[var(--color-text)] bg-[var(--color-background)] p-4 rounded"
            style={{ paddingRight: '4rem', paddingLeft: '3rem' }}
        >
            <div className="flex items-center">
                <span className="inline-block flex-shrink-0 text-[var(--color-accent)]" style={{ fontSize: GLYPH_SIZE, marginRight: '12px' }} aria-hidden>
                    <GiHearts size={GLYPH_SIZE} />
                </span>
                <span className="font-semibold text-[var(--color-accent)] w-8">HP</span>
                <span className="tabular-nums font-medium text-[var(--color-accent)]" style={{ paddingLeft: '1.5rem' }}>
                    {hp.toLocaleString()}/{MAX_HP.toLocaleString()}
                </span>
            </div>
            <div className="flex items-center">
                <span className="inline-block flex-shrink-0 text-[var(--color-accent)]" style={{ fontSize: GLYPH_SIZE, marginRight: '12px' }} aria-hidden>
                    <GiWizardStaff size={GLYPH_SIZE} />
                </span>
                <span className="font-semibold text-[var(--color-accent)] w-8">MP</span>
                <span className="tabular-nums font-medium text-[var(--color-accent)]" style={{ paddingLeft: '1.5rem' }}>
                    {mp.toLocaleString()}/{MAX_MP.toLocaleString()}
                </span>
            </div>
        </div>
    );
}
