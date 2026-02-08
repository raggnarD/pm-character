import MainLayout from './components/Layout/MainLayout';


import { useTheme } from './hooks/useTheme';

import './App.css';

function App() {
    const { activeTheme, setActiveTheme } = useTheme();

    return (
        <>
            {/* Modern Sprite - Fixed at absolute left edge, full height, behind content */}
            <div className="fixed left-0 top-0 h-screen w-screen overflow-hidden z-0 pointer-events-none">
                <img
                    src="sprites/ff7-rebirth/modern-sprite.gif"
                    alt="Modern Character Sprite"
                    className="h-full w-auto absolute left-[60px] top-0"
                    style={{
                        objectFit: 'contain',
                        transform: 'translateX(-45%) scale(1.08)',
                        transformOrigin: 'left center'
                    }}
                />
            </div>

            {/* Main Layout with content */}
            <MainLayout>
                {/* Main content area with left margin for sprite */}
                <div className="relative z-10 p-8">
                    {/* Theme Selection Tabs */}
                    <div className="flex gap-2 mb-6 justify-center">
                        {(['8bit', 'ff7', 'ff7-rebirth'] as const).map((style) => (
                            <button
                                key={style}
                                onClick={() => setActiveTheme(style)}
                                className={`
                                    px-6 py-3 rounded-lg font-semibold text-base
                                    transition-all duration-300 border-2
                                    ${activeTheme === style
                                        ? 'bg-[var(--color-accent)] text-black border-[var(--color-accent)] scale-105'
                                        : 'bg-transparent text-[var(--color-text)] border-[var(--color-border)] hover:border-[var(--color-accent)] hover:scale-105'
                                    }
                                `}
                            >
                                {style === '8bit' ? 'Vintage' : style === 'ff7' ? 'Classic' : 'Modern'}
                            </button>
                        ))}
                    </div>

                    {/* Content area - ready for new layout */}
                    <div className="mt-8">
                        <p className="text-center text-[var(--color-text)] opacity-60">
                            Ready to build layout for: {activeTheme}
                        </p>
                    </div>
                </div>
            </MainLayout>
        </>
    );
}

export default App;
