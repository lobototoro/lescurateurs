"use client";

import { useState } from "react";

import HeaderNode from "./headerNode";
import CreateArticleForm from "./createArticlesForm";
import SearchArticle from "./searchArticle";

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
      />
      <SearchArticle />
      {/* <p>{ selection }</p> */}
      { (selection === 'createarticles') && <CreateArticleForm /> }
      {/* (selection === 'updatearticles') && <UpdateAaticleForm /> }
      { (selection === 'deletearticles') && <DeleteArticleForm /> }
      { (selection === 'validatearticles') && <ValidateArticleForm /> }
      { (selection === 'shiparticles') && <ShipArticleForm /> }
      { (selection === 'createuser') && <CreateUserForm /> }
      { (selection === 'updateuser') && <UpdateUserForm /> }
      { (selection === 'deleteuser') && <DeleteUserForm /> }
      { (selection === 'enablemaintenance') && <EnableMaintenanceForm /> } */}
    </>
  );
}