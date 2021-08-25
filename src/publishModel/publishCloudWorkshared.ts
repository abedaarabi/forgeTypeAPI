import { Logger } from '@nestjs/common';
import { publishModel } from 'src/SDKpublishModel/publishModel';
import { items } from '../shared/forge.items';

export const publishCloudWorkshared = async () => {
  let arr = [];
  const allItems = await items();

  const filteredItems = allItems
    .filter((item) => {
      if (item.fileType === 'rvt' && item.originalItemUrn) {
        return true;
      }
    })
    .filter((item) => {
      if (
        item.projectGuid &&
        (item.fileName.includes('K07') ||
          item.fileName.includes('K08') ||
          item.fileName.includes('K09') ||
          item.fileName.includes('K10'))
      ) {
        return true;
      } else return false;
    });
  console.log('rrtt#######');

  for await (const item of filteredItems) {
    const publishModels = await publishModel(
      item.projectId,
      item.originalItemUrn,
      true, // true: orderPublishing  false: verifyPublishing
    );
    Logger.debug('initialize publisg: ', item.fileName);

    arr.push(publishModels);
  }
  Logger.log('##########Finish publishing order');

  return arr;
};
