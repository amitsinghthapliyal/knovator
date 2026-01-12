import { Queue } from "bullmq";
import { redisConnection } from "../config/redis";

export const jobQueue = new Queue("job-import", {
  connection: redisConnection,
});

jobQueue.on("waiting", (jobId) => {
  console.log("Job waiting:", jobId);
});
