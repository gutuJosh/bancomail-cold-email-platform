// hooks/useFetchData.js
import { useState, useEffect } from 'react';
import { useCookies } from "react-cookie";
import { AES, enc } from 'crypto-js';

type UnknownKeyedObject = {
  [key: string | number]: unknown;
};

const secretKey = process.env.NEXT_PUBLIC_CRYPTO_KEY as string;

export default function useAuthentication(key:string) {

  const [user, setUser] = useState<UnknownKeyedObject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cookie, setCookie] = useCookies();
  const currentUser = cookie.currentUser !== undefined &&  cookie.currentUser !== null ?  cookie.currentUser : null;

    const headers = {
      "Content-Type": "application/json",
      "x-api-key":key
    };


  useEffect(() => {

   if(currentUser){
      const bytes = AES.decrypt(currentUser, secretKey);
      const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
      setIsLoading(false);
      setUser(decryptedData);
      return;
   }
  
    //Critical: Check for a valid ID before fetching
    if(key === '' || key.length === 0){
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
      body:JSON.stringify({apiKey:key})  
    };
  
    setError(null);

    // Fetch data using the dynamic resourceId
    fetch(`/api/auth/login/`, requestOptions)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(response => {
        if(response.status === 'OK'){
          response['apiKey'] = key;
          const cryptoData = AES.encrypt(JSON.stringify(response), secretKey).toString();
          setCookie('currentUser', cryptoData, {
            path: "/",
            maxAge: 3600,
            sameSite: true,
          });
          setUser(response);
          return;
        }
    
        setError('An error has occured! code: '+response.statusCode);
        
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
    
  }, [key]); // <--- **The Key:** Hook re-runs whenever url changes

  return { user, isLoading, error };
}