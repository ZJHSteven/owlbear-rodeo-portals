import { Obr } from "../../obr/types";
import {
  ASK_FOR_CONFIRMATION_METADATA_ID,
  DESTINATION_ID_METADATA_ID,
  DISABLE_METADATA_ID,
  EXTENSION_ID,
  SPREAD_ID_METADATA_ID,
  SPREAD_RELATIVE,
} from "../../constants";
import createIconUrl from "../../fontAwesome/createIconUrl";
import { contextMenuLabels } from "../../i18n/strings";
import removeDestinations from "../../crud/delete/destination/removeDestinations";
import { Direction, setLinkTarget } from "../../crud/create/link";
import { TOOL_ID } from "../tool/createTool";
import {
  ATTACH_TELEPORT_TOOL_MODE_ID,
  DIRECTION_METADATA_ID,
} from "../tool/createToolModes";
import { Metadata } from "@owlbear-rodeo/sdk";

export const CONTEXT_MENU_VISIBILITY_METADATA_ID = `context-menu-visible`;
export const DEFAULT_CONTEXT_MENU_VISIBILITY = true;

const REMOVE_DESTINATION_CONTEXT_MENU_ID = `${EXTENSION_ID}/contextMenu/remove-destination`;
const ADD_ONE_WAY_TELEPORT_CONTEXT_MENU_ID = `${EXTENSION_ID}/contextMenu/create-one-way-teleport`;
const ADD_TWO_WAY_TELEPORT_CONTEXT_MENU_ID = `${EXTENSION_ID}/contextMenu/create-two-way-teleport`;
const SPREAD_RELATIVE_CONTEXT_MENU_ID = `${EXTENSION_ID}/contextMenu/spread-relative`;
const SPREAD_NONE_CONTEXT_MENU_ID = `${EXTENSION_ID}/contextMenu/spread-none`;
const ENABLE_CONTEXT_MENU_ID = `${EXTENSION_ID}/contextMenu/enable`;
const DISABLE_CONTEXT_MENU_ID = `${EXTENSION_ID}/contextMenu/disable`;
const ASK_FOR_CONFIRMATION_CONTEXT_MENU_ID = `${EXTENSION_ID}/contextMenu/ask`;
const DO_NOT_ASK_FOR_CONFIRMATION_MENU_ID = `${EXTENSION_ID}/contextMenu/dont-ask`;

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
          label: contextMenuLabels.removeDestination,
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
          label: contextMenuLabels.addOneWayTeleport,
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
        await obr.tool.activateMode(TOOL_ID, ATTACH_TELEPORT_TOOL_MODE_ID);
        await obr.tool.setMetadata(TOOL_ID, {
          [DIRECTION_METADATA_ID]: Direction.ONE_WAY,
        });
        await setLinkTarget(obr, context.items[0]);
      },
    }),
    obr.contextMenu.create({
      id: ADD_TWO_WAY_TELEPORT_CONTEXT_MENU_ID,
      icons: [
        {
          icon: createIconUrl("arrows-left-right-solid.svg"),
          label: contextMenuLabels.addTwoWayTeleport,
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
        await obr.tool.activateMode(TOOL_ID, ATTACH_TELEPORT_TOOL_MODE_ID);
        await obr.tool.setMetadata(TOOL_ID, {
          [DIRECTION_METADATA_ID]: Direction.TWO_WAY,
        });
        await setLinkTarget(obr, context.items[0], Direction.TWO_WAY);
      },
    }),

    obr.contextMenu.create({
      id: SPREAD_RELATIVE_CONTEXT_MENU_ID,
      icons: [
        {
          icon: createIconUrl("maximize-solid.svg"),
          label: contextMenuLabels.spreadRelative,
          filter: {
            roles: ["GM"],
            min: 1,
            some: [
              {
                key: ["metadata", SPREAD_ID_METADATA_ID],
                value: undefined,
              },
            ],
          },
        },
      ],
      async onClick(context) {
        await obr.scene.items.updateItems(context.items, (items) => {
          for (const item of items) {
            item.metadata[SPREAD_ID_METADATA_ID] = SPREAD_RELATIVE;
          }
        });
      },
    }),

    obr.contextMenu.create({
      id: SPREAD_NONE_CONTEXT_MENU_ID,
      icons: [
        {
          icon: createIconUrl("minimize-solid.svg"),
          label: contextMenuLabels.spreadNone,
          filter: {
            roles: ["GM"],
            min: 1,
            some: [
              {
                key: ["metadata", SPREAD_ID_METADATA_ID],
                value: undefined,
                operator: "!=",
              },
            ],
          },
        },
      ],
      async onClick(context) {
        await obr.scene.items.updateItems(context.items, (items) => {
          for (const item of items) {
            delete item.metadata[SPREAD_ID_METADATA_ID];
          }
        });
      },
    }),

    obr.contextMenu.create({
      id: ENABLE_CONTEXT_MENU_ID,
      icons: [
        {
          icon: createIconUrl("toggle-off-solid.svg"),
          label: contextMenuLabels.enableTeleport,
          filter: {
            roles: ["GM"],
            min: 1,
            some: [
              {
                key: ["metadata", DESTINATION_ID_METADATA_ID],
                value: undefined,
                operator: "!=",
              },
              {
                key: ["metadata", DISABLE_METADATA_ID],
                value: undefined,
                operator: "!=",
              },
            ],
          },
        },
      ],
      async onClick(context) {
        await obr.scene.items.updateItems(context.items, (items) => {
          for (const item of items) {
            delete item.metadata[DISABLE_METADATA_ID];
          }
        });
      },
    }),

    obr.contextMenu.create({
      id: DISABLE_CONTEXT_MENU_ID,
      icons: [
        {
          icon: createIconUrl("toggle-on-solid.svg"),
          label: contextMenuLabels.disableTeleport,
          filter: {
            roles: ["GM"],
            min: 1,
            some: [
              {
                key: ["metadata", DESTINATION_ID_METADATA_ID],
                value: undefined,
                operator: "!=",
              },
              {
                key: ["metadata", DISABLE_METADATA_ID],
                value: undefined,
              },
            ],
          },
        },
      ],
      async onClick(context) {
        await obr.scene.items.updateItems(context.items, (items) => {
          for (const item of items) {
            item.metadata[DISABLE_METADATA_ID] = true;
          }
        });
      },
    }),

    obr.contextMenu.create({
      id: ASK_FOR_CONFIRMATION_CONTEXT_MENU_ID,
      icons: [
        {
          icon: createIconUrl("comment-solid.svg"),
          label: contextMenuLabels.automagicTeleport,
          filter: {
            roles: ["GM"],
            min: 1,
            some: [
              {
                key: ["metadata", DESTINATION_ID_METADATA_ID],
                value: undefined,
                operator: "!=",
              },
              {
                key: ["metadata", ASK_FOR_CONFIRMATION_METADATA_ID],
                value: undefined,
                operator: "!=",
              },
            ],
          },
        },
      ],
      async onClick(context) {
        await obr.scene.items.updateItems(context.items, (items) => {
          for (const item of items) {
            delete item.metadata[ASK_FOR_CONFIRMATION_METADATA_ID];
          }
        });
      },
    }),

    obr.contextMenu.create({
      id: DO_NOT_ASK_FOR_CONFIRMATION_MENU_ID,
      icons: [
        {
          icon: createIconUrl("comment-slash-solid.svg"),
          label: contextMenuLabels.confirmTeleport,
          filter: {
            roles: ["GM"],
            min: 1,
            some: [
              {
                key: ["metadata", DESTINATION_ID_METADATA_ID],
                value: undefined,
                operator: "!=",
              },
              {
                key: ["metadata", ASK_FOR_CONFIRMATION_METADATA_ID],
                value: undefined,
              },
            ],
          },
        },
      ],
      async onClick(context) {
        await obr.scene.items.updateItems(context.items, (items) => {
          for (const item of items) {
            item.metadata[ASK_FOR_CONFIRMATION_METADATA_ID] = true;
          }
        });
      },
    }),
  ]);
}

async function removeContextMenu(obr: Obr) {
  await Promise.all([
    obr.contextMenu.remove(REMOVE_DESTINATION_CONTEXT_MENU_ID),
    obr.contextMenu.remove(ADD_ONE_WAY_TELEPORT_CONTEXT_MENU_ID),
    obr.contextMenu.remove(ADD_TWO_WAY_TELEPORT_CONTEXT_MENU_ID),
    obr.contextMenu.remove(SPREAD_RELATIVE_CONTEXT_MENU_ID),
    obr.contextMenu.remove(SPREAD_NONE_CONTEXT_MENU_ID),
    obr.contextMenu.remove(ENABLE_CONTEXT_MENU_ID),
    obr.contextMenu.remove(DISABLE_CONTEXT_MENU_ID),
    obr.contextMenu.remove(ASK_FOR_CONFIRMATION_CONTEXT_MENU_ID),
    obr.contextMenu.remove(DO_NOT_ASK_FOR_CONFIRMATION_MENU_ID),
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
