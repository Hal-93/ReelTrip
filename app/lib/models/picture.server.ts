import { prisma } from "~/lib/service/prisma";
import type { Genre, Picture } from "@prisma/client";

type CreatePictureParams = {
  userId: string;
  fileId: string;
  spotName: string;
  category: string;
  description: string;
  lat: number;
  lng: number;
  width: number;
  height: number;
  date: string;
  price?: number;
  genre?: Genre;
};



export async function createPicture(params: CreatePictureParams) {
  const {
    userId,
    fileId,
    spotName,
    category,
    description,
    lat,
    lng,
    width,
    height,
    date,
    price,
    genre,
  } = params;

  try {
    return await prisma.picture.create({
      data: {
        createdAt: new Date(),
        userId,
        fileId,
        spotName,
        category,
        description,
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


function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function isWithinThreshold(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  thresholdKm = 5
) {
  return distanceKm(lat1, lng1, lat2, lng2) <= thresholdKm;
}

export async function groupPicturesByLocation() {
  const pictures = await prisma.picture.findMany({
    include: {
      file: true,
    },
  });

  const imagesWithGPS = pictures.map(p => ({
    key: p.file.objectName,
    lat: p.lat,
    lng: p.lng,
  }));

  const groups: { key: string; lat: number; lng: number }[][] = [];

  for (const image of imagesWithGPS) {
    let addedToGroup = false;

    for (const group of groups) {
      const refImage = group[0];
      if (isWithinThreshold(image.lat, image.lng, refImage.lat, refImage.lng)) {
        group.push(image);
        addedToGroup = true;
        break;
      }
    }

    if (!addedToGroup) {
      groups.push([image]);
    }
  }

  return groups;
}

export async function getNearestPictureGroup(
  lat: number,
  lng: number
) {
  const groups = await groupPicturesByLocation();
  if (groups.length === 0) {
    return [];
  }

  let nearestGroup = groups[0];
  let minDistance = distanceKm(lat, lng, nearestGroup[0].lat, nearestGroup[0].lng);

  for (const group of groups) {
    const dist = distanceKm(lat, lng, group[0].lat, group[0].lng);
    if (dist < minDistance) {
      nearestGroup = group;
      minDistance = dist;
    }
  }

  return nearestGroup;
}
