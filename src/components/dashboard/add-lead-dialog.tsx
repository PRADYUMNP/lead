// // import { useState } from "react";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { Calendar } from "@/components/ui/calendar";
// // import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// // import { CalendarIcon } from "lucide-react";
// // import { format } from "date-fns";
// // import { Lead } from "@/types/lead";
// // import { generateLeadId } from "@/data/mockLeads";

// // interface AddLeadDialogProps {
// //   open: boolean;
// //   onOpenChange: (open: boolean) => void;
// //   onAddLead: (lead: Lead) => void;
// //   existingLeadsCount: number;
// // }

// // export function AddLeadDialog({ open, onOpenChange, onAddLead, existingLeadsCount }: AddLeadDialogProps) {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     email: "",
// //     phone: "",
// //     company: "",
// //     source: "" as Lead["source"] | "",
// //     status: "New" as Lead["status"],
// //     notes: "",
// //     followUpDate: undefined as Date | undefined,
// //   });
  
// //   const [isSubmitting, setIsSubmitting] = useState(false);

// //   const postToWebhook = async (leadData: Lead) => {
// //     try {
// //       // Send data in a simple, direct format that the AI Agent can process
// //       const webhookPayload = {
// //         "Lead ID": leadData.id,
// //         "Name": leadData.name,
// //         "Company": leadData.company || "",
// //         "Contact": leadData.email + (leadData.phone ? ` | ${leadData.phone}` : ""),
// //         "Source": leadData.source,
// //         "Status": leadData.status,
// //         "Date Added": leadData.dateAdded.toLocaleDateString('en-CA'),
// //         "Follow-up": leadData.followUpDate ? leadData.followUpDate.toLocaleDateString('en-CA') : "",
// //         "Notes": leadData.notes || ""
// //       };

// //       console.log('Sending lead data to webhook:', webhookPayload);

// //       const response = await fetch('https://omkarpp.app.n8n.cloud/webhook/a209c902-a436-48b5-bcdd-1ae79ae1a99b', {
// //         method: 'POST',              
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(webhookPayload),
// //       });

// //       let responseData;
// //       try {
// //         responseData = await response.json();
// //         console.log('Webhook response:', responseData);
// //       } catch (parseError) {
// //         console.log('Response is not JSON, raw response:', await response.text());
// //         responseData = null;
// //       }

// //       if (response.ok) {
// //         console.log('✅ Lead data posted to webhook successfully');
// //         return true;
// //       } else {
// //         console.error('❌ Webhook returned error status:', response.status);
// //         return false;
// //       }
// //     } catch (error) {
// //       console.error('❌ Error posting to webhook:', error);
// //       return false;
// //     }
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
    
// //     if (!formData.name || !formData.email || !formData.source) {
// //       return; // Basic validation
// //     }

// //     setIsSubmitting(true);

// //     const newLead: Lead = {
// //       id: generateLeadId(existingLeadsCount),
// //       name: formData.name,
// //       email: formData.email,
// //       phone: formData.phone,
// //       company: formData.company,
// //       source: formData.source as Lead["source"],
// //       status: formData.status,
// //       dateAdded: new Date(),
// //       notes: formData.notes,
// //       followUpDate: formData.followUpDate,
// //       reminder: formData.followUpDate && formData.followUpDate <= new Date() ? "⚠ Follow-up Due" : undefined,
// //     };

// //     // Post to webhook first
// //     const webhookSuccess = await postToWebhook(newLead);
    
// //     if (webhookSuccess) {
// //       // Only add to local state if webhook was successful
// //       onAddLead(newLead);
// //       onOpenChange(false);
      
// //       // Reset form
// //       setFormData({
// //         name: "",
// //         email: "",
// //         phone: "",
// //         company: "",
// //         source: "",
// //         status: "New",
// //         notes: "",
// //         followUpDate: undefined,
// //       });
// //     } else {
// //       // Handle webhook error - you might want to show an error message
// //       alert('Failed to save lead. Please try again.');
// //     }
    
// //     setIsSubmitting(false);
// //   };

