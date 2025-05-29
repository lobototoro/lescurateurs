"use client";

import { useState } from "react";

import HeaderNode from '@/app/editor/components/headerMenu';
import CreateArticleForm from "@/app/editor/components/formComponents/createArticles";
import UpdateArticleForm from '@/app/editor/components/formComponents/updateArticle';

import ManageArticleForm from '@/app/editor/components/formComponents/manageArticle';

// import ValidateArticleForm from '@/app/editor/components/formComponents/validateArticle';
// import ShipArticle from '@/app/editor/components/formComponents/shipArticle';
import CreateUserForm from '@/app/editor/components/formComponents/createUser';
import ManageUserForm from './formComponents/manageUser';

export default function EditorForm({ role, permissions }: {
  role: string;
  permissions: string;
}) {
  const [selection, setSelection] = useState<string>('');

  return (
    <>
      <HeaderNode
        role={role}
        permissions={permissions}
        setSelection={setSelection}
        selection={selection}
      />

      {/* <SearchArticle target="search" /> */}
      {/* <p>{ selection }</p> */}
      {selection === 'createarticles' && <CreateArticleForm />}
      {selection === 'updatearticles' && <UpdateArticleForm />}

      {/* {selection === 'deletearticles' && <DeleteArticleForm />}
      {selection === 'validatearticles' && <ValidateArticleForm />}
      {selection === 'shiparticles' && <ShipArticle />} */}
      {selection === 'managearticles' && <ManageArticleForm />}
      {selection === 'createuser' && <CreateUserForm />}
      {selection === 'manageuser' && <ManageUserForm />}

      {/* 
      { (selection === 'enablemaintenance') && <EnableMaintenanceForm /> }
      */}
    </>
  );
}