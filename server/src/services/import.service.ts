import { jobQueue } from "../jobs/job.queue";
import { JobSchema } from "../validators/job.validator";
import { JobDTO } from "../types/JobDTO";
import { ZodError } from "zod";

function formatZodErrors(error: ZodError) {
  const formatted = error.format();

  return Object.entries(formatted)
    .filter(([key]) => key !== "_errors")
    .reduce<Record<string, string[]>>((acc, [key, value]) => {
      if ("_errors" in value && value._errors.length) {
        acc[key] = value._errors;
      }
      return acc;
    }, {});
}

export async function enqueueJobs(jobs: JobDTO[], importLogId: string) {
  const validJobs: JobDTO[] = [];
  const failedJobs: { jobId?: string; reason: string }[] = [];

  for (const job of jobs) {
    const parsed = JobSchema.safeParse(job);

    if (!parsed.success) {
      const errors = formatZodErrors(parsed.error);

      console.error("Validation failed for job", {
        externalId: job.externalId,
        errors,
      });

      failedJobs.push({
        jobId: job.externalId,
        reason: JSON.stringify(errors),
      });

      continue;
    }

    validJobs.push(parsed.data);
  }

  console.log(
    `Enqueue summary - valid: ${validJobs.length}, failed: ${failedJobs.length}`
  );

  if (!validJobs.length) {
    console.warn("No valid jobs to enqueue");
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

  console.log("Jobs added to queue");
}
