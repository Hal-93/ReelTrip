import { type ActionFunctionArgs } from 'react-router';
import { createFile } from '~/lib/models/file.server';
import { uploadFile } from '~/lib/service/minio';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return { status: 400 };
  }

  const userId = request.headers.get('x-user-id') || '';

  try {
    const fileName = file.name;
    const timestamp = Date.now();
    const objectName = `${timestamp}_${fileName}`;

    await uploadFile(file, objectName);

    const downloadLink = `/api/files/${objectName}`;

    const result = await createFile(userId, fileName, objectName, downloadLink);
    return result;
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
}