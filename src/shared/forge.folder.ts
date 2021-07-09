import * as ForgeSDK from 'forge-apis';
import { oAuth2 } from './forge.oAuth2';
import { ProjectInfo, projects, Projects } from './forge.projects';
import { hub } from './forge.hub';
import { flatten } from './array.helper';

export type RootFolder = {
  id: string;
  attributes: { displayName: string };
};

export type RootFolders = RootFolder[];
export type X = {
  allProjectFiles: RootFolders;
  prjectDetails: ProjectInfo;
};

export type Abed = {
  urnFolder: string;
  folderName: string;
  projectSourceFolder: {
    id: string;
    name: string;
    rootFolderId: string;
  };
};

export type Abeds = Abed[];

export const folderApi = async () => {
  let projectFiles: X[] = [];

  const hubId = await hub();
  const credentials = await oAuth2();
  const projectDetailes = await projects();
  const folders = new ForgeSDK.ProjectsApi();

  for (let i = 0; i < projectDetailes.length; i++) {
    try {
      const prjectDetails = projectDetailes[i];
      const rootFolder = await folders.getProjectTopFolders(
        hubId,
        prjectDetails.id,
        undefined,
        credentials,
      );
      const allfolder = rootFolder.body.data as RootFolders;
      const allProjectFiles = allfolder.filter((folder) => {
        const foldersname = folder.attributes.displayName;
        if (foldersname === 'Project Files') {
          return true;
        } else {
          return false;
        }
      });
      projectFiles.push({ allProjectFiles, prjectDetails });
    } catch (error) {
      console.log(error.message);
    }
  }

  const allProjectFiles = projectFiles.map((urns) => {
    const projectSourceFolder = urns.prjectDetails;

    const folderUrnId = urns.allProjectFiles.map((folder) => {
      return {
        urnFolder: folder.id,
        folderName: folder.attributes.displayName,
        projectSourceFolder,
      };
    });
    return folderUrnId;
  });

  const flatAbed = flatten(allProjectFiles);

  return flatAbed;
};
