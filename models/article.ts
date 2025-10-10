export enum UrlsTypes {
  WEBSITE = 'website',
  VIDEOS = 'videos',
  AUDIO = 'audio',
  SOCIAL = 'social',
  IMAGE = 'image',
}

export interface Article {
  id?: number | bigint;
  slug: string;
  title: string;
  introduction: string | null;
  main: string;
  mainAudioUrl: string | null;
  urlToMainIllustration: string;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  author: string;
  author_email: string;
  urls: string;
  validated: string;
  shipped: string;
}
