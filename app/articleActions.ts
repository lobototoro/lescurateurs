'use server';
import { z } from 'zod';
import slugify from 'slugify';
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';

import { articleSchema } from '@/models/articleSchema';

import {
  createArticle,
  createSlug,
  deleteArticle,
  updateArticle,
  updateSlug,
  getArticleById,
  deleteSlug,
  validateArticle,
  shipArticle,
} from '@/lib/articles';

interface ValidateTypes {
  articleId: number | bigint;
  validation: string;
  updatedAt: string;
}

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
export async function createArticleAction(prevState: any, data: any) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const author = session?.user.nickname;
  const author_email = session?.user.email;

  // const title = formData.get('title') as string;
  // const introduction = formData.get('introduction') as string;
  // const main = formData.get('main') as string;
  // const urls = formData.get('urls') as string;
  // const mainAudioUrl = formData.get('mainAudioUrl') as string;
  // const urlToMainIllustration = formData.get('urlToMainIllustration') as string;
  const title = data.title as string;
  const introduction = data.introduction as string;
  const main = data.main as string;
  const urls = data.urls as string;
  const mainAudioUrl = data.mainAudioUrl as string;
  const urlToMainIllustration = data.urlToMainIllustration as string;
  const createdAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();
  const publishedAt = '';
  const validated = 'false';
  const shipped = 'false';
  const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g });

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
      validated,
    });

    return {
      message: true,
      text: 'Article was successfully created',
    };
  } catch (error) {
    console.log(error);
    await deleteArticle(articleError as number | bigint);

    return {
      message: false,
      text: 'Error creating article',
    };
  }
}

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
    redirect('/editor');
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
  const validated = 'false'; // NEX-72
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

    await updateSlug({
      id, // assuming slug ID is the same as article ID
      slug,
      createdAt,
      articleId: id,
      validated,
    });

    return {
      message: true,
      text: 'Article was successfully updated',
    };
  } catch (error) {
    console.log(error);

    return {
      message: false,
      text: 'Error updating article',
    };
  }
}

export async function fetchArticleById(id: number | bigint) {
  try {
    const article = await getArticleById(id);

    return {
      message: true,
      article,
    };
  } catch (error) {
    console.log(error);

    return {
      message: false,
      text: "Pas d'article correspondant à cet ID",
    };
  }
}

/**
 * Deletes an article based on the provided form data and updates the application state.
 *
 * @param prevState - The previous state of the application.
 * @param formData - A `FormData` object containing the data required to delete the article.
 *                   Must include an `id` field representing the article's ID.
 * @returns A promise that resolves to an object containing:
 *          - `message`: A boolean indicating the success or failure of the operation.
 *          - `text`: A string message describing the result of the operation.
 *
 * @throws Logs any errors encountered during the deletion process to the console.
 *
 * The function performs the following steps:
 * 1. Verifies if the user is logged in using the `auth0.getSession()` method.
 *    If the user is not logged in, it returns an error message.
 * 2. Extracts the article ID from the `formData` object and attempts to delete
 *    the associated slug and article using `deleteSlug` and `deleteArticle` functions.
 * 3. If both deletions are successful, it checks the total number of changes made.
 *    - If more than one change is detected, it returns a success message.
 *    - Otherwise, it returns an error message indicating a failure in the deletion process.
 * 4. Catches any errors during the process and returns a generic error message.
 */
export async function deleteArticleAction(prevState: any, formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const id = parseInt(formData.get('id') as string, 10);
  try {
    const slugResult = await deleteSlug(id);
    const articleResult = await deleteArticle(id);

    const result = await Promise.all([slugResult, articleResult]);

    const totalchanges = result[0]?.changes + result[1]?.changes;
    if (totalchanges > 1) {
      return {
        message: true,
        text: "L'article a été supprimé avec succès",
      };
    } else {
      return {
        message: false,
        text: "une erreur s'est produite lors de la suppression de l'article",
      };
    }
  } catch (error) {
    // Log the error to the console for debugging purposes
    console.log(error);

    return {
      message: false,
      text: "une erreur s'est produite : contactez l'administrateur",
    };
  }
}

export async function validateArticleAction(
  prevState: any,
  formData: FormData
) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const validationArgs: ValidateTypes = {
    articleId: parseInt(formData.get('id') as string, 10),
    validation: formData.get('validation') as string,
    updatedAt: new Date().toISOString() as string, // NEX-59
  };

  try {
    const validation = await validateArticle({
      articleId: validationArgs.articleId,
      validatedValue: validationArgs.validation,
      updatedAt: validationArgs.updatedAt,
    });
    if (!validation) {
      return {
        message: false,
        text: 'Article not found',
      };
    }

    return {
      message: true,
      text: `L'article a été ${validationArgs.validation === 'true' ? 'validé' : 'rejeté'} avec succès`,
    };
  } catch (error) {
    console.log(error);

    return {
      message: false,
      text: 'Error validating article',
    };
  }
}

export async function shipArticleAction(prevState: any, formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const id = parseInt(formData.get('id') as string, 10);
  const ship = (formData.get('shipped') as string) === 'true' ? true : false;
  const updatedAt = new Date().toISOString() as string;

  // get article to check for validity: 'true' or 'false'
  const article = (await getArticleById(id)) as z.infer<typeof articleSchema>;
  if (!article) {
    return {
      message: false,
      text: 'Article inconnu',
    };
  }
  if (article?.validated === 'false' && ship) {
    return {
      message: false,
      text: "L'article doit être validé avant d'être mis en MeP",
    };
  }
  const shippedValue = ship ? 'true' : 'false';
  const result = await shipArticle({
    articleId: id,
    shippedValue,
    updatedAt, // NEX-59
  });
  if (!result) {
    return {
      message: false,
      text: "Une erreur est survenue lors de la mise en MeP de l'article",
    };
  }

  return {
    message: true,
    text: ship
      ? "L'article a été mis en MeP avec succès"
      : "L'article a été mis offline avec succès",
  };
}
