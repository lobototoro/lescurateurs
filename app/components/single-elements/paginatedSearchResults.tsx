"use client";
import { useState } from "react";
import { z } from 'zod';

import { Slugs } from "@/models/slugs";
import { userSchema } from '@/models/userSchema';
import { ArticleTitle } from "./ArticleTitle";

export function PaginatedSearchDisplay({
  itemList,
  defaultPage,
  defaultLimit,
  target,
  context,
  handleReference,
  handleSelectedUser,
  manageActions,
}: {
  itemList: Slugs[] | z.infer<typeof userSchema>[];
  defaultPage: number;
  defaultLimit: number;
  target: string;
  context: 'article' | 'user';
  handleReference?: (id: number, itemName?: string) => void;
  handleSelectedUser?: (user: z.infer<typeof userSchema>, action: 'update' | 'delete') => void;
  manageActions?: (id: number, actionName: 'delete' | 'validate' | 'ship') => void;
}) {
  const [activePage, setActivePage] = useState<number>(Number(defaultPage));
  const totalPages = Math.ceil(itemList.length / Number(defaultLimit));
  const offset = Number(defaultLimit) * (activePage - 1);
  const paginatedItems = itemList.slice(
    offset,
    Number(defaultLimit) * activePage
  );

  const handleChangePage = (page: number) => {
    setActivePage(page);
  };

  const swapValue = (item: Slugs | z.infer<typeof userSchema>) => {
    const result =
      context === 'article' && 'slug' in item
        ? item.slug
        : 'email' in item
          ? item.email
          : '';

    return result;
  };

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
          {paginatedItems.map((item: Slugs | z.infer<typeof userSchema>) => {
            return (
              <tr key={`item-${item?.id}`}>
                <td>{item?.id}</td>
                <td>
                  <ArticleTitle
                    color="primary"
                    level="h5"
                    size="medium"
                    text={`${swapValue(item)}`}
                  />
                </td>
                <td>{item?.createdAt}</td>
                <td>
                  {(context === 'article') && (target === 'search') && (
                    <button
                      className="button is-size-6"
                      onClick={() =>
                        handleReference && handleReference(0, swapValue(item))
                      }
                    >
                      validez
                    </button>
                  )}

                  {(context === 'article') &&
                    (target === 'update'
                    ) && (
                      <button
                        className="button mr-4"
                        data-testid="selection-button"
                        onClick={() => {
                          if ('articleId' in item) {
                            handleReference &&
                              handleReference(item.articleId as number);
                          } else if ('id' in item) {
                            handleReference &&
                              handleReference(item.id as number);
                          }
                        }}
                      >
                        Sélectionner
                      </button>
                    )}

                  {(context === 'article') && (target === 'manage') && (
                    <div className="buttons">
                      <button
                        className="button is-size-6"
                        onClick={() => {
                          if ('articleId' in item) {
                            manageActions &&
                              manageActions(item?.articleId as number, 'delete');
                          }
                        }}
                      >
                        Effacer
                      </button>
                      <button
                        className="button is-size-6"
                        onClick={() => {
                          if ('articleId' in item) {
                            manageActions &&
                              manageActions(item?.articleId as number, 'validate');
                          }
                        }}
                      >
                        Valider / Invalider
                      </button>
                      <button
                        className="button is-size-6"
                        onClick={() => {
                          if ('articleId' in item) {
                            manageActions &&
                              manageActions(item?.articleId as number, 'ship');
                          }
                        }}
                      >
                        Online / Offline
                      </button>
                    </div>
                  )}
                    {context === 'user' && (
                      <button
                        className="button mr-4"
                        data-testid="selection-button"
                        onClick={() => {
                          if ('id' in item) {
                            handleSelectedUser &&
                              handleSelectedUser(item as z.infer<typeof userSchema>, 'update');
                          }
                        }}
                      >
                        udpate
                      </button>
                    )}
                  {context === 'user' && (
                    <button
                      className="button mr-4"
                      data-testid="selection-button"
                      onClick={() => {
                        if ('id' in item) {
                          handleSelectedUser &&
                            handleSelectedUser(
                              item as z.infer<typeof userSchema>,
                              'delete'
                            );
                        }
                      }}
                    >
                      delete
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* pagination */}
      {totalPages > 1 && (
        <nav className="pagination" role="navigation" aria-label="pagination">
          <button
            className={`pagination-previous ${activePage <= 1 ? 'is-disabled' : ''}`}
            title="This is the first page"
            onClick={() => handleChangePage(activePage - 1)}
            disabled={activePage <= 1}
          >
            Previous
          </button>
          <button
            className={`pagination-next ${activePage >= totalPages ? 'is-disabled' : ''}`}
            onClick={() => handleChangePage(activePage + 1)}
            disabled={activePage >= totalPages}
            data-testid="next-button"
          >
            Next page
          </button>
          <ul className="pagination-list">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <li key={`page-${page}`}>
                  <button
                    className={`pagination-link ${activePage === page ? 'is-current' : ''}`}
                    onClick={() =>
                      activePage !== page && handleChangePage(page)
                    }
                    aria-label={`Goto page ${page}`}
                  >
                    {page}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      )}
    </section>
  );
}