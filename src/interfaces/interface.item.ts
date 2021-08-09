//located in the incloude
export interface ItemContent {
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

export interface ItemContents extends Array<ItemContent> {}
