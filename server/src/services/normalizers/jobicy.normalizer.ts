import { JobDTO } from "../../types/JobDTO";

function extractGuid(guid: any): string {
  if (!guid) return "";
  if (typeof guid === "string") return guid;
  if (typeof guid === "object" && guid["#text"]) return guid["#text"];
  return "";
}

export function normalizeJobicy(item: any): JobDTO {
  return {
    externalId: extractGuid(item.guid) || item.link,

    source: "jobicy",
    title: item.title ?? "Untitled",

    company: item["job:company"] ?? "Unknown",
    location: item["job:location"] ?? "Remote",
    type: item["job:type"] ?? "N/A",
    category: item["job:category"] ?? "General",

    description: item.description ?? "",
    url: item.link,

    publishedAt: item.pubDate ? new Date(item.pubDate) : undefined,
  };
}
