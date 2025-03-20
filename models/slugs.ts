export interface Slugs {
  id?: number;
  slug: string;
  createdAt: string;
  articleId: number | bigint;
}

export interface Params {
  slug: string;
}