import { oAuth2 } from '../shared/forge.oAuth2';
import axios from 'axios';
import { Logger } from '@nestjs/common';

//200703030286415 Jesper
//4RL5NPRJ3LNM bimadmin
//G37HRH22DWBV Abed
//A4CZNLQVA864 Anita

export async function publishModel(
  projectId: string,
  urnId: string,
  shouldPublish: boolean,
) {
  const credentials = await oAuth2();

  let publishType;

  if (!shouldPublish) {
    publishType = 'C4RModelGetPublishJob';
  } else {
    publishType = 'C4RModelPublish';
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
            type: `commands:autodesk.bim360:${publishType}`, //C4RModelGetPublishJob
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
  Logger.log('translate prosses: ', response.data);
  return response.data;
}
