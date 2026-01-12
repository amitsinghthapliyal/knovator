import { Schema, model } from "mongoose";

const JobSchema = new Schema(
  {
    externalId: { type: String, required: true },
    source: { type: String, required: true },
    title: String,
    company: String,
    location: String,
    type: String,
    category: String,
    description: String,
    url: String,
    publishedAt: Date,
  },
  { timestamps: true }
);

JobSchema.index({ externalId: 1, source: 1 }, { unique: true });

export const Job = model("Job", JobSchema);
