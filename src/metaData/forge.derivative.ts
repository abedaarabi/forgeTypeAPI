import * as ForgeSDK from 'forge-apis';
import { oAuth2 } from '../shared/forge.oAuth2';
import { delay } from '../shared/array.helper';
import { ItemDetails } from '../interfaces/interface.item';
import { items } from '../shared/forge.items';
import { Logger } from '@nestjs/common';

let arr: ItemDetails[] = [];

export const metadata = async () => {
  const guid = new ForgeSDK.DerivativesApi();
  const credentials = await oAuth2();
  const allItems = await items();

  const filteredItems = allItems.filter((item) => {
    if (item.fileType === 'rvt' && item.originalItemUrn) {
      return true;
    }
  });

  for await (const guidContent of filteredItems) {
    while (true) {
      try {
        // check if the transalteProsses complete
        const transalteProsses = await guid.getManifest(
          guidContent.derivativesId,
          null,
          null,
          credentials,
        );

        if (transalteProsses.body.progress != 'complete') {
          Logger.debug(
            'waitin for translation to finish: ',
            guidContent.fileName,
          );
          await delay(10 * 1000);
          continue;
        } else if (
          transalteProsses.body.progress === 'complete'
          // transalteProsses.body.status != 'failed'
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
