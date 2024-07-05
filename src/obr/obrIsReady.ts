import OBR from "@owlbear-rodeo/sdk";
import { Obr } from "./types";

if (location.hostname === "localhost") {
  (window as any).OBR = OBR;
}

export default async function obrIsReady(): Promise<Obr> {
  if (!OBR.isAvailable) {
    return Promise.reject("OBR is not available");
  }

  if (OBR.isReady) {
    return Promise.resolve(OBR);
  }

  return new Promise<Obr>((resolve) => {
    OBR.onReady(() => resolve(OBR));
  });
}
