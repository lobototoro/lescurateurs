'use client';

import React, { useState } from 'react';

import HeaderMenu from '@/app/editor/components/headerMenu';
import CreateArticleForm from '@/app/editor/components/formComponents/createArticles';
import UpdateArticleForm from '@/app/editor/components/formComponents/updateArticle';
import ManageArticleForm from '@/app/editor/components/formComponents/manageArticle';
import CreateUserForm from '@/app/editor/components/formComponents/createUser';
import ManageUserForm from './formComponents/manageUser';

export default function EditorForm({
  role,
  permissions,
}: {
  role: string;
  permissions: string[];
}) {
  const [selection, setSelection] = useState<string>('');
  const topPointRef = React.useRef<HTMLDivElement | null>(null);

  const handleScrollUp = () => {
    if (topPointRef.current) {
      topPointRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <HeaderMenu
        role={role}
        permissions={permissions}
        setSelection={setSelection}
        selection={selection}
      />
      <div className="h-5" ref={topPointRef} />
      {selection === 'createarticles' && (
        <CreateArticleForm scrollTopAction={handleScrollUp} />
      )}
      {selection === 'updatearticles' && (
        <UpdateArticleForm scrollTopAction={handleScrollUp} />
      )}
      {selection === 'managearticles' && (
        <ManageArticleForm scrollTopAction={handleScrollUp} />
      )}
      {selection === 'createuser' && (
        <CreateUserForm scrollTopAction={handleScrollUp} />
      )}
      {selection === 'manageuser' && (
        <ManageUserForm scrollTopAction={handleScrollUp} />
      )}

      {/*
      { (selection === 'enablemaintenance') && <EnableMaintenanceForm /> }
      */}
    </>
  );
}
