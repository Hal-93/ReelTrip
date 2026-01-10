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

  if (!selectedPictureObjectNames || selectedPictureObjectNames.length === 0) {
    throw new Error("selectedPictureObjectNames must have at least 1 item.");
  }

  return prisma.$transaction(async (tx) => {
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

    await tx.picture.updateMany({
      where: {
        userId,
        reelId: reel.id,
      },
      data: {
        reelId: null,
      },
    });

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



export async function setUserReel(params: {
  userId: string;
  reelId: string;
}): Promise<{
  userId: string;
  reelId: string;
}> {
  const { userId, reelId } = params;

  return prisma.$transaction(async (tx) => {
    const reel = await tx.reel.findUnique({
      where: { id: reelId },
      select: { id: true, userId: true },
    });

    if (!reel) {
      throw new Error("Reel not found.");
    }

    if (reel.userId !== userId) {
      throw new Error("Reel does not belong to the user.");
    }

    await tx.user.update({
      where: { id: userId },
      data: {
        reel: {
          connect: { id: reelId },
        },
      },
    });

    return { userId, reelId };
  });
}



export async function getUserReel(params: {
  userId: string;
}): Promise<{
  id: string;
  createdAt: Date;
  caption: string | null;
  videoFile: {
    id: string;
    fileName: string;
    objectName: string;
    downloadLink: string;
  };
  pictures: {
    id: string;
    file: {
      id: string;
      objectName: string;
      fileName: string;
      downloadLink: string;
    };
  }[];
} | null> {
  const { userId } = params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      reel: {
        select: {
          id: true,
          createdAt: true,
          caption: true,
          videoFile: {
            select: {
              id: true,
              fileName: true,
              objectName: true,
              downloadLink: true,
            },
          },
          pictures: {
            orderBy: {
              createdAt: "asc",
            },
            select: {
              id: true,
              file: {
                select: {
                  id: true,
                  objectName: true,
                  fileName: true,
                  downloadLink: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return user?.reel ?? null;
}

/**
 * Get latitude / longitude of all pictures attached to user's Reel.
 */

export async function getUserReelLocations(params: {
  userId: string;
}): Promise<
  | {
      id: string;
      lat: number;
      lng: number;
      image: string;
    }[]
  | null
> {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: {
      reel: {
        select: {
          pictures: {
            select: {
              id: true,
              lat: true,
              lng: true,
              file: {
                select: {
                  downloadLink: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user?.reel) {
    return null;
  }

  return user.reel.pictures.map((p) => ({
    id: p.id,
    lat: p.lat,
    lng: p.lng,
    image: p.file.downloadLink,
  }));
}