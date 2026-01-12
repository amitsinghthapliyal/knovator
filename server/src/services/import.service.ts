import { jobQueue } from "../jobs/job.queue";
import { JobSchema } from "../validators/job.validator";

export async function enqueueJobs(jobs: any[], importLogId: string) {
  const validJobs = [];
  const failedJobs = [];

  for (const job of jobs) {
    const parsed = JobSchema.safeParse(job);

    if (!parsed.success) {
      console.error("❌ Validation failed for job:", {
        externalId: job.externalId,
        errors: parsed.error.flatten().fieldErrors,
        rawJob: job,
      });

      failedJobs.push({
        jobId: job.externalId,
        reason: JSON.stringify(parsed.error.flatten().fieldErrors),
      });

      // 🔥 STOP after first failure so we see the real reason
      break;
    }

    validJobs.push(parsed.data);
  }

  console.log(`📤 Enqueue called. Valid jobs: ${validJobs.length}`);

  if (validJobs.length === 0) {
    console.warn("⚠️ No valid jobs to enqueue");
    return;
  }

  await jobQueue.addBulk(
    validJobs.map((job) => ({
      name: "import-job",
      data: {
        ...job,
        importLogId,
      },
    }))
  );

  console.log("✅ Jobs added to queue");
}
