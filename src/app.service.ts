import { Injectable } from '@nestjs/common';
import { Abed, Abeds } from './shared/forge.folder';
import {
  folderContent,

  ArrayType,
} from './shared/forge.topFolderContent';

@Injectable()
export class AppService {
  async getHello(): Promise<ArrayType[]> {
    const allfolder = await folderContent();
    return allfolder;
  }
}
