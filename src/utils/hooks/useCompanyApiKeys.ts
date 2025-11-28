/*
Retrieve a paginated list of API keys associated with a specific company. The response will include only the keys created by the requesting user
{
  "content": [
    {
      "api_key": "123456.abcdefg123456hijk987",
      "label": "Custom name"
    }
  ],
  "pagination_data": {
    "total_elements": 2,
    "total_pages": 1,
    "current_page_number": 1,
    "page_size": 50
  }
}
*/
import { useState, useEffect } from 'react';


type UnknownKeyedObject = {
  [key: string | number]: unknown;
};

type UnknownArray = unknown[];

type headerProperties = {
    [key: string]: string
}

export function useCompanyApiKeys(companyId:number, page:number | null) {

  const [data, setData] = useState<UnknownKeyedObject | UnknownArray | string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

    const headers = {
      "Content-Type": "application/json",
      "x-company-id":companyId,
      "x-api-key":process.env.NEXT_PUBLIC_AUTHENTICATION_KEY
    };
   

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
    fetch(`${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/agency/companies/${companyId}/api_keys${page ? '?page='+page : ''}`, { signal })
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
    
  }, [companyId, page]); // <--- **The Key:** Hook re-runs whenever url changes

  return { data, isLoading, error };
}