import { createClient as createClientFront } from './client';
import { createClient } from './back-office.client';
import { Article } from '@/models/article';
import { Slugs } from '@/models/slugs';

const supabaseFront = createClientFront();
const supabase = createClient();

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
  const { data, error } = await supabaseFront
    .from('slugs-development')
    .select();

  if (error) {
    throw new Error('articles: could not fetch slugs');
  }

  return data;
};

export const getArticleById = async (id: number | bigint): Promise<Article> => {
  const { data, error } = await supabaseFront
    .from('articles-development')
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
export const createSlug = async (slugObject: Slugs) => {
  const { slug, created_at, article_id, validated } = slugObject;
  const { error, status } = await supabase.from('slugs-development').insert({
    slug,
    created_at,
    article_id,
    validated,
  });

  if (error) {
    console.log('error in slug creation ', error);
  }

  console.log('status ', status);

  return status;
};

export const createArticle = async (article: Article) => {
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

    console.log('data ', data);
    const lastInsertedId = data && data.length > 0 ? data[0].id : null;
    if (!lastInsertedId && error) {
      throw new Error('Article: could not create article', error);
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
    console.log('Articles: could not complete article creation process ', err);
  }
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
