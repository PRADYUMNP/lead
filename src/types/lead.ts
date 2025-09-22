export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: 'Website form' | 'LinkedIn' | 'Email' | 'Referral' | 'Other';
  status: 'New' | 'Contacted' | 'In Progress' | 'Converted' | 'Lost';
  dateAdded: Date;
  notes: string;
  followUpDate?: Date;
  reminder?: string;
}

export interface KPI {
  totalLeads: number;
  convertedLeads: number;
  conversionRate: number;
  followUpsDueToday: number;
  overdueFollowUps: number;
}

export interface ChartData {
  sourceData: Array<{ name: string; value: number; color: string }>;
  statusData: Array<{ name: string; value: number; color: string }>;
  monthlyData: Array<{ month: string; leads: number }>;
}