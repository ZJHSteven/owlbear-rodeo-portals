export default function showHelp(storeUrl: string) {
  const popup = window.open(storeUrl, "_blank");
  if (!popup || popup.closed === undefined || popup.closed) {
    throw `popup blocked`;
  }
}
