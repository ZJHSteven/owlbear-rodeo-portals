import {OBR} from "../obr/types";
import createRemoveDestinationContextMenu
  from "./createRemoveDestinationContextMenu";

export default async function createPortalContextMenu(obr: OBR) {
  await createRemoveDestinationContextMenu(obr);
}
