import { useState, useEffect, useRef } from 'react';
import { GiHearts, GiWizardStaff } from 'react-icons/gi';
import type { ViewMode } from '../hooks/useIsMobile';

const GLYPH_SIZE = 18;
const MAX_HP = 9999;
const MAX_MP = 680;
const BASE_HP = 7890;
const BASE_MP = 543;

export interface ViewSwitcherProps {
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    isMobile: boolean;
    viewMenuOpen: boolean;
    setViewMenuOpen: (open: boolean) => void;
}

/** Fluctuate value by ~5–10% of base (up or down), clamped to [0, max]. */
function fluctuate(current: number, base: number, max: number): number {
    const pct = 0.05 + Math.random() * 0.05;
    const delta = (Math.random() > 0.5 ? 1 : -1) * Math.round(base * pct);
    return Math.max(0, Math.min(max, current + delta));
}

export default function HPMPStats(props?: { viewSwitcher?: ViewSwitcherProps }) {
    const { viewSwitcher } = props ?? {};
    const [hp, setHp] = useState(BASE_HP);
    const [mp, setMp] = useState(BASE_MP);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setHp((prev) => fluctuate(prev, BASE_HP, MAX_HP));
            setMp((prev) => fluctuate(prev, BASE_MP, MAX_MP));
        }, 2500 + Math.random() * 1500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!viewSwitcher?.viewMenuOpen) return;
        const close = (e: MouseEvent) => {
            if (menuRef.current?.contains(e.target as Node)) return;
            viewSwitcher.setViewMenuOpen(false);
        };
        document.addEventListener('click', close, true);
        return () => document.removeEventListener('click', close, true);
    }, [viewSwitcher?.viewMenuOpen, viewSwitcher?.setViewMenuOpen]);

    const heartEl = (
        <span className="inline-block flex-shrink-0 text-[var(--color-accent)]" style={{ fontSize: GLYPH_SIZE, marginRight: '12px' }} aria-hidden>
            <GiHearts size={GLYPH_SIZE} />
        </span>
    );

    return (
        <div
            className="mb-4 flex flex-col gap-2 font-panel-body text-sm text-[var(--color-text)] p-4 rounded"
            style={{ paddingRight: '4rem', paddingLeft: '3rem', backgroundColor: 'transparent' }}
        >
            <div className="flex items-center relative" ref={menuRef}>
                {viewSwitcher ? (
                    <button
                        type="button"
                        onClick={() => viewSwitcher.setViewMenuOpen(!viewSwitcher.viewMenuOpen)}
                        className="flex-shrink-0 p-0 border-0 bg-transparent cursor-default text-[var(--color-accent)] outline-none focus:outline-none focus-visible:outline-none"
                        style={{ fontSize: GLYPH_SIZE, marginRight: '12px' }}
                        aria-expanded={viewSwitcher.viewMenuOpen}
                        aria-haspopup="true"
                        aria-label="View options"
                    >
                        <GiHearts size={GLYPH_SIZE} />
                    </button>
                ) : (
                    heartEl
                )}
                {viewSwitcher?.viewMenuOpen && (
                    <div
                        className="absolute left-full top-0 ml-1 z-[100] flex flex-col gap-0 py-1 rounded border border-[var(--color-border)] shadow-xl min-w-[7rem]"
                        role="menu"
                        style={{ backgroundColor: '#000', color: '#e6e6e6' }}
                    >
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => { viewSwitcher.setViewMode('desktop'); viewSwitcher.setViewMenuOpen(false); }}
                            className={`px-3 py-1.5 text-left text-sm font-medium border-0 rounded-none w-full ${!viewSwitcher.isMobile ? 'bg-[var(--color-accent)]/30' : 'hover:bg-white/15'}`}
                            style={{ color: 'inherit' }}
                        >
                            Desktop
                        </button>
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => { viewSwitcher.setViewMode('mobile'); viewSwitcher.setViewMenuOpen(false); }}
                            className={`px-3 py-1.5 text-left text-sm font-medium border-0 rounded-none w-full ${viewSwitcher.isMobile ? 'bg-[var(--color-accent)]/30' : 'hover:bg-white/15'}`}
                            style={{ color: 'inherit' }}
                        >
                            Mobile
                        </button>
                        {viewSwitcher.viewMode !== 'auto' && (
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => { viewSwitcher.setViewMode('auto'); viewSwitcher.setViewMenuOpen(false); }}
                                className="px-3 py-1.5 text-left text-sm font-medium border-0 rounded-none w-full hover:bg-white/15"
                                style={{ color: 'inherit' }}
                            >
                                Auto
                            </button>
                        )}
                    </div>
                )}
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
