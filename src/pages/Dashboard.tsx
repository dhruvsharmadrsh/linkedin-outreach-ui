import React from 'react';
import { Header, StatsCard, WorkflowVisualizer, LeadCard, ActivityFeed } from '../components';
import { useApp, useWorkflow, useLeads, useConnection } from '../context';
import { WifiOff, RefreshCw } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { state } = useApp();
    const { nodes } = useWorkflow();
    const { leads, loading: leadsLoading, refresh: refreshLeads } = useLeads();
    const { useMockData } = useConnection();

    // Calculate stats from real data
    const stats = {
        totalLeads: leads.length,
        messagesSent: state.messages.filter(m => m.status !== 'draft').length,
        responseRate: leads.length > 0
            ? ((leads.filter(l => l.status === 'responded' || l.status === 'converted').length / leads.length) * 100).toFixed(1)
            : '0',
        conversions: leads.filter(l => l.status === 'converted').length,
    };

    // Calculate trends (mock for now, would be calculated from historical data)
    const trends = {
        leads: 12,
        messages: 8,
        response: 3,
        conversions: -2,
    };

    return (
        <div>
            <Header title="Dashboard" />
            <div className="page-content">
                {/* Connection Status */}
                {useMockData && (
                    <div
                        className="glass-card flex items-center justify-between"
                        style={{
                            padding: '0.75rem 1rem',
                            marginBottom: '1rem',
                            background: 'rgba(245, 158, 11, 0.1)',
                            borderColor: 'rgba(245, 158, 11, 0.3)',
                        }}
                    >
                        <div className="flex items-center gap-sm">
                            <WifiOff size={16} color="var(--accent-yellow)" />
                            <span className="text-sm">
                                Showing demo data. Configure n8n connection in Settings for live data.
                            </span>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem' }}>
                    <StatsCard
                        icon="Users"
                        label="Total Leads"
                        value={stats.totalLeads.toLocaleString()}
                        trend={{ value: trends.leads, label: 'vs last week' }}
                        gradient="var(--gradient-primary)"
                    />
                    <StatsCard
                        icon="Send"
                        label="Messages Sent"
                        value={stats.messagesSent.toString()}
                        trend={{ value: trends.messages, label: 'vs last week' }}
                        gradient="var(--gradient-success)"
                    />
                    <StatsCard
                        icon="MessageSquare"
                        label="Response Rate"
                        value={`${stats.responseRate}%`}
                        trend={{ value: trends.response, label: 'vs last week' }}
                        gradient="var(--gradient-warning)"
                    />
                    <StatsCard
                        icon="Target"
                        label="Conversions"
                        value={stats.conversions.toString()}
                        trend={{ value: trends.conversions, label: 'vs last week' }}
                        gradient="linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)"
                    />
                </div>

                {/* Workflow Pipeline */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <WorkflowVisualizer nodes={nodes} />
                </div>

                {/* Main Content Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr',
                        gap: '1.5rem',
                    }}
                >
                    {/* Leads Preview */}
                    <div>
                        <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                            <h3>Recent Leads</h3>
                            <div className="flex items-center gap-sm">
                                <button
                                    className="btn btn-ghost"
                                    onClick={refreshLeads}
                                    disabled={leadsLoading}
                                    style={{ padding: '0.25rem 0.5rem' }}
                                >
                                    <RefreshCw size={14} className={leadsLoading ? 'animate-spin' : ''} />
                                </button>
                                <a href="/leads" className="text-sm">
                                    View All →
                                </a>
                            </div>
                        </div>
                        <div className="grid grid-cols-2">
                            {leads.slice(0, 4).map((lead, index) => (
                                <div
                                    key={lead.id}
                                    className="animate-fade-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <LeadCard lead={lead} />
                                </div>
                            ))}
                        </div>
                        {leads.length === 0 && !leadsLoading && (
                            <div
                                className="glass-card flex flex-col items-center justify-center"
                                style={{ padding: '3rem', textAlign: 'center' }}
                            >
                                <p className="text-secondary">No leads yet. Start a search to find leads!</p>
                                <a href="/search" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                    Start Search
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Activity Feed */}
                    <ActivityFeed activities={state.activities} />
                </div>
            </div>
        </div>
    );
};
