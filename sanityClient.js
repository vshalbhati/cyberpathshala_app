import { createClient } from '@sanity/client';

// Create the Sanity client
export const client = createClient({
  projectId: 't4de8f3k',
  dataset: 'production',  
  apiVersion: '2021-08-31',  
  useCdn: true,                    
});
