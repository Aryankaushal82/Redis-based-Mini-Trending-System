import { NextFunction, Request, Response } from "express";
import prisma from "../lib/prisma";
import redisClient from "../config/redis";

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, image } = req.body;
    // @ts-ignore
    const userId = req.userId;

    if (!content) {
      return res.status(400).json({ success: false, message: "Content is required" });
    }

    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    // Extract hashtags and update Redis trending
    const hashtags = content.match(/#[\w-]+/g);
    console.log(`[DEBUG] Creating post. Content: "${content}". Hashtags found:`, hashtags);
    if (hashtags) {
      for (const tag of hashtags) {
        const tagName = tag.slice(1).toLowerCase().trim(); // Remove #
        await redisClient.zIncrBy("trending:topics", 1, tagName);
        await redisClient.set(`topic:lastSeen:${tagName}`, new Date().toISOString(), { EX: 600 });
        
        // Also ensure topic exists in Postgres for history (optional, keeping consistent with old logic)
        // We can just fire and forget or await.
        try {
            await prisma.topic.upsert({
                where: { name: tagName },
                update: {},
                create: { name: tagName }
            });
        } catch (e) {}
      }
    }

    return res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        likes: true,
      },
      take: 50,
    });

    // Transform to add like count and isLiked
    // @ts-ignore
    const currentUserId = req.userId; // Might be undefined if public feed

    const feed = posts.map(post => ({
      ...post,
      likeCount: post.likes.length,
      isLiked: currentUserId ? post.likes.some(like => like.userId === currentUserId) : false,
      likes: undefined, // Remove raw likes array
    }));

    return res.status(200).json({
      success: true,
      data: feed,
    });
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    const userId = req.userId;

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return res.status(200).json({ success: true, message: "Unliked" });
    } else {
      await prisma.like.create({
        data: {
          userId,
          postId: id,
        },
      });
      return res.status(200).json({ success: true, message: "Liked" });
    }
  } catch (error) {
    next(error);
  }
};
