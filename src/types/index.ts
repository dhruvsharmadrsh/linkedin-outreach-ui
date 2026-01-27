export interface Lead {
    id: string;
    name: string;
    urn: string;
    profileUrl: string;
    imageUrl: string;
    headline: string;
    location: string;
    isPremium: boolean;
    companyName: string;
    companyUrn: string;
    companyUrl: string;
    industry: string;
    position: string;
    score: number;
    status: 'new' | 'contacted' | 'responded' | 'converted' | 'rejected';
    createdAt: string;
    postsSummary?: string;
    companyPostsSummary?: string;
    companyNewsSummary?: string;
}

export interface Company {
    urn: string;
    name: string;
    linkedinUrl: string;
    websiteUrl: string;
    industry: string;
    size: string;
    description: string;
    logoUrl: string;
}

export interface SearchParams {
    keywords?: string;
    currentTitles?: string;
    currentCompanies?: string;
    location?: string;
    industry?: string;
    companySizes?: string[];
    count: number;
}

export interface Message {
    id: string;
    leadId: string;
    leadName: string;
    subject?: string;
    content: string;
    sentAt: string;
    status: 'draft' | 'sent' | 'delivered' | 'read' | 'replied';
}

export interface WorkflowNode {
    id: string;
    name: string;
    description: string;
    status: 'idle' | 'running' | 'completed' | 'error';
    icon: string;
    progress?: number;
    processedCount?: number;
    totalCount?: number;
}

export interface Activity {
    id: string;
    type: 'lead_found' | 'message_sent' | 'response_received' | 'search_completed' | 'score_updated' | 'error';
    title: string;
    description: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
}

export interface SearchHistory {
    id: string;
    params: SearchParams;
    leadsFound: number;
    executedAt: string;
    name?: string;
}
