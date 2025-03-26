"use client";
import { useState } from "react";

import { searchForSlugs } from "@/app/searchActions";
import { Slugs } from "@/models/slugs";
import { ArticleTitle } from "@/app/components/single-elements/ArticleTitle";
import { PaginatedArticlesSearchDisplay } from "@/app/components/PaginatedArticlesSearch";

type TargetTypes = 'search' | 'update' | 'delete' | 'validate' | 'ship';

const DEFAULT_PAGE = process.env.NEXT_PUBLIC_DEFAULT_PAGE || 1;
const DEFAULT_LIMIT = process.env.NEXT_PUBLIC_DEFAULT_LIMIT || 10;

export default function SearchArticle({
  target,
  setSelection 
}: {
  target: TargetTypes,
  setSelection?: React.Dispatch<React.SetStateAction<number | string>>
}) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [slugs, setSlugs] = useState<Slugs[]>([]);
  const [notification, setNotification] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (searchTerm.trim() === '') return;
    setNotification('');
    
    const result = await searchForSlugs(searchTerm) as { message: boolean; slugs: Slugs[] };

    if (result?.message) {
      setSlugs(result?.slugs);
    }
    if (result?.slugs.length === 0) {
      setNotification('No slug results found');

      return;
    }
  }

  const handleReference = (id: number, slug?: string) => {
    switch(target) {
      case 'search':
        if (slug !== undefined && setSelection) {
        setSelection(`/article/${slug}`); // super with slugs instead of id
        }
        break;
      case 'update':
      case 'delete':
      case 'validate':
      case'ship':
        if (id !== undefined && setSelection) {
          setSelection(id);
        }
        break;
      default:
        return;
    }
  }

  const clearNotification = () => {
    setNotification('');
  }

  return (
    <div className="container">
      <form onSubmit={handleSubmit} role="search">
        <div className="is-flex is-flex-direction-row is-flex-justify-space-between is-flex-align-items-center">
          <label htmlFor="search" className="is-hidden">Search</label>
          <input
            className="input is-inline-flex"
            id="search"
            type="text"
            data-testid="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="button is-primary is-inline-flex ml-4 mr-4" data-testid="submit-search">Search</button>
        </div>

        {notification && <div className="notification is-primary is-light mt-4 mb-4">
          <button className="delete" onClick={() => clearNotification()}></button>
          {notification}
        </div>}

        {slugs.length > 0 && <ArticleTitle
          size="medium"
          level="h3"
          color="secondary"
          text={`Vous avez cherché " ${searchTerm} " avec ${slugs.length} résultat(s)`}
          spacings="mt-3 mb-5"
        />}

        {(slugs.length > 0) && <PaginatedArticlesSearchDisplay
          slugsList={slugs}
          defaultPage={DEFAULT_PAGE as number}
          defaultLimit={DEFAULT_LIMIT as number}
          target={target}
          handleReference={handleReference}
        />}
      </form>
    </div>
  )
}