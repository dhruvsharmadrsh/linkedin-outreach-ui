// Application Configuration
// Uses Vite environment variables (prefixed with VITE_)

export const config = {
    n8n: {
        baseUrl: import.meta.env.VITE_N8N_BASE_URL || 'http://localhost:5678',
        apiKey: import.meta.env.VITE_N8N_API_KEY || '',
        workflowId: import.meta.env.VITE_N8N_WORKFLOW_ID || '',
    },
    googleSheets: {
        sheetId: import.meta.env.VITE_GOOGLE_SHEET_ID || '',
    },
    // Polling intervals (milliseconds)
    polling: {
        executionStatus: 2000, // Check execution status every 2 seconds
        leadsRefresh: 30000,   // Refresh leads every 30 seconds
    },
    // API retry configuration
    retry: {
        maxAttempts: 3,
        delayMs: 1000,
    },
} as const;

// Type declaration for Vite environment variables
declare global {
    interface ImportMetaEnv {
        VITE_N8N_BASE_URL?: string;
        VITE_N8N_API_KEY?: string;
        VITE_N8N_WORKFLOW_ID?: string;
        VITE_GOOGLE_SHEET_ID?: string;
    }
}
