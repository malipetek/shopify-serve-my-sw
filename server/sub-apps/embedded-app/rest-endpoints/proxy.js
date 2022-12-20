import { getFile } from '../../../helpers/s3.js';

export default function (req, res, next) {
  const shop = req.headers['x-shop-domain'];
  const { theme, file } = req.params;
  const directory = `${shop}/${theme}`;
  const filename = `${file}`;
  res.set('content-type', 'text/javascript');
  res.set('service-worker-allowed', '/');
  res.status(200).send(getFile({ directory, filename }).toString());
}
