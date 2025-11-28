/*
Retrieve quantitative data on your clients' campaign performance.
This endpoint provides key campaign metrics, including the total number of emails sent, delivered, opened, replied to, and bounced within a specified period. 
Additionally, it includes a comparison with the previous period of the same duration
{
  "content": [
    {
      "id": 123,
      "name": "First client company",
      "emails_sent": {
        "current_period": 1016,
        "previous_period": 462
      },
      "delivered_emails": {
        "current_period": 998,
        "previous_period": 438
      },
      "views": {
        "current_period": 712,
        "previous_period": 303
      },
      "replies": {
        "current_period": 73,
        "previous_period": 34
      },
      "bounces": {
        "current_period": 18,
        "previous_period": 24
      }
    }
  ],
  "pagination_data": {
    "total_count": 22,
    "pages_count": 2,
    "current_page_number": 2,
    "page_size": 20
  }
}
*/
import { useState, useEffect } from 'react';


type UnknownKeyedObject = {
  [key: string | number]: unknown;
};

type UnknownArray = unknown[];


type FiltersParameters = {
  from?:string,
  to?:string,
  page?:number,
  'per_page'?:number
}

export function useDeliverabilityStats(filters:FiltersParameters) {

  const [data, setData] = useState<UnknownKeyedObject | UnknownArray | string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

 const headers = {
      "Content-Type": "application/json",
      "x-api-key":process.env.NEXT_PUBLIC_AUTHENTICATION_KEY
 };

 let parameters = '';
 if(Object.entries(filters).length > 0){
    parameters = '?';
    for(const key in filters){
       parameters += `${key}=${filters[key]}&`; 
    }
    parameters = parameters.replace(new RegExp(["&"] + "$"), "");
 }
   

  useEffect(() => {
    //Critical: Check for a valid ID before fetching
    if (!process.env.NEXT_PUBLIC_AUTHENTICATION_KEY) {
      setData(null); // Clear previous data if no API_KEY is set
      setIsLoading(false);
      return; 
    }

    const controller = new AbortController();
    const signal = controller.signal;
    
    setIsLoading(true);
    setError(null);

    // Fetch data using the dynamic resourceId
    fetch(`${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/agency/deliverability${parameters}`, { signal })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setData(data);
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });

    // Cleanup: This runs when the component unmounts OR when resourceId changes
    return () => {
      controller.abort();
    };
    
  }, [filters]); // <--- **The Key:** Hook re-runs whenever url changes

  return { data, isLoading, error };
}