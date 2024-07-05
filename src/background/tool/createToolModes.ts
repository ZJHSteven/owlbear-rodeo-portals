import {Obr} from "../../obr/types";
import {TOOL_ID} from "./createTool";
import createIconUrl from "../../fontAwesome/createIconUrl";

export default async function createToolModes(obr: Obr) {
  await Promise.all([
    obr.tool.createMode({
      id: `${TOOL_ID}/mode/add-one-way-teleport`,
      icons: [
        {
          icon: createIconUrl("arrow-right-solid.svg"),
          label: "Add One-Way Teleport",
          filter: {activeTools: [TOOL_ID], roles: ["GM"]}
        }
      ],
      cursors: [{cursor: "crosshair"}],
      onToolClick(context, event) {
      },
      onToolMove(context, event) {
      },
      onKeyDown(context, event) {
      },
      onDeactivate() {
      },
    }),

    obr.tool.createMode({
      id: `${TOOL_ID}/mode/add-two-way-teleport`,
      icons: [
        {
          icon: createIconUrl("arrows-left-right-solid.svg"),
          label: "Add Two-Way Teleport",
          filter: {activeTools: [TOOL_ID], roles: ["GM"]}
        }
      ],
      cursors: [{cursor: "crosshair"}],
      onToolClick(context, event) {
      },
      onToolMove(context, event) {
      },
      onKeyDown(context, event) {
      },
      onDeactivate() {
      },
    })
  ]);
}
