export default function UserDetails({ user }: { user: any }) {
  return (
    <section>
      <figure>
        {user.picture && <img src={user.picture} alt={'some-alt-data'} />}
      </figure>
      <div>
        <UserDetail title={'name'} details={user.name} />
        <UserDetail
          title={'email'}
          details={
            <span>
              <p>{user.email}</p>
              <span></span>
            </span>
          }
        />
        <UserDetail title={'nickname'} details={user.nickname} />
      </div>
      <a href='/api/auth/logout'>
        logout
      </a>
    </section>
  );
}
function UserDetail({ title, details }: { title: string; details: any }) {
  return (
    <article>
      <h6>{title}</h6>
      <div>{details}</div>
    </article>
  );
}