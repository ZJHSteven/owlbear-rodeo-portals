import { Obr } from "../../obr/types";
import { DESTINATION_ID_METADATA_ID, EXTENSION_ID } from "../../constants";
import createIconUrl from "../../fontAwesome/createIconUrl";
import removeDestinations from "../../crud/delete/destination/removeDestinations";
import { Direction, setTarget } from "../../crud/create/create";
import { TOOL_ID } from "../tool/createTool";
import {
  ADD_ONE_WAY_TELEPORT_TOOL_MODE_ID,
  ADD_TWO_WAY_TELEPORT_TOOL_MODE_ID,
} from "../tool/createToolModes";
import { Metadata } from "@owlbear-rodeo/sdk";

export const CONTEXT_MENU_VISIBILITY_METADATA_ID = `context-menu-visible`;
export const DEFAULT_CONTEXT_MENU_VISIBILITY = true;

const REMOVE_DESTINATION_CONTEXT_MENU_ID = `${EXTENSION_ID}/contextMenu/remove-destination`;
const ADD_ONE_WAY_TELEPORT_CONTEXT_MENU_ID = `${EXTENSION_ID}/contextMenu/create-one-way-teleport`;
const ADD_TWO_WAY_TELEPORT_CONTEXT_MENU_ID = `${EXTENSION_ID}/contextMenu/create-two-way-teleport`;

export default async function updateContextMenu(obr: Obr) {
  const visibility = await getVisibility(obr);
  if (visibility) {
    await createContextMenu(obr);
  } else {
    await removeContextMenu(obr);
  }
}

async function getVisibility(obr: Obr) {
  const metadata = await obr.tool.getMetadata(TOOL_ID);
  if (
    metadata === undefined ||
    metadata[CONTEXT_MENU_VISIBILITY_METADATA_ID] === undefined
  ) {
    return DEFAULT_CONTEXT_MENU_VISIBILITY;
  }

  return metadata[CONTEXT_MENU_VISIBILITY_METADATA_ID] as boolean;
}

async function createContextMenu(obr: Obr) {
  await Promise.all([
    obr.contextMenu.create({
      id: REMOVE_DESTINATION_CONTEXT_MENU_ID,
      icons: [
        {
          icon: createIconUrl("trash-can-regular.svg"),
          label: "Remove Destination",
          filter: {
            roles: ["GM"],
            some: [
              {
                key: ["metadata", DESTINATION_ID_METADATA_ID],
                value: undefined,
                operator: "!=",
              },
            ],
          },
        },
      ],
      async onClick(context) {
        await removeDestinations(obr, context.items);
      },
    }),

    obr.contextMenu.create({
      id: ADD_ONE_WAY_TELEPORT_CONTEXT_MENU_ID,
      icons: [
        {
          icon: createIconUrl("arrow-right-solid.svg"),
          label: "Add One-Way Teleport",
          filter: {
            roles: ["GM"],
            min: 1,
            max: 1,
            every: [
              {
                key: ["metadata", DESTINATION_ID_METADATA_ID],
                value: undefined,
              },
            ],
          },
        },
      ],
      async onClick(context) {
        await obr.player.deselect();
        await obr.tool.activateTool(TOOL_ID);
        await obr.tool.activateMode(TOOL_ID, ADD_ONE_WAY_TELEPORT_TOOL_MODE_ID);
        await setTarget(obr, context.items[0]);
      },
    }),
    obr.contextMenu.create({
      id: ADD_TWO_WAY_TELEPORT_CONTEXT_MENU_ID,
      icons: [
        {
          icon: createIconUrl("arrows-left-right-solid.svg"),
          label: "Add Two-Way Teleport",
          filter: {
            roles: ["GM"],
            min: 1,
            max: 1,
            every: [
              {
                key: ["metadata", DESTINATION_ID_METADATA_ID],
                value: undefined,
              },
            ],
          },
        },
      ],
      async onClick(context) {
        await obr.player.deselect();
        await obr.tool.activateTool(TOOL_ID);
        await obr.tool.activateMode(TOOL_ID, ADD_TWO_WAY_TELEPORT_TOOL_MODE_ID);
        await setTarget(obr, context.items[0], Direction.TWO_WAY);
      },
    }),
  ]);
}

async function removeContextMenu(obr: Obr) {
  await Promise.all([
    obr.contextMenu.remove(REMOVE_DESTINATION_CONTEXT_MENU_ID),
    obr.contextMenu.remove(ADD_ONE_WAY_TELEPORT_CONTEXT_MENU_ID),
    obr.contextMenu.remove(ADD_TWO_WAY_TELEPORT_CONTEXT_MENU_ID),
  ]);
}

export async function toggleContextMenuVisibility(
  obr: Obr,
  metadata: Metadata,
) {
  const visibility = !metadata[CONTEXT_MENU_VISIBILITY_METADATA_ID];
  await obr.tool.setMetadata(TOOL_ID, {
    [CONTEXT_MENU_VISIBILITY_METADATA_ID]: visibility,
  });

  await updateContextMenu(obr);
}
