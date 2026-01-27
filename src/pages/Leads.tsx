import React, { useState } from 'react';
import { Header, LeadCard } from '../components';
import { Filter, Grid, List, SortAsc, Download, RefreshCw } from 'lucide-react';
import { useLeads } from '../context';

export const Leads: React.FC = () => {
    const { leads, loading, refresh } = useLeads();
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [scoreFilter, setScoreFilter] = useState<string>('all');

    const filteredLeads = leads.filter((lead) => {
        if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
        if (scoreFilter === 'high' && lead.score < 80) return false;
        if (scoreFilter === 'medium' && (lead.score >= 80 || lead.score < 50)) return false;
        if (scoreFilter === 'low' && lead.score >= 50) return false;
        return true;
    });

    const handleExport = () => {
        // Export leads as CSV
        const headers = ['Name', 'Company', 'Position', 'Industry', 'Location', 'Score', 'Status'];
        const csvContent = [
            headers.join(','),
            ...filteredLeads.map(lead =>
                [lead.name, lead.companyName, lead.position, lead.industry, lead.location, lead.score, lead.status]
                    .map(field => `"${field}"`)
                    .join(',')
            )
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div>
            <Header title="Leads" />
            <div className="page-content">
                {/* Toolbar */}
                <div
                    className="glass-card flex items-center justify-between"
                    style={{ padding: '1rem', marginBottom: '1.5rem' }}
                >
                    <div className="flex items-center gap-md">
                        <div className="flex items-center gap-sm">
                            <Filter size={18} className="text-tertiary" />
                            <select
                                className="input select"
                                style={{ width: 'auto', minWidth: 120 }}
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="responded">Responded</option>
                                <option value="converted">Converted</option>
                            </select>
                        </div>
                        <select
                            className="input select"
                            style={{ width: 'auto', minWidth: 120 }}
                            value={scoreFilter}
                            onChange={(e) => setScoreFilter(e.target.value)}
                        >
                            <option value="all">All Scores</option>
                            <option value="high">High (80+)</option>
                            <option value="medium">Medium (50-79)</option>
                            <option value="low">Low (&lt;50)</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-md">
                        <span className="text-sm text-secondary">{filteredLeads.length} leads</span>
                        <button
                            className="btn btn-ghost btn-icon"
                            onClick={refresh}
                            disabled={loading}
                            title="Refresh leads"
                        >
                            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                        </button>
                        <div className="flex items-center gap-xs">
                            <button
                                className={`btn btn-icon ${viewMode === 'grid' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid size={18} />
                            </button>
                            <button
                                className={`btn btn-icon ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                                onClick={() => setViewMode('list')}
                            >
                                <List size={18} />
                            </button>
                        </div>
                        <button className="btn btn-secondary">
                            <SortAsc size={18} />
                            Sort
                        </button>
                        <button className="btn btn-secondary" onClick={handleExport}>
                            <Download size={18} />
                            Export
                        </button>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center" style={{ padding: '3rem' }}>
                        <RefreshCw size={32} className="animate-spin text-tertiary" />
                    </div>
                )}

                {/* Leads Grid/List */}
                {!loading && (
                    <div
                        className={viewMode === 'grid' ? 'grid grid-cols-3' : ''}
                        style={viewMode === 'list' ? { display: 'flex', flexDirection: 'column', gap: '1rem' } : {}}
                    >
                        {filteredLeads.map((lead, index) => (
                            <div
                                key={lead.id}
                                className="animate-fade-in"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <LeadCard lead={lead} />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && filteredLeads.length === 0 && (
                    <div
                        className="glass-card flex flex-col items-center justify-center"
                        style={{ padding: '4rem', textAlign: 'center' }}
                    >
                        <div
                            style={{
                                width: 80,
                                height: 80,
                                background: 'var(--bg-tertiary)',
                                borderRadius: 'var(--radius-xl)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '1rem',
                            }}
                        >
                            <Filter size={32} className="text-tertiary" />
                        </div>
                        <h4>No leads found</h4>
                        <p className="text-secondary" style={{ marginTop: '0.5rem' }}>
                            Try adjusting your filters or run a new search
                        </p>
                        <a href="/search" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                            Start New Search
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};
