import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Search,
    BarChart3,
    MessageSquare,
    Settings,
    Zap,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface SidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Leads', path: '/leads' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: MessageSquare, label: 'Messages', path: '/messages' },
    { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false, onToggle }) => {
    const location = useLocation();

    return (
        <aside className="sidebar" style={{ width: collapsed ? '80px' : '260px' }}>
            {/* Logo */}
            <div className="sidebar-logo" style={{ marginBottom: '2rem' }}>
                <div className="flex items-center gap-md">
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            background: 'var(--gradient-primary)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: 'var(--shadow-glow)',
                        }}
                    >
                        <Zap size={24} color="white" />
                    </div>
                    {!collapsed && (
                        <div style={{ animation: 'fadeIn 0.3s ease' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Outreach</h4>
                            <span className="text-xs text-tertiary">Automation Flow</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        padding: collapsed ? '0.75rem' : '0.75rem 1rem',
                                        borderRadius: 'var(--radius-lg)',
                                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        background: isActive
                                            ? 'linear-gradient(90deg, rgba(0,102,230,0.15) 0%, transparent 100%)'
                                            : 'transparent',
                                        borderLeft: isActive ? '3px solid var(--primary-500)' : '3px solid transparent',
                                        transition: 'all var(--transition-base)',
                                        textDecoration: 'none',
                                        justifyContent: collapsed ? 'center' : 'flex-start',
                                    }}
                                >
                                    <Icon
                                        size={20}
                                        style={{
                                            color: isActive ? 'var(--primary-400)' : 'inherit',
                                            transition: 'color var(--transition-base)',
                                        }}
                                    />
                                    {!collapsed && (
                                        <span style={{ fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
                                    )}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Collapse Toggle */}
            <button
                onClick={onToggle}
                className="btn btn-ghost btn-icon"
                style={{
                    marginTop: 'auto',
                    alignSelf: collapsed ? 'center' : 'flex-end',
                }}
            >
                {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </button>

            {/* Bottom CTA */}
            {!collapsed && (
                <div
                    className="glass-card"
                    style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            background: 'var(--gradient-success)',
                            borderRadius: 'var(--radius-lg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 0.75rem',
                        }}
                    >
                        <Zap size={24} color="white" />
                    </div>
                    <p className="text-sm font-medium" style={{ marginBottom: '0.5rem' }}>
                        Upgrade to Pro
                    </p>
                    <p className="text-xs text-tertiary" style={{ marginBottom: '1rem' }}>
                        Unlock unlimited searches
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%' }}>
                        Upgrade Now
                    </button>
                </div>
            )}
        </aside>
    );
};
