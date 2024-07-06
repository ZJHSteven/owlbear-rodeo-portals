import * as styles from "./skeleton.css";

export default function SkeletonList() {
  return (
    <ul className={styles.skeleton}>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  );
}
