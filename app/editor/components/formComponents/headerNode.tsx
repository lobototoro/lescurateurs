"use client";
import React from "react";

export default function HeaderNode({ role, permissions, setSelection }: {
  role: string;
  permissions: string;
  setSelection: React.Dispatch<React.SetStateAction<string>>;
}) {
  const stringifiedPermissions = JSON.parse(permissions);
  const filteredMenu = stringifiedPermissions.map( (permission: string, index: number) => {
    if (permission === 'read:articles') return;

    return <li key = { index } onClick={ () => setSelection(permission.split(':').join('')) }>{permission.split(':')[0]} {permission.split(':')[1]}</li>;
  });

  return (
    <header>
      <ul>
        <li>Role: { role }</li>
        { filteredMenu }
      </ul>
    </header>
  );
}