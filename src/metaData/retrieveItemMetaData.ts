import * as ForgeSDK from 'forge-apis';
import { ItemDetails } from 'src/interfaces/interface.item';
import { delay } from 'src/shared/array.helper';
import { oAuth2 } from '../shared/forge.oAuth2';
import { metadata } from './forge.derivative';
import { hasIdentityData } from './helper';
import {
  insertProjects,
  insdertItems,
  insterElements,
  deleteObjId,
} from '../database/bim.db';
import { projects } from 'src/shared/forge.projects';
import { hub } from 'src/shared/forge.hub';
import { Logger } from '@nestjs/common';
import { publishCloudWorkshared } from 'src/publishModel/publishCloudWorkshared';

const dummyObject = {
  name: 'key not exist',
  dbId: 'key not exist',
  version_id: 'key not exist',
  externalId: 'key not exist',
  'Type Name': 'key not exist',
  objectId: 'key not exist',
  Workset: 'key not exist',
  'Type Sorting': 'key not exist',
  CCSTypeID: 'key not exist',
  CCSTypeID_Type: 'key not exist',
  CCSClassCode_Type: 'key not exist',
  BIM7AATypeName: 'key not exist',
  BIM7AATypeDescription: 'key not exist',
  BIM7AATypeID: 'key not exist',
  BIM7AATypeNumber: 'key not exist',
  BIM7AATypeCode: 'key not exist',
  BIM7AATypeComments: 'key not exist',
};
const isObj = (obj) => typeof obj === 'object' && !Array.isArray(obj);
const topLevelObj = (obj) => {
  let item = {};
  for (const key in obj) {
    if (isObj(obj[key])) {
      const result = topLevelObj(obj[key]);

      item = { ...item, ...result };
    } else {
      if (Object.keys(dummyObject).includes(key)) {
        // item[key] = obj[key];

        item = { ...item, [key]: obj[key] };
      }
    }
  }
  return item;
};

export type ElementProperties = {
  name: string;
  dbId: number;
  version_id: number;
  externalId: string;
  TypeName: string;
  objectId: string;
  Workset: string;
  Type_Sorting: string;
  CCSTypeID: string;
  CCSTypeID_Type: string;
  CCSClassCode_Type: string;
  BIM7AATypeName: string;
  BIM7AATypeDescription: string;
  BIM7AATypeID: string;
  BIM7AATypeNumber: string;
  BIM7AATypeCode: string;
  BIM7AATypeComments: string;
};

export const propertiesMetadata = async () => {
  // await publishCloudWorkshared();

  let arr = [];
  const guid = new ForgeSDK.DerivativesApi();
  const allItemsMetaData = await metadata();

  const hasGuId = allItemsMetaData.filter((item) => {
    if (
      (item.guid && item.fileName.includes('K07')) ||
      item.fileName.includes('K08') ||
      item.fileName.includes('K09') ||
      item.fileName.includes('K10')
    ) {
      return true;
    } else return false;
  });

  const credentials = await oAuth2();

  for await (const itemMetaData of hasGuId) {
    // const derivativesId = itemMetaData.guidContent.derivativesId;

    while (true) {
      try {
        console.log(itemMetaData.guid);

        const itemProperties = await guid.getModelviewProperties(
          itemMetaData.derivativesId,
          itemMetaData.guid,
          { forceget: true },
          null,
          credentials,
        );

        if (itemProperties.statusCode === 202) {
          console.log(
            ` Status:${itemProperties.statusCode} Preparing json data for model`,
            itemMetaData.fileName,
          );
          await delay(10 * 1000);
          continue;
        } else {
          console.log(
            ` Status:${itemProperties.statusCode} retrieve json data for model`,
            itemMetaData.fileName,
          );
          //   arr.push({ itemProperties, itemDteails:itemMetaData });

          const hasTypeName = hasIdentityData(
            itemProperties.body.data.collection,
          );
          arr.push({ hasTypeName, itemMetaData });

          break;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  const hubs = await hub(credentials);
  const allProjects = await projects(hubs);
  await insertProjects(allProjects);

  for await (const property of arr) {
    //detailes from Item
    const id = property.itemMetaData.versionId as string;
    const projectId = property.itemMetaData.projectId as string;
    const projectName = property.itemMetaData.projectName as string;
    const originalItemUrn = property.itemMetaData.originalItemUrn as string;
    const name = property.itemMetaData.fileName as string;
    const elementsCount = property.hasTypeName.length as string;
    const date = property.itemMetaData.lastModifiedTime as string;
    const modiId = id.split('?')[0] as string;
    const version_id = Number(id.split('=')[1]);

    const eltCollection = property.hasTypeName.map((elt) => {
      const dbId = Number(elt.name.split('[')[1].split(']')[0]);

      // return elt;

      const elementProps = topLevelObj(elt);

      const typeName = elementProps?.['Type Name']
        ? elementProps['Type Name']
        : null;
      const typeSorting = elementProps?.['Type Sorting']
        ? elementProps['Type Sorting']
        : null;
      const objWithSpaces = {
        TypeName: typeName,
        Type_Sorting: typeSorting,
      };

      //@ts-ignore
      const objResult = {
        ...dummyObject,
        dbId,
        version_id,
        objectId: id,

        ...elementProps,
        ...objWithSpaces,
      } as ElementProperties;
      delete objResult['Type Name'];
      delete objResult['Type Sorting'];
      return objResult;
    });
    //calling the database

    await deleteObjId(modiId);

    await insdertItems({
      id,
      projectId,
      originalItemUrn,
      name,
      elementsCount,
      date,
    });

    await insterElements(eltCollection);
    Logger.debug('*****************DONE*****************' + name + projectName);

    await delay(10 * 1000);
  }
  console.log('*****************DONE*****************');

  return '*****************DONE*****************';
};

// return;
// const returnObj = {
//   name: elt.name,
//   dbId: Number(dbId),
//   version_id: Number(version_id),
//   externalId: elt['externalId'],
//   TypeName: elt.properties['Identity Data']['Type Name'],
//   objectId: property.itemMetaData.versionId,
//   Workset: elt.properties['Identity Data']['Workset'],
//   Type_Sorting: elt.properties['Identity Data']['Type Sorting'],
//   CCSTypeID: elt.properties['Other']['CCSTypeID'],
//   CCSTypeID_Type: elt.properties['Other']['CCSTypeID_Type'],
//   CCSClassCode_Type: elt.properties['Other']['CCSClassCode_Type'],
//   BIM7AATypeName: elt.properties['Other']['BIM7AATypeName'],
//   BIM7AATypeDescription: elt.properties['Other']['BIM7AATypeDescription'],
//   BIM7AATypeID: elt.properties['Other']['BIM7AATypeID'],
//   BIM7AATypeNumber: elt.properties['Other']['BIM7AATypeNumber'],
//   BIM7AATypeCode: elt.properties['Other']['BIM7AATypeCode'],
//   BIM7AATypeComments: elt.properties['Other']['BIM7AATypeComments'],
// };
