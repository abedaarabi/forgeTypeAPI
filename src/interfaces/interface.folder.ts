//located in the incloude
export interface FolderContent {
  type: string;
  id: string;
  attributes: {
    name: string;
    displayName: string;
    createTime: Date;
    createUserID?: string;
    createUserName: string;
    lastModifiedTime: Date;
    lastModifiedUserID?: string;
    lastModifiedUserName: string;
    lastModifiedTimeRollup?: Date;
    objectCount?: number;
    hidden?: boolean;
  };
}

export interface FolderContents extends Array<FolderContent> {}
