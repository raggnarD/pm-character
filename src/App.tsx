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
        <div className="desktop-layout-root">
            <div className="fixed left-0 top-0 h-screen w-screen overflow-hidden z-0 pointer-events-none desktop-sprite-bg">
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
        </div>
    );
}

/** Mobile layout: all position/size values in px so layout is atomic and consistent across screen sizes. */
const MOBILE_LAYOUT = {
    pagePaddingPx: 16,
    leftColumnWidthPx: 160,
    spriteLeftPx: 16,
    spriteTopPx: 0,
    spriteMaxHeightPx: 320,
    spriteTranslateXPx: -28,
    spriteTranslateYPx: 30,
    spriteScale: 0.6,
    hpmpPaddingTopPx: 280,
    rightColumnPaddingLeftPx: 16,
} as const;

/** Mobile layout: Level bar top-left, sprite below it, HP/MP below sprite; details + stats on right. */
function MobileLayout() {
    return (
        <div className="mobile-layout-root">
            <div className="fixed left-0 top-0 h-screen w-screen overflow-hidden z-0 pointer-events-none">
                <LoopingGif
                    src="sprites/ff7-rebirth/modern-sprite-loop.gif?v=2"
                    alt="Character Sprite"
                    className="mobile-sprite h-full w-auto absolute"
                    style={{
                        left: MOBILE_LAYOUT.spriteLeftPx,
                        top: MOBILE_LAYOUT.spriteTopPx,
                        maxHeight: MOBILE_LAYOUT.spriteMaxHeightPx,
                        objectFit: 'contain',
                        transform: `translateX(${MOBILE_LAYOUT.spriteTranslateXPx}px) translateY(${MOBILE_LAYOUT.spriteTranslateYPx}px) scale(${MOBILE_LAYOUT.spriteScale})`,
                        transformOrigin: 'left center',
                    }}
                />
            </div>
            <MainLayout>
                <div
                    className="relative z-10 flex flex-col gap-4"
                    style={{
                        backgroundColor: 'transparent',
                        padding: MOBILE_LAYOUT.pagePaddingPx,
                    }}
                >
                    <div className="flex flex-row items-start w-full">
                        <div
                            className="flex-shrink-0"
                            style={{ width: MOBILE_LAYOUT.leftColumnWidthPx, minWidth: MOBILE_LAYOUT.leftColumnWidthPx }}
                        >
                            <ExperienceBar />
                        </div>
                        <div className="flex-1 min-w-0" />
                    </div>
                    <div className="flex flex-row items-start w-full">
                        <div
                            className="mobile-hpmp flex-shrink-0 flex flex-col items-start text-left"
                            style={{
                                width: MOBILE_LAYOUT.leftColumnWidthPx,
                                minWidth: MOBILE_LAYOUT.leftColumnWidthPx,
                                paddingTop: MOBILE_LAYOUT.hpmpPaddingTopPx,
                            }}
                        >
                            <HPMPStats />
                        </div>
                        <div
                            className="flex-1 min-w-0 flex flex-col gap-4"
                            style={{ paddingLeft: MOBILE_LAYOUT.rightColumnPaddingLeftPx }}
                        >
                            <CharacterDetails variant="mobile" />
                            <CharacterStats />
                        </div>
                    </div>
                </div>
            </MainLayout>
        </div>
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
