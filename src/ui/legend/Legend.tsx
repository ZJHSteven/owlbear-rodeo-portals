import { PropsWithChildren, ReactNode } from "react";
import * as styles from "./legend.css";

export default function Legend({ children }: PropsWithChildren) {
  return <dl className={styles.legend}>{children}</dl>;
}
