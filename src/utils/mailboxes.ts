import axios from "axios";
import{ apiConfigBase } from "./agency";
//import { MailboxesProperties } from "../types/global";

//Connect one or multiple mailboxes to your account by providing SMTP/IMAP credentials along with optional sending configurations.
//This endpoint enables you to set up the connection but you can also specify additional settings, including daily sending limits, tracking domains or footers.
//return {"batch_id":string} ID of the submitted email batch. Use it to review the connection status.
export async function addMailboxesInBulk(apiKey:string, mailboxes:[]){

    if(apiKey === undefined || apiKey === '' || mailboxes.length === 0){
        return;
    }

    const headers = {...apiConfigBase};
    headers['x-api-key'] = apiKey;

    const parameters = {
        "mailboxes" : mailboxes
    }

    const returnData = axios
    .post(
      `${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/mailboxes/manual_connection/bulk`,
      parameters,
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

//Retrieve a list and configuration of email accounts connected to your account. 
//Each object contains details of SMTP or IMAP and information about the connection settings, sending limits, warm-up status and freeze dates, and more.
//You can also retrieve information about one specific IMAP or SMTP using their IDs and the /mailboxes/id endpoint.
/*
[{
    "id": 123456,
    "type": "SMTP",
    "details": {
      "email": "jared.dunn@piedpiper.com",
      "provider": "GOOGLE",
      "login": "jared.dunn@piedpiper.com",
      "server": "smtp.gmail.com",
      "port": null,
      "from_name": "Jared Dunn",
      "error": null,
      "daily_limit": 50,
      "sent_today": 20,
      "frequency_from": 150000,
      "frequency_to": 600000,
      "bcc_crm": "",
      "signature": "<div>Email signature wrapped in HTML.</div>",
      "open_url": "sub.piedpiper.com",
      "click_url": "sub.piedpiper.com",
      "unsubscribe_url": "sub.piedpiper.com",
      "freeze_account": [],
      "in_slot": true,
      "warmup_data": {
          "status": "PAUSED"
      },
      "imap_id": 123457
    }
  }]
 */
export async function getEmailAccountsList(apiKey:string) {

   const headers = {...apiConfigBase};
   headers['x-api-key'] = apiKey;

  const data = await axios
    .get(`${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/mailboxes`,
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
  return data;
}

export async function getEmailAccount(accountId:string, apiKey:string) {

   const headers = {...apiConfigBase};
   headers['x-api-key'] = apiKey;

  const data = await axios
    .get(`${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/mailboxes/${accountId}`,
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
  return data;
}

//Update the details of an email account connected to your account. Currently, the property that can be updated is the footer of an SMTP account.
export async function updateEmailAccount(smtp_mailbox_id:string, apiKey:string, footer:string) {
   const headers = {...apiConfigBase};
   headers['x-api-key'] = apiKey;
  //
  const data = await axios
    .patch(`${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/mailboxes/${smtp_mailbox_id}`,
      JSON.stringify({'footer':footer}),
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