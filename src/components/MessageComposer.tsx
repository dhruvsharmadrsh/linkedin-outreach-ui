import React, { useState } from 'react';
import { Send, Sparkles, Clock, ChevronDown, User, Loader2 } from 'lucide-react';

interface MessageComposerProps {
    leadName?: string;
    onSend?: (message: string) => void;
    onSchedule?: (message: string, date: Date) => void;
    isLoading?: boolean;
}

const templates = [
    {
        id: '1',
        name: 'Initial Outreach',
        content: `Hi {{name}},

I came across your profile and was impressed by your work at {{company}}. I'd love to connect and share some insights on how we've helped similar companies in {{industry}}.

Would you be open to a quick chat this week?

Best regards`,
    },
    {
        id: '2',
        name: 'Follow Up',
        content: `Hi {{name}},

I wanted to follow up on my previous message. I believe we could really help {{company}} with some of the challenges you might be facing.

Let me know if you'd like to learn more!`,
    },
    {
        id: '3',
        name: 'Value Proposition',
        content: `Hi {{name}},

Quick question - are you looking to improve your {{industry}} workflow efficiency?

We've helped companies like yours increase productivity by 40%. I'd love to show you how.

Interested in a quick 15-min demo?`,
    },
];

export const MessageComposer: React.FC<MessageComposerProps> = ({
    leadName,
    onSend,
    onSchedule,
    isLoading = false,
}) => {
    const [message, setMessage] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [showTemplates, setShowTemplates] = useState(false);
    const maxLength = 1900;

    const handleTemplateSelect = (template: (typeof templates)[0]) => {
        setMessage(template.content);
        setSelectedTemplate(template.id);
        setShowTemplates(false);
    };

    const handleAIEnhance = () => {
        // Simulate AI enhancement
        setMessage((prev) => prev + '\n\n[AI-enhanced personalization would be added here based on lead research data]');
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
                <h3>Compose Message</h3>
                {leadName && (
                    <div className="flex items-center gap-sm text-sm text-secondary">
                        <User size={16} />
                        <span>To: {leadName}</span>
                    </div>
                )}
            </div>

            {/* Template Selector */}
            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <button
                    type="button"
                    className="btn btn-secondary w-full"
                    style={{ justifyContent: 'space-between' }}
                    onClick={() => setShowTemplates(!showTemplates)}
                >
                    <span>
                        {selectedTemplate
                            ? templates.find((t) => t.id === selectedTemplate)?.name
                            : 'Choose a template...'}
                    </span>
                    <ChevronDown
                        size={18}
                        style={{
                            transform: showTemplates ? 'rotate(180deg)' : 'rotate(0)',
                            transition: 'transform var(--transition-base)',
                        }}
                    />
                </button>

                {showTemplates && (
                    <div
                        className="animate-fade-in"
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '0.5rem',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: 'var(--radius-lg)',
                            zIndex: 10,
                            overflow: 'hidden',
                        }}
                    >
                        {templates.map((template) => (
                            <button
                                key={template.id}
                                type="button"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    textAlign: 'left',
                                    background:
                                        selectedTemplate === template.id
                                            ? 'rgba(0, 102, 230, 0.1)'
                                            : 'transparent',
                                    border: 'none',
                                    borderBottom: '1px solid var(--glass-border)',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    transition: 'background var(--transition-fast)',
                                }}
                                onClick={() => handleTemplateSelect(template)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(0, 102, 230, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background =
                                        selectedTemplate === template.id
                                            ? 'rgba(0, 102, 230, 0.1)'
                                            : 'transparent';
                                }}
                            >
                                <div className="font-medium text-sm">{template.name}</div>
                                <div className="text-xs text-tertiary" style={{ marginTop: '0.25rem' }}>
                                    {template.content.substring(0, 50)}...
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div style={{ position: 'relative' }}>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your personalized message here..."
                    className="input"
                    style={{
                        minHeight: 200,
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        lineHeight: 1.6,
                    }}
                    maxLength={maxLength}
                />
                <div
                    className="flex items-center justify-between text-xs text-tertiary"
                    style={{ marginTop: '0.5rem' }}
                >
                    <span>
                        {message.length} / {maxLength} characters
                    </span>
                    <div
                        style={{
                            width: 100,
                            height: 4,
                            background: 'var(--bg-primary)',
                            borderRadius: 'var(--radius-full)',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: `${(message.length / maxLength) * 100}%`,
                                height: '100%',
                                background:
                                    message.length > maxLength * 0.9
                                        ? 'var(--accent-red)'
                                        : message.length > maxLength * 0.7
                                            ? 'var(--accent-yellow)'
                                            : 'var(--gradient-primary)',
                                transition: 'width 0.3s ease',
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* AI Assist Button */}
            <button
                type="button"
                className="btn btn-ghost w-full"
                style={{
                    marginTop: '1rem',
                    border: '1px dashed var(--glass-border)',
                    background: 'rgba(139, 92, 246, 0.05)',
                }}
                onClick={handleAIEnhance}
            >
                <Sparkles size={18} color="var(--accent-purple)" />
                <span style={{ color: 'var(--accent-purple)' }}>Enhance with AI</span>
            </button>

            {/* Actions */}
            <div
                className="flex items-center gap-md"
                style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}
            >
                <button
                    type="button"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => onSend?.(message)}
                    disabled={!message.trim() || isLoading}
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {isLoading ? 'Sending...' : 'Send Message'}
                </button>
                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onSchedule?.(message, new Date())}
                    disabled={!message.trim()}
                >
                    <Clock size={18} />
                    Schedule
                </button>
            </div>
        </div>
    );
};
