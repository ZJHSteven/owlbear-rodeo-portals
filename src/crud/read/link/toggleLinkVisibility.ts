import { Obr } from "../../../obr/types";
import { Metadata } from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../../../background/tool/createTool";

export const LINK_VISIBILITY_METADATA_ID = "links-visible";

const EVENT_TARGET = new EventTarget();

export default async function toggleLinkVisibility(
  obr: Obr,
  metadata: Metadata,
) {
  const linkVisibility = !metadata[LINK_VISIBILITY_METADATA_ID];
  await obr.tool.setMetadata(TOOL_ID, {
    [LINK_VISIBILITY_METADATA_ID]: linkVisibility,
  });

  EVENT_TARGET.dispatchEvent(
    new CustomEvent("change", {
      detail: linkVisibility,
    }),
  );
}

export function onLinkVisibilityChange(callback) {
  return EVENT_TARGET.addEventListener("change", callback);
}
