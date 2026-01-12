import { Worker } from "bullmq";
import { redisConnection } from "../config/redis";
import { Job } from "../models/Job.model";
import { ImportLog } from "../models/ImportLog.model";

console.log("👷 Worker booting up...");

new Worker(
  "job-import",
  async (job) => {
    console.log("👷 Processing job:", job.id);

    const { importLogId, ...jobData } = job.data;

    try {
      const existing = await Job.findOne({
        externalId: jobData.externalId,
        source: jobData.source,
      });

      if (existing) {
        await Job.updateOne({ _id: existing._id }, jobData);
        await ImportLog.updateOne(
          { _id: importLogId },
          { $inc: { updatedJobs: 1, totalImported: 1 } }
        );
        return;
      }

      await Job.create(jobData);
      await ImportLog.updateOne(
        { _id: importLogId },
        { $inc: { newJobs: 1, totalImported: 1 } }
      );
    } catch (err: any) {
      await ImportLog.updateOne(
        { _id: importLogId },
        {
          $push: {
            failedJobs: {
              jobId: jobData.externalId,
              reason: err.message,
            },
          },
        }
      );
      throw err;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  }
);
