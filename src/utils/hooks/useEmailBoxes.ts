// hooks/useFetchData.js
import { useState, useEffect } from 'react';


type UnknownKeyedObject = {
  [key: string | number]: unknown;
};

type UnknownArray = unknown[];


// Assumi che emailBoxes sia un array di oggetti sconosciuti o null
type CampaignData = UnknownArray | null;

export default function useEmailBoxes(key:string) {

  const [emailBoxes, setEmailBoxes] = useState<CampaignData>(null);
  const [emailBoxesLoader, setEmailBoxesLoader] = useState<boolean>(true);
  const [emailBoxesError, setEmailBoxesError] = useState<string | null>(null);



 
   

  useEffect(() => {

     const url = `/v2/mailboxes`;
    
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
  
    setEmailBoxesError(null);

    // Fetch data using the dynamic resourceId
    fetch(`/api/woodpecker/`, requestOptions)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(response => {
        if(response.status !== 'OK'){
             setEmailBoxesError('An error has occured! code: '+response.statusCode);
             return;
        }
        setEmailBoxes(response.statusCode !== 200 ? [] : response);
        return;
        
    
        
        
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setEmailBoxesError(err.message);
        }
     
      })
      .finally(() => {
        setEmailBoxesLoader(false);
      });

    // Cleanup: This runs when the component unmounts OR when resourceId changes
    return () => {
      controller.abort();
    };
    
  }, [key]); // <--- **The Key:** Hook re-runs whenever url changes

  return { emailBoxes, emailBoxesLoader, emailBoxesError };
}