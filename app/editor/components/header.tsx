export default function Header({ role, permissions }: {
  role: string;
  permissions: string;
}) {
  const stringifiedPermissions = JSON.parse(permissions);
  const filteredMenu = stringifiedPermissions.map( (permission: string) => {
    if (permission.split(':')[1] === 'articles') {
      return `${permission.split(':')[0]} article`;
    }
    if (permission.split(':')[1] === 'user') {
      return `${permission.split(':')[0]} user`;
    }
    if (permission.split(':')[1] === 'maintenance') {
      return `${permission.split(':')[0]} maintenance`;
    }
  });

  return (
    <header>
      <ul>
        <li>Role: { role }</li>
        { filteredMenu.map( (permission: string, index: number) => (
          <li key={ index }>{ permission }</li>
        ))}
      </ul>
    </header>
  );
}