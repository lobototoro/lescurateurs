"use client";

import { useState } from "react";

import HeaderNode from "./headerNode";
import CreateArticleForm from "./createArticles";

;
import UpdateArticleForm from "./updateArticle";
import DeleteArticleForm from "./deleteArticle";
import ValidateArticleForm from "./validateArticle";
import ShipArticle from "./shipArticle";

export default function EditorForm({ role, permissions }: {
  role: string;
  permissions: string;
}) {
  // const [selection, setSelection] = useState<string>('');
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
      { (selection === 'createarticles') && <CreateArticleForm /> }
      { (selection === 'updatearticles') && <UpdateArticleForm /> }
      { (selection === 'deletearticles') && <DeleteArticleForm /> }
      { (selection === 'validatearticles') && <ValidateArticleForm /> }
      { (selection === 'shiparticles') && <ShipArticle /> }
      
      {/* { (selection === 'createuser') && <CreateUserForm /> }
      { (selection === 'updateuser') && <UpdateUserForm /> }
      { (selection === 'deleteuser') && <DeleteUserForm /> }
      { (selection === 'enablemaintenance') && <EnableMaintenanceForm /> } */}
    </>
  );
}