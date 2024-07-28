import { Obr } from "../../../obr/types";
import { TOOL_ID } from "../createTool";
import createIconUrl from "../../../fontAwesome/createIconUrl";
import checkIntegrity from "../../../teleport/checkIntegrity";

export async function createCheckPortalsAction(obr: Obr) {
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
