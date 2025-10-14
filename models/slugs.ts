export interface Slugs {
  id?: number;
  slug: string;
  created_at: string;
  article_id: number | bigint;
  validated: string;
}

export interface Params {
  slug: string;
}
