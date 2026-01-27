/**
 * Application Context
 * Global state management for leads, workflow, and API status
 */

import React, { createContext, useContext, useReducer, useEffect, ReactNode, useCallback } from 'react';
import { Lead, Activity, WorkflowNode, SearchParams, Message, SearchHistory } from '../types';
import { n8nService, N8nExecution, N8nWorkflow } from '../services/n8nService';
import { dataService } from '../services/dataService';
import { mockLeads, mockActivities, mockWorkflowNodes, mockMessages, mockSearchHistory } from '../data/mockData';

// ===================================
// State Types
// ===================================

export interface AppState {
    // Connection status
    isConnected: boolean;
    isConnecting: boolean;
    connectionError: string | null;
    useMockData: boolean;

    // Leads
    leads: Lead[];
    leadsLoading: boolean;
    leadsError: string | null;

    // Workflow
    workflow: N8nWorkflow | null;
    workflowNodes: WorkflowNode[];
    currentExecution: N8nExecution | null;
    isExecuting: boolean;

    // Activities
    activities: Activity[];

    // Messages
    messages: Message[];

    // Search History
    searchHistory: SearchHistory[];
}

type AppAction =
    | { type: 'SET_CONNECTING'; payload: boolean }
    | { type: 'SET_CONNECTED'; payload: { connected: boolean; error?: string } }
    | { type: 'SET_USE_MOCK_DATA'; payload: boolean }
    | { type: 'SET_LEADS'; payload: Lead[] }
    | { type: 'SET_LEADS_LOADING'; payload: boolean }
    | { type: 'SET_LEADS_ERROR'; payload: string | null }
    | { type: 'ADD_LEAD'; payload: Lead }
    | { type: 'UPDATE_LEAD'; payload: { id: string; updates: Partial<Lead> } }
    | { type: 'SET_WORKFLOW'; payload: N8nWorkflow }
    | { type: 'SET_WORKFLOW_NODES'; payload: WorkflowNode[] }
    | { type: 'SET_EXECUTION'; payload: N8nExecution | null }
    | { type: 'SET_EXECUTING'; payload: boolean }
    | { type: 'ADD_ACTIVITY'; payload: Activity }
    | { type: 'SET_ACTIVITIES'; payload: Activity[] }
    | { type: 'ADD_MESSAGE'; payload: Message }
    | { type: 'SET_MESSAGES'; payload: Message[] }
    | { type: 'ADD_SEARCH_HISTORY'; payload: SearchHistory };

// ===================================
// Initial State
// ===================================

const initialState: AppState = {
    isConnected: false,
    isConnecting: true,
    connectionError: null,
    useMockData: true, // Start with mock data by default

    leads: mockLeads,
    leadsLoading: false,
    leadsError: null,

    workflow: null,
    workflowNodes: mockWorkflowNodes,
    currentExecution: null,
    isExecuting: false,

    activities: mockActivities,
    messages: mockMessages,
    searchHistory: mockSearchHistory,
};

// ===================================
// Reducer
// ===================================

function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_CONNECTING':
            return { ...state, isConnecting: action.payload };

        case 'SET_CONNECTED':
            return {
                ...state,
                isConnected: action.payload.connected,
                isConnecting: false,
                connectionError: action.payload.error || null,
                useMockData: !action.payload.connected,
            };

        case 'SET_USE_MOCK_DATA':
            return { ...state, useMockData: action.payload };

        case 'SET_LEADS':
            return { ...state, leads: action.payload };

        case 'SET_LEADS_LOADING':
            return { ...state, leadsLoading: action.payload };

        case 'SET_LEADS_ERROR':
            return { ...state, leadsError: action.payload };

        case 'ADD_LEAD':
            return { ...state, leads: [action.payload, ...state.leads] };

        case 'UPDATE_LEAD':
            return {
                ...state,
                leads: state.leads.map((lead) =>
                    lead.id === action.payload.id
                        ? { ...lead, ...action.payload.updates }
                        : lead
                ),
            };

        case 'SET_WORKFLOW':
            return { ...state, workflow: action.payload };

        case 'SET_WORKFLOW_NODES':
            return { ...state, workflowNodes: action.payload };

        case 'SET_EXECUTION':
            return { ...state, currentExecution: action.payload };

        case 'SET_EXECUTING':
            return { ...state, isExecuting: action.payload };

        case 'ADD_ACTIVITY':
            return { ...state, activities: [action.payload, ...state.activities].slice(0, 50) };

        case 'SET_ACTIVITIES':
            return { ...state, activities: action.payload };

        case 'ADD_MESSAGE':
            return { ...state, messages: [action.payload, ...state.messages] };

        case 'SET_MESSAGES':
            return { ...state, messages: action.payload };

        case 'ADD_SEARCH_HISTORY':
            return { ...state, searchHistory: [action.payload, ...state.searchHistory] };

        default:
            return state;
    }
}

// ===================================
// Context
// ===================================

interface AppContextValue {
    state: AppState;
    dispatch: React.Dispatch<AppAction>;

    // Actions
    checkConnection: () => Promise<void>;
    fetchWorkflow: () => Promise<void>;
    triggerSearch: (params: SearchParams) => Promise<void>;
    refreshLeads: () => Promise<void>;
    sendMessage: (leadId: string, content: string) => Promise<void>;
    toggleMockData: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ===================================
// Provider
// ===================================

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Check n8n connection on mount
    const checkConnection = useCallback(async () => {
        dispatch({ type: 'SET_CONNECTING', payload: true });

        try {
            const isHealthy = await n8nService.healthCheck();

            if (isHealthy) {
                const isValidKey = await n8nService.validateApiKey();
                dispatch({
                    type: 'SET_CONNECTED',
                    payload: {
                        connected: isValidKey,
                        error: isValidKey ? undefined : 'Invalid API key',
                    },
                });
            } else {
                dispatch({
                    type: 'SET_CONNECTED',
                    payload: { connected: false, error: 'n8n not reachable' },
                });
            }
        } catch (error) {
            dispatch({
                type: 'SET_CONNECTED',
                payload: {
                    connected: false,
                    error: error instanceof Error ? error.message : 'Connection failed',
                },
            });
        }
    }, []);

