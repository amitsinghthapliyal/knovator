import { JobDTO } from "../../types/JobDTO";

export function normalizeHigherEd(item: any): JobDTO {
  return {
    externalId: item.guid || item.link,
    source: "higheredjobs",
    title: item.title,
    company: item["dc:creator"] || "HigherEd",
    location: item.location || "N/A",
    type: "Academic",
    category: "Education",
    description: item.description,
    url: item.link,
    publishedAt: new Date(item.pubDate),
  };
}
