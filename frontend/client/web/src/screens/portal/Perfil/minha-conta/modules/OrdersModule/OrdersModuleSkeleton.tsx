import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./OrdersModule.module.css";
export function OrdersModuleSkeleton() { return <section aria-busy="true" className={styles.skeleton}><Skeleton shape="text" size="lg" width="md" />{Array.from({ length: 3 }, (_, index) => <Skeleton key={index} shape="block" size="xl" />)}</section>; }
