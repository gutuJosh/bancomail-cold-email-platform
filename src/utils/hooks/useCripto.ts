// hooks/useFetchData.js
import { useState, useEffect } from 'react';
import { AES, enc } from 'crypto-js';


type UnknownKeyedObject = {
  [key: string | number]: unknown;
};

type UnknownArray = unknown[];



export default function useCrypto(object:any, directive:string) {

  const [cryptoData, setCriptoData] = useState<UnknownKeyedObject | UnknownArray | string | null>(null);
  const secretKey = process.env.NEXT_PUBLIC_CRYPTO_KEY as string;
     

  useEffect(() => {
       if(!object){
         return;
       }
       if(directive === 'decrypt'){
        const bytes = AES.decrypt(object, secretKey);
        const decryptedData = JSON.parse(bytes.toString(enc.Utf8));
        setCriptoData(decryptedData);
       }

       if(directive === 'encrypt'){
        const cipherText = AES.encrypt(JSON.stringify(object), secretKey).toString();
        setCriptoData(cipherText);
       }
    
  }, [object, directive]); 

  return { cryptoData };
}