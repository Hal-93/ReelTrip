import { NextRequest, NextResponse } from 'next/server';
import { createFile } from '@/lib/models/file.server';
import { uploadFile } from '@/lib/minio';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  const userId = request.headers.get('x-user-id') || '';

  try {
    const fileName = file.name;
    const timestamp = Date.now();
    const objectName = `${timestamp}_${fileName}`;

    await uploadFile(file, objectName);

    const downloadLink = `/api/files/${objectName}`;

    const result = await createFile(userId, fileName, objectName, downloadLink);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process file' }, { status: 500 });
  }
}
