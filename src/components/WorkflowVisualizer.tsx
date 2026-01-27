import React, { useState } from 'react';
import {
    Search,
    Building2,
    Globe,
    FileText,
    Building,
    Newspaper,
    BarChart3,
    Send,
    CheckCircle2,
    Clock,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { WorkflowNode } from '../types';

interface WorkflowVisualizerProps {
    nodes: WorkflowNode[];
}

const iconMap: Record<string, React.FC<{ size?: number; color?: string; className?: string }>> = {
    Search,
    Building2,
    Globe,
    FileText,
    Building,
    Newspaper,
    BarChart3,
    Send,
};

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({ nodes }) => {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);

    const getStatusIcon = (status: WorkflowNode['status']) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 size={16} color="var(--accent-green)" />;
            case 'running':
                return <Loader2 size={16} color="var(--primary-400)" className="animate-spin" />;
            case 'error':
                return <AlertCircle size={16} color="var(--accent-red)" />;
            default:
                return <Clock size={16} color="var(--text-tertiary)" />;
        }
    };

    const getStatusColor = (status: WorkflowNode['status']) => {
        switch (status) {
            case 'completed':
                return 'var(--accent-green)';
            case 'running':
                return 'var(--primary-400)';
            case 'error':
                return 'var(--accent-red)';
            default:
                return 'var(--text-tertiary)';
        }
    };

    return (
        <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                <h3>Workflow Pipeline</h3>
                <div className="flex items-center gap-md">
                    <span className="badge badge-success">
                        <span style={{ marginRight: 4 }}>●</span> Running
                    </span>
                </div>
            </div>

            {/* Pipeline Visualization */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    overflowX: 'auto',
                    padding: '1rem 0',
                    gap: '0.5rem',
                }}
            >
                {nodes.map((node, index) => {
                    const Icon = iconMap[node.icon] || Search;
                    const isSelected = selectedNode === node.id;

                    return (
                        <React.Fragment key={node.id}>
                            {/* Node */}
                            <div
                                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '1rem',
                                    background: isSelected
                                        ? 'rgba(0, 102, 230, 0.1)'
                                        : 'var(--bg-tertiary)',
                                    border: `2px solid ${isSelected ? 'var(--primary-500)' : 'var(--glass-border)'}`,
                                    borderRadius: 'var(--radius-xl)',
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-base)',
                                    minWidth: 100,
                                    position: 'relative',
                                }}
                            >
                                {/* Status indicator */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: -8,
                                        right: -8,
                                        background: 'var(--bg-secondary)',
                                        borderRadius: '50%',
                                        padding: 4,
                                        border: '2px solid var(--bg-secondary)',
                                    }}
                                >
                                    {getStatusIcon(node.status)}
                                </div>

                                {/* Icon */}
                                <div
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: 'var(--radius-lg)',
                                        background:
                                            node.status === 'completed'
                                                ? 'var(--gradient-success)'
                                                : node.status === 'running'
                                                    ? 'var(--gradient-primary)'
                                                    : 'var(--bg-elevated)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        boxShadow:
                                            node.status === 'running'
                                                ? '0 0 20px rgba(0, 102, 230, 0.4)'
                                                : 'none',
                                    }}
                                >
                                    <Icon
                                        size={24}
                                        color={
                                            node.status === 'idle' ? 'var(--text-tertiary)' : 'white'
                                        }
                                    />
                                </div>

                                {/* Label */}
                                <span
                                    className="text-xs font-medium text-center"
                                    style={{
                                        color:
                                            node.status === 'idle'
                                                ? 'var(--text-tertiary)'
                                                : 'var(--text-primary)',
                                        maxWidth: 80,
                                    }}
                                >
                                    {node.name}
                                </span>

                                {/* Progress */}
                                {node.status === 'running' && node.progress !== undefined && (
                                    <div
                                        style={{
                                            width: '100%',
                                            height: 4,
                                            background: 'var(--bg-primary)',
                                            borderRadius: 'var(--radius-full)',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${node.progress}%`,
                                                height: '100%',
                                                background: 'var(--gradient-primary)',
                                                transition: 'width 0.3s ease',
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Connector */}
                            {index < nodes.length - 1 && (
                                <div
                                    style={{
                                        width: 32,
                                        height: 2,
                                        background:
                                            node.status === 'completed'
                                                ? 'var(--accent-green)'
                                                : 'var(--bg-elevated)',
                                        position: 'relative',
                                    }}
                                >
                                    {node.status === 'completed' && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                right: -4,
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: 0,
                                                height: 0,
                                                borderTop: '4px solid transparent',
                                                borderBottom: '4px solid transparent',
                                                borderLeft: '6px solid var(--accent-green)',
                                            }}
                                        />
                                    )}
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Node Details */}
            {selectedNode && (
                <div
                    className="animate-fade-in"
                    style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-lg)',
                        border: '1px solid var(--glass-border)',
                    }}
                >
                    {(() => {
                        const node = nodes.find((n) => n.id === selectedNode);
                        if (!node) return null;
                        return (
                            <>
                                <div className="flex items-center justify-between">
                                    <h4>{node.name}</h4>
                                    <span
                                        className="badge"
                                        style={{
                                            background: `${getStatusColor(node.status)}20`,
                                            color: getStatusColor(node.status),
                                        }}
                                    >
                                        {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
                                    </span>
                                </div>
                                <p className="text-sm text-secondary" style={{ marginTop: '0.5rem' }}>
                                    {node.description}
                                </p>
                                {node.processedCount !== undefined && (
                                    <p className="text-xs text-tertiary" style={{ marginTop: '0.5rem' }}>
                                        Processed: {node.processedCount} / {node.totalCount}
                                    </p>
                                )}
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
};
