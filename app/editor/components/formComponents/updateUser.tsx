import { startTransition, Suspense, useActionState, useEffect, useState } from 'react';
import { z } from 'zod';

import { userSchema } from '@/models/userSchema';
import { ArticleTitle } from '@/app/components/single-elements/ArticleTitle';
import { updateUserAction, getUsersList } from '@/app/userActions';
import { set } from 'ramda';
import { PaginatedSearchDisplay } from '@/app/components/single-elements/paginatedSearchResults';

export default function UpdateUserForm() {
  const [state, formAction, isPending] = useActionState(updateUserAction, null);
  const [usersList, setUsersList] = useState<z.infer<typeof userSchema>[]>([]);
  const [selectedUser, setSelectedUser] = useState<z.infer<typeof userSchema> | null>(null);

  const getAllUsers = async () => {
    const usersListResponse = await getUsersList();
    if (usersListResponse.message) {
      const usersList = usersListResponse?.usersList as z.infer<typeof userSchema>[];

      return usersList;
    } else {
      console.error('[!] while fetching users list ', usersListResponse.text);
      
      return [];
    }
  }

  useEffect(() => {
    const fetchUsers = async () => {
      const usersList = await getAllUsers() as z.infer<typeof userSchema>[];
      if (usersList?.length > 0) {
        setUsersList(usersList);
      }
    };

    fetchUsers();
  }, []);

  const handleSelectedUser = (user: z.infer<typeof userSchema>, action: string) => {
    console.info('Selected user: ', action, user);
    if (user?.id !== undefined) {
      setSelectedUser(user);
    }
  }

  return (
    <>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <div className="box">
          <ArticleTitle
            text="Sélectionnez un utilisateur"
            level="h2"
            size="large"
            color="black"
            spacings="mt-5 mb-5"
          />
          <PaginatedSearchDisplay
            itemList={usersList}
            defaultPage={1}
            defaultLimit={10}
            target="user"
            context="user"
            handleSelectedUser={handleSelectedUser}
          />
        </div>
      </Suspense>
    </>
  );
};
