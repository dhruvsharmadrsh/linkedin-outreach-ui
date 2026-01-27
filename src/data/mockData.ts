import { Lead, Company, Activity, WorkflowNode, Message, SearchHistory } from '../types';

export const mockLeads: Lead[] = [
    {
        id: '1',
        name: 'Sarah Chen',
        urn: 'urn:li:person:ABC123',
        profileUrl: 'https://linkedin.com/in/sarah-chen',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
        headline: 'VP of Engineering at TechCorp | Building AI-first Products',
        location: 'San Francisco Bay Area',
        isPremium: true,
        companyName: 'TechCorp',
        companyUrn: 'urn:li:company:12345',
        companyUrl: 'https://techcorp.com',
        industry: 'Technology',
        position: 'VP of Engineering',
        score: 92,
        status: 'new',
        createdAt: '2026-01-27T10:00:00Z',
        postsSummary: 'Actively posts about AI, machine learning, and tech leadership...',
        companyNewsSummary: 'Recently raised Series C funding, expanding engineering team...'
    },
    {
        id: '2',
        name: 'Michael Rodriguez',
        urn: 'urn:li:person:DEF456',
        profileUrl: 'https://linkedin.com/in/michael-rodriguez',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        headline: 'CTO at DataFlow | Data Infrastructure Expert',
        location: 'New York City',
        isPremium: true,
        companyName: 'DataFlow',
        companyUrn: 'urn:li:company:23456',
        companyUrl: 'https://dataflow.io',
        industry: 'Software',
        position: 'CTO',
        score: 87,
        status: 'contacted',
        createdAt: '2026-01-26T15:30:00Z',
        postsSummary: 'Shares insights on data engineering and scalability...',
        companyPostsSummary: 'Company posts about product launches and culture...'
    },
    {
        id: '3',
        name: 'Emily Watson',
        urn: 'urn:li:person:GHI789',
        profileUrl: 'https://linkedin.com/in/emily-watson',
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
        headline: 'Head of Growth at ScaleUp | SaaS Marketing Strategy',
        location: 'Austin, Texas',
        isPremium: false,
        companyName: 'ScaleUp',
        companyUrn: 'urn:li:company:34567',
        companyUrl: 'https://scaleup.com',
        industry: 'Marketing & Advertising',
        position: 'Head of Growth',
        score: 78,
        status: 'responded',
        createdAt: '2026-01-25T09:15:00Z'
    },
    {
        id: '4',
        name: 'James Park',
        urn: 'urn:li:person:JKL012',
        profileUrl: 'https://linkedin.com/in/james-park',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        headline: 'Director of Operations at CloudScale',
        location: 'Seattle, WA',
        isPremium: true,
        companyName: 'CloudScale',
        companyUrn: 'urn:li:company:45678',
        companyUrl: 'https://cloudscale.io',
        industry: 'Cloud Computing',
        position: 'Director of Operations',
        score: 65,
        status: 'new',
        createdAt: '2026-01-27T08:00:00Z'
    },
    {
        id: '5',
        name: 'Lisa Thompson',
        urn: 'urn:li:person:MNO345',
        profileUrl: 'https://linkedin.com/in/lisa-thompson',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
        headline: 'CEO & Founder at HealthTech Solutions',
        location: 'Boston, MA',
        isPremium: true,
        companyName: 'HealthTech Solutions',
        companyUrn: 'urn:li:company:56789',
        companyUrl: 'https://healthtech.com',
        industry: 'Healthcare',
        position: 'CEO',
        score: 95,
        status: 'new',
        createdAt: '2026-01-27T11:30:00Z'
    }
];

export const mockCompanies: Company[] = [
    {
        urn: 'urn:li:company:12345',
        name: 'TechCorp',
        linkedinUrl: 'https://linkedin.com/company/techcorp',
        websiteUrl: 'https://techcorp.com',
        industry: 'Technology',
        size: '501-1,000',
        description: 'Building AI-first enterprise solutions',
        logoUrl: 'https://via.placeholder.com/50'
    },
    {
        urn: 'urn:li:company:23456',
        name: 'DataFlow',
        linkedinUrl: 'https://linkedin.com/company/dataflow',
        websiteUrl: 'https://dataflow.io',
        industry: 'Software',
        size: '201-500',
        description: 'Modern data infrastructure for teams',
        logoUrl: 'https://via.placeholder.com/50'
    }
];

