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
  folderData: FolderContents;
  folderIncluded: ItemContents;
  projectDetails: TypeProjectDetail;
}

export const folderContent = async (projectId: string, folderId: string) => {
  let allIncloudedArray: any[] = [];
  const credentials = await oAuth2();
  const folder = new ForgeSDK.FoldersApi();

  const allFolder = await folder.getFolderContents(
    projectId,
    folderId,
    null,
    null,
    credentials,
  );

  let testArray: any = [];
  const folderContentt = allFolder.body as FolderContents;

  testArray.push(folderContentt);

  await Promise.all(
    testArray.map(async (element) => {
      if (element.included) {
        allIncloudedArray.push(element.included);
      }

      return await Promise.all(
        element.data.map(async (folder) => {
          if (folder.type === 'folders') {
            const recursive = await folderContent(projectId, folder.id);
            allIncloudedArray = allIncloudedArray.concat(recursive);
            return allIncloudedArray;
          }
        }),
      );
    }),
  ).catch((err) => {
    err;
  });

  return allIncloudedArray;
};

export const test = async () => {
  let rr: any[] = [];
  const credentials = await oAuth2();
  const hubs = await hub(credentials);
  const allProjects = await projects(hubs);
  const allfolders = await Promise.all(
    allProjects.map(async (item) => {
      const projectId = item.id;
      const projectName = item.name;
      const folderId = item.rootFolderId;
      const items = await folderContent(projectId, folderId);
      return { items, projectId, projectName };
    }),
  ).catch((err) => {
    err;
  });
  const boo = allfolders as any;

  boo.forEach((i) => {
    const flat = flatten(i.items);

    flat.forEach((incloude: any) => {
      const downloadItems =
        incloude.relationships.storage.meta.link.href.split('?')[0];

      const items = rr.filter((item) => {
        if (item.fileName === incloude.attributes.displayName) {
          return true;
        } else {
          return false;
        }
      });

      const isFound = Boolean(items[0]);
      // && incloude.attributes.fileType === 'rvt'
      if (!isFound && incloude.attributes.fileType === 'rvt') {
        rr.push({
          projectName: i.projectName,
          projectId: i.projectId,
          versionId: incloude.id,
          versionType: incloude.type,
          derivativesId: incloude.relationships.derivatives.data.id,
          createUserName: incloude.attributes.createUserName,
          fileType: incloude.attributes.fileType,
          createTime: incloude.attributes.createTime,
          lastModifiedTime: incloude.attributes.lastModifiedTime,
          lastModifiedUserName: incloude.attributes.lastModifiedUserName,
          storageSize: incloude.attributes.storageSize,
          fileName: incloude.attributes.displayName,
          extension: incloude.attributes.extension.type,
          originalItemUrn: incloude.attributes.extension.data.originalItemUrn,
          projectGuid: incloude.attributes.extension.data.projectGuid,
          downloadItem: downloadItems,
        });
      } else {
        console.log(`Ignore ${incloude.attributes.displayName}`);
      }
    });
  });

  return rr;
};
