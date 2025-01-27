/* eslint-disable @next/next/no-html-link-for-pages */
import { UserProfile } from '@auth0/nextjs-auth0/client';

export default function UserDetails({ user }: { user: UserProfile }) {
  return (
    <section className='grid_2'>
      <figure className='prof_img_con'>
        {user.picture && <img src={user.picture} alt={'some-alt-data'} />}
      </figure>
      <div className='user_details_pkg'>
        <UserDetail title={'name'} details={user.name} />
        <UserDetail
          title={'email'}
          details={
            <span className='flexi'>
              <p>{user.email}</p>
              <span className={`dot ${user.email_verified ? 'bg-gr' : 'bg-r'}`}></span>
            </span>
          }
        />
        <UserDetail title={'nickname'} details={user.nickname} />
      </div>
      <a className='br btn_solid' href='/api/auth/logout'>
        logout
      </a>
    </section>
  );
}
function UserDetail({ title, details }: { title: string; details: any }) {
  return (
    <article className='detail_box br'>
      <h6 className='detail_box_heading'>{title}</h6>
      <p>{details}</p>
    </article>
  );
}