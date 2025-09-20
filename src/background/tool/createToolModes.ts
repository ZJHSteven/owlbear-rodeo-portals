import { Obr } from "../../obr/types";
import { TOOL_ID } from "./createTool";
import createIconUrl from "../../fontAwesome/createIconUrl";
import { labels, notifications } from "../../i18n/strings";
import {
  Direction,
  resetLink,
  setLinkTarget,
  updateLinkIndicator,
} from "../../crud/create/link";
import {
  resetImage,
  setImagePosition,
  updateImageIndicator,
} from "../../crud/create/image";

export const ATTACH_TELEPORT_TOOL_MODE_ID = `${TOOL_ID}/mode/attach-teleport`;
export const CREATE_TELEPORT_TOOL_MODE_ID = `${TOOL_ID}/mode/create-teleport`;

export const DIRECTION_METADATA_ID = "direction";
export const DEFAULT_DIRECTION = Direction.ONE_WAY;

export default async function createToolModes(obr: Obr) {
  await Promise.all([
    obr.tool.createMode({
      id: ATTACH_TELEPORT_TOOL_MODE_ID,
      icons: [
        {
          icon: createIconUrl("link-solid.svg"),
          label: labels.attachMode,
          filter: { activeTools: [TOOL_ID], roles: ["GM"] },
        },
      ],
      cursors: [{ cursor: "crosshair" }],
      async onToolClick({ metadata }, event) {
        await handlePromise(
          setLinkTarget(
            obr,
            event.target,
            metadata[DIRECTION_METADATA_ID] as Direction,
          ),
        );
      },
      async onToolMove({ metadata }, event) {
        await updateLinkIndicator(
          obr,
          event.pointerPosition,
          metadata[DIRECTION_METADATA_ID] as Direction,
          event.target,
        );
      },
      async onKeyDown(context, event) {
        if (event.key === "Escape") {
          await resetLink(obr);
        }
      },
      async onDeactivate() {
        await resetLink(obr);
      },
    }),

    obr.tool.createMode({
      id: CREATE_TELEPORT_TOOL_MODE_ID,
      icons: [
        {
          icon: createIconUrl("image-solid.svg"),
          label: labels.createMode,
          filter: { activeTools: [TOOL_ID], roles: ["GM"] },
        },
      ],
      cursors: [{ cursor: "crosshair" }],
      async onToolClick({ metadata }, event) {
        await handlePromise(
          setImagePosition(
            obr,
            event.pointerPosition,
            metadata[DIRECTION_METADATA_ID] as Direction,
          ),
        );
      },
      async onToolMove(context, event) {
        await updateImageIndicator(obr, event.pointerPosition);
      },
      async onKeyDown(context, event) {
        if (event.key === "Escape") {
          await resetImage(obr);
        }
      },
      async onDeactivate() {
        await resetImage(obr);
      },
    }),
  ]);

  async function handlePromise(promise: Promise<boolean | void>) {
    return promise
      .then((done) => {
        if (done) {
          obr.notification.show(notifications.linkCreated, "SUCCESS");
        }
      })
      .catch((error) => {
        obr.notification.show(error, "WARNING");
      });
  }
}
