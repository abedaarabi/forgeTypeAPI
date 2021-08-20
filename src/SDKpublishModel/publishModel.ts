import { oAuth2 } from '../shared/forge.oAuth2';
import axios from 'axios';

export async function publishModel(projectId: string, urnId: string, tt: any) {
  const credentials = await oAuth2();

  const verifyPublishing = 'C4RModelGetPublishJob';
  const orderPublishing = 'C4RModelPublish';

  if (!tt) {
    tt = verifyPublishing;
  } else {
    tt = orderPublishing;
  }

  const url = `https://developer.api.autodesk.com/data/v1/projects/${projectId}/commands`;
  const response = await axios({
    method: 'post',
    url,
    headers: {
      'content-type': 'application/vnd.api+json',
      Authorization: `Bearer ${credentials.access_token}`,
      'x-user-id': '4RL5NPRJ3LNM',
    },
    data: JSON.stringify({
      jsonapi: {
        version: '1.0',
      },
      data: {
        type: 'commands',
        attributes: {
          extension: {
            type: `commands:autodesk.bim360:${tt}`, //C4RModelGetPublishJob
            version: '1.0.0',
          },
        },
        relationships: {
          resources: {
            data: [
              {
                id: urnId,
                type: 'items',
              },
            ],
          },
        },
      },
    }),
  });
  console.log(response.data);
  return response.data;
}
