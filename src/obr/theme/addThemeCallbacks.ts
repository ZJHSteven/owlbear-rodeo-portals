import applyTheme from "./applyTheme";
import { Obr } from "../types";

export default async function addThemeCallbacks(obr: Obr) {
  obr.theme.onChange(applyTheme);
}
