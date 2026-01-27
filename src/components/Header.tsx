import React from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
    title?: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
        <header className="header">
            {/* Left - Page Title */}
            <div className="flex items-center gap-lg">
                {title && <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{title}</h1>}
            </div>

            {/* Center - Search */}
            <div style={{ flex: 1, maxWidth: 480, margin: '0 2rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search
                        size={18}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-tertiary)',
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Search leads, companies, messages..."
                        className="input"
                        style={{
                            paddingLeft: '2.75rem',
                            background: 'var(--bg-tertiary)',
                        }}
                    />
                </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-md">
                {/* Notifications */}
                <button
                    className="btn btn-ghost btn-icon"
                    style={{ position: 'relative' }}
                >
                    <Bell size={20} />
                    <span
                        style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            width: 8,
                            height: 8,
                            background: 'var(--accent-red)',
                            borderRadius: '50%',
                            border: '2px solid var(--bg-secondary)',
                        }}
                    />
                </button>

                {/* Profile */}
                <button
                    className="flex items-center gap-sm"
                    style={{
                        padding: '0.5rem 0.75rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-base)',
                    }}
                >
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            background: 'var(--gradient-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <User size={16} color="white" />
                    </div>
                    <span className="text-sm font-medium">John Doe</span>
                    <ChevronDown size={16} className="text-tertiary" />
                </button>
            </div>
        </header>
    );
};
