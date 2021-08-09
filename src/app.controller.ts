import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

import { FolderContent } from './interfaces/interface.folder';
import { TypeProjectDetails } from './interfaces/interface.project';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<FolderContent[] | TypeProjectDetails[]> {
    return this.appService.getHello();
  }
}
