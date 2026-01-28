import React from 'react';
import {
    UserPlus,
    Send,
    MessageSquare,
    CheckCircle,
    AlertTriangle,
    Search,
} from 'lucide-react';
import { Activity } from '../types';

interface ActivityFeedProps {
    activities: Activity[];
}

const iconMap: Record<Activity['type'], React.ElementType> = {
    lead_found: UserPlus,
    message_sent: Send,
    response_received: MessageSquare,
    search_completed: Search,
    score_updated: CheckCircle,
    error: AlertTriangle,
};

const colorMap: Record<Activity['type'], string> = {
    lead_found: 'var(--accent-green)',
    message_sent: 'var(--primary-400)',
    response_received: 'var(--accent-cyan)',
    search_completed: 'var(--accent-purple)',
    score_updated: 'var(--accent-yellow)',
    error: 'var(--accent-red)',
};

const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                <h3>Recent Activity</h3>
                <button className="btn btn-ghost text-sm">View All</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {activities.map((activity, index) => {
                    const Icon = iconMap[activity.type];
                    const color = colorMap[activity.type];

                    return (
                        <div
                            key={activity.id}
                            className="animate-fade-in"
                            style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1rem 0',
                                borderBottom:
                                    index < activities.length - 1
                                        ? '1px solid var(--glass-border)'
                                        : 'none',
                                animationDelay: `${index * 0.1}s`,
                            }}
                        >
                            {/* Timeline */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                }}
                            >
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 'var(--radius-lg)',
                                        background: `${color}20`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Icon size={18} color={color} />
                                </div>
                                {index < activities.length - 1 && (
                                    <div
                                        style={{
                                            width: 2,
                                            flex: 1,
                                            background: 'var(--glass-border)',
                                            marginTop: 8,
                                        }}
                                    />
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1 }}>
                                <div className="flex items-center justify-between">
                                    <h5 className="text-sm font-medium">{activity.title}</h5>
                                    <span className="text-xs text-tertiary">
                                        {formatTime(activity.timestamp)}
                                    </span>
                                </div>
                                <p className="text-sm text-secondary" style={{ marginTop: '0.25rem' }}>
                                    {activity.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
