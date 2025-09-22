import type { NextApiRequest, NextApiResponse } from 'next';

const N8N_WEBHOOK_URL = 'https://omkarpp.app.n8n.cloud/webhook/a209c902-a436-48b5-bcdd-1ae79ae1a99b';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Fetching leads from n8n webhook:', N8N_WEBHOOK_URL);
    
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from n8n: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Successfully fetched data from n8n webhook');
    
    // Return the data as-is, let the client handle transformation
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Error fetching leads from n8n:', error);
    res.status(500).json({ 
      error: 'Failed to fetch leads',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}