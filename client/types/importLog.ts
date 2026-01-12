export interface ImportLog {
  _id: string;
  fileName: string;
  timestamp: string;
  totalFetched: number;
  totalImported: number;
  newJobs: number;
  updatedJobs: number;
  failedJobs: {
    jobId: string;
    reason: string;
  }[];
}
