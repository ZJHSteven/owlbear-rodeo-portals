import { Obr } from "../types";

export default async function sceneIsReady(obr: Obr) {
  if (await obr.scene.isReady()) {
    return;
  }

  return new Promise<void>((resolve) => {
    const unsubscribe = obr.scene.onReadyChange((isReady) => {
      if (isReady) {
        unsubscribe();
        resolve();
      }
    });
  });
}
