import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

/**
 * AppShell - Main application layout wrapper
 * Contains sidebar, header, and main content area
 */
function AppShell() {
    return (
        <div className="h-screen w-screen flex overflow-hidden bg-zinc-950">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <Header />

                {/* Page content */}
                <motion.main
                    className="flex-1 relative overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Outlet />
                </motion.main>
            </div>
        </div>
    );
}

export { AppShell };
