import React from 'react';
import { Header, StatsCard } from '../components';
import { TrendingUp } from 'lucide-react';

export const Analytics: React.FC = () => {
    // Mock funnel data
    const funnelData = [
        { label: 'Leads Found', value: 1284, color: 'var(--primary-400)' },
        { label: 'Contacted', value: 456, color: 'var(--accent-purple)' },
        { label: 'Responded', value: 112, color: 'var(--accent-cyan)' },
        { label: 'Interested', value: 67, color: 'var(--accent-yellow)' },
        { label: 'Converted', value: 32, color: 'var(--accent-green)' },
    ];

    const topSearches = [
        { name: 'VP Engineering Tech', leads: 47, rate: 28 },
        { name: 'Growth Marketing SaaS', leads: 35, rate: 22 },
        { name: 'CTO Startups', leads: 28, rate: 31 },
        { name: 'Director Operations', leads: 22, rate: 18 },
    ];

    const weeklyData = [
        { day: 'Mon', leads: 32, messages: 18 },
        { day: 'Tue', leads: 28, messages: 22 },
        { day: 'Wed', leads: 45, messages: 31 },
        { day: 'Thu', leads: 38, messages: 25 },
        { day: 'Fri', leads: 52, messages: 28 },
        { day: 'Sat', leads: 18, messages: 8 },
        { day: 'Sun', leads: 12, messages: 5 },
    ];

    const maxLeads = Math.max(...weeklyData.map((d) => d.leads));

    return (
        <div>
            <Header title="Analytics" />
            <div className="page-content">
                {/* Stats Row */}
                <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem' }}>
                    <StatsCard
                        icon="Users"
                        label="Total Leads"
                        value="1,284"
                        trend={{ value: 12, label: 'vs last month' }}
                    />
                    <StatsCard
                        icon="TrendingUp"
                        label="Conversion Rate"
                        value="2.5%"
                        trend={{ value: 0.3, label: 'vs last month' }}
                        gradient="var(--gradient-success)"
                    />
                    <StatsCard
                        icon="Clock"
                        label="Avg. Response Time"
                        value="4.2h"
                        trend={{ value: -15, label: 'vs last month' }}
                        gradient="var(--gradient-warning)"
                    />
                    <StatsCard
                        icon="DollarSign"
                        label="Pipeline Value"
                        value="$124k"
                        trend={{ value: 8, label: 'vs last month' }}
                        gradient="linear-gradient(135deg, #10b981 0%, #06b6d4 100%)"
                    />
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.5rem',
                        marginBottom: '1.5rem',
                    }}
                >
                    {/* Lead Funnel */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Lead Funnel</h3>
                        <div className="flex flex-col gap-md">
                            {funnelData.map((stage, index) => (
                                <div key={stage.label}>
                                    <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                                        <span className="text-sm">{stage.label}</span>
                                        <span className="text-sm font-semibold">{stage.value.toLocaleString()}</span>
                                    </div>
                                    <div
                                        style={{
                                            height: 8,
                                            background: 'var(--bg-primary)',
                                            borderRadius: 'var(--radius-full)',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${(stage.value / funnelData[0].value) * 100}%`,
                                                height: '100%',
                                                background: stage.color,
                                                borderRadius: 'var(--radius-full)',
                                                transition: 'width 1s ease',
                                            }}
                                        />
                                    </div>
                                    {index < funnelData.length - 1 && (
                                        <div className="text-xs text-tertiary" style={{ marginTop: '0.25rem' }}>
                                            {((funnelData[index + 1].value / stage.value) * 100).toFixed(1)}% conversion
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weekly Activity */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Weekly Activity</h3>
                        <div
                            className="flex items-end justify-between"
                            style={{ height: 180, paddingBottom: '2rem' }}
                        >
                            {weeklyData.map((day) => (
                                <div
                                    key={day.day}
                                    className="flex flex-col items-center gap-sm"
                                    style={{ flex: 1, height: '100%', justifyContent: 'flex-end' }}
                                >
                                    <div
                                        style={{
                                            width: '60%',
                                            height: `${(day.leads / maxLeads) * 100}%`,
                                            minHeight: 8,
                                            background: 'var(--gradient-primary)',
                                            borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                                            transition: 'height 0.5s ease',
                                        }}
                                    />
                                    <span className="text-xs text-tertiary">{day.day}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center justify-center gap-lg text-xs">
                            <div className="flex items-center gap-sm">
                                <div
                                    style={{
                                        width: 12,
                                        height: 12,
                                        background: 'var(--gradient-primary)',
                                        borderRadius: 2,
                                    }}
                                />
                                <span className="text-secondary">Leads Found</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Performing Searches */}
                <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Top Performing Searches</h3>
                    <div className="grid grid-cols-4" style={{ gap: '1rem' }}>
                        {topSearches.map((search, index) => (
                            <div
                                key={search.name}
                                className="gradient-border-card animate-fade-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="gradient-border-card-inner">
                                    <h5 className="font-medium truncate" style={{ marginBottom: '0.75rem' }}>
                                        {search.name}
                                    </h5>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-2xl font-bold">{search.leads}</div>
                                            <div className="text-xs text-tertiary">leads</div>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className="flex items-center gap-xs"
                                                style={{ color: 'var(--accent-green)' }}
                                            >
                                                <TrendingUp size={14} />
                                                <span className="font-semibold">{search.rate}%</span>
                                            </div>
                                            <div className="text-xs text-tertiary">response</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
