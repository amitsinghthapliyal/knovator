import axios from "axios";
import { parseXML } from "./xmlParser.service";
import { normalizeJobs } from "./normalizeJobs.service";

export async function fetchJobs(url: string) {
  const response = await axios.get(url);
  const parsed = parseXML(response.data);

  let source: "jobicy" | "higheredjobs";
  let items: any[] = [];

  if (url.includes("jobicy.com")) {
    source = "jobicy";

    items = parsed?.rss?.channel?.item || parsed?.channel?.item || [];
  } else {
    source = "higheredjobs";

    items = parsed?.rss?.channel?.item || parsed?.channel?.item || [];
  }

  // normalize single item to array
  if (!Array.isArray(items)) {
    items = [items];
  }

  return normalizeJobs(source, items);
}
