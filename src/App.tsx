import MainLayout from './components/Layout/MainLayout';
import CharacterPicker from './components/CharacterPicker/CharacterPicker';
import SkillsCharts from './components/SkillsCharts/SkillsCharts';
import { useTheme } from './hooks/useTheme';
import { skillsData } from './data/skillsData';
import './App.css';

function App() {
    const { activeTheme, setActiveTheme } = useTheme();

    return (
        <MainLayout>
            {/* Responsive grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 md:p-8">
                {/* Character Picker - Left side on desktop, top on mobile */}
                <div className="lg:col-span-1">
                    <CharacterPicker
                        activeStyle={activeTheme}
                        onStyleChange={setActiveTheme}
                    />
                </div>

                {/* Skills Charts - Right side on desktop, bottom on mobile */}
                <div className="lg:col-span-1">
                    <SkillsCharts skillsData={skillsData} />
                </div>
            </div>
        </MainLayout>
    );
}

export default App;