// //   return (
// //     <Dialog open={open} onOpenChange={onOpenChange}>
// //       <DialogContent className="sm:max-w-md">
// //         <DialogHeader>
// //           <DialogTitle>Add New Lead</DialogTitle>
// //         </DialogHeader>
        
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <div className="grid grid-cols-2 gap-4">
// //             <div className="space-y-2">
// //               <Label htmlFor="name">Name *</Label>
// //               <Input
// //                 id="name"
// //                 value={formData.name}
// //                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
// //                 required
// //                 disabled={isSubmitting}
// //               />
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="email">Email *</Label>
// //               <Input
// //                 id="email"
// //                 type="email"
// //                 value={formData.email}
// //                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// //                 required
// //                 disabled={isSubmitting}
// //               />
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-2 gap-4">
// //             <div className="space-y-2">
// //               <Label htmlFor="phone">Phone</Label>
// //               <Input
// //                 id="phone"
// //                 value={formData.phone}
// //                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
// //                 disabled={isSubmitting}
// //               />
// //             </div>
// //             <div className="space-y-2">
// //               <Label htmlFor="company">Company</Label>
// //               <Input
// //                 id="company"
// //                 value={formData.company}
// //                 onChange={(e) => setFormData({ ...formData, company: e.target.value })}
// //                 disabled={isSubmitting}
// //               />
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-2 gap-4">
// //             <div className="space-y-2">
// //               <Label>Source *</Label>
// //               <Select 
// //                 value={formData.source} 
// //                 onValueChange={(value) => setFormData({ ...formData, source: value as Lead["source"] })}
// //                 disabled={isSubmitting}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue placeholder="Select source" />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="Website form">Website form</SelectItem>
// //                   <SelectItem value="LinkedIn">LinkedIn</SelectItem>
// //                   <SelectItem value="Email">Email</SelectItem>
// //                   <SelectItem value="Referral">Referral</SelectItem>
// //                   <SelectItem value="Other">Other</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //             <div className="space-y-2">
// //               <Label>Status</Label>
// //               <Select 
// //                 value={formData.status} 
// //                 onValueChange={(value) => setFormData({ ...formData, status: value as Lead["status"] })}
// //                 disabled={isSubmitting}
// //               >
// //                 <SelectTrigger>
// //                   <SelectValue />
// //                 </SelectTrigger>
// //                 <SelectContent>
// //                   <SelectItem value="New">New</SelectItem>
// //                   <SelectItem value="Contacted">Contacted</SelectItem>
// //                   <SelectItem value="In Progress">In Progress</SelectItem>
// //                   <SelectItem value="Converted">Converted</SelectItem>
// //                   <SelectItem value="Lost">Lost</SelectItem>
// //                 </SelectContent>
// //               </Select>
// //             </div>
// //           </div>

// //           <div className="space-y-2">
// //             <Label>Follow-up Date</Label>
// //             <Popover>
// //               <PopoverTrigger asChild>
// //                 <Button 
// //                   variant="outline" 
// //                   className="w-full justify-start text-left font-normal"
// //                   disabled={isSubmitting}
// //                 >
// //                   <CalendarIcon className="mr-2 h-4 w-4" />
// //                   {formData.followUpDate ? format(formData.followUpDate, "PPP") : "Select date"}
// //                 </Button>
// //               </PopoverTrigger>
// //               <PopoverContent className="w-auto p-0" align="start">
// //                 <Calendar
// //                   mode="single"
// //                   selected={formData.followUpDate}
// //                   onSelect={(date) => setFormData({ ...formData, followUpDate: date })}
// //                   initialFocus
// //                 />
// //               </PopoverContent>
// //             </Popover>
// //           </div>

// //           <div className="space-y-2">
// //             <Label htmlFor="notes">Notes</Label>
// //             <Textarea
// //               id="notes"
// //               value={formData.notes}
// //               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
// //               rows={3}
// //               disabled={isSubmitting}
// //             />
// //           </div>

// //           <div className="flex justify-end space-x-2 pt-4">
// //             <Button 
// //               type="button" 
// //               variant="outline" 
// //               onClick={() => onOpenChange(false)}
// //               disabled={isSubmitting}
// //             >
// //               Cancel
// //             </Button>
// //             <Button 
// //               type="submit" 
// //               className="bg-gradient-primary hover:opacity-90"
// //               disabled={isSubmitting}
// //             >
// //               {isSubmitting ? "Adding Lead..." : "Add Lead"}
// //             </Button>
// //           </div>
// //         </form>
// //       </DialogContent>
// //     </Dialog>
// //   );
// // }


// import { useState } from "react";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Calendar } from "@/components/ui/calendar";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";
// import { Lead } from "@/types/lead";
// import { generateLeadId } from "@/data/mockLeads";

// interface AddLeadDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   onAddLead: (lead: Lead) => void;
//   existingLeadsCount: number;
// }

