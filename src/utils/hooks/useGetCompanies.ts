/*
Retrieve a list of companies managed by your agency, including their ID, name, owner's name, status (active or inactive), 
number of running campaigns, and number of connected accounts.
{
  "content": [
    {
      "id": 12345678,
      "name": "Dunmore High School",
      "owner": "Jim Halpert",
      "active": true,
      "running_campaigns": 2,
      "email_slots": 2,
      "linkedin_slots": 1
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

export function useGetCompanies(filters:{page:number, active : boolean}, apiKey:string) {

  const [data, setData] = useState<UnknownKeyedObject | UnknownArray | string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

    const headers = {
      "Content-Type": "application/json",
    };
    

  useEffect(() => {
    //Critical: Check for a valid ID before fetching
    if (!process.env.NEXT_PUBLIC_AUTHENTICATION_KEY) {
      setData(null); // Clear previous data if no API_KEY is set
      setIsLoading(false);
      return; 
    }

    const controller = new AbortController();
    
    // Define your request options
    const requestOptions = {
      method: 'POST', 
      // 1. Include the signal here
      signal: controller.signal, 
      // 2. Include the headers here
      headers: headers,  
      body: JSON.stringify({
        'x-api-key' :process.env.NEXT_PUBLIC_AUTHENTICATION_KEY
      }) 
    };
    
    setIsLoading(true);
    setError(null);

    // Fetch data using the dynamic resourceId
    fetch(`${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/agency/companies`, requestOptions )
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