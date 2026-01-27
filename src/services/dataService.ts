/**
 * Data Service
 * Handles data transformations between n8n/Google Sheets and the UI
 */

import { Lead, Activity, WorkflowNode } from '../types';
import { N8nExecution, N8nWorkflowNode } from './n8nService';

// ===================================
// Google Sheets Data Transformers
// ===================================

interface GoogleSheetLeadRow {
    Name: string;
    'Profile URL': string;
    Headline: string;
    Location: string;
    'Is Premium': string;
    'Company Name': string;
    'Company Linkedin URN': string;
    'Company Linkedin URL': string;
    'Company URL': string;
    Industry: string;
    Position: string;
    'Company Description': string;
    'Joined At': string;
    Status: string;
    row_number: number;
}

interface GoogleSheetContentRow {
    'Company URN': string;
    'Lead Posts Summary': string;
    'Company Posts Summary': string;
    'Company News Summary': string;
    'Key Topics': string;
    'Pain Signals': string;
    'Buying Signals': string;
    'Last Researched At': string;
}

/**
 * Transform Google Sheets lead row to UI Lead type
 */
export function transformSheetRowToLead(
    row: GoogleSheetLeadRow,
    contentRow?: GoogleSheetContentRow
): Lead {
    // Generate a score based on available data (simplified scoring logic)
    const score = calculateLeadScore(row, contentRow);

    return {
        id: row.row_number.toString(),
        name: row.Name || 'Unknown',
        urn: extractUrn(row['Profile URL']),
        profileUrl: row['Profile URL'] || '',
        imageUrl: generateAvatarUrl(row.Name),
        headline: row.Headline || '',
        location: row.Location || '',
        isPremium: row['Is Premium']?.toLowerCase() === 'true',
        companyName: row['Company Name'] || '',
        companyUrn: row['Company Linkedin URN'] || '',
        companyUrl: row['Company URL'] || '',
        industry: row.Industry || '',
        position: row.Position || '',
        score,
        status: mapStatus(row.Status),
        createdAt: row['Joined At'] || new Date().toISOString(),
        postsSummary: contentRow?.['Lead Posts Summary'],
        companyPostsSummary: contentRow?.['Company Posts Summary'],
        companyNewsSummary: contentRow?.['Company News Summary'],
    };
}

/**
 * Calculate lead score based on available data
 */
function calculateLeadScore(
    row: GoogleSheetLeadRow,
    contentRow?: GoogleSheetContentRow
): number {
    let score = 50; // Base score

    // Premium accounts are more valuable
    if (row['Is Premium']?.toLowerCase() === 'true') score += 15;

    // Has company website
    if (row['Company URL'] && row['Company URL'] !== 'NA') score += 10;

    // Has content intelligence
    if (contentRow) {
        if (contentRow['Lead Posts Summary']) score += 8;
        if (contentRow['Company Posts Summary']) score += 5;
        if (contentRow['Company News Summary']) score += 5;
        if (contentRow['Buying Signals']) score += 12;
        if (contentRow['Pain Signals']) score += 10;
    }

    // Has complete profile data
    if (row.Headline) score += 3;
    if (row.Location) score += 2;

    return Math.min(100, Math.max(0, score));
}

function extractUrn(profileUrl: string): string {
    const match = profileUrl?.match(/\/in\/([^/?]+)/);
    return match ? `urn:li:person:${match[1]}` : '';
}

