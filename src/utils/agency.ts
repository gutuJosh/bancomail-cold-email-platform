import axios from "axios";
axios.defaults.headers.common['x-api-key'] = process.env.NEXT_PUBLIC_AUTHENTICATION_KEY;

export const apiConfigBase = {
  headers: {
    "Content-Type": "application/json",
  },
};

//Create new client accounts under your agency account, each with its own prospect database, campaigns, and team access.
//Each company created via API will automatically have an API key generated. Accept one argument tpe Array of objects 
// [{"name":"My first client"}]


export async function createCompanies(companies:Array<{key:string}>){

    const parameters = {
        "companies" : companies
    }

    const returnData = axios
    .post(
      `${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/agency/companies`,
      parameters,
      apiConfigBase
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

//generate a new API key for the specified company, which can be used to authenticate API requests. The response contains the newly created API key.
//Accept 2 mandatories arguments 'companyId':number and 'label':string and return an object { "api_key": "string"}
export async function generateNewApiKey(companyId:number, label:string){

    const parameters = {
        "label" : label
    }

    const returnData = axios
    .post(
      `${process.env.NEXT_PUBLIC_API_SRV_ROOT}/v2/agency/companies/${companyId}/api_keys`,
      parameters,
      apiConfigBase
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

//Remove prospects from a specific company within your agency account. This endpoint allows you to DELETE prospects from the company, updating the company's prospect database accordingly. It provides a response with the deletion request ID and the number of prospects removed.
//return {"deletion_request_id": 0,"count": 0}
export async function removeProspects(companyId:number){

    const parameters = {
        "type" : 'ALL'
    }

    const returnData = axios
    .post(
      `${process.env.NEXT_PUBLIC_API_SRV_ROOT}v2/agency/companies/${companyId}/prospects/delete`,
      parameters,
      apiConfigBase
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