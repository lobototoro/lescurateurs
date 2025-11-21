/**
 * Module: UserPermissionsCheckboxes
 *
 * Renders a readonly list of permission checkboxes for a given user role.
 *
 * @packageDocumentation
 */

/**
 * UserPermissionsCheckboxes
 *
 * Renders a list of permissions as disabled, checked checkboxes for a given role.
 *
 * @param role - The role to compute permissions for. When null, contributor permissions are used.
 *               This value is expected to be one of the entries from `userRoles`.
 * @returns A JSX fragment containing:
 *   - A title describing that the role has the following permissions.
 *   - A list of disabled, checked checkboxes displaying each permission string
 *     (colons in permission keys are shown as slashes).
 *
 * @example
 * <UserPermissionsCheckboxes role={userRoles.admin} />
 *
 * @public
 */
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
