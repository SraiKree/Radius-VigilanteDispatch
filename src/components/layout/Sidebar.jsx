import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    HeartHandshake,
    Settings,
    Shield,
    Radius
} from 'lucide-react';
import { cn } from '../../lib/cn';

const navItems = [
    {
        icon: LayoutDashboard,
        label: 'Dashboard',
        path: '/dashboard',
    },
    {
        icon: HeartHandshake,
        label: 'Bounties',
        path: '/bounties',
    },
    {
        icon: Settings,
        label: 'Settings',
        path: '/settings',
    },
];

/**
 * Sidebar - Collapsed icon navigation rail
 * Fixed width w-16 with high contrast active states
 */
function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-16 h-full bg-zinc-950 border-r border-zinc-800 flex flex-col">
            {/* Logo */}
            <div className="h-14 flex items-center justify-center border-b border-zinc-800">
                <Link to="/emergency">
                    <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg glow-danger"
                    >
                        <Radius className="w-5 h-5 text-white" />
                    </motion.div>
                </Link>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-4 flex flex-col gap-2 px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                        (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className="relative group"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200',
                                    isActive
                                        ? 'bg-zinc-800 text-zinc-50'
                                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                                )}
                            >
                                <Icon className="w-5 h-5" />

                                {/* Active indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-1 h-6 bg-red-500 rounded-r-full"
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    />
                                )}
                            </motion.div>

                            {/* Tooltip */}
                            <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-zinc-50 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                {item.label}
                            </div>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom section - Shield icon */}
            <div className="py-4 px-2 border-t border-zinc-800">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-zinc-600">
                    <Shield className="w-5 h-5" />
                </div>
            </div>
        </aside>
    );
}

export { Sidebar };
