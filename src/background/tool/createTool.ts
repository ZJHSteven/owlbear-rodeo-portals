import { EXTENSION_ID } from "../../constants";
import { Obr } from "../../obr/types";
import createIconUrl from "../../fontAwesome/createIconUrl";
import { labels } from "../../i18n/strings";
import createToolModes, {
  DEFAULT_DIRECTION,
  DIRECTION_METADATA_ID,
} from "./createToolModes";
import createToolActions from "./createToolActions";
import {
  DEFAULT_LINK_VISIBILITY,
  LINK_VISIBILITY_METADATA_ID,
} from "../../crud/read/link/toggleLinkVisibility";
import {
  CONTEXT_MENU_VISIBILITY_METADATA_ID,
  DEFAULT_CONTEXT_MENU_VISIBILITY,
} from "../contextMenu/updateContextMenu";

export const TOOL_ID = `${EXTENSION_ID}/tool/portals`;

const DEFAULT_METADATA = {
  [LINK_VISIBILITY_METADATA_ID]: DEFAULT_LINK_VISIBILITY,
  [CONTEXT_MENU_VISIBILITY_METADATA_ID]: DEFAULT_CONTEXT_MENU_VISIBILITY,
  [DIRECTION_METADATA_ID]: DEFAULT_DIRECTION,
};

export default async function createTool(obr: Obr) {
  await obr.tool.create({
    id: TOOL_ID,
    icons: [
      {
        icon: createIconUrl("dungeon-solid.svg"),
        label: labels.toolName,
        filter: {
          roles: ["GM"],
        },
      },
    ],
    defaultMetadata: DEFAULT_METADATA,
  });

  const metadata = await obr.tool.getMetadata(TOOL_ID);
  if (metadata === undefined) {
    await obr.tool.setMetadata(TOOL_ID, DEFAULT_METADATA);
  } else {
    const missing = Object.entries(DEFAULT_METADATA).filter(
      ([key]) => metadata[key] === undefined,
    );

    if (missing.length !== 0) {
      missing.forEach(([key, defaultValue]) => (metadata[key] = defaultValue));
      await obr.tool.setMetadata(TOOL_ID, metadata);
    }
  }

  await Promise.all([createToolModes(obr), createToolActions(obr)]);
}
