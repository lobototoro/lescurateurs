"use client";
import { ArticleTitle } from "@/app/components/single-elements/ArticleTitle";
import React, { useRef } from "react";

export default function HeaderMenu({
  role,
  permissions,
  setSelection,
  selection
}: {
  role: string;
  permissions: string;
  setSelection: React.Dispatch<React.SetStateAction<string>>;
  selection: string;
}) {
  // NEX-50: whikle working on modal and notif, we simplify BO menu
  let definitivePermissions = [];
  
  const stringifiedPermissions =
    role === 'admin'
      ? JSON.parse(permissions).filter(
          (permission: string) =>
            permission !== 'update:user' && permission !== 'delete:user' && permission !== 'delete:articles' && permission !== 'validate:articles' && permission !== 'ship:articles'
        )
      : JSON.parse(permissions);
  
  if (role === 'admin') {
    definitivePermissions = stringifiedPermissions.toSpliced(3, 0, 'manage:articles').toSpliced(-1, 0, 'manage:user');
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
          >
            {permission.split(':')[0]} {permission.split(':')[1]}
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
          <div className="navbar-start is-flex-wrap-wrap">
            {filteredMenu}
          </div>

          <div className="is-flex">
            <div className="navbar-item">
              <div className="buttons">
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