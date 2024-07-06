import HasRole from "../../obr/player/HasRole";
import { Player } from "@owlbear-rodeo/sdk";
import SkeletonList from "../../ui/skeleton/SkeletonList";
import Role from "../../obr/player/Role";
import usePlayers from "../../obr/party/usePlayers";
import useWorkerId from "./useWorkerId";
import useConnectionId from "../../obr/player/useConnectionId";
import Legend from "../../ui/legend/Legend";
import * as styles from "../../css/theme.css";
import { enforceWorker } from "./coordination";
import { Obr } from "../../obr/types";
import { useContext } from "react";
import { obrContext } from "../../obr/ObrContextProvider";

export default function Workers() {
  const obr = useContext(obrContext);
  const players = usePlayers();
  const workerId = useWorkerId();
  const connectionId = useConnectionId();

  return (
    <>
      <HasRole requiredRole="PLAYER">
        <blockquote>
          <p>You have no power here.</p>
        </blockquote>
        <p>— King Théoden</p>
      </HasRole>
      <HasRole requiredRole="GM">
        <p>
          Only one of the users (players and GM) handles the movement of tokens
          and teleports them (called <em>worker</em>.) Below is a list of all
          connections.
        </p>
        <p>
          Click a toggle to pick a new worker. This setting automatically
          changes, when a new connection is established.
        </p>

        {renderList(obr, players, connectionId, workerId)}

        <Legend>
          <dt>
            <Role role="GM" />
          </dt>
          <dd>GM</dd>

          <dt>
            <Role role="PLAYER" />
          </dt>
          <dd>Player</dd>
        </Legend>
      </HasRole>
    </>
  );
}

function renderList(
  obr: Obr,
  players: Player[],
  connectionId?: string,
  workerId?: string | null,
) {
  if (players.length === 0) {
    return <SkeletonList />;
  }

  const multi = players
    .filter((player) =>
      players.some(
        (other) =>
          other.id === player.id && other.connectionId !== player.connectionId,
      ),
    )
    .map(({ id }) => id);

  players.sort(sort);

  return (
    <ul className={styles.toggles}>
      {players.map((player) =>
        renderPlayer(obr, player, multi, connectionId, workerId),
      )}
    </ul>
  );
}

function sort(a: Player, b: Player): number {
  const compare = a.name.localeCompare(b.name);
  if (compare === 0) {
    return a.connectionId.localeCompare(b.connectionId);
  }

  return compare;
}

function renderPlayer(
  obr: Obr,
  player: Player,
  multi: string[],
  connectionId?: string,
  workerId?: string | null,
) {
  return (
    <li key={player.connectionId}>
      <label>
        <input
          name="active-worker"
          type="radio"
          checked={player.connectionId === workerId}
          onChange={async () => enforceWorker(obr, player.connectionId)}
        />{" "}
        <Role role={player.role} /> {player.name}{" "}
        {renderConnectionId(player, multi)} {renderSelf(player, connectionId)}
      </label>
    </li>
  );
}

function renderConnectionId(player: Player, multi: string[]) {
  if (multi.includes(player.id)) {
    return ` (${player.connectionId})`;
  }
}

function renderSelf(player: Player, connectionId?: string) {
  if (player.connectionId === connectionId) {
    return " (You)";
  }
}
