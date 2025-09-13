'use client';
import { useEffect, useState } from 'react';

import { searchForSlugs } from '@/app/searchActions';
import { Slugs } from '@/models/slugs';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';
import { PaginatedSearchDisplay } from '@/app/components/single-elements/paginatedSearchResults';

type TargetTypes = 'search' | 'update' | 'manage';

const DEFAULT_PAGE = process.env.NEXT_PUBLIC_DEFAULT_PAGE || 1;
const DEFAULT_LIMIT = process.env.NEXT_PUBLIC_DEFAULT_LIMIT || 10;

export default function SearchArticle({
  target,
  cancelSearchDisplay,
  setSelection,
  manageSelection,
}: {
  target: TargetTypes;
  cancelSearchDisplay?: boolean;
  setSelection?: React.Dispatch<React.SetStateAction<number | string>>;
  manageSelection?: React.Dispatch<React.SetStateAction<Record<string, any>>>;
}) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [slugs, setSlugs] = useState<Slugs[]>([]);
  const [notification, setNotification] = useState<string>('');
  const [pendingSearch, setPendingSearch] = useState<boolean>(false);

  useEffect(() => {
    if (cancelSearchDisplay) {
      setSearchTerm('');
      setSlugs([]);
      setNotification('');
    }
  }, [cancelSearchDisplay]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchTerm.trim() === '') return;
    setNotification('');

    setPendingSearch(true);

    const result = (await searchForSlugs(searchTerm)) as {
      message: boolean;
      slugs: Slugs[];
    };

    if (result?.message) {
      setSlugs(result?.slugs);
    }
    if (result?.slugs.length === 0) {
      setNotification('No slug results found');
      setPendingSearch(false);

      return;
    }
    setPendingSearch(false);
  };

  const handleReference = (id: number, slug?: string, actionName?: string) => {
    switch (target) {
      case 'search':
        if (slug !== undefined && setSelection) {
          setSelection(`/article/${slug}`); // super with slugs instead of id
        }
        break;
      case 'update':
        if (id !== undefined && setSelection) {
          setSelection(id);
        }
        break;
      case 'manage':
        if (id !== undefined && manageSelection) {
          manageSelection({ id, actionName });
        }
        break;
      default:
        return;
    }
  };

  const clearNotification = () => {
    setNotification('');
  };

  return (
    <div className="container">
      <ArticleTitle
        text={target}
        level="h2"
        size="large"
        color="white"
        spacings="mt-6 mb-4"
      />
      <form onSubmit={handleSubmit} role="search">
        <div className="is-flex is-flex-direction-row is-flex-justify-space-between is-flex-align-items-center">
          <label htmlFor="search" className="is-hidden">
            Search
          </label>
          <input
            className="input is-inline-flex"
            id="search"
            type="text"
            data-testid="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className={
              pendingSearch
                ? 'button is-inline-flex ml-4 mr-4 is-loading'
                : 'button is-inline-flex ml-4 mr-4'
            }
            data-testid="submit-search"
          >
            Search
          </button>
        </div>

        {notification && (
          <div className="notification is-primary is-light mt-4 mb-4">
            <button
              className="delete"
              onClick={() => clearNotification()}
            ></button>
            {notification}
          </div>
        )}

        {slugs.length > 0 && (
          <ArticleTitle
            size="medium"
            level="h3"
            color="secondary"
            text={`Vous avez cherché " ${searchTerm} " avec ${slugs.length} résultat(s)`}
            spacings="mt-3 mb-5"
          />
        )}

        {slugs.length > 0 && (
          <PaginatedSearchDisplay
            itemList={slugs}
            defaultPage={DEFAULT_PAGE as number}
            defaultLimit={DEFAULT_LIMIT as number}
            target={target}
            context="article"
            handleReference={handleReference}
          />
        )}
      </form>
    </div>
  );
}
