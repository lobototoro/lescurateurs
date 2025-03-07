"use server";
import slugify from 'slugify';

import { auth0 } from "@/lib/auth0"
import { createArticle, createSlug } from "@/lib/articles";

export async function createArticleAction(prevState: any, formData: FormData) {
  const session = await auth0.getSession();
  if (!session) {
    return {
      message: false,
      text: 'You must be logged in to create an article'
    }
  }
  console.log(session);
  const author = session.user.name;
  const author_email = session.user.email;
  const title = formData.get('title') as string;
  const introduction = formData.get('introduction') as string;
  const main = formData.get('main') as string;
  const urls = formData.get('urls') as string;
  const mainAudioUrl = formData.get('mainAudioUrl') as string;
  const urlToMainIllustration = formData.get('urlToMainIllustration') as string;
  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const publishedAt = null;
  const validated = 'false';
  const shipped = 'false';
  const slug = slugify(title, { lower: true });
  
  // console.log('create article action ', typeof urls);

  try {
    await createSlug({
      slug,
      createdAt
    });
    
    await createArticle({
      slug,
      title,
      introduction,
      main,
      urls,
      mainAudioUrl,
      urlToMainIllustration,
      author: author as string,
      author_email: author_email as string,
      createdAt,
      updatedAt,
      publishedAt,
      validated,
      shipped,
    });

    return {
      message: true,
      text: 'Article was successfully created'
    }
  } catch (error) {
    console.log(error);

    return {
      message: false,
      text: 'Error creating article'
    }
  }
};
