import { Obr } from "../../../../obr/types";
import { Extension } from "../../../../extension/fetchExtension";
import { TOOL_ID } from "../../createTool";
import createIconUrl from "../../../../fontAwesome/createIconUrl";
import { dateTimeFormatter } from "../../../../i18n/format/dateTime";

export async function createInfoAction(obr: Obr, extension: Extension) {
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
      await obr.notification.show(
        `${extension.name} ${extension.version} (${dateTimeFormatter.format(extension.buildDateTime)})`,
        "DEFAULT",
      );
    },
  });
}
