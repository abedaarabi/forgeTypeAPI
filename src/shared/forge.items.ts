import * as ForgeSDK from 'forge-apis';
import { oAuth2 } from './forge.oAuth2';
import { folderApi } from './forge.folder';
import { ItemContent, ItemContents, Item } from '../interfaces/interface.item';
import { FolderContent, FolderContents } from '../interfaces/interface.folder';
import { flatten } from '../shared/array.helper';
import { TypeProjectDetail } from 'src/interfaces/interface.project';
import { projects } from './forge.projects';
import { hub } from './forge.hub';

import { folderContent } from './forge.topFolderContent';

export interface AllItems {
  items: ItemContents[];
  projectName: string;
  projectId: string;
}

export const items = async () => {
  let allFolderContents: AllItems[] = [];
  let rr: Item[] = [];
  const credentials = await oAuth2();
  const hubs = await hub(credentials);
  const allProjects = await projects(hubs);

  try {
    for await (const item of allProjects) {
      const projectId = item.id;
      const projectName = item.name;
      console.log(projectName);

      const folderId = item.rootFolderId;
      const items = await folderContent(projectId, folderId);

      allFolderContents.push({ items, projectId, projectName });
    }
  } catch (error) {
    console.log(error);
  }

  const boo = allFolderContents;

  boo.forEach((i) => {
    const flat = flatten(i.items);

    flat.forEach((incloude) => {
      try {
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

        if (!isFound) {
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
      } catch (error) {
        console.log(error);
      }
    });
  });

  return rr;
};
