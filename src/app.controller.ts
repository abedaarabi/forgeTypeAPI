import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { folderApi, RootFolder, Abeds } from './shared/forge.folder';
import { ArrayType } from './shared/forge.topFolderContent';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<ArrayType[]> {
    return this.appService.getHello();
  }
}
