'use client';
import { useState } from 'react';
import { z } from 'zod';

import { Slugs } from '@/models/slugs';
import { userSchema } from '@/models/userSchema';
import { ArticleTitle } from './ArticleTitle';
import styles from './paginatedSearchResults.module.css';

/**
 * @packageDocumentation
 * Utilities and UI component for displaying paginated search results.
 *
 * This module exports PaginatedSearchDisplay, a presentational React component
 * that renders a list of items (articles or users) in a paginated table.
 *
 * The component supports multiple contexts and targets:
 * - context: 'article' | 'user' controls how items are interpreted and which actions are shown
 * - target: string (e.g., 'search', 'update', 'manage') controls which action buttons are rendered
 *
 * The module relies on application specific types:
 * - Slugs: model describing article slug entries
 * - userSchema: zod schema used to infer user type
 *
 * Example:
 * ```tsx
 * <PaginatedSearchDisplay
 *   itemList={items}
 *   defaultPage={1}
 *   defaultLimit={10}
 *   target="search"
 *   context="article"
 *   handleReference={(id, name, action) => { ... }}
 * />
 * ```
 */

/**
 * PaginatedSearchDisplay
 *
 * Render a paginated list of items (articles or users) with contextual actions.
 *
 * @param itemList - Array of items to display. Items are either Slugs or objects matching `userSchema`.
 * @param defaultPage - Initial page number (1-based).
 * @param defaultLimit - Number of items per page.
 * @param target - Usage target that alters available actions (e.g. 'search', 'update', 'manage').
 * @param context - Contextual type of the items, either 'article' or 'user'.
 * @param handleReference - Optional callback invoked for article-related actions.
 *   Receives (id: number, itemName?: string, actionName?: string).
 * @param handleSelectedUser - Optional callback invoked for user-related actions.
 *   Receives (user: z.infer<typeof userSchema>, action: 'update' | 'delete').
 *
 * @remarks
 * - The component will compute pagination locally from the provided itemList and defaultLimit.
 * - When rendering articles, the component uses the presence of 'slug' or 'article_id' fields
 *   to determine how to display and reference items.
 *
 * @public
 */

/**
 * Internal helper documentation
 *
 * handleChangePage(page: number) => void
 *   Updates the component's active page state. This is used by the pagination controls.
 *
 * swapValue(item) => string
 *   Extracts a display value from an item depending on the current context:
 *   - For articles: returns the 'slug' field
 *   - For users: returns the 'email' field
 *
 * These helpers are intentionally kept local to the component since they reference
 * component state and props (context, activePage).
 *
 * @internal
 */

export function PaginatedSearchDisplay({
  itemList,
  defaultPage,
  defaultLimit,
  target,
  context,
  handleReference,
  handleSelectedUser,
}: {
  itemList: Slugs[] | z.infer<typeof userSchema>[];
  defaultPage: number;
  defaultLimit: number;
  target: string;
  context: 'article' | 'user';
  handleReference?: (
    id: number,
    itemName?: string,
    actionName?: string
  ) => void;
  handleSelectedUser?: (
    user: z.infer<typeof userSchema>,
    action: 'update' | 'delete'
  ) => void;
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
      <table
        className="table container slugs-list"
        data-testid="paginated-search"
      >
        <thead>
          <tr>
            <th className={styles['id-cell']}>
              <abbr title="Number">#</abbr>{' '}
              <abbr title="Identifier">ID</abbr>
            </th>
            <th className={styles['slug-cell']}>
              {context === 'article' ? 'Slug' : 'Email'}
            </th>
            <th className={styles['date-cell']}>Créé le</th>
            <th className={styles['actions-cell']}>Actions</th>
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
                <td>{item?.created_at && item.created_at.toString()}</td>
                <td>
                  {context === 'article' && target === 'search' && (
                    <button
                      className="button is-size-6"
                      onClick={() =>
                        handleReference && handleReference(0, swapValue(item))
                      }
                    >
                      validez
                    </button>
                  )}

                  {context === 'article' && target === 'update' && (
                    <button
                      className="button mr-4"
                      data-testid="selection-button"
                      onClick={() => {
                        if ('article_id' in item) {
                          handleReference &&
                            handleReference(item.article_id as number);
                        } else if ('id' in item) {
                          handleReference && handleReference(item.id as number);
                        }
                      }}
                    >
                      Sélectionner
                    </button>
                  )}

                  {context === 'article' && target === 'manage' && (
                    <div className="buttons is-flex is-flex-direction-row is-justify-content-start">
                      <button
                        className="button is-size-6"
                        onClick={() => {
                          if ('article_id' in item) {
                            handleReference &&
                              handleReference(
                                item?.article_id as number,
                                '',
                                'delete'
                              );
                          }
                        }}
                      >
                        Effacer
                      </button>
                      <button
                        className="button is-size-6"
                        onClick={() => {
                          if ('article_id' in item) {
                            handleReference &&
                              handleReference(
                                item?.article_id as number,
                                '',
                                'validate'
                              );
                          }
                        }}
                      >
                        Valider / Invalider
                      </button>
                      <button
                        className="button is-size-6"
                        onClick={() => {
                          if ('article_id' in item) {
                            handleReference &&
                              handleReference(
                                item?.article_id as number,
                                '',
                                'ship'
                              );
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
                      data-testid="user-update-button"
                      onClick={() => {
                        if ('id' in item) {
                          handleSelectedUser &&
                            handleSelectedUser(
                              item as z.infer<typeof userSchema>,
                              'update'
                            );
                        }
                      }}
                    >
                      update
                    </button>
                  )}
                  {context === 'user' && (
                    <button
                      className="button mr-4"
                      data-testid="user-delete-button"
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
            title={activePage <= 1 ? "This is the first page" : "Go to previous page"}
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
