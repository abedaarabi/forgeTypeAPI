export interface TypeProjectDetail {
  urnFolder: string;
  folderName: string;
  projectSourceFolder: {
    id: string;
    name: string;
    rootFolderId: string;
  };
}

export interface TypeProjectDetails extends Array<TypeProjectDetail> {}
