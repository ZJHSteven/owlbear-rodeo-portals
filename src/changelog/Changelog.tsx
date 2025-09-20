import { useState } from "react";
import fetchExtension, { Extension } from "../extension/fetchExtension";
import Commits from "./Commits";
import usePromise from "../react/hook/usePromise";
import { changelogText } from "../i18n/strings";

export default function Changelog() {
  const [extension, setExtension] = useState<Extension | undefined>(undefined);
  usePromise(fetchExtension, setExtension);
  if (extension === undefined) {
    return changelogText.loading;
  }

  return (
    <>
      <h1>{extension.name}</h1>
      <h2>{changelogText.title}</h2>
      <Commits
        projectId={extension.gitLab.projectId}
        installedId={extension.git.id}
      />
    </>
  );
}
