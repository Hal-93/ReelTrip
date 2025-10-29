import * as Minio from "minio";

const endpoint: string = process.env.MINIO_ENDPOINT!;
const accessKey: string = process.env.MINIO_ACCESS_KEY!;
const secretKey: string = process.env.MINIO_SECRET_KEY!;
const bucket: string = process.env.MINIO_BUCKET!;
const publicBucket: string = process.env.MINIO_PUBLIC_BUCKET!;
export const minioClient = new Minio.Client({
  endPoint: endpoint,
  port: 9000,
  useSSL: false,
  accessKey: accessKey,
  secretKey: secretKey,
});

function getContentType(filename: string): string {
  const mimeTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".mp4": "video/mp4",
    ".mp3": "audio/mp3",
  };

  const ext: string = filename.slice(
    ((filename.lastIndexOf(".") - 1) >>> 0) + 2,
  );
  return mimeTypes["." + ext] || "application/octet-stream"; // 拡張子に基づいてContent-Typeを返す
}

export async function uploadFile(
  sourceFile: File,
  destinationObject: string,
): Promise<void> {
  try {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      await minioClient.makeBucket(bucket);
    }
    const fileBuffer = Buffer.from(await sourceFile.arrayBuffer());
    await minioClient.putObject(bucket, destinationObject, fileBuffer);
    console.log(
      `File uploaded as object ${destinationObject} in bucket ${bucket}`,
    );
  } catch (err) {
    console.error("Error uploading file:", err);
  }
}

export async function uploadPublicFile(
  sourceFile: File,
  destinationObject: string,
): Promise<void> {
  try {
    const exists = await minioClient.bucketExists(publicBucket);
    if (!exists) {
      await minioClient.makeBucket(publicBucket);
    }
    const metaData = { "Content-Type": getContentType(sourceFile.name) };
    const fileBuffer = Buffer.from(await sourceFile.arrayBuffer());
    await minioClient.putObject(
      publicBucket,
      destinationObject,
      fileBuffer,
      undefined,
      metaData,
    );
    console.log(
      `File uploaded as object ${destinationObject} in bucket ${publicBucket}`,
    );
  } catch (err) {
    console.error("Error uploading file:", err);
  }
}

export async function deleteFile(sourceObject: string): Promise<void> {
  try {
    await minioClient.removeObject(bucket, sourceObject);
    console.log(`File "${sourceObject}" was deleted`);
  } catch (err) {
    console.error("Error delete file:", err);
  }
}

export async function deletePublicObject(sourceObject: string): Promise<void> {
  try {
    await minioClient.removeObject(publicBucket, sourceObject);
    console.log(`File "${sourceObject}" was deleted`);
  } catch (err) {
    console.error("Error delete file:", err);
  }
}

export async function getListOfFiles(prefix: string): Promise<string[]> {
  try {
    const objects = minioClient.listObjectsV2(bucket, prefix, true);

    const files: string[] = [];
    for await (const obj of objects) {
      files.push(obj.name);
    }

    return files;
  } catch (err) {
    console.error("Error getting list of files:", err);
    throw err;
  }
}

export async function getFile(sourceObject: string): Promise<Buffer> {
  try {
    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      throw new Error(`Bucket "${bucket}" does not exist.`);
    }

    const dataStream = await minioClient.getObject(bucket, sourceObject);

    const result = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      dataStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      dataStream.on("end", () => {
        console.log(`File ${sourceObject} retrieved from bucket ${bucket}`);
        resolve(Buffer.concat(chunks));
      });

      dataStream.on("error", (err) => {
        reject(err);
      });
    });

    return result;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}

export async function getPublicObject(sourceObject: string): Promise<Buffer> {
  try {
    const exists = await minioClient.bucketExists(publicBucket);
    if (!exists) {
      throw new Error(`Bucket "${publicBucket}" does not exist.`);
    }

    const dataStream = await minioClient.getObject(publicBucket, sourceObject);

    const result = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      dataStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      dataStream.on("end", () => {
        console.log(`File ${sourceObject} retrieved from bucket ${publicBucket}`);
        resolve(Buffer.concat(chunks));
      });

      dataStream.on("error", (err) => {
        reject(err);
      });
    });

    return result;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}