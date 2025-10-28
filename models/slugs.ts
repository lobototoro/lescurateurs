export interface Slugs {
  id?: number | bigint;
  slug: string;
  created_at: Date;
  article_id: number | bigint;
  validated: boolean;
}

export interface Params {
  slug: string;
}
