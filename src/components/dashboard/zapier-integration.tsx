import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Zap, ExternalLink, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ZapierIntegrationProps {
  onWebhookTest?: (data: any) => void;
}

export function ZapierIntegration({ onWebhookTest }: ZapierIntegrationProps) {
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!webhookUrl) {
      toast({
        title: "Error",
        description: "Please enter your Zapier webhook URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log("Triggering Zapier webhook:", webhookUrl);

    try {
      const testData = {
        timestamp: new Date().toISOString(),
        triggered_from: window.location.origin,
        event_type: "test_connection",
        sample_lead: {
          name: "Test Lead",
          email: "test@example.com",
          company: "Test Company",
          source: "Dashboard Test",
          status: "New"
        }
      };

      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors", // Add this to handle CORS
        body: JSON.stringify(testData),
      });

      // Since we're using no-cors, we won't get a proper response status
      // Instead, we'll show a more informative message
      toast({
        title: "Test Request Sent",
        description: "The test request was sent to Zapier. Please check your Zap's history to confirm it was triggered.",
      });
      
      setIsConnected(true);
      onWebhookTest?.(testData);
    } catch (error) {
      console.error("Error triggering webhook:", error);
      toast({
        title: "Error",
        description: "Failed to trigger the Zapier webhook. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The webhook URL has been copied to your clipboard.",
    });
  };

  const samplePayload = {
    "lead_id": "L0009",
    "name": "Jane Smith", 
    "email": "jane@company.com",
    "phone": "+1-555-0131",
    "company": "Smith Corp",
    "source": "Website form",
    "status": "New",
    "date_added": "2024-09-16T10:30:00Z",
    "notes": "Interested in premium package",
    "follow_up_date": "2024-09-18T09:00:00Z"
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Zapier Integration</CardTitle>
          </div>
          {isConnected && (
            <Badge className="bg-success text-success-foreground">
              <CheckCircle className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Setup Instructions */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-sm">Setup Instructions:</h3>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Create a new Zap in Zapier</li>
            <li>Add "Webhooks by Zapier" as the trigger</li>
            <li>Choose "Catch Hook" trigger event</li>
            <li>Copy the webhook URL provided by Zapier</li>
            <li>Paste it below and test the connection</li>
          </ol>
        </div>

        {/* Webhook URL Input */}
        <form onSubmit={handleTrigger} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Zapier Webhook URL</Label>
            <div className="flex space-x-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://hooks.zapier.com/hooks/catch/..."
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(webhookUrl)}
                disabled={!webhookUrl}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={!webhookUrl || isLoading}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            {isLoading ? "Testing Connection..." : "Test Connection"}
          </Button>
        </form>

        {/* Sample Payload */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Sample Payload Structure:</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(JSON.stringify(samplePayload, null, 2))}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy JSON
            </Button>
          </div>
          <pre className="bg-muted/50 rounded-lg p-3 text-xs overflow-x-auto">
            {JSON.stringify(samplePayload, null, 2)}
          </pre>
        </div>

        {/* Integration Examples */}
        <div className="bg-accent/10 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-sm flex items-center">
            <ExternalLink className="h-4 w-4 mr-2" />
            Common Zap Actions:
          </h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Send Slack notifications for new leads</li>
            <li>• Add leads to Google Sheets or Airtable</li>
            <li>• Create tasks in project management tools</li>
            <li>• Send follow-up emails via Gmail/Outlook</li>
            <li>• Update CRM systems (HubSpot, Salesforce)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}