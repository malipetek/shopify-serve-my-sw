import verifyRequest from "../../../middleware/verify-request.js";
import { downloadFiles, uploadFiles, getDirectory, getFile, saveFile, deleteFile, createDirectory } from '../../../helpers/s3.js';

export default function (app) {
  return [
    async (req, res) => {
      const { shop, theme, filename } = req.params;
      res.status(200).send(getFile());
    },
  ];
}
