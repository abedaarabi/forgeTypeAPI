import { Injectable } from '@nestjs/common';

import { items } from './shared/forge.items';
import { metadata } from './metaData/forge.derivative';
import { publishCloudWorkshared } from './publishModel/publishCloudWorkshared';
import { propertiesMetadata } from './metaData/retrieveItemMetaData';

import { oAuth2 } from './shared/forge.oAuth2';
@Injectable()
export class AppService {
  async getHello(): Promise<any> {
    const allfolder = await propertiesMetadata();
    return allfolder;
  }
}
