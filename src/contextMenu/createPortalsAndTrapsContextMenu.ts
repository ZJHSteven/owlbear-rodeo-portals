import {OBR} from "../obr/types";
import createRemoveDestinationContextMenu
  from "./createRemoveDestinationContextMenu";

export default async function createPortalsAndTrapsContextMenu(obr: OBR) {
  await createRemoveDestinationContextMenu(obr);
}
