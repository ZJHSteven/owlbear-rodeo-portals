import OBR from "@owlbear-rodeo/sdk";
import setUp from "./setUp";

if (location.hostname === "localhost") {
  (window as any).OBR = OBR;
}

OBR.onReady(async () => {
  const theme = await OBR.theme.getTheme();
  const obr = {...OBR, theme};
  OBR.theme.onChange((theme) => obr.theme = theme);

  return setUp(obr);
});
