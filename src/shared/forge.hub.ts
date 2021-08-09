import * as ForgeSDK from 'forge-apis';

import { oAuth2 } from './forge.oAuth2';

export const hub = async (credentials) => {
  //   const credentials = await oAuth2();
  const HubsApi = new ForgeSDK.HubsApi();
  const response = await HubsApi.getHubs(undefined, undefined, credentials);
  return response.body.data[0].id;
};
