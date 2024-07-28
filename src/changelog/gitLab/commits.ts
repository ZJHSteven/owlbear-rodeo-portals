type GitLabResponse<PAYLOAD> = {
  payload: PAYLOAD;
  pagination: {
    hasNext: boolean;
  };
};

export type Commit = {
  id: string;
  title: string;
  committed_date: string;
  message: string;
};

export async function listCommits(
  projectId: number,
): Promise<GitLabResponse<Commit[]>> {
  const response = await fetch(
    `https://gitlab.com/api/v4/projects/${projectId}/repository/commits`,
  );
  const links = parseLink(response);
  const payload = await response.json();
  return {
    payload,
    pagination: {
      hasNext: links.some(({ relation }) => relation === "next"),
    },
  };
}

function parseLink(response: Response) {
  const header = response.headers.get("link");
  if (header === null) {
    return [];
  }

  return header.split(",").map(parseLinkValue);
}

function parseLinkValue(header: string) {
  const parts = header.split(";");
  const url = parts[0].substring(1, parts[0].length - 1);
  const relation = parts
    .slice(1)
    .map(parseParameter)
    .find(({ key }) => key === "rel");

  return { url, relation: relation?.value };
}

function parseParameter(parameter: string) {
  const [key, value] = parameter.trim().split("=", 2);
  return { key, value: value.substring(1, value.length - 1) };
}
