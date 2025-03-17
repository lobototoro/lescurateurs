"use client";
import { useState } from "react";

import { Article } from "@/models/article";
import { ArticleTitle } from "./single-elements/ArticleTitle";

export function PaginatedarticlesSearchDisplay({
  articlesList,
  defaultPage,
  defaultLimit,
  target,
  handleReference,
}: {
  articlesList: Article[],
  defaultPage: number,
  defaultLimit: number,
  target: string,
  handleReference: (id: number) => void,
}) {
  const [activePage, setActivePage] = useState<number>(Number(defaultPage))
  const totalPages = Math.ceil(articlesList.length / Number(defaultLimit))
  const offset = Number(defaultLimit) * (activePage - 1)
  const paginatedItems = articlesList.slice(offset, Number(defaultLimit) * activePage)

  const handleChangePage = (page: number) => {
    setActivePage(page)
  }

  return (
    <section className="section">
      <ul className="article-list is-flex is-justify-content-center is-flex-wrap-wrap is-align-content-space-around">
        {paginatedItems.map((article: Article) => {
                      
          return (
            <li
              key={`article-${article?.id}`}
              className="m-5 is-flex is-align-self-stretch"
            >
              {['delete', 'validate', 'ship'].includes(target) && <input
                type="radio"
                className="radio mr-4"
                id="articleSelection"
                name="article"
                onClick={() => handleReference(article?.id as number)}
              />}
              <div className="is-flex-direction-column has-background-dark p-5">
                <ArticleTitle
                  color="primary"
                  level="h5"
                  size="medium"
                  text={`${article?.title} - <span class="is-size-6 has-text-grey-light">${article?.createdAt?.slice(0, 10)} - ${article?.author} - ${article?.author}</span>`}
                />
                <p className="content has-text-grey is-size-6">
                  { (article?.introduction as string).length > 20
                    ? article?.introduction?.slice(0, 50)
                    : article?.introduction
                  }...
                </p>
              </div>
              {['search', 'update'].includes(target) && <button className="button is-size-6" onClick={() => handleReference(article?.id as number)}>validez</button>}
            </li>
          )
        })}
      </ul>
      {/* pagination */}
      <nav className="pagination" role="navigation" aria-label="pagination">
        <button
          className={`pagination-previous ${(activePage <= 1) ? 'is-disabled' : ''}`}
          title="This is the first page"
          onClick={() => handleChangePage(activePage -1)}
          disabled={activePage <= 1}
        >
          Previous
        </button>
        <button
          className={`pagination-next ${(activePage >= totalPages) ? 'is-disabled' : ''}`}
          onClick={() => handleChangePage(activePage + 1)}
          disabled={activePage >= totalPages}
        >
          Next page
        </button>
        <ul className="pagination-list">
          {Array.from({ length: totalPages }, (_, index) => index + 1)
          .map((page) => (
            <li key={`page-${page}`}>
              <button
                className={`pagination-link ${activePage === page ? 'is-current' : ''}`}
                onClick={() => activePage !== page && handleChangePage(page)}
                aria-label={`Goto page ${page}`}
              >
                {page}
              </button>
            </li>))
          }
        </ul>
      </nav>
    </section>
  );
}