import { Button } from "@/components/ui/button";  
import { Plus, Download, Settings } from "lucide-react";

interface DashboardHeaderProps {
  onAddLead: () => void;
}

export function DashboardHeader({ onAddLead }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lead Management Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track and manage your sales pipeline</p>
      </div>
      
      <div className="flex items-center space-x-3">
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
        <Button onClick={onAddLead} className="bg-gradient-primary hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>
    </div>
  );
}