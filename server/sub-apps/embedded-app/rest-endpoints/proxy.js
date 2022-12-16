import { getFile } from '../../../helpers/s3.js';

export default function (req, res, next) {
  const shop = req.headers['x-shop-domain'];
  const { theme, file } = req.params;
  const directory = `${shop}/${decodeURIComponent(theme)}`;
  const filename = `${decodeURIComponent(file)}`;
  res.set('content-type', 'text/javascript');
  res.status(200).send(getFile({ directory, filename }).toString());
}
