import { Obr } from "../../obr/types";
import { TOOL_ID } from "./createTool";
import createIconUrl from "../../fontAwesome/createIconUrl";
import toggleLinkVisibility, {
  LINK_VISIBILITY_METADATA_ID,
} from "../../crud/read/link/toggleLinkVisibility";
import {
  CONTEXT_MENU_VISIBILITY_METADATA_ID,
  toggleContextMenuVisibility,
} from "../contextMenu/updateContextMenu";
import checkIntegrity from "../../teleport/checkIntegrity";
import fetchExtension, { Extension } from "../../extension/fetchExtension";
import showHelp from "../../help/showHelp";

export default async function createToolActions(obr: Obr) {
  await Promise.all([
    createToggleLinkVisibilityAction(obr),
    createToggleContextMenuVisibilityAction(obr),
    createCheckPortalsAction(obr),
    createMetaActions(obr),
  ]);
}

async function createToggleLinkVisibilityAction(obr: Obr) {
  return obr.tool.createAction({
    id: `${TOOL_ID}/action/toggle-link-visibility`,
    icons: [
      {
        icon: createIconUrl("eye-slash-regular.svg"),
        label: "Show Links",
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
          metadata: [
            {
              key: LINK_VISIBILITY_METADATA_ID,
              value: false,
            },
          ],
        },
      },
      {
        icon: createIconUrl("eye-regular.svg"),
        label: "Hide Links",
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
          metadata: [
            {
              key: LINK_VISIBILITY_METADATA_ID,
              value: true,
            },
          ],
        },
      },
    ],
    async onClick(context) {
      await toggleLinkVisibility(obr, context.metadata);
    },
  });
}

async function createToggleContextMenuVisibilityAction(obr: Obr) {
  return obr.tool.createAction({
    id: `${TOOL_ID}/action/toggle-context-menu-visibility`,
    icons: [
      {
        icon: createIconUrl("wand-magic-solid.svg"),
        label: "Show Context Menu Entries",
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
          metadata: [
            {
              key: CONTEXT_MENU_VISIBILITY_METADATA_ID,
              value: false,
            },
          ],
        },
      },
      {
        icon: createIconUrl("wand-magic-sparkles-solid.svg"),
        label: "Hide Context Menu Entries",
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
          metadata: [
            {
              key: CONTEXT_MENU_VISIBILITY_METADATA_ID,
              value: true,
            },
          ],
        },
      },
    ],
    async onClick(context) {
      await toggleContextMenuVisibility(obr, context.metadata);
    },
  });
}

async function createCheckPortalsAction(obr: Obr) {
  return obr.tool.createAction({
    id: `${TOOL_ID}/action/check-portals-integrity`,
    icons: [
      {
        icon: createIconUrl("list-check-solid.svg"),
        label: "Check Portals Integrity",
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
        },
      },
    ],
    async onClick() {
      const errors = await checkIntegrity(obr);
      if (errors.length === 0) {
        await obr.notification.show("Everything seems ok.", "INFO");
        return;
      }

      errors.forEach(({ offendingItem, error }) => {
        console.error(error, offendingItem.id, offendingItem);
      });

      await obr.notification.show(
        `There are errors: ${errors.map(({ error }) => error).join("\n")}`,
        "ERROR",
      );
    },
  });
}

async function createMetaActions(obr: Obr) {
  const extension = await fetchExtension();
  return Promise.all([
    createHelpAction(obr, extension),
    createInfoAction(obr, extension),
  ]);
}

async function createHelpAction(obr: Obr, { storeUrl }: Extension) {
  return obr.tool.createAction({
    id: `${TOOL_ID}/action/help`,
    icons: [
      {
        icon: createIconUrl("circle-question-solid.svg"),
        label: "Open Help (Popup)",
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
        },
      },
    ],
    async onClick() {
      try {
        showHelp(storeUrl);
      } catch (error) {
        await obr.notification.show(`Could not open help: ${error}`, "ERROR");
      }
    },
  });
}

async function createInfoAction(obr: Obr, extension: Extension) {
  return obr.tool.createAction({
    id: `${TOOL_ID}/action/info`,
    icons: [
      {
        icon: createIconUrl("circle-info-solid.svg"),
        label: "Show Extension Information",
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
        },
      },
    ],
    async onClick() {
      const formatter = new Intl.DateTimeFormat(undefined, {
        dateStyle: "short",
        timeStyle: "short",
      });

      await obr.notification.show(
        `${extension.name} ${extension.version} (${formatter.format(extension.buildDateTime)})`,
        "DEFAULT",
      );
    },
  });
}
