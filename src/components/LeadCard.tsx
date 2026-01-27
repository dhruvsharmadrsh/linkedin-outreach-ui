import React from 'react';
import { ExternalLink, MessageSquare, X, Crown, MapPin, Building2 } from 'lucide-react';
import { Lead } from '../types';

interface LeadCardProps {
    lead: Lead;
    onView?: (lead: Lead) => void;
    onMessage?: (lead: Lead) => void;
    onSkip?: (lead: Lead) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ lead, onView, onMessage, onSkip }) => {
    const getScoreClass = () => {
        if (lead.score >= 80) return 'score-high';
        if (lead.score >= 50) return 'score-medium';
        return 'score-low';
    };

    const getStatusBadge = () => {
        const statusMap: Record<Lead['status'], { label: string; class: string }> = {
            new: { label: 'New', class: 'badge-primary' },
            contacted: { label: 'Contacted', class: 'badge-warning' },
            responded: { label: 'Responded', class: 'badge-success' },
            converted: { label: 'Converted', class: 'badge-success' },
            rejected: { label: 'Rejected', class: 'badge-danger' },
        };
        return statusMap[lead.status];
    };

    const status = getStatusBadge();

    return (
        <div
            className="glass-card"
            style={{
                padding: '1.25rem',
                transition: 'all var(--transition-base)',
                cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-xl)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
        >
            <div className="flex items-center gap-md" style={{ marginBottom: '1rem' }}>
                {/* Avatar */}
                <div style={{ position: 'relative' }}>
                    <img
                        src={lead.imageUrl}
                        alt={lead.name}
                        className="avatar avatar-lg"
                        style={{ objectFit: 'cover' }}
                    />
                    {lead.isPremium && (
                        <div
                            style={{
                                position: 'absolute',
                                bottom: -4,
                                right: -4,
                                background: 'var(--gradient-warning)',
                                borderRadius: '50%',
                                padding: 4,
                                border: '2px solid var(--bg-secondary)',
                            }}
                        >
                            <Crown size={12} color="white" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-sm">
                        <h4 className="truncate" style={{ fontSize: '1rem' }}>
                            {lead.name}
                        </h4>
                        <span className={`badge ${status.class}`}>{status.label}</span>
                    </div>
                    <p className="text-sm text-secondary truncate">{lead.headline}</p>
                </div>

                {/* Score */}
                <div className={`score-badge ${getScoreClass()}`}>{lead.score}</div>
            </div>

            {/* Details */}
            <div className="flex flex-col gap-xs" style={{ marginBottom: '1rem' }}>
                <div className="flex items-center gap-sm text-sm text-tertiary">
                    <Building2 size={14} />
                    <span className="truncate">{lead.companyName}</span>
                    <span>•</span>
                    <span>{lead.industry}</span>
                </div>
                <div className="flex items-center gap-sm text-sm text-tertiary">
                    <MapPin size={14} />
                    <span>{lead.location}</span>
                </div>
            </div>

            {/* Summaries */}
            {lead.postsSummary && (
                <div
                    style={{
                        padding: '0.75rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                    }}
                >
                    <p className="text-xs text-secondary" style={{ lineHeight: 1.5 }}>
                        {lead.postsSummary.substring(0, 100)}...
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-sm">
                <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => onView?.(lead)}
                >
                    <ExternalLink size={16} />
                    View Profile
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => onMessage?.(lead)}
                >
                    <MessageSquare size={16} />
                </button>
                <button className="btn btn-ghost" onClick={() => onSkip?.(lead)}>
                    <X size={16} />
                </button>
            </div>
        </div>
    );
};
