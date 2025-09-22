import { KPICard } from "@/components/ui/kpi-card";
import { TrendingUp, Users, Target, Calendar, AlertTriangle } from "lucide-react";
import { KPI } from "@/types/lead";

interface KPISectionProps {
  kpis: KPI;
}

export function KPISection({ kpis }: KPISectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <KPICard
        title="Total Leads"
        value={kpis.totalLeads}
        icon={Users}
        variant="default"
      />
      <KPICard
        title="Converted Leads"
        value={kpis.convertedLeads}
        change={`+${Math.round((kpis.convertedLeads / kpis.totalLeads) * 100)}%`}
        icon={Target}
        variant="success"
      />
      <KPICard
        title="Conversion Rate"
        value={`${kpis.conversionRate}%`}
        icon={TrendingUp}
        variant="accent"
      />
      <KPICard
        title="Follow-ups Due"
        value={kpis.followUpsDueToday}
        icon={Calendar}
        variant="warning"
      />
      <KPICard
        title="Overdue Follow-ups"
        value={kpis.overdueFollowUps}
        icon={AlertTriangle}
        variant="warning"
      />
    </div>
  );
}