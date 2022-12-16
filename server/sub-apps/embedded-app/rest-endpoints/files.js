import verifyRequest from "../../../middleware/verify-request.js";
import { downloadFiles, uploadFiles, getDirectory, getFile, saveFile, deleteFile, createDirectory } from '../../../helpers/s3.js';
import { Shopify, ApiVersion } from "@shopify/shopify-api";

export default function (app) {
  return [
    verifyRequest(app),
    async (req, res) => {
      let { shop, theme, filename } = req.params;
      const { theme_id } = req.query;
      theme = encodeURIComponent(theme);
      filename = encodeURIComponent(filename);

      switch (req.method) {
        case 'POST':
          const session = await Shopify.Utils.loadOfflineSession(req.query.shop);
    
          const { Asset } = await import(
            `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
          );
          const [ asset ] = await Asset.all({
            session: session,
            theme_id,
            asset: {"key": `assets/${filename}`},
          });

          await saveFile({ directory: `${shop}/${theme}`, filename, file: asset.value });
          uploadFiles({ directory: `${shop}/${theme}` });
          res.status(200).send({ status: 'ok' });
          break;
        case 'DELETE':
          await deleteFile({ directory: `${shop}/${theme}`, filename });
          uploadFiles({ directory: `${shop}/${theme}` });
          res.status(200).send({ status: 'ok' });
          break;
        case 'GET':
          const dir = await getDirectory({ directory: `${shop}/${theme}` });
          res.status(200).send(dir);
          break;
      }
    },
  ];
}
