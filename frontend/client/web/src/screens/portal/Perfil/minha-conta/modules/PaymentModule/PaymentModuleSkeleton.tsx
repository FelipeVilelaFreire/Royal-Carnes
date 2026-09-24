import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./PaymentModule.module.css";
export function PaymentModuleSkeleton() { return <section aria-busy="true" className={styles.skeleton}><Skeleton shape="text" size="lg" width="md" /><Skeleton shape="block" size="xl" /> <Skeleton shape="text" size="lg" width="md" />{Array.from({ length: 2 }, (_, index) => <Skeleton key={index} shape="block" size="lg" />)}</section>; }
