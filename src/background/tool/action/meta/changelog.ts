import { Obr } from "../../../../obr/types";
import { TOOL_ID } from "../../createTool";
import createIconUrl from "../../../../fontAwesome/createIconUrl";
import { labels } from "../../../../i18n/strings";
import { EXTENSION_ID } from "../../../../constants";
import createUrl from "../../../../extension/createUrl";

export async function createChangelogAction(obr: Obr) {
  return obr.tool.createAction({
    id: `${TOOL_ID}/action/changelog`,
    icons: [
      {
        icon: createIconUrl("newspaper-solid.svg"),
        label: labels.showChangelog,
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
        },
      },
    ],
    async onClick() {
      await obr.popover.open({
        id: `${EXTENSION_ID}/popover/changelog`,
        url: createUrl("changelog.html"),
        width: 500,
        height: 300,
        hidePaper: true,
      });
    },
  });
}
