import { useActionState, useState } from 'react';
import { z } from 'zod';

import { userSchema } from '@/models/userSchema';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';
import { updateUserAction } from '@/app/userActions';

export default function UpdateUserForm() {
  const [state, formAction, isPending] = useActionState(updateUserAction, null);
  const [selectedID, setSelectedID] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<z.infer<typeof userSchema> | null>(null);

  return (
    <>
      {!selectedID && <div className="box">
        <ArticleTitle
          text="Sélectionnez un utilisateur"
          level="h2"
          size="large"
          color="black"
          spacings="mt-5 mb-5"
        />

        </div>}
    </>
  );
};
