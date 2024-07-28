import { Obr } from "../../obr/types";
import { TOOL_ID } from "./createTool";
import createIconUrl from "../../fontAwesome/createIconUrl";
import {
  Direction,
  reset,
  setTarget,
  updateIndicator,
} from "../../crud/create/create";

export const ATTACH_TELEPORT_TOOL_MODE_ID = `${TOOL_ID}/mode/attach-teleport`;

export const DIRECTION_METADATA_ID = "direction";
export const DEFAULT_DIRECTION = Direction.ONE_WAY;

export default async function createToolModes(obr: Obr) {
  await Promise.all([
    obr.tool.createMode({
      id: ATTACH_TELEPORT_TOOL_MODE_ID,
      icons: [
        {
          icon: createIconUrl("link-solid.svg"),
          label: "Attach Teleport",
          filter: { activeTools: [TOOL_ID], roles: ["GM"] },
        },
      ],
      cursors: [{ cursor: "crosshair" }],
      async onToolClick({ metadata }, event) {
        await handleSetTarget(
          setTarget(
            obr,
            event.target,
            metadata[DIRECTION_METADATA_ID] as Direction,
          ),
        );
      },
      async onToolMove({ metadata }, event) {
        await updateIndicator(
          obr,
          event.pointerPosition,
          metadata[DIRECTION_METADATA_ID] as Direction,
          event.target,
        );
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
