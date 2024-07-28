import { Obr } from "../../../obr/types";
import { TOOL_ID } from "../createTool";
import createIconUrl from "../../../fontAwesome/createIconUrl";
import toggleLinkVisibility, {
  LINK_VISIBILITY_METADATA_ID,
} from "../../../crud/read/link/toggleLinkVisibility";

export async function createToggleLinkVisibilityAction(obr: Obr) {
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
