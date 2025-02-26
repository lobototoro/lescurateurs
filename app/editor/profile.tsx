import { useUser } from "@auth0/nextjs-auth0";

import UserDetails from './components/userDetails';

function Profile() {
  const { user } = useUser();
  
  return (
    <section>
      {user && <UserDetails user={user} />}
    </section>
  );
}
export default Profile;