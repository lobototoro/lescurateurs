"use client";

import { useState } from "react";

import HeaderNode from '@/app/editor/components/headerMenu';
import CreateArticleForm from "@/app/editor/components/formComponents/createArticles";

;
import UpdateArticleForm from '@/app/editor/components/formComponents/updateArticle';
import DeleteArticleForm from '@/app/editor/components/formComponents/deleteArticle';
import ValidateArticleForm from '@/app/editor/components/formComponents/validateArticle';
import ShipArticle from '@/app/editor/components/formComponents/shipArticle';
import CreateUserForm from '@/app/editor/components/formComponents/createUser';
import UpdateUserForm from "./formComponents/updateUser";

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
      {selection === 'deletearticles' && <DeleteArticleForm />}
      {selection === 'validatearticles' && <ValidateArticleForm />}
      {selection === 'shiparticles' && <ShipArticle />}
      {selection === 'createuser' && <CreateUserForm />}
      {selection === 'updateuser' && <UpdateUserForm />}
      {/* 
      { (selection === 'deleteuser') && <DeleteUserForm /> }
      { (selection === 'enablemaintenance') && <EnableMaintenanceForm /> } */}
    </>
  );
}