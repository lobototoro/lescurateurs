/**
 * @module HeaderMenu
 *
 * Top-level module that exports the HeaderMenu React component.
 *
 * This component renders an editor navigation menu driven by an auth role and
 * a permissions payload. It transforms and filters the incoming permissions,
 * maps them to UI actions and icons, and exposes a simple selection API to the
 * parent via setSelection.
 *
 * @remarks
 * - The file uses a simplified BO (back-office) menu logic (see NEX-50).
 * - Permissions are expected to be a native array of strings.
 * - This module relies on `iconMapper` and `ArticleTitle` imported from the
 *   application's utility and component libraries.
 */

/**
 * Properties for the HeaderMenu component.
 *
 * @typedef HeaderMenuProps
 * @property {string} role - The user's role (e.g. 'admin'). Controls how
 *   permissions are transformed and which menu items are present.
 * @property {string[]} permissions - Array of permission strings
 *   (e.g. ["read:articles","manage:articles"]).
 * @property {React.Dispatch<React.SetStateAction<string>>} setSelection - React
 *   state setter used to update the currently selected menu action.
 * @property {string} selection - The currently selected action key (used to
 *   mark a menu button as active).
 */

/**
 * Internal variables and transformations
 *
 * - definitivePermissions: Array<string>
 *   The computed, definitive list of permissions used to render menu items.
 *   It is derived from the incoming permissions (stringified) and modified
 *   depending on the role (admin vs non-admin).
 *
 * - stringifiedPermissions: Array<string>
 *   The parsed permissions array. When role is 'admin' some permissions are
 *   filtered out to simplify the BO menu.
 *
 * - filteredMenu: JSX.Element[]
 *   The array of rendered menu item elements mapped from definitivePermissions.
 *   Items like 'read:articles' are intentionally skipped.
 */

/**
 * toggleMenu
 *
 * Small click handler to toggle the visibility of the responsive navbar menu.
 *
 * @param {React.MouseEvent} e - The click event from the burger button.
 *
 * @remarks
 * The function uses a ref to the container element and toggles the
 * 'is-active' CSS class to show/hide the menu.
 */

/**
 * Notes for consumers / implementors
 *
 * - To change which permissions appear or their order, update the logic that
 *   constructs `definitivePermissions`.
 * - The component assumes permission strings are colon-delimited tokens of the
 *   shape "<verb>:<resource>" (e.g. 'manage:articles'). The UI label and the
 *   selection key are derived by removing the colon.
 * - Any changes to permission normalization should preserve the behavior of
 *   `selection` matching (it compares against permission.split(':').join('')).
 *
 * @example
 * <HeaderMenu
 *   role="editor"
 *   permissions={["read:articles","manage:articles","delete:comments"]}
 *   selection="managearticles"
 *   setSelection={(s) => console.log(s)}
 * />
 *
 * @public
 */
'use client';
import React, { useRef } from 'react';

import { iconMapper } from '@/lib/utility-functions';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';

export default function HeaderMenu({
  role,
  permissions,
  setSelection,
  selection,
}: {
  role: string;
  permissions: string[];
  setSelection: React.Dispatch<React.SetStateAction<string>>;
  selection: string;
}) {
  // NEX-50: whikle working on modal and notif, we simplify BO menu
  let definitivePermissions = [];

  const stringifiedPermissions =
    role === 'admin'
      ? permissions.filter(
          (permission: string) =>
            permission !== 'update:user' &&
            permission !== 'delete:user' &&
            permission !== 'delete:articles' &&
            permission !== 'validate:articles' &&
            permission !== 'ship:articles'
        )
      : permissions;

  if (role === 'admin') {
    definitivePermissions = stringifiedPermissions
      .toSpliced(3, 0, 'manage:articles')
      .toSpliced(-1, 0, 'manage:user');
  } else {
    definitivePermissions = stringifiedPermissions.toSpliced(
      2,
      2,
      'manage:articles'
    );
  }

  const filteredMenu = definitivePermissions.map(
    (permission: string, index: number) => {
      // TODO: how do we read articles > is it the same as validate article?
      if (permission === 'read:articles') return;

      return (
        <div className="navbar-item" key={index}>
          <a
            className={`button ${selection === permission.split(':').join('') ? 'is-active' : ''}`}
            onClick={() => setSelection(permission.split(':').join(''))}
            title={` ${permission.split(':')[0]} ${permission.split(':')[1]}`}
          >
            <span className="material-icons-outlined is-size-5">
              {iconMapper(permission)}
            </span>
            {permission.split(':')[0]} {permission.split(':')[1]}
            &nbsp;
          </a>
        </div>
      );
    }
  );

  const toggledMenu = useRef<HTMLDivElement>(null);
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = toggledMenu.current as HTMLDivElement;

    target.classList.contains('is-active')
      ? target.classList.remove('is-active')
      : target.classList.add('is-active');
  };

  return (
    <>
      <ArticleTitle
        text="ÉDITEUR"
        level="h2"
        size="large"
        color="black"
        spacings="mt-5 mb-5"
      />
      <nav
        className="navbar box"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarMenuItems"
            onClick={(e: React.MouseEvent) => toggleMenu(e)}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="navbarMenuItems"
          className="navbar-menu is-flex-direction-row"
          ref={toggledMenu}
        >
          <div className="navbar-start is-flex-wrap-wrap">{filteredMenu}</div>

          <div className="is-flex">
            <div className="navbar-item">
              <div className="buttons is-flex-direction-column">
                <a className="button is-info" href="/auth/logout">
                  Log out
                </a>
                <span className="tag is-dark">
                  <strong>Role : {role}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
        <hr />
      </nav>
    </>
  );
}
