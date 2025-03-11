"use server";

import { auth0 } from "@/lib/auth0";
import { searchSlugs } from "@/lib/articles";
import { Slugs } from "@/models/slugs";

export async function searchForArticles(searchTerm: string) {
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
      text: 'Error searching for articles'
    }
  }
}
