import { createClient as createClientFront } from './client';
import { createClient } from './back-office.client';
import { Article } from '@/models/article';
import { Slugs } from '@/models/slugs';
import { _undefined } from 'zod/v4/core';

const supabaseFront = createClientFront();
const supabase = createClient();

const articlesDB =
  process.env.NEXT_PUBLIC_ARTICLES_TABLE || 'articles-development';
const slugsDB = process.env.NEXT_PUBLIC_SLUGS_TABLE || 'slugs-development';

type ArticleInput = Omit<
  Article,
  'id' | 'created_at' | 'updated_at' | 'published_at'
> & {
  id?: number | bigint;
  created_at?: Date;
  updated_at?: Date | null;
  published_at?: Date | null;
};

type SlugInput = Omit<Slugs, 'created_at'> & {
  created_at?: Date;
};

// fetch in tables actions
export const getArticle = async (slug: string): Promise<Article> => {
  const { data, error } = await supabase
    .from(articlesDB)
    .select()
    .eq('slug', slug);

  if (error) {
    throw new Error('articles: could not fetch article');
  }

  return data[0];
};

export const getSlugs = async (): Promise<Slugs[]> => {
  const { data, error } = await supabaseFront.from(slugsDB).select();

  if (error) {
    throw new Error('articles: could not fetch slugs');
  }

  return data;
};

export const getArticleById = async (id: number | bigint): Promise<Article> => {
  const { data, error } = await supabaseFront
    .from(articlesDB)
    .select()
    .eq('id', id);

  if (error) {
    throw new Error('Articles: could not find this article');
  }

  if (!data || data.length === 0) {
    throw new Error('Articles: article not found');
  }

  return data[0] as Article;
};

// create items in tables actions
export const createSlug = async (slugObject: SlugInput) => {
  const { slug, created_at, article_id, validated } = slugObject;
  const { error, status } = await supabase.from(slugsDB).insert({
    slug,
    created_at,
    article_id,
    validated,
  });

  if (error) {
    throw new Error(`Slugs: could not create slug - ${error.message}`);
  }

  return status;
};

export const createArticle = async (article: ArticleInput) => {
  try {
    const {
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
    } = article;
    const { data, error, status } = await supabase
      .from(articlesDB)
      .insert({
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
      })
      .select();

    const lastInsertedId = data && data.length > 0 ? data[0].id : null;
    if (!lastInsertedId || error) {
      throw new Error(
        `Article: could not create article ${error ? error.toString() : ''}`
      );
    } else {
      let slugCreationResult;
      if (status === 201) {
        slugCreationResult = await createSlug({
          slug,
          created_at,
          article_id: lastInsertedId,
          validated,
        });
      }

      return {
        articleStatus: status,
        slugStatus: slugCreationResult,
      };
    }
  } catch (err) {
    console.error(
      'Articles: could not complete article creation process ',
      err
    );
    throw err;
  }
};

// update items in tables actions
// updates only affect articles table, never slugs table
// once created, slugs table can only be updated via manageArticles menu
// setting the `validated` prop only
export const updateArticle = async (article: ArticleInput) => {
  const {
    id,
    introduction,
    main,
    urls,
    main_audio_url,
    url_to_main_illustration,
    updated_at,
    updated_by,
  } = article;

  const { error, status } = await supabase
    .from(articlesDB)
    .update({
      introduction,
      main,
      urls,
      main_audio_url,
      url_to_main_illustration,
      updated_at,
      updated_by,
    })
    .eq('id', id);

  if (error) {
    throw new Error('Articles: could not update article');
  }

  return status;
};

// search in tables actions
export const searchSlugs = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from(slugsDB)
    .select()
    .textSearch('slug', searchTerm);

  if (error) {
    throw new Error(
      `Search: could not find results corresponding to ${searchTerm}`
    );
  }

  return data;
};

export const searchArticles = async (searchTerm: string) => {
  const { data, error } = await supabase
    .from(articlesDB)
    .select()
    .or(
      `title.textSearch.${searchTerm},introduction.textSearch.${searchTerm},main.textSearch.${searchTerm}`
    );

  if (error) {
    throw new Error(
      `Articles: could not find results corresponding to ${searchTerm}`
    );
  }

  return data;
};

// delete items in tables actions
export const deleteSlug = async (slugId: number | bigint) => {
  const { error, status } = await supabase
    .from(slugsDB)
    .delete()
    .eq('article_id', slugId);

  if (error) {
    throw new Error('Deleting: could not delete slug');
  }

  return status;
};

export const deleteArticle = async (article_id: number | bigint) => {
  const { error, status } = await supabase
    .from(articlesDB)
    .delete()
    .eq('id', article_id);

  if (error) {
    throw new Error('Deleting: could not delete article');
  }

  return status;
};

// validating items in tables actions
// validateSlugField is never called outside of this file
// it's an internal call only
export const validateSlugField = async (validateProps: {
  article_id: number | bigint;
  validatedValue: boolean;
}) => {
  const { error, status } = await supabase
    .from(slugsDB)
    .update({
      validated: validateProps.validatedValue,
    })
    .eq('article_id', validateProps.article_id);

  if (error) {
    throw new Error('Valdiation: could not validate this slug');
  }

  return status;
};

export const validateArticle = async (validateProps: {
  article_id: number | bigint;
  validatedValue: boolean;
  updated_at: Date;
  updated_by: string;
}) => {
  const { error, status } = await supabase
    .from(articlesDB)
    .update({
      validated: validateProps.validatedValue,
      updated_at: validateProps.updated_at,
      updated_by: validateProps.updated_by,
    })
    .eq('id', validateProps.article_id);

  if (error) {
    throw new Error('Validation: could not validate this article');
  }

  let slugValidationResult;
  if (status === 204) {
    slugValidationResult = await validateSlugField({
      article_id: validateProps.article_id,
      validatedValue: validateProps.validatedValue,
    });
  }

  return {
    articleValidationStatus: status,
    slugValidationStatus: slugValidationResult,
  };
};

// shipping actions
export const shipArticle = async (shipProps: {
  article_id: number | bigint;
  shippedValue: boolean;
  updated_at: Date;
  updated_by: string;
}) => {
  const { error, status } = await supabase
    .from(articlesDB)
    .update({
      shipped: shipProps.shippedValue,
      updated_at: shipProps.updated_at,
      updated_by: shipProps.updated_by,
    })
    .eq('id', shipProps.article_id);

  if (error) {
    throw new Error('Shipping: could not ship this article');
  }

  return status;
};
