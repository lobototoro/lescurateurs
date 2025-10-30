import { createClient } from './index';
import { Article } from '@/models/article';
import { Slugs } from '@/models/slugs';

const supabase = await createClient();

// fetch in tables actions
export const getArticle = async (slug: string) => {
  const { data, error } = await supabase
    .from('articles-development')
    .select()
    .eq('slug', slug);

  if (error) {
    throw new Error('articles: could not fetch article');
  }

  return data;
};

export const getSlugs = async () => {
  const { data, error } = await supabase.from('slugs-development').select();

  if (error) {
    throw new Error('articles: could not fetch slugs');
  }

  return data;
};

export const getArticleById = async (id: number | bigint) => {
  const { data, error } = await supabase
    .from('articles-development')
    .select()
    .eq('id', id);

  if (error) {
    throw new Error('Articles: could not find this article');
  }

  return data;
};

// create items in tables actions
export const createSlug = async (slugObject: Slugs) => {
  const { slug, created_at, article_id, validated } = slugObject;
  const { error, status } = await supabase.from('slugs-development').insert({
    slug,
    created_at,
    article_id,
    validated,
  });

  if (error) {
    throw new Error('Slug: coud not create slug');
  }

  return status;
};

export const createArticle = async (article: Article) => {
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
    .from('articles-development')
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

  if (error) {
    throw new Error('Articles: could not create article');
  }
  const lastInsertedId = data[0].id;
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
};

// update items in tables actions
// updates only affect articles table, never slugs table
// once created, slugs table can only be updated via manageArticles menu
// setting the `validated` prop only
export const updateArticle = async (article: Article) => {
  const {
    id,
    introduction,
    main,
    urls,
    main_audio_url,
    url_to_main_illustration,
    updated_at,
    updated_by,
    published_at,
    validated,
    shipped,
  } = article;
  const { error, status } = await supabase
    .from('articles-development')
    .update({
      introduction,
      main,
      urls,
      main_audio_url,
      url_to_main_illustration,
      updated_at,
      updated_by,
      published_at,
      validated,
      shipped,
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
    .from('slugs-development')
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
    .from('articles-development')
    .select()
    .textSearch('title', searchTerm)
    .textSearch('introduction', searchTerm)
    .textSearch('main', searchTerm);

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
    .from('slugs-development')
    .delete()
    .eq('article_id', slugId);

  if (error) {
    throw new Error('Deleting: could not delete slug');
  }

  return status;
};

export const deleteArticle = async (article_id: number | bigint) => {
  const { error, status } = await supabase
    .from('articles-development')
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
    .from('slugs-development')
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
    .from('articles-development')
    .update({
      validated: validateProps.validatedValue,
      updated_at: validateProps.updated_at,
      updated_by: validateProps.updated_by,
    })
    .eq('id', validateProps.article_id);

  if (error) {
    throw new Error('Valdiation: couuld not validate this article');
  }

  let slugValidationResult;
  if (status === 201) {
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
    .from('articles-development')
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
