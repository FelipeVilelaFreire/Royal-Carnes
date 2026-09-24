import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./AddressesModule.module.css";
export function AddressesModuleSkeleton() { return <section aria-busy="true" className={styles.skeleton}><Skeleton shape="text" size="lg" width="md" /><div className={styles.grid}>{Array.from({ length: 2 }, (_, index) => <Skeleton key={index} shape="block" size="xl" />)}</div></section>; }