// export function AddLeadDialog({ open, onOpenChange, onAddLead, existingLeadsCount }: AddLeadDialogProps) {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     company: "",
//     source: "" as Lead["source"] | "",
//     status: "New" as Lead["status"],
//     notes: "",
//     followUpDate: undefined as Date | undefined,
//   });
  
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const postToWebhook = async (leadData: Lead) => {
//     try {
//       // Send only the required parameters matching your CSV header
//       const webhookPayload = {
//         "Lead ID": leadData.id,
//         "Name": leadData.name,
//         "Company": leadData.company || "",
//         "Contact": leadData.email + (leadData.phone ? ` | ${leadData.phone}` : ""),
//         "Source": leadData.source,
//         "Status": leadData.status,
//         "Date Added": leadData.dateAdded.toLocaleDateString('en-CA'),
//         "Follow-up": leadData.followUpDate ? leadData.followUpDate.toLocaleDateString('en-CA') : "",
//         "Actions": "" // Empty actions field as per your requirement
//       };

//       console.log('Sending lead data to webhook:', webhookPayload);

//       const response = await fetch('https://omkarpp.app.n8n.cloud/webhook/a209c902-a436-48b5-bcdd-1ae79ae1a99b', {
//         method: 'POST',              
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(webhookPayload),
//       });

//       let responseData;
//       try {
//         responseData = await response.json();
//         console.log('Webhook response:', responseData);
//       } catch (parseError) {
//         console.log('Response is not JSON, raw response:', await response.text());
//         responseData = null;
//       }

//       if (response.ok) {
//         console.log('✅ Lead data posted to webhook successfully');
//         return true;
//       } else {
//         console.error('❌ Webhook returned error status:', response.status);
//         return false;
//       }
//     } catch (error) {
//       console.error('❌ Error posting to webhook:', error);
//       return false;
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.name || !formData.email || !formData.source) {
//       return; // Basic validation
//     }

//     setIsSubmitting(true);

//     const newLead: Lead = {
//       id: generateLeadId(existingLeadsCount),
//       name: formData.name,
//       email: formData.email,
//       phone: formData.phone,
//       company: formData.company,
//       source: formData.source as Lead["source"],
//       status: formData.status,
//       dateAdded: new Date(),
//       notes: formData.notes,
//       followUpDate: formData.followUpDate,
//       reminder: formData.followUpDate && formData.followUpDate <= new Date() ? "⚠ Follow-up Due" : undefined,
//     };

//     // Post to webhook first
//     const webhookSuccess = await postToWebhook(newLead);
    
//     if (webhookSuccess) {
//       // Only add to local state if webhook was successful
//       onAddLead(newLead);
//       onOpenChange(false);
      
//       // Reset form
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         company: "",
//         source: "",
//         status: "New",
//         notes: "",
//         followUpDate: undefined,
//       });
//     } else {
//       // Handle webhook error - you might want to show an error message
//       alert('Failed to save lead. Please try again.');
//     }
    
//     setIsSubmitting(false);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>Add New Lead</DialogTitle>
//         </DialogHeader>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="name">Name *</Label>
//               <Input
//                 id="name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 required
//                 disabled={isSubmitting}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="email">Email *</Label>
//               <Input
//                 id="email"
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 required
//                 disabled={isSubmitting}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="phone">Phone</Label>
//               <Input
//                 id="phone"
//                 value={formData.phone}
//                 onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                 disabled={isSubmitting}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label htmlFor="company">Company</Label>
//               <Input
//                 id="company"
//                 value={formData.company}
//                 onChange={(e) => setFormData({ ...formData, company: e.target.value })}
//                 disabled={isSubmitting}
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>Source *</Label>
//               <Select 
//                 value={formData.source} 
//                 onValueChange={(value) => setFormData({ ...formData, source: value as Lead["source"] })}
//                 disabled={isSubmitting}
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select source" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Website form">Website form</SelectItem>
//                   <SelectItem value="LinkedIn">LinkedIn</SelectItem>
//                   <SelectItem value="Email">Email</SelectItem>
//                   <SelectItem value="Referral">Referral</SelectItem>
//                   <SelectItem value="Other">Other</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="space-y-2">
//               <Label>Status</Label>
//               <Select 
//                 value={formData.status} 
//                 onValueChange={(value) => setFormData({ ...formData, status: value as Lead["status"] })}
//                 disabled={isSubmitting}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="New">New</SelectItem>
//                   <SelectItem value="Contacted">Contacted</SelectItem>
//                   <SelectItem value="In Progress">In Progress</SelectItem>
//                   <SelectItem value="Converted">Converted</SelectItem>
//                   <SelectItem value="Lost">Lost</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label>Follow-up Date</Label>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button 
//                   variant="outline" 
//                   className="w-full justify-start text-left font-normal"
//                   disabled={isSubmitting}
//                 >
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {formData.followUpDate ? format(formData.followUpDate, "PPP") : "Select date"}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={formData.followUpDate}
//                   onSelect={(date) => setFormData({ ...formData, followUpDate: date })}
//                   initialFocus
//                 />
//               </PopoverContent>
//             </Popover>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="notes">Notes</Label>
//             <Textarea
//               id="notes"
//               value={formData.notes}
//               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//               rows={3}
//               disabled={isSubmitting}
//             />
//           </div>

//           <div className="flex justify-end space-x-2 pt-4">
//             <Button 
//               type="button" 
//               variant="outline" 
//               onClick={() => onOpenChange(false)}
//               disabled={isSubmitting}
//             >
//               Cancel
//             </Button>
//             <Button 
//               type="submit" 
//               className="bg-gradient-primary hover:opacity-90"
//               disabled={isSubmitting}
//             >
//               {isSubmitting ? "Adding Lead..." : "Add Lead"}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Lead } from "@/types/lead";
import { generateLeadId } from "@/data/mockLeads";

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLead: (lead: Lead) => void;
  existingLeadsCount: number;
}

