import { Lead } from "@/types/lead";

interface WebhookLeadItem {
  'Lead ID'?: string;
  'Name': string;
  'Email'?: string;
  'Company'?: string;
  'Phone'?: string;
  'Status'?: string;
  'Source'?: string;
  'Last Contacted'?: string;
  'Follow-up Date'?: string;
  'Notes'?: string;
  row_number?: number;
  'Date Added'?: string;
  'Contact'?: string;
  'Follow-up'?: string;
  [key: string]: unknown; // For any additional fields
}

// Using relative path to leverage Vite's proxy in development
const API_ROUTE = "/api/leads";

/**
 * Parses date string from webhook format (M/D/YYYY) to Date object
 */
const parseWebhookDate = (dateString: string): Date => {
  if (!dateString || dateString === '') return new Date();
  
  // Remove any extra text like "⚠ Follow-up Due"
  const cleanDateString = dateString.split('⚠')[0].trim();
  
  if (!cleanDateString) return new Date();
  
  try {
    // Parse M/D/YYYY format
    const [month, day, year] = cleanDateString.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  } catch (error) {
    console.warn('Failed to parse date:', dateString);
    return new Date();
  }
};

/**
 * Fetches leads from the API route which proxies to the n8n webhook
 */
export const fetchLeads = async (): Promise<Lead[]> => {
  try {
    console.log('Fetching leads from:', API_ROUTE);
    const response = await fetch(API_ROUTE, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache"
      },
      credentials: 'same-origin' // Important for cookies, authorization headers with HTTPS
    });

    const responseText = await response.text();
    
    // Log the raw response for debugging
    console.log('Raw response status:', response.status);
    console.log('Response headers:', JSON.stringify([...response.headers.entries()]));
    
    if (!response.ok) {
      console.error('Error response:', responseText);
      throw new Error(`Failed to fetch leads: ${response.status} ${response.statusText}`);
    }

    // Try to parse the response as JSON
    let data: WebhookLeadItem[] | unknown;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.error('Response text:', responseText);
      throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 200)}...`);
    }

    // Transform the webhook response data to match our Lead interface
    if (Array.isArray(data)) {
      return data.map((item: WebhookLeadItem) => ({
        id: item['Lead ID'] || `L${String(item.row_number || Math.random()).padStart(4, '0')}`,
        name: item['Name'] || '',
        email: '', // Not provided in webhook data
        phone: item['Contact'] || '',
        company: item['Company'] || '',
        source: item['Source'] || 'Other',
        status: item['Status'] || 'New',
        dateAdded: parseWebhookDate(item['Date Added']),
        notes: '', // Not provided in webhook data
        followUpDate: item['Follow-up'] && item['Follow-up'] !== '' 
          ? parseWebhookDate(item['Follow-up']) 
          : undefined,
        reminder: item['Follow-up']?.includes('⚠ Follow-up Due') ? 'Follow-up Due' : ''
      })) as Lead[];
    } else {
      console.error("API response is not an array:", data);
      return [];
    }
  } catch (error) {
    console.error("Error in fetchLeads:", error);
    // Return empty array if the API call fails
    console.log("API call failed, returning empty array");
    return [];
  }
};

/**
 * Generates a lead ID based on count.
 */
export const generateLeadId = (count: number): string => {
  return `L${String(count + 1).padStart(4, "0")}`;
};