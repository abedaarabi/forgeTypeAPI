import { Injectable } from '@nestjs/common';

import { items } from './shared/forge.items';
import { metadata } from './metaData/forge.derivative';

@Injectable()
export class AppService {
  async getHello(): Promise<any> {
    const allfolder = await metadata();
    return allfolder;
  }
}
