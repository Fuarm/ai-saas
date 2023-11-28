import { auth } from "@clerk/nextjs";

import prisma_db from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
  const { userId } = auth();

  if (!userId) { return }

  const userApiLimit = await prisma_db.userApiLimit.findUnique({
    where: { userId }
  });

  if (userApiLimit) {
    await prisma_db.userApiLimit.update({
      where: { userId },
      data: { count: userApiLimit.count + 1 }
    });
  } else {
    await prisma_db.userApiLimit.create({
      data: { userId, count: 1 }
    })
  }
}

export const checkApiLimit = async () => {
  const { userId } = auth();

  if (!userId) { return false; }

  const userApiLimit = await prisma_db.userApiLimit.findUnique({
    where: { userId }
  });

  return !userApiLimit || userApiLimit.count < MAX_FREE_COUNTS;
}

export const getApiLimitCount = async () => {
  const { userId } = auth();

  if (!userId) { return 0 }

  const userApiLimit = await prisma_db.userApiLimit.findUnique({
    where: { userId }
  });

  if (!userApiLimit)  { return 0 }

  return userApiLimit.count;
}