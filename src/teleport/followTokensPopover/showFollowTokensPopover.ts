import { FOLLOW_TOKENS_POPOVER_ID } from "./followTokensPopover";
import createUrl from "./createUrl";
import { Obr } from "./obr/types";

export default async function showFollowTokensPopover(obr: Obr) {
  await obr.popover.open({
    id: FOLLOW_TOKENS_POPOVER_ID,
    url: createUrl("followTokensPopover.html"),
    width: 320,
    height: 240,
  });
}