export function AddLeadDialog({ open, onOpenChange, onAddLead, existingLeadsCount }: AddLeadDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "" as Lead["source"] | "",
    status: "New" as Lead["status"],
    notes: "",
    followUpDate: undefined as Date | undefined,
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postToWebhook = async (leadData: Lead) => {
    try {
      console.log("leadData.id",leadData.id);
      
      // Send only the required parameters matching your CSV header
      const webhookPayload = {
        "LeadID": leadData.id,
        "Name": leadData.name,
        "Company": leadData.company || "",
        "Contact": leadData.email + (leadData.phone ? ` | ${leadData.phone}` : ""),
        "Source": leadData.source,
        "Status": leadData.status,
        "Date Added": format(leadData.dateAdded, "dd/MM/yyyy"),
        "Follow-up": leadData.followUpDate ? format(leadData.followUpDate, "dd/MM/yyyy") : "",
        "Actions": "" // Empty actions field as per your requirement
      };

      console.log('Sending lead data to webhook:', webhookPayload);

      const response = await fetch('https://omkarpp.app.n8n.cloud/webhook/a209c902-a436-48b5-bcdd-1ae79ae1a99b', {
        method: 'POST',              
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      let responseData;
      try {
        responseData = await response.json();
        console.log('Webhook response:', responseData);
      } catch (parseError) {
        console.log('Response is not JSON, raw response:', await response.text());
        responseData = null;
      }

      if (response.ok) {
        console.log('✅ Lead data posted to webhook successfully');
        return true;
      } else {
        console.error('❌ Webhook returned error status:', response.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error posting to webhook:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.source) {
      return; // Basic validation
    }

    setIsSubmitting(true);

    // Generate unique ID with timestamp to avoid duplicates
    const uniqueId = `L${String(existingLeadsCount + 1)}`;
    
    const newLead: Lead = {
      id: uniqueId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      source: formData.source as Lead["source"],
      status: formData.status,
      dateAdded: new Date(),
      notes: formData.notes,
      followUpDate: formData.followUpDate,
      reminder: formData.followUpDate && formData.followUpDate <= new Date() ? "⚠ Follow-up Due" : undefined,
    };

    // Post to webhook first
    const webhookSuccess = await postToWebhook(newLead);
    
    if (webhookSuccess) {
      // Only add to local state if webhook was successful
      onAddLead(newLead);
      onOpenChange(false);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        source: "",
        status: "New",
        notes: "",
        followUpDate: undefined,
      });
    } else {
      // Handle webhook error - you might want to show an error message
      alert('Failed to save lead. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Source *</Label>
              <Select 
                value={formData.source} 
                onValueChange={(value) => setFormData({ ...formData, source: value as Lead["source"] })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Website form">Website form</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Referral">Referral</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData({ ...formData, status: value as Lead["status"] })}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="Contacted">Contacted</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Converted">Converted</SelectItem>
                  <SelectItem value="Lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Follow-up Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                  disabled={isSubmitting}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.followUpDate ? format(formData.followUpDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.followUpDate}
                  onSelect={(date) => setFormData({ ...formData, followUpDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Adding Lead..." : "Add Lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}