import * as ForgeSDK from 'forge-apis';
import { oAuth2 } from '../shared/forge.oAuth2';
import { delay } from '../shared/array.helper';
import { ItemDetails } from '../interfaces/interface.item';
import { items } from '../shared/forge.items';
import { Logger } from '@nestjs/common';

let arr: ItemDetails[] = [];
const transaltionStatus = ['pending', 'inprogress'];
export const metadata = async () => {
  const guid = new ForgeSDK.DerivativesApi();
  // const credentials = await oAuth2();
  const allItems = await items();

  const filteredItems = allItems.filter((item) => {
    if (
      item.fileType === 'rvt' &&
      item.originalItemUrn &&
      (item.fileName.includes('K07') ||
        item.fileName.includes('K08') ||
        item.fileName.includes('K09') ||
        item.fileName.includes('K10'))
    ) {
      return true;
    } else {
      return false;
    }
  });

  console.log(filteredItems);

  for await (const guidContent of filteredItems) {
    while (true) {
      try {
        // check if the transalteProsses complete
        const credentials = await oAuth2();

        const transalteProsses = await guid.getManifest(
          guidContent.derivativesId,
          null,
          null,
          credentials,
        );
        // if (transalteProsses.body.progress !== 'complete'
        if (transaltionStatus.includes(transalteProsses.body.progress)) {
          console.log(transalteProsses.body.progress, 'transalte status');

          Logger.debug(
            'waitin for translation to finish: ',
            guidContent.fileName,
          );
          await delay(10 * 1000);
          //FIXED:

          continue;
        } else if (
          transalteProsses.body.progress === 'complete'
          // transalteProsses.body.progress === '99% complete transalte status'
        ) {
          const metaData = await guid.getMetadata(
            guidContent.derivativesId,
            null,
            null,
            credentials,
          );
          Logger.log('Translate progress complete: ', guidContent.fileName);
          const uu = metaData.body.data.metadata as ItemDetails[];
          const roleInfo = uu.find((item) => {
            if (item.role === '3d' && item.name === 'New Construction') {
              return true;
            }
          });

          //push all items that finish translation(but status could be failed)
          arr.push({
            ...guidContent,
            ...roleInfo,
            translateStatus: transalteProsses.body.status,
            translateProgress: transalteProsses.body.progress,
          });
          break;
        }
      } catch (error) {
        Logger.log(error);
      }
    }
  }

  return arr;
};
