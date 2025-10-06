export interface Slugs {
  id?: number;
  slug: string;
  createdAt: string;
  articleId: number | bigint;
  validated: string;
}

export interface Params {
  slug: string;
}
