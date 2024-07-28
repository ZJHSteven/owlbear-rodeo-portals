import { Obr } from "../../../obr/types";
import fetchExtension from "../../../extension/fetchExtension";
import { createHelpAction } from "./meta/help";
import { createInfoAction } from "./meta/info";
import { createChangelogAction } from "./meta/changelog";

export async function createMetaActions(obr: Obr) {
  const extension = await fetchExtension();
  return Promise.all([
    createHelpAction(obr, extension),
    createInfoAction(obr, extension),
    createChangelogAction(obr),
  ]);
}
