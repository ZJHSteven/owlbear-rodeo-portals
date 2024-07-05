import { Obr } from "../../obr/types";
import { TOOL_ID } from "./createTool";
import createIconUrl from "../../fontAwesome/createIconUrl";
import {
  Direction,
  reset,
  setTarget,
  updateIndicator,
} from "../../crud/create/create";

export const ADD_ONE_WAY_TELEPORT_TOOL_MODE_ID = `${TOOL_ID}/mode/add-one-way-teleport`;
export const ADD_TWO_WAY_TELEPORT_TOOL_MODE_ID = `${TOOL_ID}/mode/add-two-way-teleport`;

export default async function createToolModes(obr: Obr) {
  await Promise.all([
    obr.tool.createMode({
      id: ADD_ONE_WAY_TELEPORT_TOOL_MODE_ID,
      icons: [
        {
          icon: createIconUrl("arrow-right-solid.svg"),
          label: "Add One-Way Teleport",
          filter: { activeTools: [TOOL_ID], roles: ["GM"] },
        },
      ],
      cursors: [{ cursor: "crosshair" }],
      async onToolClick(context, event) {
        await handleSetTarget(setTarget(obr, event.target));
      },
      async onToolMove(context, event) {
        await updateIndicator(obr, event.pointerPosition);
      },
      async onKeyDown(context, event) {
        if (event.key === "Escape") {
          await reset(obr);
        }
      },
      async onDeactivate() {
        await reset(obr);
      },
    }),

    obr.tool.createMode({
      id: ADD_TWO_WAY_TELEPORT_TOOL_MODE_ID,
      icons: [
        {
          icon: createIconUrl("arrows-left-right-solid.svg"),
          label: "Add Two-Way Teleport",
          filter: { activeTools: [TOOL_ID], roles: ["GM"] },
        },
      ],
      cursors: [{ cursor: "crosshair" }],
      async onToolClick(context, event) {
        await handleSetTarget(setTarget(obr, event.target, Direction.TWO_WAY));
      },
      async onToolMove(context, event) {
        await updateIndicator(obr, event.pointerPosition, Direction.TWO_WAY);
      },
      async onKeyDown(context, event) {
        if (event.key === "Escape") {
          await reset(obr);
        }
      },
      async onDeactivate() {
        await reset(obr);
      },
    }),
  ]);

  async function handleSetTarget(promise: Promise<boolean | void>) {
    return promise
      .then((done) => {
        if (done) {
          obr.notification.show("Link has been created.", "SUCCESS");
        }
      })
      .catch((error) => {
        obr.notification.show(error, "WARNING");
      });
  }
}
