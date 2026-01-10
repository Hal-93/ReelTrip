import { prisma } from "~/lib/service/prisma";

import { Genre } from "@prisma/client";

/**
 * Map UI preference to Picture.genre
 */
function preferenceToGenres(preference: "見る" | "遊ぶ" | "食べる"): Genre[] {
  switch (preference) {
    case "見る":
      return [Genre.Sightseeing];
    case "遊ぶ":
      return [Genre.Activity];
    case "食べる":
      return [Genre.Gourmet];
    default:
      return [Genre.None];
  }
}

/**
 * Select picture file keys by user preference and return keys for make-video
 */
export async function generateMakeVideoKeys(params: {
  userId: string;
  preference: "見る" | "遊ぶ" | "食べる";
  limit?: number;
}): Promise<string[]> {
  const { userId, preference, limit = 10 } = params;

  const primaryGenres = preferenceToGenres(preference);

  const primaryPictures = await prisma.picture.findMany({
    where: {
      userId,
      genre: {
        in: primaryGenres,
      },
      reelId: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
    select: {
      file: {
        select: {
          objectName: true,
        },
      },
    },
  });

  let results = primaryPictures.map((p) => p.file.objectName);

  if (results.length < limit) {
    const remain = limit - results.length;

    const nonePictures = await prisma.picture.findMany({
      where: {
        userId,
        genre: Genre.None,
        reelId: null,
        file: {
          objectName: {
            notIn: results,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: remain,
      select: {
        file: {
          select: {
            objectName: true,
          },
        },
      },
    });

    results = results.concat(nonePictures.map((p) => p.file.objectName));
  }

  if (results.length < limit) {
    const remain = limit - results.length;

    const fallbackPictures = await prisma.picture.findMany({
      where: {
        userId,
        reelId: null,
        file: {
          objectName: {
            notIn: results,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: remain,
      select: {
        file: {
          select: {
            objectName: true,
          },
        },
      },
    });

    results = results.concat(fallbackPictures.map((p) => p.file.objectName));
  }

  return results.slice(0, limit);
}

/**
 * Create (or update) a Reel from selected picture file objectNames.
 *
 * - Reel is unique per user (Reel.userId @unique), so we upsert.
 * - Picture is attached to Reel via Picture.reelId (nullable).
 * - Video is represented as a File row (Reel.videoFileId -> File.id).
 */
export async function createReelFromSelectedKeys(params: {
  userId: string;
  selectedPictureObjectNames: string[];
  video: {
    fileName: string;
    objectName: string;
    downloadLink: string;
  };
  caption?: string | null;
}): Promise<{
  id: string;
  createdAt: Date;
  userId: string;
  videoFileId: string;
  caption: string | null;
}> {
  const { userId, selectedPictureObjectNames, video, caption = null } = params;

  // 空なら空で作らない方が安全。呼び出し側のバグを早期に炙り出す。
  if (!selectedPictureObjectNames || selectedPictureObjectNames.length === 0) {
    throw new Error("selectedPictureObjectNames must have at least 1 item.");
  }

  return prisma.$transaction(async (tx) => {
    // 1) 動画ファイルの File を upsert
    const videoFile = await tx.file.upsert({
      where: { objectName: video.objectName },
      update: {
        fileName: video.fileName,
        downloadLink: video.downloadLink,
        userId,
      },
      create: {
        fileName: video.fileName,
        objectName: video.objectName,
        downloadLink: video.downloadLink,
        userId,
      },
      select: {
        id: true,
      },
    });

    // 2) Reel を upsert（ユーザーあたり1つ）
    const reel = await tx.reel.upsert({
      where: { userId },
      update: {
        videoFileId: videoFile.id,
        caption,
      },
      create: {
        userId,
        videoFileId: videoFile.id,
        caption,
      },
      select: {
        id: true,
        createdAt: true,
        userId: true,
        videoFileId: true,
        caption: true,
      },
    });

    // 3) 既存の紐付けを外す（同ユーザーの Reel は1つなので、reel.id のみ対象）
    await tx.picture.updateMany({
      where: {
        userId,
        reelId: reel.id,
      },
      data: {
        reelId: null,
      },
    });

    // 4) 選ばれた画像を紐付ける（重複・他ユーザー混入防止のため userId + reelId:null を条件に）
    await tx.picture.updateMany({
      where: {
        userId,
        reelId: null,
        file: {
          objectName: {
            in: selectedPictureObjectNames,
          },
        },
      },
      data: {
        reelId: reel.id,
      },
    });

    return reel;
  });
}
