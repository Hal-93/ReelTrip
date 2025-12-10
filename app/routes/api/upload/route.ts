import { type ActionFunctionArgs } from "react-router";
import { createFile } from "~/lib/models/file.server";
import { createPicture } from "~/lib/models/picture.server";
import { uploadFile } from "~/lib/service/minio";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { status: 400 };
  }

  const userId = request.headers.get("x-user-id") || "";

  try {
    const fileName = file.name;
    const timestamp = Date.now();
    const objectName = `${timestamp}_${fileName}`;

    const lat = formData.get("lat");
    const lng = formData.get("lng");
    const width = formData.get("width");
    const height = formData.get("height");
    const date = formData.get("date");
    const price = formData.get("price");
    //onst genre = formData.get("genre");
    const quality = formData.get("quality");

    if (quality === "false") {
      return Response.json(
        { message: "AI判定によりアップロードできません。" },
        { status: 400 }
      );
    }

    await uploadFile(file, objectName);

    const downloadLink = `/api/files/${objectName}`;

    const result = await createFile(userId, fileName, objectName, downloadLink);

    let pictureResult;
    try {
      pictureResult = await createPicture({
        userId,
        fileId: result.id,
        lat: Number(lat),
        lng: Number(lng),
        width: Number(width),
        height: Number(height),
        date: String(date),
        price: price ? Number(price) : undefined,
        //genre: genre ? String(genre) : undefined
      });
    } catch (error) {
      console.error(error);
      return Response.json(
        { message: "画像登録に失敗しました。" },
        { status: 500 },
      );
    }

    return Response.json({ file: result, picture: pictureResult });
  } catch (error) {
    console.error(error);
    return { status: 500 };
  }
}
