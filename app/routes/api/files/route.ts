import { type LoaderFunctionArgs } from "react-router";
import { minioClient } from "~/lib/service/minio";

const BUCKET = process.env.MINIO_BUCKET!;

export async function loader({ params }: LoaderFunctionArgs) {
  const objectName = params.objectName;
  if (!objectName) {
    return new Response("Missing object name", { status: 400 });
  }

  try {
    const dataStream = await minioClient.getObject(BUCKET, objectName);
    const chunks: Uint8Array[] = [];
    for await (const chunk of dataStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: { "Content-Type": "image/webp" },
    });
  } catch (error) {
    console.error("Error fetching object from MinIO:", error);
    return new Response("File not found", { status: 404 });
  }
}
