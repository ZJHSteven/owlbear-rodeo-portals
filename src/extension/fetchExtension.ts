import createUrl from "./createUrl";

export type Extension = {
  name: string;
  description: string;
  version: string;
  buildDateTime: Date;
  storeUrl: string;
  gitLab: {
    projectId: number;
  };
  git: {
    id: string;
  };
};

type About = {
  build_date_time: string;
  store_url: string;
  git_lab: {
    project_id: number;
  };
  git: {
    id: string;
  };
};

type Manifest = {
  name: string;
  description: string;
  version: string;
};

export default async function fetchExtension(): Promise<Extension> {
  const [about, manifest] = await Promise.all([fetchAbout(), fetchManifest()]);

  return {
    name: manifest.name,
    description: manifest.description,
    version: manifest.version,
    buildDateTime: new Date(about.build_date_time),
    storeUrl: about.store_url,
    gitLab: {
      projectId: about.git_lab.project_id,
    },
    git: {
      id: about.git.id,
    },
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
