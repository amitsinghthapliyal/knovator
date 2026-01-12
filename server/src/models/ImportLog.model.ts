import { Schema, model, Types } from "mongoose";

const ImportLogSchema = new Schema({
  fileName: String,
  timestamp: { type: Date, default: Date.now },

  totalFetched: Number,
  totalImported: Number,

  newJobs: { type: Number, default: 0 },
  updatedJobs: { type: Number, default: 0 },

  failedJobs: [
    {
      jobId: String,
      reason: String,
    },
  ],
});

export const ImportLog = model("ImportLog", ImportLogSchema);
