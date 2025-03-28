"use server";

import slugify from 'slugify';

import { auth0 } from "@/lib/auth0"

import {
  createArticle,
  createSlug,
  deleteArticle,
  updateArticle,
  getArticleById
} from "@/lib/articles";


/**
 * Creates a new article based on the provided form data.
 * 
 * This function handles the creation of a new article, including user authentication,
 * data extraction from the form, article creation, and slug generation.
 * 
 * @param prevState - The previous state of the application (not used in this function).
 * @param formData - FormData object containing the article details.
 * @returns An object with a message indicating success or failure, and a descriptive text.
 *          {message: boolean, text: string}
 *          message is true if the article was created successfully, false otherwise.
 *          text provides a description of the operation result.
 * @throws Will log any errors that occur during the article creation process.
 */
export async function createArticleAction(prevState: any, formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return {
      message: false,
      text: 'You must be logged in to create an article'
    }
  }

  const author = session?.user.nickname;
  const author_email = session?.user.email;
  const title = formData.get('title') as string;
  const introduction = formData.get('introduction') as string;
  const main = formData.get('main') as string;
  const urls = formData.get('urls') as string;
  const mainAudioUrl = formData.get('mainAudioUrl') as string;
  const urlToMainIllustration = formData.get('urlToMainIllustration') as string;
  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const publishedAt = '';
  const validated = 'false';
  const shipped = 'false';
  const slug = slugify(title, { lower: true });

  let articleError;
  try {
    const articleresult = await createArticle({
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

    articleError = articleresult?.lastInsertRowid;

    await createSlug({
      slug,
      createdAt,
      articleId: articleresult?.lastInsertRowid as number,
    });

    return {
      message: true,
      text: 'Article was successfully created'
    }
  } catch (error) {
    console.log(error);
    await deleteArticle(articleError as number | bigint);

    return {
      message: false,
      text: 'Error creating article'
    }
  }
};

/**
 * Updates an existing article based on the provided form data.
 * 
 * This function handles the update of an existing article, including user authentication,
 * data extraction from the form, and article update in the database.
 * 
 * @param prevState - The previous state of the application (not used in this function).
 * @param formData - FormData object containing the updated article details.
 * @returns An object with a message indicating success or failure, and a descriptive text.
 *          {message: boolean, text: string}
 *          message is true if the article was updated successfully, false otherwise.
 *          text provides a description of the operation result.
 * @throws Will log any errors that occur during the article update process.
 */
export async function updateArticleAction(prevState: any, formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) {
    return {
      message: false,
      text: 'You must be logged in to update an article'
    }
  }

  const id = parseInt(formData.get('id') as string, 10);
  const author = formData.get('author') as string;
  const author_email = formData.get('author_email') as string;
  const slug = formData.get('slug') as string;
  const title = formData.get('title') as string;
  const introduction = formData.get('introduction') as string;
  const main = formData.get('main') as string;
  const urls = formData.get('urls') as string;
  const mainAudioUrl = formData.get('mainAudioUrl') as string;
  const urlToMainIllustration = formData.get('urlToMainIllustration') as string;
  const createdAt = formData.get('createdAt') as string;
  const publishedAt = formData.get('publishedAt') as string;
  const validated = formData.get('validated') as string;
  const shipped = formData.get('shipped') as string;

  const updatedAt = new Date().toISOString() as string;

  try {
    await updateArticle({
      id,
      slug,
      title,
      introduction,
      main,
      urls,
      mainAudioUrl,
      urlToMainIllustration,
      author,
      author_email,
      createdAt,
      updatedAt,
      publishedAt,
      validated,
      shipped,
    });

    return {
      message: true,
      text: 'Article was successfully updated'
    }
  } catch (error) {
    console.log(error);

    return {
      message: false,
      text: 'Error updating article'
    }
  }
};

export async function fetchArticleById(id: number | bigint) {
  try {
    const article = await getArticleById(id);
    
    return {
      message: true,
      article,
    }
  } catch (error) {
    console.log(error);

    return {
      message: false,
      text: "Pas d'article correspondant à cet ID"
    }
  }
};

