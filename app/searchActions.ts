"use server";

import { auth0 } from "@/lib/auth0";
import { searchArticles, searchSlugs } from "@/lib/articles";
import { Slugs } from "@/models/slugs";

export async function searchForSlugs(searchTerm: string) {
  const sessions = await auth0.getSession();
  if (!sessions?.user) {
    return {
      message: false,
      text: 'You must be logged in to create an article'
    }
  }

  try {
    const slugs = await searchSlugs(searchTerm) as Slugs[];

    return {
      message: true,
      slugs
    }
  } catch (error) {
    return {
      message: false,
      text: 'Error searching for slugs'
    }
  }
}

export async function searchForArticle(slug: string) {
  const sessions = await auth0.getSession();
  if (!sessions?.user) {
    return {
      message: false,
      text: 'You must be logged in to search for an article'
    }
  }

  try {
    const article = await searchArticles(slug);

    return {
      message: true,
      article
    }
  } catch (error) {
    return {
      message: false,
      text: 'Error getting article'
    }
  }
}
