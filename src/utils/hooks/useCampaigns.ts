// hooks/useFetchData.js
import { useState, useEffect } from 'react';


type UnknownKeyedObject = {
  [key: string | number]: unknown;
};

type UnknownArray = unknown[];

type headerProperties = {
    [key: string]: string
}

// Assumi che campaigns sia un array di oggetti sconosciuti o null
type CampaignData = UnknownArray | null;

export default function useCampaigns(key:string | null, campaignId: string | boolean) {

  const [campaigns, setCampaigns] = useState<CampaignData>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaignError, setCampaignError] = useState<string | null>(null);



 
   

  useEffect(() => {

     const url = campaignId ? `/v1/campaign_list?id=${campaignId}` : '/v1/campaign_list';
    
    //Critical: Check for a valid ID before fetching
    if(key === '' || key === null){
      return;
    }

    const controller = new AbortController();
      // Define your request options
    const requestOptions = {
      method: 'POST', 
      // 1. Include the signal here
      signal: controller.signal, 
      // 2. Include the body here
      body:JSON.stringify({apiKey:key, path : url})  
    };
  
    setCampaignError(null);

    // Fetch data using the dynamic resourceId
    fetch(`/api/woodpecker/`, requestOptions)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(response => {
        if(response.status !== 'OK'){
             setCampaignError('An error has occured! code: '+response.statusCode);
             return;
        }
        setCampaigns(response.statusCode === 204 ? [] : response);
        return;
        
    
        
        
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setCampaignError(err.message);
        }
     
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Cleanup: This runs when the component unmounts OR when resourceId changes
    return () => {
      controller.abort();
    };
    
  }, [key, campaignId]); // <--- **The Key:** Hook re-runs whenever url changes

  return { campaigns, isLoading, campaignError };
}