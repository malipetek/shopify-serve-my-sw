import verifyRequest from "../../../middleware/verify-request.js";
import { Shopify, ApiVersion } from "@shopify/shopify-api";

export default function (app) {
  return [
    verifyRequest(app),
    async (req, res) => {
      const session = await Shopify.Utils.loadCurrentSession(
        req,
        res,
        app.get("use-online-tokens")
      );
      const { Theme } = await import(
        `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
      );

      const themes = await Theme.all({ session });
      res.status(200).send(themes);
    },
  ];
}
