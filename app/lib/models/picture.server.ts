import { prisma } from "~/lib/service/prisma";
import type { Genre, Picture } from "@prisma/client";

type CreatePictureParams = {
  userId: string;
  fileId: string;
  lat: number;
  lng: number;
  width: number;
  height: number;
  date: string;
  price?: number;
  genre?: Genre;
  
};

export async function createPicture(params: CreatePictureParams) {
  const { userId, fileId, lat, lng, width, height, date, price, genre } = params;

  try {
    return await prisma.picture.create({
      data: {
        createdAt: new Date(),
        userId,
        fileId,
        lat,
        lng,
        width,
        height,
        date,
        price,
        genre,
      },
    });
  } catch (e) {
    console.error("データベースエラー: ", e);
  }
}

export async function getPictureById(id: string) {
  try {
    return await prisma.picture.findUnique({
      where: { id },
    });
  } catch {
    throw new Error("エラー");
  }
}

export async function getAllPictures() {
  try {
    return await prisma.picture.findMany();
  } catch {
    throw new Error("エラー");
  }
}

export async function updatePicture(id: string, data: Partial<Picture>) {
  try {
    return await prisma.picture.update({
      where: { id },
      data,
    });
  } catch {
    throw new Error("エラー");
  }
}

export async function deletePicture(id: string) {
  try {
    return await prisma.picture.delete({
      where: { id },
    });
  } catch {
    throw new Error("エラー");
  }
}
