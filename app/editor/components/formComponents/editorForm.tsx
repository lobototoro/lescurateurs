"use client";

import { useState } from "react";

import HeaderNode from "./headerNode";
import CreateArticleForm from "./createArticlesForm";
import SearchArticle from "./searchArticle";
import UpdateArticleForm from "./updateArticle";

export default function EditorForm({ role, permissions }: {
  role: string;
  permissions: string;
}) {
  // const [selection, setSelection] = useState<string>('');
  const [selection, setSelection] = useState<string>('');
  
  // console.info(selection);

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
      { (selection === 'deletearticles') && <SearchArticle target="delete" /> }
      { (selection === 'validatearticles') && <SearchArticle target="validate" /> }
      { (selection === 'shiparticles') && <SearchArticle target="ship" /> }
      {/* (selection === 'validatearticles') && <ValidateArticleForm /> }
      { (selection === 'shiparticles') && <ShipArticleForm /> }
      { (selection === 'createuser') && <CreateUserForm /> }
      { (selection === 'updateuser') && <UpdateUserForm /> }
      { (selection === 'deleteuser') && <DeleteUserForm /> }
      { (selection === 'enablemaintenance') && <EnableMaintenanceForm /> } */}
    </>
  );
}