import cron from "node-cron";
import { fetchJobs } from "../services/fetchJobs.service";
import { enqueueJobs } from "../services/import.service";
import { createImportLog } from "../services/importRun.service";
import { FEEDS } from "../config/feeds";

cron.schedule("0 * * * *", async () => {
  console.log("⏳ Running job import cron");

  for (const feed of FEEDS) {
    console.log("➡️ Processing feed:", feed);

    try {
      const jobs = await fetchJobs(feed);

      console.log(`📦 Fetched ${jobs.length} jobs from ${feed}`);

      if (jobs.length === 0) {
        console.warn(`⚠️ No jobs found for feed: ${feed}`);
        continue;
      }

      const importLog = await createImportLog(feed, jobs.length);

      await enqueueJobs(jobs, importLog._id.toString());
    } catch (error: any) {
      console.error(`❌ Failed to process feed ${feed}`, error.message);
    }
  }
});
