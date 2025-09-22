// 


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, MoreHorizontal, Edit, Trash2, Phone, Mail, AlertTriangle } from "lucide-react";
import { Lead } from "@/types/lead";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LeadsTableProps {
  leads: Lead[];
  onEditLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

export function LeadsTable({ leads, onEditLead, onDeleteLead }: LeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone && lead.phone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500 text-white hover:bg-blue-600";
      case "Contacted": return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "In Progress": return "bg-orange-500 text-white hover:bg-orange-600";
      case "Converted": return "bg-green-500 text-white hover:bg-green-600";
      case "Lost": return "bg-red-500 text-white hover:bg-red-600";
      default: return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  const isOverdue = (followUpDate?: Date) => {
    if (!followUpDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUp = new Date(followUpDate);
    followUp.setHours(0, 0, 0, 0);
    return followUp < today;
  };

  const isToday = (followUpDate?: Date) => {
    if (!followUpDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const followUp = new Date(followUpDate);
    followUp.setHours(0, 0, 0, 0);
    return followUp.getTime() === today.getTime();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get unique sources from leads for filter dropdown
  const uniqueSources = Array.from(new Set(leads.map(lead => lead.source)));

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Leads Management</CardTitle>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Converted">Converted</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {uniqueSources.map(source => (
                  <SelectItem key={source} value={source}>{source}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-muted/50">
                <TableHead className="font-semibold">Lead ID</TableHead>
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Company</TableHead>
                <TableHead className="font-semibold">Contact</TableHead>
                <TableHead className="font-semibold">Source</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date Added</TableHead>
                <TableHead className="font-semibold">Follow-up</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow 
                  key={lead.id} 
                  className={`hover:bg-muted/50 transition-colors ${
                    isOverdue(lead.followUpDate) ? 'bg-red-50 border-l-4 border-l-red-500' : 
                    isToday(lead.followUpDate) ? 'bg-yellow-50 border-l-4 border-l-yellow-500' : ''
                  }`}
                >
                  <TableCell className="font-mono text-sm font-medium">{lead.id}</TableCell>
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell className="text-sm">{lead.company || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {lead.email && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-blue-100"
                          onClick={() => window.location.href = `mailto:${lead.email}`}
                          title={lead.email}
                        >
                          <Mail className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                      {lead.phone && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-green-100"
                          onClick={() => window.location.href = `tel:${lead.phone}`}
                          title={lead.phone}
                        >
                          <Phone className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {!lead.email && !lead.phone && (
                        <span className="text-xs text-muted-foreground">No contact</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {lead.source}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(lead.status)} text-xs`}>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(lead.dateAdded)}
                  </TableCell>
                  <TableCell>
                    {lead.followUpDate ? (
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${
                          isOverdue(lead.followUpDate) ? 'text-red-600 font-medium' : 
                          isToday(lead.followUpDate) ? 'text-yellow-600 font-medium' :
                          'text-muted-foreground'
                        }`}>
                          {formatDate(lead.followUpDate)}
                        </span>
                        {isOverdue(lead.followUpDate) && (
                          <div className="flex items-center">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <Badge variant="destructive" className="text-xs ml-1">
                              Overdue
                            </Badge>
                          </div>
                        )}
                        {isToday(lead.followUpDate) && (
                          <Badge className="bg-yellow-500 text-white text-xs">
                            Due Today
                          </Badge>
                        )}
                        {lead.reminder && !isOverdue(lead.followUpDate) && !isToday(lead.followUpDate) && (
                          <Badge variant="outline" className="text-xs">
                            {lead.reminder}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">No follow-up</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEditLead(lead)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Lead
                        </DropdownMenuItem>
                        {lead.email && (
                          <DropdownMenuItem onClick={() => window.location.href = `mailto:${lead.email}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Send Email
                          </DropdownMenuItem>
                        )}
                        {lead.phone && (
                          <DropdownMenuItem onClick={() => window.location.href = `tel:${lead.phone}`}>
                            <Phone className="h-4 w-4 mr-2" />
                            Call Lead
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => onDeleteLead(lead.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Lead
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground">
              {leads.length === 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-2">No leads found</h3>
                  <p>Start by adding your first lead to get started.</p>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2">No matching leads</h3>
                  <p>Try adjusting your search criteria or filters.</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {leads.length > 0 && (
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Showing {filteredLeads.length} of {leads.length} leads
          </div>
        )}
      </CardContent>
    </Card>
  );
}