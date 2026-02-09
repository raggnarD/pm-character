import MainLayout from './components/Layout/MainLayout';
import LoopingGif from './components/LoopingGif';
import HPMPStats from './components/HPMPStats';
import CharacterDetails from './components/CharacterDetails/CharacterDetails';
import CharacterStats from './components/CharacterDetails/CharacterStats';
import { useTheme } from './hooks/useTheme';

import './App.css';

function App() {
    useTheme(); // Apply modern theme (ff7-rebirth) for CSS vars and font

    return (
        <>
            {/* Character sprite */}
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
                <div className="relative z-10 p-8">
                    {/* HP/MP (left) | Level 39, Specialization, Stats (right) — aligned at top */}
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

export default App;
