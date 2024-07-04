import {OBR} from "../obr/types";
import createIconUrl from "../createIconUrl";
import {EXTENSION_ID} from "../constants";
import createAddOneWayTeleportMode from "./mode/createAddOneWayTeleportMode";
import createToggleLinkVisibilityAction, {
  LINK_VISIBILITY_METADATA_ID
} from "./action/createToggleLinkVisibilityAction";
import createAddTwoWayTeleportMode from "./mode/createAddTwoWayTeleportMode";

export const TOOL_ID = `${EXTENSION_ID}/tool/portals`;

export default async function createPortalTool(obr: OBR) {
  await obr.tool.create({
    id: TOOL_ID,
    icons: [
      {
        icon: createIconUrl("dungeon-solid.svg"),
        label: "Portals",
        filter: {
          roles: ["GM"],
        }
      }
    ],
    defaultMetadata: {
      [LINK_VISIBILITY_METADATA_ID]: false,
    }
  });

  await createAddOneWayTeleportMode(obr);
  await createAddTwoWayTeleportMode(obr);
  await createToggleLinkVisibilityAction(obr);
}
