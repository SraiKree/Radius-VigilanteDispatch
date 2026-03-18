import { NavLink, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    HeartHandshake,
    Settings,
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
 * Sidebar - Hardware-tactical icon navigation rail
 * Fixed width w-16, crisp borders, Command Cyan active state
 */
function Sidebar() {
    const location = useLocation();

    return (
        <aside className="w-16 h-full bg-background border-r border-border flex flex-col">
            {/* Logo — solid Beacon Red (justified: links to SOS/emergency page) */}
            <div className="h-14 flex items-center justify-center border-b border-border">
                <Link to="/emergency">
                    <motion.div
                        whileTap={{ scale: 0.93 }}
                        className="w-9 h-9 rounded-sm bg-gradient-to-br from-beacon to-[#D01B3A] flex items-center justify-center shadow-md hover:brightness-110 transition-all"
                    >
                        <Radius className="w-5 h-5 text-white" />
                    </motion.div>
                </Link>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
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
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                    'w-12 h-10 rounded-sm flex items-center justify-center transition-colors duration-100',
                                    isActive
                                        ? 'bg-surface border border-command/30 text-foreground shadow-[inset_0_1px_0_rgba(0,229,255,0.08)]'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-surface/60 border border-transparent'
                                )}
                            >
                                <Icon className="w-[18px] h-[18px]" />

                                {/* Active indicator — Command Cyan, not Beacon Red */}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-active"
                                        className="absolute left-0 w-[3px] h-5 bg-command rounded-r-sm"
                                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                    />
                                )}
                            </motion.div>

                            {/* Tooltip */}
                            <div className="absolute left-full ml-2 px-2.5 py-1 bg-surface border border-border text-foreground text-xs font-medium rounded-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-md">
                                {item.label}
                            </div>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom — compact build label instead of decorative icon */}
            <div className="py-3 px-2 border-t border-border flex items-center justify-center">
                <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-widest select-none">
                    v0.1
                </span>
            </div>
        </aside>
    );
}

export { Sidebar };
