//located in the incloude
export interface ItemContent {
  type: string;
  id: string;

  attributes: {
    name: string;
    displayName: string;
    // extension:{type: string}
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
    extension: {
      type: string;
      data: { projectGuid: string; originalItemUrn: string };
    };
  };
  relationships: {
    derivatives: { data: { id: string } };
    id: { data: { id: string } };
    storage: { meta: { link: { href: string } } };
  };
}

export interface Item {
  versionId: string;
  fileName: string;
  projectName: string;
  projectId: string;
  versionType: string;
  derivativesId: string;
  createUserName: string;
  fileType: string;
  createTime: Date;
  lastModifiedTime: Date;
  lastModifiedUserName: string;
  storageSize: number;
  extension: string;
  originalItemUrn: string;
  projectGuid: string;
  downloadItem: string;
}

export interface ItemDetails {
  versionId: string;
  fileName: string;
  projectName: string;
  projectId: string;
  versionType: string;
  derivativesId: string;
  createUserName: string;
  fileType: string;
  createTime: Date;
  lastModifiedTime: Date;
  lastModifiedUserName: string;
  storageSize: number;
  extension: string;
  originalItemUrn: string;
  projectGuid: string;
  downloadItem: string;
  name: string;
  role: string;
  guid: string;
  translateStatus: string;
  translateProgress: string;
}

export interface ItemContents extends Array<ItemContent> {}
