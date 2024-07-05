import {Theme} from "@owlbear-rodeo/sdk";
import {EXTENSION_ID} from "./constants";
import "./theme.css";
import updateView from "./followTokensPopover/updateView";
import sceneIsReady from "./obr/scene/sceneIsReady";
import obrIsReady from "./obr/obrIsReady";
import setProperty from "./css/setProperty";

export const FOLLOW_TOKENS_POPOVER_ID = `${EXTENSION_ID}/popover/follow-tokens`;
export const LATEST_TELEPORT_IDS_METADATA_ID = `${EXTENSION_ID}/latest-teleport-ids`;

function applyTheme(theme: Theme) {
  setProperty("--theme-primary-main", theme.primary.main);
  setProperty("--theme-primary-light", theme.primary.light);
  setProperty("--theme-primary-dark", theme.primary.dark);
  setProperty("--theme-primary-contrast-text", theme.primary.contrastText);

  setProperty("--theme-secondary-main", theme.secondary.main);
  setProperty("--theme-secondary-light", theme.secondary.light);
  setProperty("--theme-secondary-dark", theme.secondary.dark);
  setProperty("--theme-secondary-contrast-text", theme.secondary.contrastText);

  setProperty("--theme-background-default", theme.background.default);
  setProperty("--theme-background-paper", theme.background.paper);

  setProperty("--theme-text-primary", theme.text.primary);
  setProperty("--theme-text-secondary", theme.text.secondary);
  setProperty("--theme-text-disabled", theme.text.disabled);
}

const obr = await obrIsReady();
const scene = await sceneIsReady(obr);

const metadata = await scene.getMetadata();
await updateView(obr, metadata);
scene.onMetadataChange(metadata => updateView(obr, metadata));
