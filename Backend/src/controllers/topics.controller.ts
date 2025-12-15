import { NextFunction, Request, Response } from "express";
import { getAllTopicsService, getTopicHistoryService, getTrendingTopicsService, mentionTopicService } from "../services/topics.service";
import redisClient from "../config/redis";


export const mentionTopic = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Topic name is required",
      });
    }

    const result = await mentionTopicService(name);
    await redisClient.zIncrBy("trending_topics",1,name.toLowerCase().trim());
    await redisClient.set(`topic:lastSeen:${name.toLowerCase().trim()}`, new Date().toISOString(),
      {EX:600}
    );
    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTopics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const topics = await getAllTopicsService();

    return res.status(200).json({
      success: true,
      data: topics,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopicHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== "string") {
        return res.status(400).json({
            success: false,
            message: "Topic name is required",
        });
    }
    const history = await getTopicHistoryService(name);

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrendingTopics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const trending = await getTrendingTopicsService();

    return res.status(200).json({
      success: true,
      data: trending,
    });
  } catch (error) {
    next(error);
  }
};

export const redisTest = async(req: Request,
  res: Response,
  next: NextFunction)=>{
    try {
      await redisClient.set("test-key","Hello Redis!");
      const value = await redisClient.get("test-key");
      return res.status(200).json({
        success: true,
        data: value,
      });
    } catch (error) {
      next(error);
    }
  }

