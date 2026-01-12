import { normalizeJobicy } from "./normalizers/jobicy.normalizer";
import { normalizeHigherEd } from "./normalizers/highered.normalizer";
import { JobDTO } from "../types/JobDTO";

export function normalizeJobs(
  source: "jobicy" | "higheredjobs",
  items: any[]
): JobDTO[] {
  switch (source) {
    case "jobicy":
      return items.map(normalizeJobicy);
    case "higheredjobs":
      return items.map(normalizeHigherEd);
    default:
      throw new Error("Unknown source");
  }
}