    // Fetch workflow
    const fetchWorkflow = useCallback(async () => {
        if (state.useMockData) return;

        const response = await n8nService.getWorkflow();

        if (response.data) {
            dispatch({ type: 'SET_WORKFLOW', payload: response.data });

            const nodes = dataService.transformN8nNodesToWorkflow(response.data.nodes);
            dispatch({ type: 'SET_WORKFLOW_NODES', payload: nodes });
        }
    }, [state.useMockData]);

    // Trigger search workflow
    const triggerSearch = useCallback(async (params: SearchParams) => {
        dispatch({ type: 'SET_EXECUTING', payload: true });

        // Add to search history
        const historyEntry: SearchHistory = {
            id: Date.now().toString(),
            params,
            leadsFound: 0,
            executedAt: new Date().toISOString(),
            name: `Search ${new Date().toLocaleDateString()}`,
        };
        dispatch({ type: 'ADD_SEARCH_HISTORY', payload: historyEntry });

        // Add activity
        dispatch({
            type: 'ADD_ACTIVITY',
            payload: {
                id: Date.now().toString(),
                type: 'search_completed',
                title: 'Search Started',
                description: `Searching for ${params.currentTitles || 'leads'}...`,
                timestamp: new Date().toISOString(),
            },
        });

        if (state.useMockData) {
            // Simulate search with mock data
            await new Promise((resolve) => setTimeout(resolve, 2000));
            dispatch({ type: 'SET_EXECUTING', payload: false });

            dispatch({
                type: 'ADD_ACTIVITY',
                payload: {
                    id: (Date.now() + 1).toString(),
                    type: 'search_completed',
                    title: 'Search Completed',
                    description: `Found ${mockLeads.length} leads`,
                    timestamp: new Date().toISOString(),
                },
            });
            return;
        }

        // Real API call
        const response = await n8nService.triggerWorkflow(params);

        if (response.data) {
            dispatch({ type: 'SET_EXECUTION', payload: response.data });

            // Poll for completion
            await n8nService.pollExecution(
                response.data.id,
                (execution) => {
                    dispatch({ type: 'SET_EXECUTION', payload: execution });

                    // Update workflow nodes with execution status
                    if (state.workflow && execution.data?.resultData?.runData) {
                        const nodes = dataService.transformN8nNodesToWorkflow(
                            state.workflow.nodes,
                            execution.data.resultData.runData
                        );
                        dispatch({ type: 'SET_WORKFLOW_NODES', payload: nodes });
                    }
                }
            );
        }

        dispatch({ type: 'SET_EXECUTING', payload: false });
    }, [state.useMockData, state.workflow]);

    // Refresh leads from backend
    const refreshLeads = useCallback(async () => {
        if (state.useMockData) {
            dispatch({ type: 'SET_LEADS', payload: mockLeads });
            return;
        }

        dispatch({ type: 'SET_LEADS_LOADING', payload: true });

        // In a real implementation, this would fetch from n8n/Google Sheets
        // For now, just use mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        dispatch({ type: 'SET_LEADS', payload: mockLeads });
        dispatch({ type: 'SET_LEADS_LOADING', payload: false });
    }, [state.useMockData]);

    // Send message
    const sendMessage = useCallback(async (leadId: string, content: string) => {
        const lead = state.leads.find((l) => l.id === leadId);
        if (!lead) return;

        const message: Message = {
            id: Date.now().toString(),
            leadId,
            leadName: lead.name,
            content,
            sentAt: new Date().toISOString(),
            status: 'sent',
        };

        dispatch({ type: 'ADD_MESSAGE', payload: message });
        dispatch({ type: 'UPDATE_LEAD', payload: { id: leadId, updates: { status: 'contacted' } } });

        dispatch({
            type: 'ADD_ACTIVITY',
            payload: {
                id: Date.now().toString(),
                type: 'message_sent',
                title: 'Message Sent',
                description: `Sent message to ${lead.name}`,
                timestamp: new Date().toISOString(),
            },
        });
    }, [state.leads]);

    // Toggle mock data
    const toggleMockData = useCallback(() => {
        dispatch({ type: 'SET_USE_MOCK_DATA', payload: !state.useMockData });
    }, [state.useMockData]);

    // Initial connection check
    useEffect(() => {
        checkConnection();
    }, [checkConnection]);

    const value: AppContextValue = {
        state,
        dispatch,
        checkConnection,
        fetchWorkflow,
        triggerSearch,
        refreshLeads,
        sendMessage,
        toggleMockData,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ===================================
// Hook
// ===================================

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

// Export individual selectors
export function useLeads() {
    const { state, refreshLeads } = useApp();
    return {
        leads: state.leads,
        loading: state.leadsLoading,
        error: state.leadsError,
        refresh: refreshLeads,
    };
}

export function useWorkflow() {
    const { state, triggerSearch, fetchWorkflow } = useApp();
    return {
        nodes: state.workflowNodes,
        execution: state.currentExecution,
        isExecuting: state.isExecuting,
        triggerSearch,
        fetchWorkflow,
    };
}

export function useConnection() {
    const { state, checkConnection, toggleMockData } = useApp();
    return {
        isConnected: state.isConnected,
        isConnecting: state.isConnecting,
        error: state.connectionError,
        useMockData: state.useMockData,
        checkConnection,
        toggleMockData,
    };
}
