import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./OverviewModule.module.css";
export function OverviewModuleSkeleton() { return <section aria-busy="true" className={styles.skeleton}><Skeleton shape="text" size="lg" width="md" /><Skeleton shape="text" size="sm" width="lg" /><div className={styles.grid}>{Array.from({ length: 5 }, (_, index) => <Skeleton key={index} shape="block" size="xl" />)}</div><Skeleton shape="block" size="xl" /></section>; }
