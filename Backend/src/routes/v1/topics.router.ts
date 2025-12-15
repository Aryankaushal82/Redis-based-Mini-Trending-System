import express from 'express';
import { getAllTopics, getTopicHistory, getTrendingTopics, mentionTopic, redisTest } from '../../controllers/topics.controller';
const topicsRouter = express.Router();


topicsRouter.post("/mention",mentionTopic);
topicsRouter.get("/",getAllTopics);
topicsRouter.get("/history",getTopicHistory);
topicsRouter.get("/trending", getTrendingTopics);
topicsRouter.get("/redis-test",redisTest)



export default topicsRouter