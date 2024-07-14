import createUrl from "./createUrl";

export type Extension = {
  name: string;
  version: string;
  buildDateTime: Date;
  storeUrl: string;
};

type About = {
  build_date_time: string;
  store_url: string;
};

type Manifest = {
  name: string;
  version: string;
};

export default async function fetchExtension(): Promise<Extension> {
  const [about, manifest] = await Promise.all([fetchAbout(), fetchManifest()]);

  return {
    name: manifest.name,
    version: manifest.version,
    buildDateTime: new Date(about.build_date_time),
    storeUrl: about.store_url,
  };
}

async function fetchAbout(): Promise<About> {
  return fetchJson("about.json");
}

async function fetchManifest(): Promise<Manifest> {
  return fetchJson("manifest.json");
}

async function fetchJson(url: string) {
  return fetch(createUrl(url)).then((response) => response.json());
}
