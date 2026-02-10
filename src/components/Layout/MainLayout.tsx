import React from 'react';
import { motion } from 'framer-motion';

interface MainLayoutProps {
    children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex flex-col text-[var(--color-text)]"
            style={{ backgroundColor: 'transparent' }}
        >
            {/* Header: compact on iPhone 16/17 (sm) and below */}
            <header className="p-3 sm:p-6 text-center shrink-0">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl sm:text-3xl md:text-5xl font-bold text-[var(--color-text)] leading-tight"
                >
                    Stakeholder Gambit: The Last Standup
                </motion.h1>
            </header>

            {/* Main content */}
            <main className="container mx-auto max-w-7xl flex-1 px-2 sm:px-4">
                {children}
            </main>
        </motion.div>
    );
};

export default MainLayout;
