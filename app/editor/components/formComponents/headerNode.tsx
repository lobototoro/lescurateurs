"use client";
import React, { useRef } from "react";

export default function HeaderNode({ role, permissions, setSelection }: {
  role: string;
  permissions: string;
  setSelection: React.Dispatch<React.SetStateAction<string>>;
}) {
  const stringifiedPermissions = JSON.parse(permissions);
  const filteredMenu = stringifiedPermissions.map( (permission: string, index: number) => {
    if (permission === 'read:articles') return;

    return (
      <div
        className="navbar-item"
        key={ index }
        onClick={ () => setSelection(permission.split(':').join('')) }
      >
        {permission.split(':')[0]} {permission.split(':')[1]}
      </div>
    );
  });
  const toggledMenu = useRef<HTMLDivElement>(null);
  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const origin = e.target as HTMLAnchorElement;
    const target = toggledMenu.current as HTMLDivElement;
    console.info(e);
    target.classList.contains('is-active')
      ? target.classList.remove('is-active')
      : target.classList.add('is-active');
    origin.classList.contains('is-active')
      ? origin.classList.remove('is-active')
      : origin.classList.add('is-active');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
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
      
      <div id="navbarMenuItems" className="navbar-menu" ref={toggledMenu}>
        <div className="navbar-start">
          { filteredMenu }
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              <a className="button is-primary" href="/auth/logout">
                Log out
              </a>
              <a className="button is-light">
                <strong>Role : {role}</strong>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}