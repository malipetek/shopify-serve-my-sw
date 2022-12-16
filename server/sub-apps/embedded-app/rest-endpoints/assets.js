import verifyRequest from "../../../middleware/verify-request.js";
import { Shopify, ApiVersion } from "@shopify/shopify-api";

export default function (app) {
  return [
    verifyRequest(app),
    async (req, res) => {
      const theme_id = req.params.id;
      const session = await Shopify.Utils.loadOfflineSession(req.query.shop);

      const { Asset } = await import(
        `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
      );

      const assets = await Asset.all({ session, theme_id });
      res.status(200).send(assets);
    },
  ];
}
