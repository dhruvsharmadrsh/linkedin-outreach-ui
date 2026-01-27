import React, { useState } from 'react';
import { Play, Save, RotateCcw, X, Loader2 } from 'lucide-react';
import { SearchParams } from '../types';

interface SearchFormProps {
    onSearch?: (params: SearchParams) => void;
    onSave?: (params: SearchParams, name: string) => void;
    isLoading?: boolean;
}

const companySizes = [
    'Self-employed',
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1,000',
    '1,001-5,000',
    '5,001-10,000',
    '10,001+',
];

const industries = [
    'Technology',
    'Software',
    'SaaS',
    'Healthcare',
    'Finance',
    'E-commerce',
    'Marketing & Advertising',
    'Manufacturing',
    'Consulting',
    'Education',
];

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onSave, isLoading = false }) => {
    const [params, setParams] = useState<SearchParams>({
        keywords: '',
        currentTitles: '',
        currentCompanies: '',
        location: '',
        industry: '',
        companySizes: [],
        count: 25,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch?.(params);
    };

    const handleReset = () => {
        setParams({
            keywords: '',
            currentTitles: '',
            currentCompanies: '',
            location: '',
            industry: '',
            companySizes: [],
            count: 25,
        });
    };

    const toggleCompanySize = (size: string) => {
        setParams((prev) => ({
            ...prev,
            companySizes: prev.companySizes?.includes(size)
                ? prev.companySizes.filter((s) => s !== size)
                : [...(prev.companySizes || []), size],
        }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                    <h3>Search Parameters</h3>
                    <div className="flex items-center gap-sm">
                        <button type="button" className="btn btn-ghost" onClick={handleReset}>
                            <RotateCcw size={16} />
                            Reset
                        </button>
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                    }}
                >
                    {/* Keywords */}
                    <div className="input-group">
                        <label className="input-label">Keywords</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g., AI, machine learning, SaaS"
                            value={params.keywords}
                            onChange={(e) => setParams({ ...params, keywords: e.target.value })}
                        />
                    </div>

                    {/* Job Titles */}
                    <div className="input-group">
                        <label className="input-label">Job Titles</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g., VP Engineering, CTO, Director"
                            value={params.currentTitles}
                            onChange={(e) => setParams({ ...params, currentTitles: e.target.value })}
                        />
                    </div>

                    {/* Companies */}
                    <div className="input-group">
                        <label className="input-label">Companies</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g., Google, Microsoft, Startups"
                            value={params.currentCompanies}
                            onChange={(e) => setParams({ ...params, currentCompanies: e.target.value })}
                        />
                    </div>

                    {/* Location */}
                    <div className="input-group">
                        <label className="input-label">Location</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g., San Francisco, United States"
                            value={params.location}
                            onChange={(e) => setParams({ ...params, location: e.target.value })}
                        />
                    </div>

                    {/* Industry */}
                    <div className="input-group">
                        <label className="input-label">Industry</label>
                        <select
                            className="input select"
                            value={params.industry}
                            onChange={(e) => setParams({ ...params, industry: e.target.value })}
                        >
                            <option value="">All Industries</option>
                            {industries.map((ind) => (
                                <option key={ind} value={ind}>
                                    {ind}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lead Count */}
                    <div className="input-group">
                        <label className="input-label">Number of Leads</label>
                        <input
                            type="number"
                            className="input"
                            min={1}
                            max={100}
                            value={params.count}
                            onChange={(e) => setParams({ ...params, count: parseInt(e.target.value) || 25 })}
                        />
                    </div>
                </div>

                {/* Company Sizes */}
                <div className="input-group" style={{ marginTop: '1rem' }}>
                    <label className="input-label">Company Size</label>
                    <div className="flex" style={{ flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                        {companySizes.map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => toggleCompanySize(size)}
                                style={{
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: 'var(--radius-full)',
                                    background: params.companySizes?.includes(size)
                                        ? 'var(--gradient-primary)'
                                        : 'var(--bg-tertiary)',
                                    border: `1px solid ${params.companySizes?.includes(size)
                                        ? 'transparent'
                                        : 'var(--glass-border)'
                                        }`,
                                    color: params.companySizes?.includes(size)
                                        ? 'white'
                                        : 'var(--text-secondary)',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-base)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                }}
                            >
                                {size}
                                {params.companySizes?.includes(size) && <X size={12} />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div
                    className="flex items-center gap-md"
                    style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}
                >
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isLoading}>
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
                        {isLoading ? 'Searching...' : 'Start Search'}
                    </button>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => onSave?.(params, 'New Search')}
                    >
                        <Save size={18} />
                        Save Search
                    </button>
                </div>
            </div>
        </form>
    );
};
