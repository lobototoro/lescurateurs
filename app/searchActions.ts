'use server';

import { auth0 } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import { searchArticles, searchSlugs } from '@/lib/supabase/articles';
import { Slugs } from '@/models/slugs';

export async function searchForSlugs(searchTerm: string) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  try {
    const slugs = (await searchSlugs(searchTerm)) as Slugs[];
    console.log('in back func ', slugs);

    return {
      message: true,
      slugs,
    };
  } catch (error) {
    return {
      message: false,
      text: 'Error searching for slugs',
    };
  }
}

export async function searchForArticle(slug: string) {
  const session = await auth0.getSession();
  if (!session?.user) {
    redirect('/editor');
  }

  try {
    const article = await searchArticles(slug);

    return {
      message: true,
      article,
    };
  } catch (error) {
    return {
      message: false,
      text: 'Error getting article',
    };
  }
}
