"use client";
import { useState } from "react";

import { searchForArticles } from "@/app/searchActions";

import { Slugs } from "@/models/slugs";

export default function SearchArticle() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [slugs, setSlugs] = useState<Slugs[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await searchForArticles(searchTerm) as { message: boolean; slugs: Slugs[] };

    console.log(result);

    if (result?.message) {
      setSlugs(result?.slugs);
    }
  }

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
        {slugs.length > 0 && <div className="box">
          <ul className="list result-list">
            {slugs.map((slug: Slugs) => (
              <li
                className="result-list-item"
                key={`slug-${slug?.id}`}
              >
                  {slug?.slug}
              </li>
            ))}
          </ul>
        </div>}
      </form>
    </div>
  )
}