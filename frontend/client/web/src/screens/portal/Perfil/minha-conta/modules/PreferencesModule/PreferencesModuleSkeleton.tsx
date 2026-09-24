import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./PreferencesModule.module.css";
export function PreferencesModuleSkeleton() { return <section aria-busy="true" className={styles.skeleton}><Skeleton shape="text" size="lg" width="md" />{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} shape="block" size="lg" />)}</section>; }
