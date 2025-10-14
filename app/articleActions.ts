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
  validateSlugField,
  shipArticle,
} from '@/lib/articles';

interface ValidateTypes {
  article_id: number | bigint;
  validation: string;
  updated_at: string;
  updated_by: string;
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

  const author = session?.user.nickname || 'Anonyme';
  const author_email = session?.user.email || 'Email inconnu';

  const title = data.title as string;
  const introduction = data.introduction as string;
  const main = data.main as string;
  const urls = data.urls as string;
  const main_audio_url = data.main_audio_url as string;
  const url_to_main_illustration = data.url_to_main_illustration as string;
  const created_at = new Date().toISOString();
  const updated_at = new Date().toISOString();
  const updated_by = author;
  const published_at = '';
  const validated = 'false';
  const shipped = 'false';
  const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g });

  let createdArticleId;
  let createdSlugId;
  try {
    const articleresult = await createArticle({
      slug,
      title,
      introduction,
      main,
      urls,
      main_audio_url,
      url_to_main_illustration,
      author: author,
      author_email: author_email,
      created_at,
      updated_at,
      updated_by,
      published_at,
      validated,
      shipped,
    });

    createdArticleId = articleresult?.lastInsertRowid;

    /*
      Create the slug entry in the slugs table
      It should always be the same as the article id
      because we use it to link both tables
      In case there's a gap in id entries,
      we can rely on the article_id field
      to link both tables
    */
    const slugresult = await createSlug({
      slug,
      created_at,
      article_id: articleresult?.lastInsertRowid as number,
      validated,
    });

    createdSlugId = slugresult?.lastInsertRowid;

    return {
      message: true,
      text: 'Article was successfully created',
    };
  } catch (error) {
    console.log(error);
    if (createdArticleId) {
      await deleteArticle(createdArticleId as number | bigint);
    }
    if (createdSlugId) {
      await deleteSlug(createdArticleId as number | bigint);
    }

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
  const main_audio_url = formData.get('main_audio_url') as string;
  const url_to_main_illustration = formData.get(
    'url_to_main_illustration'
  ) as string;
  const created_at = formData.get('created_at') as string;
  const published_at = formData.get('published_at') as string;
  const validated = 'false'; // NEX-72
  const shipped = formData.get('shipped') as string;

  const updated_at = new Date().toISOString() as string;
  const updated_by = session.user.nickname || session.user.email || 'Anonyme';

  try {
    await updateArticle({
      id,
      slug,
      title,
      introduction,
      main,
      urls,
      main_audio_url,
      url_to_main_illustration,
      author,
      author_email,
      created_at,
      updated_at,
      updated_by,
      published_at,
      validated,
      shipped,
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
    const settledResults = await Promise.allSettled([
      deleteSlug(id),
      deleteArticle(id),
    ]);
    let successCount = 0;
    settledResults.forEach((promise: any) => {
      if (promise.status === 'fulfilled') {
        successCount += 1;
      }
    });
    if (successCount === 2) {
      return {
        message: true,
        text: "L'article a été supprimé avec succès",
      };
    }

    return {
      message: false,
      text: "Une erreur s'est produite lors de la suppression de l'article ou du slug",
    };
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
    article_id: parseInt(formData.get('id') as string, 10),
    validation: formData.get('validation') as string,
    updated_at: new Date().toISOString() as string, // NEX-59
    updated_by: session.user.nickname || session.user.email || 'Anonyme',
  };

  try {
    const validation = await validateArticle({
      article_id: validationArgs.article_id,
      validatedValue: validationArgs.validation,
      updated_at: validationArgs.updated_at,
      updated_by: validationArgs.updated_by,
    });
    const slugValidation = await validateSlugField({
      article_id: validationArgs.article_id, // NEX-81
      validatedValue: validationArgs.validation,
    });
    if (!validation || !slugValidation) {
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
  const updated_at = new Date().toISOString() as string;
  const updated_by = session.user.nickname || session.user.email || 'Anonyme';

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
    article_id: id,
    shippedValue,
    updated_at, // NEX-59
    updated_by,
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
