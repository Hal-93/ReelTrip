import { prisma } from "~/lib/service/prisma";

export interface UserInput {
  firebaseUid: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface UpdateUserInput {
  id: string;
  email?: string;
  name?: string;
}

/**
 * ユーザー作成
 * @param param
 * @returns
 */
export async function createUser({
  firebaseUid,
  email,
  name,
  avatar,
}: UserInput) {
  return prisma.user.create({
    data: {
      firebaseUid,
      email,
      name,
      avatar,
    },
  });
}

/**
 * ユーザー削除
 * @param id
 * @returns
 */
export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}

/**
 * ユーザー更新
 * @param param
 * @returns
 */
export async function updateUser({ id, email, name }: UpdateUserInput) {
  return prisma.user.update({
    where: { id },
    data: {
      ...(email !== undefined ? { email } : {}),
      ...(name !== undefined ? { name } : {}),
    },
  });
}

/**
 * ユーザー新規作成
 * @param param
 * @returns
 */
export async function findOrCreateUser({
  firebaseUid,
  email,
  name,
  avatar,
}: UserInput) {
  return prisma.user.upsert({
    where: { firebaseUid },
    update: {},
    create: {
      firebaseUid,
      email,
      name,
      avatar,
    },
  });
}
