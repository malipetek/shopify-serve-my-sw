import verifyRequest from "../../../middleware/verify-request.js";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import { downloadFiles, uploadFiles, getDirectory, getFile, saveFile, deleteFile, createDirectory } from '../../../helpers/s3.js';

export default function (app) {
  return [
    verifyRequest(app),
    async (req, res) => {
      let { shop } = req.query;
      const session = await Shopify.Utils.loadOfflineSession(shop);

      if(req.method == 'PUT') {
        const { Theme, Asset } = await import(
          `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
        );
        try {
          const themes = await Theme.all({ session });
          let themesInDirectory = await getDirectory({ directory: `${shop}` });
          themesInDirectory = themesInDirectory.map(t => decodeURIComponent(t));
          await Promise.all(themesInDirectory.map(async theme => {
            const theme_id = themes.find(t => t.name == theme).id;
            const assetsInDirectory = await getDirectory({ directory: `${shop}/${encodeURIComponent(theme)}` });
            await Promise.all(assetsInDirectory.map(async filename => {
              const [asset] = await Asset.all({
                session: session,
                theme_id,
                asset: { "key": `assets/${decodeURIComponent(filename)}` },
              });
              await saveFile({ directory: `${shop}/${theme}`, filename, file: asset.value });
            }));
          }));
          
          uploadFiles({ directory: `${shop}` });

          res.status(200).send({ status: 'Ok, purged successfully, file contents pulled from your theme' });
        } catch (err) {
          res.status(500).send({ status: err.message });
        }
      } else {  
        const { Theme } = await import(
          `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
        );
  
        const themes = await Theme.all({ session });
        res.status(200).send(themes);
      }
    },
  ];
}
