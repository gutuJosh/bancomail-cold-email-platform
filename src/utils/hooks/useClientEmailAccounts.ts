/*
Returns list of the email accounts linked to the client. By using this feature you can GET information including the type of email account, 
provider, and additional information such as error status, from name, IMAP ID, and the number of running campaigns associated with each account.

{
  "content": [
    {
      "id": 0,
      "type": "IMAP",
      "details": {
        "email": "example@email.com",
        "provider": "provider1",
        "error": "string",
        "from_name": "string",
        "imap_id": 0,
        "running_campaigns": 2
      }
    }
    }
  ]
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

export function useClientEmailAccounts(companyId:number) {

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
    fetch(`${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/agency/companies/${companyId}/email_accounts/`, { signal })
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
    
  }, [companyId]); // <--- **The Key:** Hook re-runs whenever url changes

  return { data, isLoading, error };
}