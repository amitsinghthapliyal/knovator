export interface JobDTO {
  externalId: string;
  source: string;
  title: string;

  company?: string;
  location?: string;
  type?: string;
  category?: string;

  description?: string;
  url: string;

  publishedAt?: Date;
}
