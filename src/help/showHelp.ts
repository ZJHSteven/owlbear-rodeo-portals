import { errors } from "../i18n/strings";

export default function showHelp(storeUrl: string) {
  const popup = window.open(storeUrl, "_blank");
  if (!popup || popup.closed === undefined || popup.closed) {
    throw errors.popupBlocked;
  }
}