export const mockActivities: Activity[] = [
    {
        id: '1',
        type: 'lead_found',
        title: 'New Lead Found',
        description: 'Lisa Thompson - CEO at HealthTech Solutions',
        timestamp: '2026-01-27T11:30:00Z'
    },
    {
        id: '2',
        type: 'score_updated',
        title: 'Lead Score Updated',
        description: 'Sarah Chen score increased to 92',
        timestamp: '2026-01-27T10:45:00Z'
    },
    {
        id: '3',
        type: 'message_sent',
        title: 'Message Sent',
        description: 'Outreach message sent to Michael Rodriguez',
        timestamp: '2026-01-27T10:00:00Z'
    },
    {
        id: '4',
        type: 'response_received',
        title: 'Response Received',
        description: 'Emily Watson replied to your message',
        timestamp: '2026-01-26T16:30:00Z'
    },
    {
        id: '5',
        type: 'search_completed',
        title: 'Search Completed',
        description: 'Found 25 new leads matching your criteria',
        timestamp: '2026-01-26T14:00:00Z'
    }
];

export const mockWorkflowNodes: WorkflowNode[] = [
    {
        id: '1',
        name: 'Find Leads',
        description: 'Search LinkedIn Sales Navigator for matching profiles',
        status: 'completed',
        icon: 'Search',
        processedCount: 50,
        totalCount: 50
    },
    {
        id: '2',
        name: 'Get Company Info',
        description: 'Fetch company details from LinkedIn',
        status: 'completed',
        icon: 'Building2',
        processedCount: 50,
        totalCount: 50
    },
    {
        id: '3',
        name: 'Research Website',
        description: 'AI analyzes company website for business info',
        status: 'running',
        icon: 'Globe',
        processedCount: 32,
        totalCount: 50,
        progress: 64
    },
    {
        id: '4',
        name: 'Analyze Posts',
        description: 'Summarize lead LinkedIn activity',
        status: 'idle',
        icon: 'FileText',
        processedCount: 0,
        totalCount: 50
    },
    {
        id: '5',
        name: 'Company Posts',
        description: 'Analyze company LinkedIn content',
        status: 'idle',
        icon: 'Building',
        processedCount: 0,
        totalCount: 50
    },
    {
        id: '6',
        name: 'Company News',
        description: 'Search Google for recent company news',
        status: 'idle',
        icon: 'Newspaper',
        processedCount: 0,
        totalCount: 50
    },
    {
        id: '7',
        name: 'Score Leads',
        description: 'AI scoring based on all collected data',
        status: 'idle',
        icon: 'BarChart3',
        processedCount: 0,
        totalCount: 50
    },
    {
        id: '8',
        name: 'Send Messages',
        description: 'Send personalized outreach messages',
        status: 'idle',
        icon: 'Send',
        processedCount: 0,
        totalCount: 50
    }
];

export const mockMessages: Message[] = [
    {
        id: '1',
        leadId: '2',
        leadName: 'Michael Rodriguez',
        content: 'Hi Michael, I noticed your work on data infrastructure at DataFlow is impressive. Would love to connect and discuss how we might help with your scaling challenges.',
        sentAt: '2026-01-27T10:00:00Z',
        status: 'delivered'
    },
    {
        id: '2',
        leadId: '3',
        leadName: 'Emily Watson',
        content: 'Hey Emily! Your growth strategies at ScaleUp are fascinating. Id love to share some insights on how we can help accelerate your SaaS metrics.',
        sentAt: '2026-01-26T14:00:00Z',
        status: 'replied'
    }
];

export const mockSearchHistory: SearchHistory[] = [
    {
        id: '1',
        params: {
            currentTitles: 'VP Engineering, CTO',
            industry: 'Technology',
            location: 'United States',
            companySizes: ['201-500', '501-1,000'],
            count: 50
        },
        leadsFound: 47,
        executedAt: '2026-01-27T09:00:00Z',
        name: 'Tech Leaders Q1'
    },
    {
        id: '2',
        params: {
            currentTitles: 'Head of Growth, Marketing Director',
            industry: 'SaaS',
            location: 'North America',
            companySizes: ['51-200', '201-500'],
            count: 30
        },
        leadsFound: 28,
        executedAt: '2026-01-25T11:00:00Z',
        name: 'Growth Marketers'
    }
];
