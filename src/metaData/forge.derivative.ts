import * as ForgeSDK from 'forge-apis';
import { oAuth2 } from '../shared/forge.oAuth2';
import { Item } from '../interfaces/interface.item';
import { items } from '../shared/forge.items';

interface GuId {
  guidContent: Item;
  name: string;
  role: string;
  guid: string;
}
let arr: GuId[] = [];


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
          console.log(
            'waitin for translation to finish: ',
            guidContent.fileName,
          );
          continue;
        } else if (
          transalteProsses.body.progress === 'complete' &&
          transalteProsses.body.status != 'failed'
        ) {
          const metaData = await guid.getMetadata(
            guidContent.derivativesId,
            null,
            null,
            credentials,
          );
          console.log('Translate progress complete: ', guidContent.fileName);
          const uu = metaData.body.data.metadata as GuId[];
          const roleInfo = uu.find((item) => {
            if (item.role === '3d' && item.name === 'New Construction') {
              return true;
            }
          });

          arr.push({ ...guidContent, ...roleInfo });
          break;
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  return arr;
};
