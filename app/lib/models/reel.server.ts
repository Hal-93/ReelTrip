import { prisma } from "~/lib/service/prisma";

export async function createReel(input: {
  userId?: string;
  caption?: string | null;
}) {
  return prisma.reel.create({
    data: {
      caption: input.caption ?? null,
      ...(input.userId
        ? {
            user: {
              connect: { id: input.userId },
            },
          }
        : {}),
    },
  });
}

export async function getReelById(reelId: string) {
  return prisma.reel.findUnique({
    where: { id: reelId },
    include: {
      pictures: true,
      user: true,
    },
  });
}

export async function getReelByUserId(userId: string) {
  return prisma.reel.findFirst({
    where: {
      userId: userId,
    },
    include: {
      pictures: true,
    },
  });
}

export async function updateReel(
  reelId: string,
  data: {
    caption?: string | null;
  },
) {
  return prisma.reel.update({
    where: { id: reelId },
    data,
  });
}

/**
 * DELETE
 */
export async function deleteReel(reelId: string) {
  return prisma.reel.delete({
    where: { id: reelId },
  });
}