export enum UrlsTypes {
  WEBSITE = "website",
  VIDEOS = "videos",
  AUDIO = "audio",
  SOCIAL = "social",
  IMAGE = "image",
}

export interface Article {
  title: string;
  introduction: string | null;
  main: string;
  mainAudioUrl: string | null;
  urlToMainIllustration: string;
  publishedAt: string | null;
  createAt: string;
  updateAt: string;
  author: string;
  author_email: string;
  urls: {
    type: UrlsTypes;
    url: string;
  }[];
}