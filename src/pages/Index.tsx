import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPISection } from "@/components/dashboard/kpi-section";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { LeadsTable } from "@/components/dashboard/leads-table";
import { AddLeadDialog } from "@/components/dashboard/add-lead-dialog";
import { fetchLeads } from "@/data/mockLeads";
import { Lead } from "@/types/lead";
import { calculateKPIs, generateChartData } from "@/utils/leadUtils";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeads = async () => {
      try {
        const fetchedLeads = await fetchLeads();
        setLeads(fetchedLeads);
      } catch (error) {
        console.error("Failed to load leads:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLeads();
  }, []);
  const [addLeadDialogOpen, setAddLeadDialogOpen] = useState(false);
  const { toast } = useToast();

  const kpis = calculateKPIs(leads);
  const chartData = generateChartData(leads);

  const handleAddLead = (newLead: Lead) => {
    setLeads(prev => [newLead, ...prev]);
    toast({
      title: "Lead Added",
      description: `${newLead.name} has been added to your leads.`,
    });
  };

  const handleEditLead = (lead: Lead) => {
    // TODO: Implement edit functionality
    console.log("Edit lead:", lead);
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(lead => lead.id !== leadId));
    toast({
      title: "Lead Deleted",
      description: "The lead has been removed from your pipeline.",
      variant: "destructive",
    });
  };

 

  return (
    <div className="min-h-screen bg-dashboard-bg">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <DashboardHeader onAddLead={() => setAddLeadDialogOpen(true)} />
        
        {/* KPI Cards */}
        <KPISection kpis={kpis} />
        
        {/* Charts Section */}
        <ChartsSection chartData={chartData} />
        
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-1 gap-8">
          {/* Leads Table - Takes 3 columns */}
          <div className="xl:col-span-3">
            <LeadsTable 
              leads={leads}
              onEditLead={handleEditLead}
              onDeleteLead={handleDeleteLead}
            />
          </div>
          
          {/* Zapier Integration - Takes 1 column */}
          {/* <div className="xl:col-span-1">
            <ZapierIntegration onWebhookTest={handleZapierWebhook} />
          </div> */}
        </div>

        {/* Add Lead Dialog */}
        <AddLeadDialog 
          open={addLeadDialogOpen}
          onOpenChange={setAddLeadDialogOpen}
          onAddLead={handleAddLead}
          existingLeadsCount={leads.length}
        />
      </div>
    </div>
  );
};

export default Index;
