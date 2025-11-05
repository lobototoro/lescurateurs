'use server';
import { z } from 'zod';
import slugify from 'slugify';
import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';

import { articleSchema } from '@/models/articleSchema';
import type { Json } from '@/lib/supabase/database.types';

// import {
//   // createArticle,
//   // createSlug,
//   // deleteArticle,
//   // updateArticle,
//   // getArticleById,
//   // deleteSlug,
//   // validateArticle,
//   // validateSlugField,
//   // shipArticle,
// } from '@/lib/articles';

import {
  createArticle,
  deleteArticle,
  updateArticle,
  getArticleById,
  deleteSlug,
  validateArticle,
  shipArticle,
} from '@/lib/supabase/articles';

interface ValidateTypes {
  article_id: number | bigint;
  validatedValue: boolean;
  updated_at: Date;
  updated_by: string;
}

/**
 * Creates a new article based on the provided data.
 *
 * This function handles the creation of a new article, including user authentication,
 * data extraction from the input, and article insertion into the database.
 * It also includes the creation of a relating slug in a separate table 'slugs'
 *
 * On sending data to backend, it returns an object with 2 statuses
 * {
 * articleStatus: status, // 201 http status in vcase of success
 * slugStatus: slugCreationResult, // 201 http status in case of success
 * }
 * @param prevState - The previous state of the application (not used in this function).
 * @param data - An object containing the article details.
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
  const urls = data.urls as Json;
  const main_audio_url = data.main_audio_url as string;
  const url_to_main_illustration = data.url_to_main_illustration as string;
  const created_at = new Date();
  const updated_at = null;
  const updated_by = null;
  const published_at = null;
  const validated = false;
  const shipped = false;
  const slug = slugify(title, { lower: true, remove: /[*+~.()'"!:@]/g });

  try {
    const articleResult = await createArticle({
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

    return {
      message: true,
      status: articleResult,
      text: 'Article and slug were successfully created',
    };
  } catch (error) {
    console.log(error);

    return {
      message: false,
      text: 'Error creating article or slug',
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
 *
 * @Rules
 * - updates article by id
 * - Title and slug can't be updated
 * - an online or validated article is set to false
 *  for validated, pubished_at = null, shipped
 */
export async function updateArticleAction(prevState: any, data: any) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const id = parseInt(data.id as string, 10);
  const slug = data.slug as string;
  const title = data.title as string;
  const introduction = data.introduction as string;
  const main = data.main as string;
  const urls = data.urls as Json;
  const main_audio_url = data.main_audio_url as string;
  const url_to_main_illustration = data.url_to_main_illustration as string;
  const created_at = new Date(data.created_at as string);
  const published_at = new Date(data.published_at as string) ?? null;
  const validated = false; // NEX-72
  const shipped = false;

  const author = data.author;
  const author_email = data.author_email;

  const updated_at = new Date();
  const updated_by = session.user.nickname || session.user.email || 'Anonyme';

  try {
    const updateResult = await updateArticle({
      id, // not updated
      slug, // not updated
      title, // not updated
      introduction,
      main,
      urls,
      main_audio_url,
      url_to_main_illustration,
      author, // not updated
      author_email, // not updated
      created_at, // not updated
      updated_at,
      updated_by,
      published_at,
      validated,
      shipped,
    });

    return {
      message: true,
      status: updateResult,
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
    settledResults.forEach((result: PromiseSettledResult<any>) => {
      if (result.status === 'fulfilled') {
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

/**
 *
 * @param prevState - Previous state
 * @param formData - FormData from the validation form
 * @returns {message: boolean; text: string}
 *
 * this function only call article validation backend func
 * never the slug validation func, that is updated as well
 */
export async function validateArticleAction(
  prevState: any,
  formData: FormData
): Promise<{ message: boolean; text: string }> {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const validatedValue = formData.get('validation') === 'true' ? true : false;

  const validationArgs: ValidateTypes = {
    article_id: parseInt(formData.get('id') as string, 10),
    validatedValue,
    updated_at: new Date(), // NEX-59
    updated_by: session.user.nickname || session.user.email || 'Anonyme',
  };

  try {
    const validation = await validateArticle(validationArgs);
    console.log('vali response ', validation);
    if (
      validation.articleValidationStatus !== 204 &&
      validation.slugValidationStatus !== 204
    ) {
      return {
        message: false,
        text: 'Article not found',
      };
    }

    return {
      message: true,
      text: `L'article a été ${validationArgs.validatedValue ? 'validé' : 'rejeté'} avec succès`,
    };
  } catch (error) {
    console.log(error);

    return {
      message: false,
      text: 'Error validating article',
    };
  }
}

/**
 * Ships or unships an article based on the provided form data.
 *
 * This function handles the shipping status of an article, including user authentication,
 * data extraction from the form, and updating the shipping status in the database.
 *
 * @param prevState - The previous state of the application (not used in this function).
 * @param formData - FormData object containing the article ID and shipping status.
 * @returns An object with a message indicating success or failure, and a descriptive text.
 *          {message: boolean, text: string}
 *          message is true if the article was shipped/unshipped successfully, false otherwise.
 *          text provides a description of the operation result.
 * @throws Will log any errors that occur during the shipping process.
 *
 * @Rules
 * - An article must be validated before it can be shipped.
 */
export async function shipArticleAction(prevState: any, formData: FormData) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  const id = parseInt(formData.get('id') as string, 10);
  const ship = formData.get('shipped') === 'true' ? true : false;
  const updated_at = new Date();
  const updated_by = session.user.nickname || session.user.email || 'Anonyme';

  // get article to check for validity: 'true' or 'false'
  const article = await getArticleById(id);

  if (!article) {
    return {
      message: false,
      text: 'Article inconnu',
    };
  }
  if (!article.validated && ship) {
    return {
      message: false,
      text: "L'article doit être validé avant d'être mis en MeP",
    };
  }

  const result = await shipArticle({
    article_id: id,
    shippedValue: ship,
    updated_at, // NEX-59
    updated_by,
  });
  if (result !== 204) {
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
