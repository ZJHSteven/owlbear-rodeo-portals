import { Obr } from "../../../obr/types";
import { TOOL_ID } from "../createTool";
import createIconUrl from "../../../fontAwesome/createIconUrl";
import { labels } from "../../../i18n/strings";
import {
  CONTEXT_MENU_VISIBILITY_METADATA_ID,
  toggleContextMenuVisibility,
} from "../../contextMenu/updateContextMenu";

export async function createToggleContextMenuVisibilityAction(obr: Obr) {
  await obr.tool.createAction({
    id: `${TOOL_ID}/action/toggle-context-menu-visibility`,
    icons: [
      {
        icon: createIconUrl("wand-magic-solid.svg"),
        label: labels.toggleContextMenuShow,
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
        label: labels.toggleContextMenuHide,
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
