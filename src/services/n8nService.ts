/**
 * n8n API Service
 * Handles all communication with the n8n workflow automation backend
 */

import { config } from '../config';
import { SearchParams } from '../types';

// ===================================
// Types for n8n API responses
// ===================================

export interface N8nExecution {
    id: string;
    finished: boolean;
    mode: string;
    startedAt: string;
    stoppedAt?: string;
    status: 'running' | 'success' | 'error' | 'waiting';
    data?: {
        resultData?: {
            runData?: Record<string, unknown[]>;
        };
    };
}

export interface N8nWorkflow {
    id: string;
    name: string;
    active: boolean;
    nodes: N8nWorkflowNode[];
    connections: Record<string, N8nConnection>;
}

export interface N8nWorkflowNode {
    id: string;
    name: string;
    type: string;
    position: [number, number];
    parameters?: Record<string, unknown>;
}

export interface N8nConnection {
    main?: Array<Array<{ node: string; type: string; index: number }>>;
}

export interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

// ===================================
// API Client Class
// ===================================

class N8nApiService {
    private baseUrl: string;
    private apiKey: string;
    private workflowId: string;

    constructor() {
        this.baseUrl = config.n8n.baseUrl;
        this.apiKey = config.n8n.apiKey;
        this.workflowId = config.n8n.workflowId;
    }

    /**
     * Make authenticated request to n8n API
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${this.baseUrl}/api/v1${endpoint}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...(this.apiKey && { 'X-N8N-API-KEY': this.apiKey }),
            ...options.headers,
        };

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            if (!response.ok) {
                const errorText = await response.text();
                return {
                    data: null,
                    error: `API Error: ${response.status} - ${errorText}`,
                    status: response.status,
                };
            }

            const data = await response.json();
            return { data, error: null, status: response.status };
        } catch (error) {
            return {
                data: null,
                error: error instanceof Error ? error.message : 'Network error',
                status: 0,
            };
        }
    }

    // ===================================
    // Workflow Operations
    // ===================================

    /**
     * Get workflow by ID
     */
    async getWorkflow(workflowId?: string): Promise<ApiResponse<N8nWorkflow>> {
        const id = workflowId || this.workflowId;
        return this.request<N8nWorkflow>(`/workflows/${id}`);
    }

    /**
     * Trigger a workflow execution
     */
    async triggerWorkflow(
        params: SearchParams,
        workflowId?: string
    ): Promise<ApiResponse<N8nExecution>> {
        const id = workflowId || this.workflowId;

        // Transform search params to n8n expected format
        const body = {
            salesNavigatorParams: {
                current_titles: params.currentTitles,
                current_companies: params.currentCompanies,
                location: params.location,
                industry: params.industry,
                company_sizes: params.companySizes,
                keywords: params.keywords,
            },
            count: params.count,
        };

        return this.request<N8nExecution>(`/workflows/${id}/execute`, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    /**
     * Trigger workflow via webhook (alternative method)
     */
    async triggerWebhook(
        webhookPath: string,
        params: SearchParams
    ): Promise<ApiResponse<unknown>> {
        const url = `${this.baseUrl}/webhook/${webhookPath}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });

            const data = await response.json();
            return { data, error: null, status: response.status };
        } catch (error) {
            return {
                data: null,
                error: error instanceof Error ? error.message : 'Webhook error',
                status: 0,
            };
        }
    }

    // ===================================
    // Execution Operations
    // ===================================

    /**
     * Get execution status
     */
    async getExecution(executionId: string): Promise<ApiResponse<N8nExecution>> {
        return this.request<N8nExecution>(`/executions/${executionId}`);
    }

    /**
     * Get recent executions
     */
    async getExecutions(
        workflowId?: string,
        limit = 10
    ): Promise<ApiResponse<{ data: N8nExecution[] }>> {
        const id = workflowId || this.workflowId;
        return this.request<{ data: N8nExecution[] }>(
            `/executions?workflowId=${id}&limit=${limit}`
        );
    }

    /**
     * Poll execution until complete
     */
    async pollExecution(
        executionId: string,
        onUpdate?: (execution: N8nExecution) => void,
        intervalMs = config.polling.executionStatus
    ): Promise<N8nExecution | null> {
        return new Promise((resolve) => {
            const poll = async () => {
                const response = await this.getExecution(executionId);

                if (response.error || !response.data) {
                    resolve(null);
                    return;
                }

                const execution = response.data;
                onUpdate?.(execution);

                if (execution.finished) {
                    resolve(execution);
                } else {
                    setTimeout(poll, intervalMs);
                }
            };

            poll();
        });
    }

    // ===================================
    // Check API Health
    // ===================================

    /**
     * Check if n8n API is reachable
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/healthz`);
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Check if API key is valid
     */
    async validateApiKey(): Promise<boolean> {
        const response = await this.request<unknown>('/workflows');
        return response.status === 200;
    }
}

// Export singleton instance
export const n8nService = new N8nApiService();

// Export class for testing
export { N8nApiService };
