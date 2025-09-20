import { Obr } from "../../../../obr/types";
import { Extension } from "../../../../extension/fetchExtension";
import { TOOL_ID } from "../../createTool";
import createIconUrl from "../../../../fontAwesome/createIconUrl";
import { labels, notifications } from "../../../../i18n/strings";
import showHelp from "../../../../help/showHelp";

export async function createHelpAction(obr: Obr, { storeUrl }: Extension) {
  return obr.tool.createAction({
    id: `${TOOL_ID}/action/help`,
    icons: [
      {
        icon: createIconUrl("circle-question-solid.svg"),
        label: labels.openHelp,
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
        await obr.notification.show(notifications.helpOpenFailed(error), "ERROR");
      }
    },
  });
}
