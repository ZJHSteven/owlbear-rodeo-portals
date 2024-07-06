import { Obr } from "../../../obr/types";
import { Metadata } from "@owlbear-rodeo/sdk";
import { TOOL_ID } from "../../../background/tool/createTool";
import { Callback } from "../../../types";

export const LINK_VISIBILITY_METADATA_ID = "links-visible";

const callbacks: Callback<boolean>[] = [];

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

export function onLinkVisibilityChange(callback: Callback<boolean>) {
  callbacks.push(callback);
}

function dispatch(linkVisibility: boolean) {
  callbacks.forEach((callback) => callback(linkVisibility));
}
