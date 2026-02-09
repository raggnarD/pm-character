import MainLayout from './components/Layout/MainLayout';
import LoopingGif from './components/LoopingGif';
import HPMPStats from './components/HPMPStats';
import CharacterDetails, { ExperienceBar } from './components/CharacterDetails/CharacterDetails';
import CharacterStats from './components/CharacterDetails/CharacterStats';
import { useTheme } from './hooks/useTheme';
import { useIsMobile } from './hooks/useIsMobile';

import './App.css';

/** Desktop-only layout: fixed sprite (original position), then content row left/right, all transparent. */
function DesktopLayout() {
    return (
        <>
            <div className="fixed left-0 top-0 h-screen w-screen overflow-hidden z-0 pointer-events-none">
                <LoopingGif
                    src="sprites/ff7-rebirth/modern-sprite-loop.gif?v=2"
                    alt="Character Sprite"
                    className="h-full w-auto absolute left-[60px] top-0"
                    style={{
                        objectFit: 'contain',
                        transform: 'translateX(-45%) translateY(60px) scale(1.08)',
                        transformOrigin: 'left center'
                    }}
                />
            </div>
            <MainLayout>
                <div className="relative z-10 p-8" style={{ backgroundColor: 'transparent' }}>
                    <div className="flex flex-row items-start w-full">
                        <div
                            className="flex-shrink-0"
                            style={{ width: 'min(50vw, 50%)', minWidth: 'min(50vw, 50%)' }}
                            aria-hidden
                        >
                            <HPMPStats />
                        </div>
                        <div className="flex-1 min-w-0 pl-6 lg:pl-8 max-w-xl flex flex-col">
                            <CharacterDetails />
                            <CharacterStats />
                        </div>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}

/** Mobile layout spacing: change these to adjust spacing; all values in px. */
const MOBILE_LAYOUT = {
    pagePadding: 16,
    gapBetweenSections: 24,
    gapBetweenHpMpAndSprite: -48, // space between HP/MP block and sprite row (negative = overlap/reduce gap)
    spriteTranslateX: -300,
    spriteScale: 2,
} as const;

/** Mobile-only layout: HP/MP above, then sprite + level, then sections, then stats. */
function MobileLayout() {
    return (
        <MainLayout>
            <div
                className="relative z-10 flex flex-col overflow-visible"
                style={{
                    backgroundColor: 'transparent',
                    padding: MOBILE_LAYOUT.pagePadding,
                    gap: MOBILE_LAYOUT.gapBetweenSections,
                }}
            >
                {/* Row 1: HP/MP above sprite */}
                <div aria-hidden>
                    <HPMPStats />
                </div>
                {/* Row 2: sprite upper left, level to the right */}
                <div
                    className="flex flex-row items-start gap-4 w-full overflow-visible"
                    style={{ marginTop: -MOBILE_LAYOUT.gapBetweenSections + MOBILE_LAYOUT.gapBetweenHpMpAndSprite }}
                >
                    <div
                        className="flex-shrink-0 overflow-hidden"
                        style={{
                            width: 800,
                            height: 1280,
                            maxWidth: '90vw',
                            maxHeight: '60vh',
                            transform: `translateX(${MOBILE_LAYOUT.spriteTranslateX}px)`,
                        }}
                        aria-hidden
                    >
                        <div style={{ transform: `scale(${MOBILE_LAYOUT.spriteScale})`, transformOrigin: 'top left', width: 400, height: 640 }}>
                            <LoopingGif
                                src="sprites/ff7-rebirth/modern-sprite-loop.gif?v=2"
                                alt="Character Sprite"
                                className="block h-full w-full object-contain object-left-top"
                            />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <ExperienceBar />
                    </div>
                </div>
                {/* Sections: Specialization, Passive Perks, Signature Moves, Bonus Trait */}
                <CharacterDetails variant="mobile" />
                {/* Stats */}
                <CharacterStats />
            </div>
        </MainLayout>
    );
}

function App() {
    useTheme();
    const { isMobile, viewMode, setViewMode } = useIsMobile();

    return (
        <>
            {/* Top bar: switch Desktop / Mobile view */}
            <div
                className="fixed top-0 left-0 right-0 z-50 flex justify-center gap-2 p-2 bg-black/70 border-b border-[var(--color-border)]"
                style={{ color: 'var(--color-text)' }}
            >
                <button
                    type="button"
                    onClick={() => setViewMode('desktop')}
                    className={`px-3 py-1.5 rounded text-sm font-medium border ${
                        !isMobile ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]' : 'border-[var(--color-border)]/50 hover:border-[var(--color-accent)]/70'
                    }`}
                >
                    Desktop
                </button>
                <button
                    type="button"
                    onClick={() => setViewMode('mobile')}
                    className={`px-3 py-1.5 rounded text-sm font-medium border ${
                        isMobile ? 'bg-[var(--color-accent)]/20 border-[var(--color-accent)]' : 'border-[var(--color-border)]/50 hover:border-[var(--color-accent)]/70'
                    }`}
                >
                    Mobile
                </button>
                {viewMode !== 'auto' && (
                    <button
                        type="button"
                        onClick={() => setViewMode('auto')}
                        className="px-3 py-1.5 rounded text-sm font-medium border border-[var(--color-border)]/50 hover:border-[var(--color-accent)]/70"
                    >
                        Auto
                    </button>
                )}
            </div>
            {/* Layout content — add top padding so it’s not under the bar */}
            <div className="pt-12">
                {isMobile ? <MobileLayout /> : <DesktopLayout />}
            </div>
        </>
    );
}

export default App;
