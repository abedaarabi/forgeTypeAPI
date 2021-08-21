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
export const propertiesMetadata = async () => {
  let arr = [];
  const guid = new ForgeSDK.DerivativesApi();
  const allItemsMetaData = await metadata();

  const hasGuId = allItemsMetaData.filter((item) => {
    if (
      item.guid &&
      (item.fileName.includes('K07') ||
        item.fileName.includes('K08') ||
        item.fileName.includes('K09') ||
        item.fileName.includes('K10'))
    ) {
      return true;
    } else return false;
  });

  const credentials = await oAuth2();

  for await (const itemMetaData of hasGuId) {
    // const derivativesId = itemMetaData.guidContent.derivativesId;

    while (true) {
      try {
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
  const dataBaseProject = await insertProjects(allProjects);
  console.log(dataBaseProject);

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

    const deleteId = await deleteObjId(modiId);
    const insertItems = await insdertItems({
      id,
      projectId,
      originalItemUrn,
      name,
      elementsCount,
      date,
    });

    const eltCollection = property.hasTypeName.map((elt) => {
      const dbId = elt.name.split('[')[1].split(']')[0];

      // return elt;
      return {
        name: elt.name,
        dbId: Number(dbId),
        externalId: elt['externalId'],
        typName: elt.properties['Identity Data']['Type Name'],
        objectId: property.itemMetaData.versionId,
        Workset: elt.properties['Identity Data']['Workset'],
        Type_Sorting: elt.properties['Identity Data']['Type Sorting'],
        CCSTypeID: elt.properties['Other']['CCSTypeID'],
        CCSTypeID_Type: elt.properties['Other']['CCSTypeID_Type'],
        CCSClassCode_Type: elt.properties['Other']['CCSClassCode_Type'],
        BIM7AATypeName: elt.properties['Other']['BIM7AATypeName'],
        BIM7AATypeDescription: elt.properties['Other']['BIM7AATypeDescription'],
        BIM7AATypeID: elt.properties['Other']['BIM7AATypeID'],
        BIM7AATypeNumber: elt.properties['Other']['BIM7AATypeNumber'],
        BIM7AATypeCode: elt.properties['Other']['BIM7AATypeCode'],
        BIM7AATypeComments: elt.properties['Other']['BIM7AATypeComments'],
      };
    });

    const insterElt = await insterElements(eltCollection);
    console.log(deleteId);
    console.log(insertItems);
    console.log(insterElt);

    await delay(10 * 1000);
  }
  console.log('*****************DONE*****************');

  return '*****************DONE*****************';
};
