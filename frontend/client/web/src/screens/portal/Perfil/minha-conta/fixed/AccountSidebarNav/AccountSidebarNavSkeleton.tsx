import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./AccountSidebarNav.module.css";

export function AccountSidebarNavSkeleton() { return <aside aria-busy="true" className={styles.skeleton}>{Array.from({ length: 8 }, (_, index) => <Skeleton key={index} shape="text" size="md" width="full" />)}</aside>; }
