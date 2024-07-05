import { Obr } from "../../../obr/types";
import { Metadata } from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../../../background/tool/createTool";

export const LINK_VISIBILITY_METADATA_ID = "links-visible";

type Callback = (linkVisibility: boolean) => void;
const listeners: Callback[] = [];

export default async function toggleLinkVisibility(
  obr: Obr,
  metadata: Metadata,
) {
  const linkVisibility = !metadata[LINK_VISIBILITY_METADATA_ID];
  await obr.tool.setMetadata(TOOL_ID, {
    [LINK_VISIBILITY_METADATA_ID]: linkVisibility,
  });

  dispatch(linkVisibility);
}

export function onLinkVisibilityChange(callback: Callback) {
  listeners.push(callback);
}

function dispatch(linkVisibility: boolean) {
  listeners.forEach((listener) => listener(linkVisibility));
}
