"use client";
import { useState } from "react";

import { Slugs } from "@/models/slugs";
import { ArticleTitle } from "./single-elements/ArticleTitle";

export function PaginatedArticlesSearchDisplay({
  slugsList,
  defaultPage,
  defaultLimit,
  target,
  handleReference,
}: {
  slugsList: Slugs[],
  defaultPage: number,
  defaultLimit: number,
  target: string,
  handleReference: (id: number, slug?: string) => void,
}) {
  const [activePage, setActivePage] = useState<number>(Number(defaultPage))
  const totalPages = Math.ceil(slugsList.length / Number(defaultLimit))
  const offset = Number(defaultLimit) * (activePage - 1)
  const paginatedItems = slugsList.slice(offset, Number(defaultLimit) * activePage)

  const handleChangePage = (page: number) => {
    setActivePage(page)
  }

  return (
    <section className="section">
      <table className="table container slugs-list">
        <thead>
          <tr>
            <th>
              <abbr title="identifiant">ID</abbr>
            </th>
            <th>Slug</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {paginatedItems.map((slug: Slugs) => {
                      
          return (
            <tr
              key={`slug-${slug?.id}`}
            >
              <td>{slug?.id}</td>
              <td>
                <ArticleTitle
                  color="primary"
                  level="h5"
                  size="medium"
                  text={`${slug?.slug}`}
                />
              </td>
              <td>{slug?.createdAt}</td>
              <td>
                {['search'].includes(target) && <button className="button is-size-6" onClick={() => handleReference(0, slug?.slug)}>validez</button>}

                {['update', 'delete', 'validate', 'ship'].includes(target) && <button
                  className="button mr-4"
                  data-testid="selection-button"
                  onClick={() => handleReference(slug?.articleId as number)}
                >
                  Sélectionner
                </button>}
              </td>
            </tr>
        )})}
        </tbody>
      </table>
      {/* pagination */}
      {(totalPages > 1) && <nav className="pagination" role="navigation" aria-label="pagination">
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
          data-testid="next-button"
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
      </nav>}
    </section>
  );
}