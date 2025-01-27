import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import React from 'react';
import UserDetails from './components/userDetails';

function Profile() {
  const { user, isLoading } = useUser();
  if (isLoading) {
    return <h1>loading....</h1>;
  }
  
  return <section className='container grid_2'>{user && <UserDetails user={user} />}</section>;
}
export default withPageAuthRequired(Profile);