import { prisma } from "../config/prisma";
import redisClient from "../config/redis";

export const mentionTopicService = async (name: string) => {
  const normalizedName = name.toLowerCase().trim();
  return prisma.$transaction(async (tx) => {
    let topic = await tx.topic.findUnique({
      where: { name: normalizedName },
    });

    if (!topic) {
      topic = await tx.topic.create({
        data: { name: normalizedName },
      });
    }

    await tx.topicMention.create({
      data: {
        topicId: topic.id,
      },
    });
    return {
      topic: topic.name,
      mentionedAt: new Date(),
    };
  });
};

export const getAllTopicsService = async () => {
  return prisma.topic.findMany({
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getTopicHistoryService = async (name: string) => {
  const normalizedName = name.toLowerCase().trim();

  const topic = await prisma.topic.findUnique({
    where: { name: normalizedName },
  });

  if (!topic) {
    throw new Error("Topic not found");
  }

  const mentions = await prisma.topicMention.findMany({
    where: { topicId: topic.id },
    orderBy: { createdAt: "desc" },
    take: 20, // recent 20 mentions
  });

  return {
    topic: topic.name,
    totalMentions: mentions.length,
    mentions: mentions.map((m) => m.createdAt),
  };
};

// export const getTrendingTopicsService = async () => {
//   const result = await prisma.topic.findMany({
//     select: {
//       name: true,
//       _count: {
//         select: { mentions: true },
//       },
//     },
//     orderBy: {
//       mentions: {
//         _count: "desc",
//       },
//     },
//     take: 10,
//   });
//   console.log("Trending Topics Result:", result);
//   return result.map((item) => ({
//     topic: item.name,
//     mentions: item._count.mentions,
//   }));
// };

export const getTrendingTopicsService = async () => {
  const raw = await redisClient.zRangeWithScores(
    "trending:topics",
    0,
    9,
    { REV: true }
  );

  const result = [];

  for (const item of raw) {
    const topic = item.value;
    const score = item.score;

    const exists = await redisClient.exists(
      `topic:lastSeen:${topic}`
    );

    if (!exists) {
      await redisClient.zRem("trending:topics", topic);
      continue;
    }

    result.push({
      topic,
      mentions: score,
    });
  }

  return result;
};

