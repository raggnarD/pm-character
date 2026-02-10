import MainLayout from './components/Layout/MainLayout';
import LoopingGif from './components/LoopingGif';
import HPMPStats from './components/HPMPStats';
import CharacterDetails from './components/CharacterDetails/CharacterDetails';
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

/** Mobile layout: same structure as desktop (sprite left, content right) but responsive (smaller sprite, tighter padding). */
function MobileLayout() {
    return (
        <div className="mobile-layout-root">
            {/* Sprite: left side on mobile, smaller so it doesn't dominate */}
            <div className="fixed left-0 top-0 h-screen w-screen overflow-hidden z-0 pointer-events-none">
                <LoopingGif
                    src="sprites/ff7-rebirth/modern-sprite-loop.gif?v=2"
                    alt="Character Sprite"
                    className="mobile-sprite h-full w-auto absolute left-4 top-0 max-h-[55vh]"
                    style={{
                        objectFit: 'contain',
                        transform: 'translateX(-17.5%) translateY(30px) scale(0.6)',
                        transformOrigin: 'left center',
                    }}
                />
            </div>
            <MainLayout>
                <div className="relative z-10 p-4" style={{ backgroundColor: 'transparent' }}>
                    <div className="flex flex-row items-start w-full">
                        <div
                            className="flex-shrink-0"
                            style={{ width: 'min(45vw, 45%)', minWidth: 'min(45vw, 45%)' }}
                            aria-hidden
                        >
                            <HPMPStats />
                        </div>
                        <div className="flex-1 min-w-0 pl-4 max-w-xl flex flex-col">
                            <CharacterDetails />
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
