import { Injectable } from '@nestjs/common';

// import { folderContent } from './forge.folders/folder.content';

import { FolderContent } from './interfaces/interface.folder';
import { TypeProjectDetails } from './interfaces/interface.project';
import { folderApi } from './shared/forge.folder';
import { folderContent, test } from './shared/forge.topFolderContent';

// import { topFolderContent } from './shared/forge.topFolderContent';

@Injectable()
export class AppService {
  async getHello(): Promise<any> {
    const allfolder = await test();
    return allfolder;
  }
}