function generateAvatarUrl(name: string): string {
    // Using UI Avatars as placeholder - replace with actual LinkedIn photos
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=0066e6&color=fff&size=100`;
}

function mapStatus(status: string): Lead['status'] {
    const statusMap: Record<string, Lead['status']> = {
        'New': 'new',
        'Contacted': 'contacted',
        'Responded': 'responded',
        'Converted': 'converted',
        'Rejected': 'rejected',
    };
    return statusMap[status] || 'new';
}

// ===================================
// Workflow Node Transformers
// ===================================

const n8nNodeTypeToIcon: Record<string, string> = {
    '@n8n/n8n-nodes-langchain.lmChatOpenAi': 'Brain',
    'n8n-nodes-hdw.hdwLinkedin': 'Search',
    'n8n-nodes-base.googleSheets': 'FileSpreadsheet',
    'n8n-nodes-base.splitInBatches': 'Layers',
    'n8n-nodes-base.aggregate': 'Merge',
    'n8n-nodes-base.if': 'GitBranch',
    'n8n-nodes-base.httpRequest': 'Globe',
    'n8n-nodes-base.stickyNote': 'StickyNote',
};

const n8nNodeNameToIcon: Record<string, string> = {
    'Find Leads': 'Search',
    'Get Company': 'Building2',
    'Research Website': 'Globe',
    'Analyze Posts': 'FileText',
    'Company Posts': 'Building',
    'Company News': 'Newspaper',
    'Score Leads': 'BarChart3',
    'Send Messages': 'Send',
    'OpenAI': 'Brain',
    'Google Sheets': 'FileSpreadsheet',
};

/**
 * Transform n8n workflow nodes to UI WorkflowNodes
 */
export function transformN8nNodesToWorkflow(
    nodes: N8nWorkflowNode[],
    executionData?: Record<string, unknown[]>
): WorkflowNode[] {
    // Filter out sticky notes
    const workflowNodes = nodes.filter(n => !n.type.includes('stickyNote'));

    // Group nodes by their x position to determine order
    const sortedNodes = [...workflowNodes].sort((a, b) => a.position[0] - b.position[0]);

    return sortedNodes.map((node) => {
        const status = getNodeStatus(node.name, executionData);
        const icon = getNodeIcon(node);

        return {
            id: node.id,
            name: simplifyNodeName(node.name),
            description: generateNodeDescription(node),
            status,
            icon,
            progress: status === 'running' ? 50 : undefined,
            processedCount: status === 'completed' ? 100 : status === 'running' ? 50 : 0,
            totalCount: 100,
        };
    });
}

function simplifyNodeName(name: string): string {
    // Remove common prefixes and simplify
    return name
        .replace(/^HDW\s+/, '')
        .replace(/^Google\s+Sheets\d*/i, 'Save Data')
        .replace(/^Loop\s+Over\s+Items\d*/i, 'Process Batch')
        .slice(0, 20);
}

function getNodeIcon(node: N8nWorkflowNode): string {
    // Check by node name first (more specific)
    for (const [key, icon] of Object.entries(n8nNodeNameToIcon)) {
        if (node.name.toLowerCase().includes(key.toLowerCase())) {
            return icon;
        }
    }
    // Fall back to type mapping
    return n8nNodeTypeToIcon[node.type] || 'Box';
}

function getNodeStatus(
    nodeName: string,
    executionData?: Record<string, unknown[]>
): WorkflowNode['status'] {
    if (!executionData) return 'idle';

    const nodeData = executionData[nodeName];
    if (!nodeData) return 'idle';

    // Check if node has completed execution
    if (Array.isArray(nodeData) && nodeData.length > 0) {
        return 'completed';
    }

    return 'running';
}

function generateNodeDescription(node: N8nWorkflowNode): string {
    const descriptions: Record<string, string> = {
        'hdwLinkedin': 'Search LinkedIn Sales Navigator for leads',
        'googleSheets': 'Read/write data to Google Sheets',
        'lmChatOpenAi': 'AI analysis with GPT models',
        'splitInBatches': 'Process items in batches',
        'aggregate': 'Combine multiple data items',
        'httpRequest': 'Make HTTP request to external API',
    };

    for (const [key, desc] of Object.entries(descriptions)) {
        if (node.type.toLowerCase().includes(key.toLowerCase())) {
            return desc;
        }
    }

    return `Execute ${node.name}`;
}

// ===================================
// Activity Transformers
// ===================================

/**
 * Transform n8n execution to Activity
 */
export function transformExecutionToActivity(execution: N8nExecution): Activity {
    const type = execution.status === 'error'
        ? 'error'
        : execution.status === 'success'
            ? 'search_completed'
            : 'lead_found';

    return {
        id: execution.id,
        type,
        title: execution.status === 'success'
            ? 'Search Completed'
            : execution.status === 'error'
                ? 'Workflow Error'
                : 'Workflow Running',
        description: `Execution ${execution.id.slice(0, 8)}...`,
        timestamp: execution.startedAt,
    };
}

// ===================================
// Export data service
// ===================================

export const dataService = {
    transformSheetRowToLead,
    transformN8nNodesToWorkflow,
    transformExecutionToActivity,
    calculateLeadScore,
};
