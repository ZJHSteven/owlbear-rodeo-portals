const BASE_URL = location.toString();

export default function createUrl(path: string): string {
  return new URL(path, BASE_URL).toString();
}
