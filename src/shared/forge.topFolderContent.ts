import * as ForgeSDK from 'forge-apis';
import { oAuth2 } from './forge.oAuth2';
import { folderApi, Abed } from './forge.folder';

import { flatten } from './array.helper';

//located in the incloude
interface ItemContent {
  type: string;
  id: string;
  attributes: {
    name: string;
    displayName: string;
    createTime: Date;
    createUserId: string;
    createUserName: string;
    lastModifiedTime: Date;
    lastModifiedUserId: string;
    lastModifiedUserName: string;
    versionNumber: number;
    mimeType: string;
    storageSize: number;
    fileType: string;
    extension: { data: { originalItemUrn: string } };
    relationships: {
      derivatives: { data: { id: string } };
      storage: { meta: { link: { href: string } } };
    };
  };
}
//located in the incloude
interface FolderContent {
  type: string;
  id: string;
  attributes: {
    name: string;
    displayName: string;
    createTime: Date;
    createUserID: string;
    createUserName: string;
    lastModifiedTime: Date;
    lastModifiedUserID: string;
    lastModifiedUserName: string;
    lastModifiedTimeRollup: Date;
    objectCount: number;
    hidden: boolean;
  };
}
export interface ArrayType {
  folderData: FolderContents;
  folderIncluded: ItemContents;
  projectDetails: Abed;
}

export interface FolderContents extends Array<FolderContent> {}
export interface ItemContents extends Array<ItemContent> {}

export const folderContent = async () => {
  const arrFolderContent: ArrayType[] = [];
  const credentials = await oAuth2();
  const projectFiles = await folderApi();
  const folders = new ForgeSDK.FoldersApi();

  for (let i = 0; i < projectFiles.length; i++) {
    const projectDetails = projectFiles[i];

    console.log(projectDetails.projectSourceFolder.id);

    const allFolderContents = await folders.getFolderContents(
      projectDetails.projectSourceFolder.id,
      projectDetails.urnFolder,
      undefined,
      undefined,
      credentials,
    );

    const folderData = allFolderContents.body.data as FolderContents;
    const folderIncluded = allFolderContents.body.included as ItemContents;

    arrFolderContent.push({ folderData, folderIncluded, projectDetails });
  }

  const folderDetails = arrFolderContent.map((i) => {
    return i.folderData.map((folder) => {
      return {
        folderId: folder.id,
        type: folder.type,
        folderName: folder.attributes.displayName,
        createUserName: folder.attributes.createUserName,
        lastModifiedUserName: folder.attributes.lastModifiedUserName,
        createTime: folder.attributes.createTime,
        lastModifiedTime: folder.attributes.lastModifiedTime,
        hidden: folder.attributes.hidden,
        ...i.projectDetails,
      };
    });
  });
  const fal = flatten(folderDetails);
  console.log(fal);

  return arrFolderContent;
};
