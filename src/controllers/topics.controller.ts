import { NextFunction, Request, Response } from "express";
import { getAllTopicsService, getTopicHistoryService, getTrendingTopicsService, mentionTopicService } from "../services/topics.service";


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

