import React, { useState } from 'react';
import { Header, SearchForm, WorkflowVisualizer } from '../components';
import { Clock, Play, Trash2, Wifi, WifiOff } from 'lucide-react';
import { useWorkflow, useConnection, useApp } from '../context';

export const Search: React.FC = () => {
    const { state, triggerSearch } = useApp();
    const { nodes, isExecuting } = useWorkflow();
    const { useMockData, toggleMockData } = useConnection();
    const [searchError, setSearchError] = useState<string | null>(null);

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSearch = async (params: Parameters<typeof triggerSearch>[0]) => {
        setSearchError(null);
        try {
            await triggerSearch(params);
        } catch (error) {
            setSearchError(error instanceof Error ? error.message : 'Search failed');
        }
    };

    const handleRerun = async (searchHistory: typeof state.searchHistory[0]) => {
        await handleSearch(searchHistory.params);
    };

    return (
        <div>
            <Header title="Search" />
            <div className="page-content">
                {/* Connection Status Banner */}
                <div
                    className="glass-card flex items-center justify-between"
                    style={{
                        padding: '0.75rem 1rem',
                        marginBottom: '1rem',
                        background: useMockData
                            ? 'rgba(245, 158, 11, 0.1)'
                            : 'rgba(16, 185, 129, 0.1)',
                        borderColor: useMockData
                            ? 'rgba(245, 158, 11, 0.3)'
                            : 'rgba(16, 185, 129, 0.3)',
                    }}
                >
                    <div className="flex items-center gap-sm">
                        {useMockData ? (
                            <WifiOff size={16} color="var(--accent-yellow)" />
                        ) : (
                            <Wifi size={16} color="var(--accent-green)" />
                        )}
                        <span className="text-sm">
                            {useMockData
                                ? 'Using mock data (n8n not connected)'
                                : `Connected to n8n`}
                        </span>
                    </div>
                    <button
                        className="btn btn-ghost"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={toggleMockData}
                    >
                        {useMockData ? 'Try Connect' : 'Use Mock Data'}
                    </button>
                </div>

                {/* Workflow Progress (when executing) */}
                {isExecuting && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <WorkflowVisualizer nodes={nodes} />
                    </div>
                )}

                {/* Error Message */}
                {searchError && (
                    <div
                        className="glass-card"
                        style={{
                            padding: '1rem',
                            marginBottom: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderColor: 'rgba(239, 68, 68, 0.3)',
                        }}
                    >
                        <span className="text-sm" style={{ color: 'var(--accent-red)' }}>
                            {searchError}
                        </span>
                    </div>
                )}

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr',
                        gap: '1.5rem',
                    }}
                >
                    {/* Search Form */}
                    <SearchForm
                        onSearch={handleSearch}
                        onSave={(params, name) => console.log('Save:', params, name)}
                        isLoading={isExecuting}
                    />

                    {/* Search History */}
                    <div className="glass-card" style={{ padding: '1.5rem' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Search History</h3>

                        <div className="flex flex-col gap-md">
                            {state.searchHistory.length === 0 ? (
                                <div className="text-sm text-tertiary" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No searches yet
                                </div>
                            ) : (
                                state.searchHistory.map((search) => (
                                    <div
                                        key={search.id}
                                        style={{
                                            padding: '1rem',
                                            background: 'var(--bg-tertiary)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--glass-border)',
                                        }}
                                    >
                                        <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                                            <h5 className="font-medium">{search.name || 'Untitled Search'}</h5>
                                            <span className="badge badge-success">{search.leadsFound} leads</span>
                                        </div>

                                        <div className="flex items-center gap-sm text-xs text-tertiary" style={{ marginBottom: '0.75rem' }}>
                                            <Clock size={12} />
                                            <span>{formatDate(search.executedAt)}</span>
                                        </div>

                                        <div className="text-xs text-secondary" style={{ marginBottom: '0.75rem' }}>
                                            {search.params.currentTitles && (
                                                <div>Titles: {search.params.currentTitles}</div>
                                            )}
                                            {search.params.industry && (
                                                <div>Industry: {search.params.industry}</div>
                                            )}
                                            {search.params.location && (
                                                <div>Location: {search.params.location}</div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-sm">
                                            <button
                                                className="btn btn-primary"
                                                style={{ flex: 1, padding: '0.5rem' }}
                                                onClick={() => handleRerun(search)}
                                                disabled={isExecuting}
                                            >
                                                <Play size={14} />
                                                Re-run
                                            </button>
                                            <button className="btn btn-ghost btn-icon" style={{ width: 32, height: 32 }}>
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
