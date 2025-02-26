import HeaderNode from "./headerNode";

// import { useState } from "react";

export default function EditorForm({ role, permissions }: {
  role: string;
  permissions: string;
}) {
  // const [selection, setSelection] = useState<string>('');

  const Header = async () => {
    return <HeaderNode role={role} permissions={permissions} />;
  }

  return (
    <form>
      <Header />
      <label htmlFor="title">Title</label>
      <input type="text" name="title" id="title" />
      <label htmlFor="content">Content</label>
      <textarea name="content" id="content" cols={30} rows={10} />
      <input type="submit" value="submit" />
    </form>
  );
}