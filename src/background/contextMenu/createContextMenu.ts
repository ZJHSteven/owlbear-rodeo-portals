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

export default async function createContextMenu(obr: Obr) {
  await Promise.all([
    obr.contextMenu.create({
      id: `${EXTENSION_ID}/contextMenu/remove-destination`,
      icons: [
        {
          icon: createIconUrl("trash-can-regular.svg"),
          label: "Remove Destination",
          filter: {
            roles: ["GM"],
            every: [
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
      id: `${EXTENSION_ID}/contextMenu/create-one-way-teleport`,
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
      id: `${EXTENSION_ID}/contextMenu/create-two-way-teleport`,
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
