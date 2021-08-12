import * as ForgeSDK from 'forge-apis';
import { oAuth2 } from '../shared/forge.oAuth2';
import fetch from 'node-fetch';

import { items } from '../shared/forge.items';

export const verifyPublishing = async (projectID: string, itemId: string) => {
  const credentials = await oAuth2();
  const response = await fetch(
    `https://developer.api.autodesk.com/data/v1/projects/${projectID}/items/${itemId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${credentials.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );
  if (!response.ok) {
    const message = `An error has occured: ${response.status}`;
    throw new Error(message);
  }
  return await response.json();
};
