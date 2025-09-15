import { NextResponse } from "next/server";
import { minioClient } from "@/lib/minio";

const BUCKET = process.env.MINIO_BUCKET!;

export async function GET(_: Request, { params }: { params: { objectName: string } }) {
  try {
    const dataStream = await minioClient.getObject(BUCKET, params.objectName);
    return new NextResponse(dataStream, {
      headers: { "Content-Type": "image/webp" },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}