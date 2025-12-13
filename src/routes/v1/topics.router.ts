import express from 'express';
import { getAllTopics, getTopicHistory, getTrendingTopics, mentionTopic } from '../../controllers/topics.controller';
const topicsRouter = express.Router();


topicsRouter.post("/mention",mentionTopic);
topicsRouter.get("/",getAllTopics);
topicsRouter.get("/history",getTopicHistory);
topicsRouter.get("/trending", getTrendingTopics);



export default topicsRouter