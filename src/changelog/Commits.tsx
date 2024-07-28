import { Fragment, useContext, useState } from "react";
import { Commit, listCommits } from "./gitLab/commits";
import { dateTimeFormatter } from "../i18n/format/dateTime";
import usePromise from "../react/hook/usePromise";
import { obrContext } from "../obr/ObrContextProvider";
import { EXTENSION_ID } from "../constants";
import * as styles from "./commits.css";

type Props = {
  projectId: number;
  installedId: string;
};

const READ_ID_METADATA_ID = `${EXTENSION_ID}/changelog/read-git-id`;

export default function Commits({ projectId, installedId }: Readonly<Props>) {
  const [commits, setCommits] = useState<Commit[] | undefined>(undefined);
  const [hasNext, setHasNext] = useState(false);
  const [readId, setReadId] = useState<string | undefined>(undefined);
  const obr = useContext(obrContext);

  usePromise(
    async () =>
      Promise.all([
        listCommits(projectId),
        obr?.room
          .getMetadata()
          .then((metadata) => metadata[READ_ID_METADATA_ID] as string),
      ]),
    ([commits, readId]) => {
      setCommits(commits.payload);
      setHasNext(commits.pagination.hasNext);
      setReadId(readId);
      obr?.room.setMetadata({ [READ_ID_METADATA_ID]: commits.payload[0].id });
    },
  );

  if (commits === undefined) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <dl className={styles.commits}>
        {renderCommits(commits, installedId, readId)}
      </dl>
      {renderHasNext(hasNext)}
    </>
  );
}

function renderCommits(
  commits: Commit[],
  installedId: string,
  readId?: string,
) {
  let foundInstalledId = false;
  let foundReadId = false;

  return commits.map((commit) => {
    if (!foundInstalledId) {
      foundInstalledId = commit.id === installedId;
    }

    if (!foundReadId) {
      foundReadId = readId === undefined ? true : commit.id === readId;
    }

    const isUpdateAvailable = !foundInstalledId;
    const isUnread = !foundReadId;
    return renderCommit(commit, isUpdateAvailable, isUnread);
  });
}

const FEAT_OR_FIX = /^(feat|fix)(\([^:]+\))?:/;

function renderCommit(
  commit: Commit,
  isUpdateAvailable: boolean,
  isUnread: boolean,
) {
  const isRelevant = FEAT_OR_FIX.test(commit.title);
  return (
    <Fragment key={commit.id}>
      <dt className={isRelevant ? undefined : styles.irrelevant}>
        {renderUpdateAvailable(isUpdateAvailable)}
        {renderUnread(isUnread)}
        {dateTimeFormatter.format(new Date(commit.committed_date))}{" "}
        {commit.title}
      </dt>
      {renderCommitMessage(commit, isRelevant)}
    </Fragment>
  );
}

function renderUpdateAvailable(isUpdateAvailable: boolean) {
  if (isUpdateAvailable) {
    return "Update available: ";
  }
}

function renderUnread(isUnread: boolean) {
  if (isUnread) {
    return "New: ";
  }
}

function renderCommitMessage(commit: Commit, isRelevant: boolean) {
  if (commit.message.trim() === commit.title.trim()) {
    return;
  }

  return (
    <dd className={isRelevant ? undefined : styles.irrelevant}>
      {commit.message}
    </dd>
  );
}

function renderHasNext(hasNext: boolean) {
  if (hasNext) {
    return <p>There are older changelog entries, which are not shown here.</p>;
  }
}
