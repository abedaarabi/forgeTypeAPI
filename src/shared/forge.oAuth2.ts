import * as ForgeSDK from 'forge-apis';
require("dotenv").config({ path: "./.env" });


const oAuth2TwoLegged = new ForgeSDK.AuthClientTwoLegged(   process.env.CLIENT_ID,
    process.env.CLIENT_SECRET, [
   "data:read", "data:create", "data:write"
], false);
 
 
export async function oAuth2() {
    const credentials = await oAuth2TwoLegged.authenticate()
  return credentials
    
} 
 
 
 
