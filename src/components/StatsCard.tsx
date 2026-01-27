import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import * as Icons from 'lucide-react';

interface StatsCardProps {
    icon: keyof typeof Icons;
    label: string;
    value: string | number;
    trend?: {
        value: number;
        label: string;
    };
    gradient?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
    icon,
    label,
    value,
    trend,
    gradient = 'var(--gradient-primary)',
}) => {
    const IconComponent = Icons[icon] as React.FC<{ size?: number; color?: string }>;

    const getTrendIcon = () => {
        if (!trend) return null;
        if (trend.value > 0) return <TrendingUp size={14} />;
        if (trend.value < 0) return <TrendingDown size={14} />;
        return <Minus size={14} />;
    };

    const getTrendColor = () => {
        if (!trend) return 'var(--text-tertiary)';
        if (trend.value > 0) return 'var(--accent-green)';
        if (trend.value < 0) return 'var(--accent-red)';
        return 'var(--text-tertiary)';
    };

    return (
        <div className="glass-card-gradient" style={{ padding: '1.5rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <div
                    style={{
                        width: 48,
                        height: 48,
                        background: gradient,
                        borderRadius: 'var(--radius-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    }}
                >
                    {IconComponent && <IconComponent size={24} color="white" />}
                </div>

                {trend && (
                    <div
                        className="flex items-center gap-xs"
                        style={{
                            padding: '0.25rem 0.5rem',
                            background:
                                trend.value > 0
                                    ? 'rgba(16, 185, 129, 0.15)'
                                    : trend.value < 0
                                        ? 'rgba(239, 68, 68, 0.15)'
                                        : 'rgba(107, 114, 128, 0.15)',
                            borderRadius: 'var(--radius-full)',
                            color: getTrendColor(),
                            fontSize: '0.75rem',
                            fontWeight: 500,
                        }}
                    >
                        {getTrendIcon()}
                        <span>
                            {trend.value > 0 ? '+' : ''}
                            {trend.value}%
                        </span>
                    </div>
                )}
            </div>

            <div>
                <h3
                    style={{
                        fontSize: '2rem',
                        fontWeight: 700,
                        marginBottom: '0.25rem',
                        background: 'linear-gradient(135deg, #fff 0%, #9ca3af 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    {value}
                </h3>
                <p className="text-secondary text-sm">{label}</p>
                {trend && (
                    <p className="text-tertiary text-xs" style={{ marginTop: '0.25rem' }}>
                        {trend.label}
                    </p>
                )}
            </div>
        </div>
    );
};
