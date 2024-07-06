import { Role as RoleType } from "./types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserTie } from "@fortawesome/free-solid-svg-icons";

type Props = {
  role: RoleType;
};

export default function Role({ role }: Props) {
  switch (role) {
    case "GM":
      return <FontAwesomeIcon icon={faUserTie} title="GM" />;
    case "PLAYER":
      return <FontAwesomeIcon icon={faUser} title="Player" />;
  }

  console.warn(`unknown role ${role}`);
}
