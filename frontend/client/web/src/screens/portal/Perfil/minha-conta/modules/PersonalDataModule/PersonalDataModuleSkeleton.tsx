import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./PersonalDataModule.module.css";
export function PersonalDataModuleSkeleton() { return <section aria-busy="true" className={styles.skeleton}><Skeleton shape="text" size="lg" width="md" /><div className={styles.grid}>{Array.from({ length: 6 }, (_, index) => <Skeleton key={index} shape="block" size="lg" />)}</div></section>; }
