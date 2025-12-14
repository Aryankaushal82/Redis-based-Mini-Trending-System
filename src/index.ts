import express from 'express';
import { connectRedis } from './config/redis';

import { envConfig } from './config';
import topicsRouter from './routes/v1/topics.router';
const app = express();
const PORT = envConfig.port;

// routers
app.use(express.json());
app.use("/api/v1/topics", topicsRouter);

// redis server
const startServer = async () => {
  try {
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

startServer();