import { adminPermissions, contributorPermissions, UserRole, userRoles } from "@/models/user";
import { ArticleTitle } from "./ArticleTitle";

export default function UserPermissionsCheckboxes({
  role
}: {
  role: typeof userRoles | null;
}) {
  const permissions = (role && role.includes("admin" as UserRole)) ? adminPermissions : contributorPermissions;

  return (
    <>
      <ArticleTitle
        text="Ce rôle a accès aux permissions suivantes :"
        level="h4"
        color="white"
        size="medium"
        spacings="mb-4"
      />
      {permissions.map((permission, index: number) => (
        <div key={index} className="container flex items-center mb-2">
          <input
            type="checkbox"
            className="checkbox mr-2"
            data-testid={permission}
            value={permission}
            checked={true}
            disabled={true}
          />
          {permission.split(":").join("/")}
          <label htmlFor={permission} className="is-hidden text-sm text-gray-700">
            {permission}
          </label>
        </div>
      ))}
    </>
  );
}