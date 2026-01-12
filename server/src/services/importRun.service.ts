import { ImportLog } from "../models/ImportLog.model";

export async function createImportLog(feed: string, totalFetched: number) {
  return ImportLog.create({
    fileName: feed,
    totalFetched,
    totalImported: 0,
    newJobs: 0,
    updatedJobs: 0,
    failedJobs: [],
  });
}
