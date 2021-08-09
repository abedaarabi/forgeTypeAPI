import { FolderContent } from '../interfaces/interface.folder';

export const getTopfolderContent = (array) => {
  const folderDetails = array.map((i) => {
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
        projectName: i.projectDetails.projectSourceFolder.name,
        projectId: i.projectDetails.projectSourceFolder.id,
      };
    });
  });

  return folderDetails;
};
