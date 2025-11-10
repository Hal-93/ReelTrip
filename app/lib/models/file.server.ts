import { prisma } from "~/lib/service/prisma";

export async function createFile(
  userId: string,
  fileName: string,
  objectName: string,
  downloadLink: string,
) {
  try {
    const file = await prisma.file.create({
      data: {
        fileName,
        objectName,
        downloadLink,
        user: { connect: { id: userId } },
      },
    });

    return file;
  } catch (error) {
    console.error("Error creating or updating file:", error);
    throw new Error("Failed to create or update file");
  }
}

export async function getFileByLinkandUId(link: string, userId: string) {
  try {
    const downloadLink = await prisma.file.findFirst({
      where: { downloadLink: link, userId: userId },
    });

    return downloadLink;
  } catch (error) {
    console.error("Error getting download link:", error);
    throw new Error("Failed to get link");
  }
}

export async function getFilesByUser(userId: string) {
  try {
    const files = await prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return files;
  } catch (error) {
    console.error("Error getting files:", error);
    throw new Error("Failed to get files");
  }
}
