import express from 'express';

import { envConfig } from './config';
import topicsRouter from './routes/v1/topics.router';
const app = express();
const PORT = envConfig.port;

app.use(express.json());
app.use("/api/v1/topics", topicsRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})