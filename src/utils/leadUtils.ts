import { Lead, KPI, ChartData } from "@/types/lead";

export function calculateKPIs(leads: Lead[]): KPI {
  const totalLeads = leads.length;
  const convertedLeads = leads.filter(lead => lead.status === 'Converted').length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const followUpsDueToday = leads.filter(lead => {
    if (!lead.followUpDate) return false;
    const followUpDate = new Date(lead.followUpDate);
    followUpDate.setHours(0, 0, 0, 0);
    return followUpDate.getTime() === today.getTime();
  }).length;

  const overdueFollowUps = leads.filter(lead => {
    if (!lead.followUpDate) return false;
    const followUpDate = new Date(lead.followUpDate);
    followUpDate.setHours(0, 0, 0, 0);
    return followUpDate.getTime() < today.getTime();
  }).length;

  return {
    totalLeads,
    convertedLeads,
    conversionRate,
    followUpsDueToday,
    overdueFollowUps
  };
}

export function generateChartData(leads: Lead[]): ChartData {
  // Source distribution
  const sourceMap = new Map<string, number>();
  leads.forEach(lead => {
    sourceMap.set(lead.source, (sourceMap.get(lead.source) || 0) + 1);
  });

  const sourceColors = {
    'Website form': 'hsl(var(--chart-primary))',
    'LinkedIn': 'hsl(var(--chart-secondary))', 
    'Email': 'hsl(var(--chart-accent))',
    'Referral': 'hsl(var(--chart-success))',
    'Other': 'hsl(var(--chart-warning))'
  };

  const sourceData = Array.from(sourceMap.entries()).map(([name, value]) => ({
    name,
    value,
    color: sourceColors[name as keyof typeof sourceColors] || 'hsl(var(--muted))'
  }));

  // Status distribution
  const statusMap = new Map<string, number>();
  leads.forEach(lead => {
    statusMap.set(lead.status, (statusMap.get(lead.status) || 0) + 1);
  });

  const statusColors = {
    'New': 'hsl(var(--chart-primary))',
    'Contacted': 'hsl(var(--chart-accent))',
    'In Progress': 'hsl(var(--chart-warning))', 
    'Converted': 'hsl(var(--chart-success))',
    'Lost': 'hsl(var(--destructive))'
  };

  const statusData = Array.from(statusMap.entries()).map(([name, value]) => ({
    name,
    value,
    color: statusColors[name as keyof typeof statusColors] || 'hsl(var(--muted))'
  }));

  // Monthly trend (last 6 months)
  const monthlyMap = new Map<string, number>();
  const currentDate = new Date();
  
  // Initialize last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    monthlyMap.set(monthKey, 0);
  }

  // Count leads by month
  leads.forEach(lead => {
    const leadDate = new Date(lead.dateAdded);
    const monthKey = leadDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
    }
  });

  const monthlyData = Array.from(monthlyMap.entries()).map(([month, leads]) => ({
    month,
    leads
  }));

  return {
    sourceData,
    statusData,
    monthlyData
  };
}