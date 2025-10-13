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
  main_audio_url: string | null;
  url_to_main_illustration: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
  author: string;
  author_email: string;
  urls: string;
  validated: string;
  shipped: string;
}
