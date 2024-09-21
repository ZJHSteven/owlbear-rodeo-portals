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
      const validationResults = await checkIntegrity(obr);
      if (validationResults.length === 0) {
        await obr.notification.show("Everything seems ok.", "INFO");
        return;
      }

      validationResults.forEach(({ offendingItem, level, message }) => {
        if (level === "warning") {
          console.warn(message, offendingItem.id, offendingItem);
          return;
        }

        console.error(message, offendingItem.id, offendingItem);
      });

      alert(
        validationResults
          .map(({ level, message }) => `${getLevelEmoji(level)} ${message}`)
          .join("\n"),
      );
    },
  });
}

function getLevelEmoji(level: "error" | "warning") {
  switch (level) {
    case "error":
      return "❗";
    case "warning":
      return "⚠️";
  }
}
