import { Lead } from "@/types/lead";

/**
 * Generates mock lead data for development and testing
 */
const getMockLeads = (): Lead[] => {
  const now = new Date();
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(now.getDate() - 14);
  
  return [
    {
      id: 'L0001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
      company: 'Acme Inc',
      source: 'Website form',
      status: 'New',
      dateAdded: twoWeeksAgo,
      notes: 'Interested in enterprise plan',
      followUpDate: oneWeekAgo,
      reminder: 'Follow-up Due'
    },
    {
      id: 'L0002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '(234) 567-8901',
      company: 'Globex Corp',
      source: 'LinkedIn',
      status: 'Contacted',
      dateAdded: oneWeekAgo,
      notes: 'Scheduled demo for next week',
      followUpDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
    },
    {
      id: 'L0003',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '(345) 678-9012',
      company: 'Initech',
      source: 'Email',
      status: 'In Progress',
      dateAdded: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      notes: 'Sent proposal, waiting for response'
    },
    {
      id: 'L0004',
      name: 'Alice Williams',
      email: 'alice.williams@example.com',
      phone: '(456) 789-0123',
      company: 'Umbrella Corp',
      source: 'Referral',
      status: 'Converted',
      dateAdded: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      notes: 'Signed up for premium plan',
      followUpDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    },
    {
      id: 'L0005',
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      phone: '(567) 890-1234',
      company: 'Stark Industries',
      source: 'Other',
      status: 'Lost',
      dateAdded: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      notes: 'Went with competitor',
      followUpDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000) // 90 days from now
    }
  ];
};

interface WebhookLeadItem {
  'Lead ID'?: string;
  'Name': string;
  'Email'?: string;
  'Contact'?: string;
  'Phone'?: string;
  'Company'?: string;
  'Source'?: string;
  'Status'?: string;
  'Date Added'?: string;
  'Follow-up'?: string;
  'Follow-up Date'?: string;
  'Last Contacted'?: string;
  'Notes'?: string;
  row_number?: number;
  [key: string]: unknown; // For any additional fields
}

// Use environment variable for API base URL or fallback to relative path
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const API_ROUTE = `${API_BASE_URL}/api/leads`;

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
    
    // Check if we're in development mode
    const isDevelopment = import.meta.env.DEV;
    
    // In development, use mock data
    if (isDevelopment) {
      console.log('Running in development mode, using mock data');
      return getMockLeads();
    }
    
    const response = await fetch(API_ROUTE, {
      method: "GET",
      mode: 'cors', // Enable CORS mode
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Accept": "application/json",
        "X-Requested-With": "XMLHttpRequest" // Helps identify AJAX requests
      },
      credentials: 'include', // Include credentials for CORS
      referrerPolicy: 'no-referrer-when-downgrade'
    });

    const responseText = await response.text();
    
    // Log the raw response for debugging
    console.log('Raw response status:', response.status);
    console.log('Response headers:', JSON.stringify([...response.headers.entries()]));
    
    // Check for non-2xx status codes
    if (!response.ok) {
      console.error('Error response:', responseText);
      
      // Handle specific status codes
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in again.');
      } else if (response.status === 403) {
        throw new Error('You do not have permission to access this resource.');
      } else if (response.status === 404) {
        throw new Error('The requested resource was not found.');
      } else if (response.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error(`Failed to fetch leads: ${response.status} ${response.statusText}`);
      }
    }

    // Try to parse the response as JSON
    let data: unknown;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      console.error('Response text:', responseText);
      throw new Error(`Invalid JSON response from server: ${responseText.substring(0, 200)}${responseText.length > 200 ? '...' : ''}`);
    }

    // Transform the webhook response data to match our Lead interface
    // The n8n webhook might return the data in a specific format, so we need to handle that
    let leadsData = data;
    
    // If the response has a 'data' field, use that
    if (data && typeof data === 'object' && data !== null && 'data' in data) {
      leadsData = (data as { data: unknown }).data;
    }
    
    // Ensure we have an array to work with
    if (!Array.isArray(leadsData)) {
      console.error("API response is not an array:", data);
      // If we have a single object, wrap it in an array
      if (leadsData && typeof leadsData === 'object' && leadsData !== null) {
        leadsData = [leadsData];
      } else {
        return [];
      }
    }
    
    // Process each lead item
    try {
      return (leadsData as WebhookLeadItem[]).map((item) => {
        // Ensure we have at least a name or ID
        const name = item['Name'] || 'Unnamed Lead';
        const id = item['Lead ID'] || `L${String(item.row_number || Math.random()).padStart(4, '0')}`;
        
        // Handle potential date parsing issues
        let dateAdded: Date;
        try {
          dateAdded = parseWebhookDate(item['Date Added']);
        } catch (e) {
          console.warn('Failed to parse date, using current date:', e);
          dateAdded = new Date();
        }
        
        // Handle follow-up date
        let followUpDate: Date | undefined;
        try {
          followUpDate = item['Follow-up'] && item['Follow-up'] !== '' 
            ? parseWebhookDate(item['Follow-up'])
            : undefined;
        } catch (e) {
          console.warn('Failed to parse follow-up date:', e);
        }
        
        // Ensure the source and status are valid values
        const validSources = ['Website form', 'LinkedIn', 'Email', 'Referral', 'Other'] as const;
        const validStatuses = ['New', 'Contacted', 'In Progress', 'Converted', 'Lost'] as const;
        
        const source = item['Source'] && typeof item['Source'] === 'string' && 
          validSources.includes(item['Source'] as typeof validSources[number])
          ? item['Source'] as typeof validSources[number]
          : 'Other';
          
        const status = item['Status'] && typeof item['Status'] === 'string' &&
          validStatuses.includes(item['Status'] as typeof validStatuses[number])
          ? item['Status'] as typeof validStatuses[number]
          : 'New';
          
        return {
          id,
          name,
          email: item['Email'] || '',
          phone: item['Contact'] || item['Phone'] || '',
          company: item['Company'] || '',
          source,
          status,
          dateAdded,
          notes: item['Notes'] || '',
          followUpDate,
          reminder: item['Follow-up']?.includes('⚠ Follow-up Due') ? 'Follow-up Due' : ''
        };
      });
    } catch (mappingError) {
      console.error('Error mapping lead data:', mappingError);
      throw new Error('Failed to process lead data. The data format may be incorrect.');
    }
  } catch (error) {
    console.error("Error in fetchLeads:", error);
    
    // Re-throw the error with a user-friendly message
    if (error instanceof Error) {
      throw new Error(`Failed to load leads: ${error.message}`);
    } else if (typeof error === 'string') {
      throw new Error(error);
    } else {
      throw new Error('An unknown error occurred while fetching leads');
    }
  }
};

/**
 * Generates a lead ID based on count.
 */
export const generateLeadId = (count: number): string => {
  return `L${String(count + 1).padStart(4, "0")}`;
};