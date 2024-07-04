import OBR, {Metadata, Theme} from "@owlbear-rodeo/sdk";
import {EXTENSION_ID} from "./constants";
import getText from "./obr/scene/items/getText";
import "./theme.css";
import updateView from "./followTokensPopover/updateView";

export const FOLLOW_TOKENS_POPOVER_ID = `${EXTENSION_ID}/popover/follow-tokens`;
export const LATEST_TELEPORT_IDS_METADATA_ID = `${EXTENSION_ID}/latest-teleport-ids`;

if (location.hostname === "localhost") {
  (window as any).OBR = OBR;
}

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

function setProperty(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}

OBR.onReady(async () => {
  const theme = await OBR.theme.getTheme();
  const obr = {...OBR, theme};
  OBR.theme.onChange((theme) => obr.theme = theme);

  applyTheme(theme);
  OBR.theme.onChange(applyTheme);

  async function handleSceneIsReady() {
    const metadata = await obr.scene.getMetadata();
    await updateView(obr, metadata);
    obr.scene.onMetadataChange(metadata => updateView(obr, metadata));
  }

  const isSceneReady = await obr.scene.isReady();
  if (isSceneReady) {
    await handleSceneIsReady();
  }

  obr.scene.onReadyChange(async (isReady) => {
    if (isReady) {
      await handleSceneIsReady();
    }
  })
});
