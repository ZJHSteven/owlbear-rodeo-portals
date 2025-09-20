import { ImageDownload } from "@owlbear-rodeo/sdk";
import { Obr } from "../../../obr/types";
import { TOOL_ID } from "../createTool";
import createIconUrl from "../../../fontAwesome/createIconUrl";
import { labels } from "../../../i18n/strings";

let originImage: ImageDownload | undefined = undefined;
let destinationImage: ImageDownload | undefined = undefined;

export function getOriginImage() {
  return originImage;
}

export function getDestinationImage() {
  return destinationImage;
}

export default async function createSetImageActions(obr: Obr) {
  await Promise.all([
    createSetImageAction(obr, "origin"),
    createSetImageAction(obr, "destination"),
  ]);
}

async function createSetImageAction(obr: Obr, side: "origin" | "destination") {
  await obr.tool.createAction({
    id: `${TOOL_ID}/action/set-image/${side}`,
    icons: [
      {
        label: side === "origin" ? labels.setImageOrigin : labels.setImageDestination,
        icon: createIconUrl(
          side === "origin"
            ? "arrow-right-from-bracket-solid.svg"
            : "arrow-right-to-bracket-solid.svg",
        ),
        filter: {
          activeTools: [TOOL_ID],
          roles: ["GM"],
        },
      },
    ],
    async onClick() {
      const images = await obr.assets.downloadImages(false, undefined, "PROP");
      if (images.length === 0) {
        return;
      }

      if (side === "origin") {
        originImage = images[0];
      } else {
        destinationImage = images[0];
      }
    },
  });
}
