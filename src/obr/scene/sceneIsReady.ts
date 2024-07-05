import { Obr } from "../types";

export default async function sceneIsReady(obr: Obr) {
  if (await obr.scene.isReady()) {
    return Promise.resolve(obr.scene);
  }

  return new Promise((resolve) => {
    const unsubscribe = obr.scene.onReadyChange((isReady) => {
      if (isReady) {
        unsubscribe();
        resolve(obr.scene);
      }
    });
  });
}
