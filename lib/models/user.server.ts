import { prisma } from '@/lib/prisma';

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

export async function createUser({ firebaseUid, email, name, avatar }: UserInput) {
  return prisma.user.create({
    data: {
      firebaseUid,
      email,
      name,
      avatar
    },
  });
}

export async function deleteUser(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}

export async function updateUser({ id, email, name }: UpdateUserInput) {
  return prisma.user.update({
    where: { id },
    data: {
      ...(email !== undefined ? { email } : {}),
      ...(name !== undefined ? { name } : {}),
    },
  });
}

export async function getUserByUid(firebaseUid: string) {
  return prisma.user.findUnique({
    where: { firebaseUid },
  });
}

export async function findOrCreateUser({ firebaseUid, email, name, avatar }: UserInput) {
  const user = await getUserByUid(firebaseUid);
  if (user) return user;
  return createUser({ firebaseUid, email, name, avatar });
}