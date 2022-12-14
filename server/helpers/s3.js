import "dotenv/config";
import fs, { ensureFile } from 'fs-extra';
import s3 from 's3';
import debounce from 'lodash.debounce';

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const client = s3.createClient({
  s3Options: {
    region,
    accessKeyId,
    secretAccessKey,
    // any other options are passed to new AWS.S3()
  },
});
const cacheFolder = `${process.cwd()}/cachedFiles`;

const baseParams = {
  localDir: cacheFolder,
  s3Params: {
    Bucket: bucketName,
    Key: "/",
  },
};
function _uploadFiles({ directory } = { directory: undefined }) {
    const uploader = client.uploadDir({
      ...baseParams,
        localDir: `${cacheFolder}${directory ? `/${encodeURIComponent(directory)}` : ''}`,
        deleteRemoved: true,
        s3Params: {
        ...baseParams.s3Params,
          Prefix: encodeURIComponent(directory)
        }
    });
    uploader.on('error', function(err) {
      console.error("unable to sync:", err.stack);
    });
    uploader.on('progress', function() {
      console.log("progress", uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on('end', function() {
      console.log("done uploading");
    });
}

function _downloadFiles({} = {}) {
  var downloader = client.downloadDir(baseParams);
  downloader.on('error', function(err) {
    console.error("unable to sync:", err.stack);
  });
  downloader.on('progress', function() {
    console.log("progress", downloader.progressAmount, downloader.progressTotal);
  });
  downloader.on('end', function() {
    console.log("done downloading");
  });
}
export async function getDirectory({ directory }) {
  if (await fs.pathExists(`${cacheFolder}/${encodeURIComponent(directory)}`)) {
    return fs.readdir(`${cacheFolder}/${encodeURIComponent(directory)}`);
  } else {
    return [];
  }
}
export function createDirectory({ directory }) {
  return fs.mkdir(`${cacheFolder}/${directory}`);
}
export async function saveFile({ directory, filename, file }) {
  await fs.ensureFile(`${cacheFolder}/${encodeURIComponent(directory)}/${filename}`);
  return fs.writeFile(`${cacheFolder}/${encodeURIComponent(directory)}/${filename}`, file);
}
export async function deleteFile({ directory, filename }) {
  if (fs.existsSync(`${cacheFolder}/${encodeURIComponent(directory)}/${filename}`)) {
    return fs.unlink(`${cacheFolder}/${encodeURIComponent(directory)}/${filename}`);
  }
}

export function getFile({ directory, filename }) {
  return fs.readFileSync(`${cacheFolder}/${encodeURIComponent(directory)}/${filename}`);
}

export const uploadFiles = debounce(_uploadFiles, 5000);
export const downloadFiles = debounce(_downloadFiles, 5000);

