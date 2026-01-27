import React, { useState } from 'react';
import { Header, MessageComposer } from '../components';
import { Send, CheckCheck, Eye, MessageCircle, Clock } from 'lucide-react';
import { useApp, useLeads } from '../context';

export const Messages: React.FC = () => {
    const { state, sendMessage } = useApp();
    const { leads } = useLeads();
    const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
    const [isSending, setIsSending] = useState(false);

    const selectedLead = leads.find(l => l.id === selectedLeadId);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'sent':
                return <Send size={14} color="var(--text-tertiary)" />;
            case 'delivered':
                return <CheckCheck size={14} color="var(--primary-400)" />;
            case 'read':
                return <Eye size={14} color="var(--accent-green)" />;
            case 'replied':
                return <MessageCircle size={14} color="var(--accent-cyan)" />;
            default:
                return <Clock size={14} color="var(--text-tertiary)" />;
        }
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSend = async (content: string) => {
        if (!selectedLead) return;
        setIsSending(true);
        try {
            await sendMessage(selectedLead.id, content);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div>
            <Header title="Messages" />
            <div className="page-content">
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '1.5rem',
                    }}
                >
                    {/* Compose Section */}
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Compose New Message</h3>

                        {/* Lead Selector */}
                        <div
                            className="glass-card"
                            style={{ padding: '1rem', marginBottom: '1rem' }}
                        >
                            <label className="input-label" style={{ marginBottom: '0.5rem', display: 'block' }}>
                                Select Lead
                            </label>
                            <select
                                className="input select"
                                value={selectedLeadId}
                                onChange={(e) => setSelectedLeadId(e.target.value)}
                            >
                                {leads.length === 0 && (
                                    <option value="">No leads available</option>
                                )}
                                {leads.map((lead) => (
                                    <option key={lead.id} value={lead.id}>
                                        {lead.name} - {lead.companyName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedLead ? (
                            <MessageComposer
                                leadName={selectedLead.name}
                                onSend={handleSend}
                                onSchedule={(msg, date) => console.log('Schedule:', msg, date)}
                                isLoading={isSending}
                            />
                        ) : (
                            <div
                                className="glass-card flex flex-col items-center justify-center"
                                style={{ padding: '3rem', textAlign: 'center' }}
                            >
                                <p className="text-secondary">Select a lead to compose a message</p>
                                <a href="/leads" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                    View Leads
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Sent Messages */}
                    <div>
                        <h3 style={{ marginBottom: '1rem' }}>Sent Messages</h3>
                        <div className="flex flex-col gap-md">
                            {state.messages.length === 0 ? (
                                <div
                                    className="glass-card"
                                    style={{ padding: '2rem', textAlign: 'center' }}
                                >
                                    <p className="text-secondary">No messages sent yet</p>
                                </div>
                            ) : (
                                state.messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className="glass-card animate-fade-in"
                                        style={{ padding: '1.25rem' }}
                                    >
                                        <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
                                            <div className="flex items-center gap-sm">
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
                                                    <span className="text-xs font-bold" style={{ color: 'white' }}>
                                                        {message.leadName.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h5 className="text-sm font-medium">{message.leadName}</h5>
                                                    <span className="text-xs text-tertiary">{formatDate(message.sentAt)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-xs">
                                                {getStatusIcon(message.status)}
                                                <span className="text-xs text-tertiary capitalize">{message.status}</span>
                                            </div>
                                        </div>
                                        <p
                                            className="text-sm text-secondary"
                                            style={{
                                                lineHeight: 1.6,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {message.content}
                                        </p>
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
