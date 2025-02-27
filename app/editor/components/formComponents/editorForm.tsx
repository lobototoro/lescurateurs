"use client";

import { useState } from "react";

import HeaderNode from "./headerNode";

export default function EditorForm({ role, permissions }: {
  role: string;
  permissions: string;
}) {
  // const [selection, setSelection] = useState<string>('');
  const [selection, setSelection] = useState<string>('');
  console.info(selection);

  return (
    <form>
      <HeaderNode
        role={role}
        permissions={permissions}
        setSelection={setSelection}
      />
      <p>{ selection }</p>
      {/* { (selection === 'createarticles') && <CreatearticlesForm /> }
      { (selection === 'updatearticles') && <UpdateAaticleForm /> }
      { (selection === 'deletearticles') && <DeleteArticleForm /> }
      { (selection === 'validatearticles') && <ValidateArticleForm /> }
      { (selection === 'shiparticles') && <ShipArticleForm /> }
      { (selection === 'createuser') && <CreateUserForm /> }
      { (selection === 'updateuser') && <UpdateUserForm /> }
      { (selection === 'deleteuser') && <DeleteUserForm /> }
      { (selection === 'enablemaintenance') && <EnableMaintenanceForm /> } */}
    </form>
  );
}