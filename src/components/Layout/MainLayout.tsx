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
            className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white"
        >
            {/* Header */}
            <header className="p-6 text-center border-b-2 border-[var(--color-border)]">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-3xl md:text-5xl font-bold text-[var(--color-text)]"
                >
                    PM Character Portfolio
                </motion.h1>
                <motion.p
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-sm md:text-base text-[var(--color-text)] opacity-70 mt-2"
                >
                    Project Management Skills • RPG Style
                </motion.p>
            </header>

            {/* Main content */}
            <main className="container mx-auto max-w-7xl">
                {children}
            </main>

            {/* Footer */}
            <footer className="p-6 text-center border-t-2 border-[var(--color-border)] mt-12">
                <p className="text-[var(--color-text)] opacity-60 text-sm">
                    Built with React + TypeScript + Tailwind CSS
                </p>
            </footer>
        </motion.div>
    );
};

export default MainLayout;
