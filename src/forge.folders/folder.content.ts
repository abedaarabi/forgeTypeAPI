// import * as ForgeSDK from 'forge-apis';
// import { oAuth2 } from '../shared/forge.oAuth2';

// import { flatten } from '../shared/array.helper';

// import { topFolderContent } from 'src/shared/forge.topFolderContent';
// import { ItemContents } from 'src/interfaces/interface.item';
// import { TypeProjectDetail } from 'src/interfaces/interface.project';
// import { FolderContents } from 'src/interfaces/interface.folder';

// interface ArrayType {
//   folderIncluded: ItemContents;
//   projectDetails: any;
// }

// export const folderContent = async () => {
//   const arrFolderContent: ItemContents[] = [];
//   const folders = new ForgeSDK.FoldersApi();

//   const credentials = await oAuth2();
//   const folderContents = await topFolderContent();

//   const allFolders = folderContents.map((folderType) => {
//     const projectFolders = folderType.folderData.filter(
//       (folder) => folder.type === 'folders',
//     );
//     return { projectFolders, projectDetails: folderType.projectDetails };
//   });

//   const folderDetails = allFolders.map((i) => {
//     return i.projectFolders.map((folder) => {
//       return {
//         folderId: folder.id,
//         type: folder.type,
//         folderName: folder.attributes.displayName,
//         createUserName: folder.attributes.createUserName,
//         lastModifiedUserName: folder.attributes.lastModifiedUserName,
//         createTime: folder.attributes.createTime,
//         lastModifiedTime: folder.attributes.lastModifiedTime,
//         hidden: folder.attributes.hidden,
//         projectName: i.projectDetails.projectSourceFolder.name,
//         projectId: i.projectDetails.projectSourceFolder.id,
//       };
//     });
//   });
//   const fal = flatten(folderDetails);

//   for (let i = 0; i < fal.length; i++) {
//     const projectDetails = fal[i];

//     const allFolderContents = await folders.getFolderContents(
//       projectDetails.projectId,
//       projectDetails.folderId,
//       undefined,
//       undefined,
//       credentials,
//     );
//     const folderIncluded = allFolderContents.body as any;
//     console.log(folderIncluded);

//     arrFolderContent.push(folderIncluded);
//   }
//   return arrFolderContent;
// };
