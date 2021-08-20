import * as ForgeSDK from 'forge-apis';
import { oAuth2 } from './forge.oAuth2';
import { folderApi } from './forge.folder';
import { ItemContent, ItemContents } from '../interfaces/interface.item';
import { FolderContent, FolderContents } from '../interfaces/interface.folder';
import { flatten } from '../shared/array.helper';
import { TypeProjectDetail } from 'src/interfaces/interface.project';
import { projects } from './forge.projects';
import { hub } from './forge.hub';

export interface ObjType {
  data: FolderContents;
  included: ItemContents;

  projectDetails: TypeProjectDetail;
}

export const folderContent = async (projectId: string, folderId: string) => {
  const credentials = await oAuth2();
  const folder = new ForgeSDK.FoldersApi();
  const translatin = new ForgeSDK.DerivativesApi();

  const allFolder = await folder.getFolderContents(
    projectId,
    folderId,
    null,
    null,
    credentials,
  );

  let allIncloudedArray: ItemContents[] = [];
  let testArray: ObjType[] = [];
  const folderContentt = allFolder.body as ObjType;

  testArray.push(folderContentt);

  try {
    for await (const element of testArray) {
      if (element.included) {
        allIncloudedArray.push(element.included);
      }
      for await (const folder of element.data) {
        if (folder.type === 'folders') {
          const recursive = await folderContent(projectId, folder.id);
          // console.log(folder.id);

          allIncloudedArray = allIncloudedArray.concat(recursive);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }

  return allIncloudedArray;
};
