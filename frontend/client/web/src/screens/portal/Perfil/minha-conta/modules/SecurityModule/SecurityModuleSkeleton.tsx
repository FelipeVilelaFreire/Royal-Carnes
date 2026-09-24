import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./SecurityModule.module.css";
export function SecurityModuleSkeleton() { return <section aria-busy="true" className={styles.skeleton}><Skeleton shape="text" size="lg" width="md" />{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} shape="block" size="lg" />)}</section>; }
