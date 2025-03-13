"use client";
import { useEffect, useState } from "react";

import { searchForSlugs, searchForArticle } from "@/app/searchActions";

import { Slugs } from "@/models/slugs";
import { redirect } from "next/navigation";
import { Article } from "@/models/article";
import { ArticleTitle } from "@/app/components/single-elements/ArticleTitle";

type TargetTypes = 'search' | 'update' | 'delete' | 'validate' | 'ship';

const DEFAULT_PAGE = process.env.NEXT_PUBLIC_DEFAULT_PAGE;
const DEFAULT_LIMIT = process.env.NEXT_PUBLIC_DEFAULT_LIMIT;

export default function SearchArticle({
  target,
  setSelection 
}: {
  target: TargetTypes,
  setSelection?: React.Dispatch<React.SetStateAction<number>>
}) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [slugs, setSlugs] = useState<Slugs[]>([]);
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [notification, setNotification] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await searchForSlugs(searchTerm) as { message: boolean; slugs: Slugs[] };

    if (result?.message) {
      setSlugs(result?.slugs);
    }
    if (result?.slugs.length === 0) {
      setNotification('No slug results found');
      
      return;
    }
  }

  useEffect(() => {
    const searchResults = slugs.map(async (slug) => {
      const response = await searchForArticle(slug.slug);

      if (response?.message) {
        return response?.article as Article[];
      } else {
        setNotification(response?.text as string);
      }
    });

    Promise.all(searchResults).then(searchResults => {
      setArticlesList(searchResults.flat() as Article[]);
    });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugs]);

  const handleReference = (id: number) => {
    switch(target) {
      case 'search':
        redirect(`/article/${id}`); // Redirect to article page but search for slug
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

  console.info('env var ', DEFAULT_PAGE, DEFAULT_LIMIT);

  return (
    <div className="box">
      <form onSubmit={handleSubmit} role="search">
        <div className="is-flex is-flex-direction-row is-flex-justify-space-between is-flex-align-items-center">
          <label htmlFor="search" className="is-hidden">Search</label>
          <input
            className="input is-inline-flex"
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="button is-primary is-inline-flex ml-4 mr-4">Search</button>
        </div>
        {notification && <div className="notification is-primary is-light mt-4 mb-4">
          <button className="delete" onClick={() => clearNotification()}></button>
          {notification}
        </div>}
        {slugs.length > 0 && <div className="box">
          <ul className="list result-list">
            {articlesList.map((article: Article) => {
              
              return (
                <li className="mt-3 mb-3" key={`article-${article?.id}`}>
                  <input
                    type="radio"
                    className="radio"
                    id="articleSelection"
                    name="article"
                    onClick={() => handleReference(article?.id as number)}
                  />
                  <ArticleTitle
                    color="primary"
                    level="h5"
                    size="medium"
                    text={`${article?.title} - ${article?.createdAt?.slice(0, 10)}`}
                  />
                  <p className="content">
                    { (article?.introduction as string).length > 20
                      ? article?.introduction?.slice(0, 50)
                      : article?.introduction
                    }...
                  </p>
                </li>
              )
            })}
          </ul>
        </div>}
      </form>
    </div>
  )
}