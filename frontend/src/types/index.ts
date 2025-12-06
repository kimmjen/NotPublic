export type Severity = 'critical' | 'warning' | 'info';

export interface TimelineEvent {
    date: string;
    title: string;
    title_ko?: string;
}

export interface RelatedLink {
    type: 'news' | 'video';
    title: string;
    title_ko?: string;
    url: string;
    source: string;
}

export interface Incident {
    id: number;
    company_name: string;
    company_name_ko?: string;
    incident_date: string;
    severity: Severity;
    leaked_items: string[];
    leaked_items_ko?: string[];
    description: string;
    description_ko?: string;
    leaked_count: number;
    original_url?: string;
    timeline?: TimelineEvent[];
    related_links?: RelatedLink[];
    fine_amount?: string;
    fine_amount_ko?: string;
}

export interface LawEvent {
    date: string;
    title: string;
    title_ko: string;
    description: string;
    description_ko: string;
    type: 'enacted' | 'amended' | 'enforcement' | 'ruling';
}
