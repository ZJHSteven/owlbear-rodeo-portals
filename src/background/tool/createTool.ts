import {EXTENSION_ID} from "../../constants";
import {Obr} from "../../obr/types";
import createIconUrl from "../../fontAwesome/createIconUrl";
import createToolModes from "./createToolModes";
import createToolActions from "./createToolActions";
import {
  LINK_VISIBILITY_METADATA_ID
} from "../../crud/read/link/toggleLinkVisibility";

export const TOOL_ID = `${EXTENSION_ID}/tool/portals`;

export default async function createTool(obr: Obr) {
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

  await Promise.all([
    createToolModes(obr),
    createToolActions(obr),
  ]);
}
