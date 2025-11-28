import axios from "axios";
import{ apiConfigBase } from "./agency";
import { UnknownKeyedObject } from "../types/global";

//Create a multichannel, LinkedIn or email campaign with a sequence of personalized follow-up messages and customizable delivery settings.
export async function createEmailCampaign(apiKey:string, body:UnknownKeyedObject){

    if(apiKey === undefined){
        return;
    }

    const headers = {...apiConfigBase};
    headers['x-api-key'] = apiKey;

   

    const returnData = axios
    .post(
      `${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/campaign`,
      JSON.stringify(body),
      headers
    )
    .then(async (response) => {
      const {status} = response;
      return response.data;
    
    })
    .catch(function (error) {
      const statusCode = error.response.status;
      const responseData = error.response.data;
      return responseData;
    });
  return returnData;
}

//starts a campaign and changes its status to RUNNING. Prospects enrolled in the campaign will be processed based on the campaign settings and delivery times.
export async function runCamapign(apiKey:string, campaignId:string) {

   const headers = {...apiConfigBase};
   headers['x-api-key'] = apiKey;

  const data = await axios
    .post(`${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/campaigns/${campaignId}/run`,
        {},
        headers
    )
    .then(async (response) => {
      const {status} = response;
      return response;
    })
    .catch(function (error) {
      const statusCode = error.response.status;
      const responseData = error.response.data;
      return responseData;
    });
  return data;
}



//this request to update campaign-wide settings such as assigned email accounts, sending limits, timezone, and more. The endpoint allows for partial updates.
export async function updateEmailAccount(campaign_id:string, apiKey:string, body:UnknownKeyedObject) {
   const headers = {...apiConfigBase};
   headers['x-api-key'] = apiKey;
  //
  const data = await axios
    .patch(`${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/campaigns/${campaign_id}`,
      JSON.stringify(body),
      headers
    )
    .then(async (response) => {
      const {status} = response;
      return response;
    })
    .catch(function (error) {
      const statusCode = error.response.status;
      const responseData = error.response.data;
      return responseData;
     

    });

  return data;
}