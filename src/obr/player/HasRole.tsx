import { PropsWithChildren, useContext } from "react";
import { Role } from "./types";
import { roleContext } from "./RoleContextProvider";

type Props = {
  requiredRole: Role;
} & PropsWithChildren;

export default function HasRole({ requiredRole, children }: Props) {
  const currentRole = useContext(roleContext);
  if (requiredRole === currentRole) {
    return children;
  }
}
