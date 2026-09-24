import { Skeleton } from "@foundation/ui/web/Skeleton";
import { Stack } from "@foundation/ui/web/Layout";
import styles from "./AccountProfileSummary.module.css";

export function AccountProfileSummarySkeleton() {
  return (
    <section aria-busy="true" className={styles.skeleton}>
      <div className={styles.identity}>
        <Skeleton shape="circle" size="xl" />
        <Stack gap="sm">
          <Skeleton shape="text" size="sm" width="sm" />
          <Skeleton shape="text" size="lg" width="md" />
          <Skeleton shape="text" size="sm" width="lg" />
        </Stack>
      </div>
      <div className={styles.stats}>
        {Array.from({ length: 4 }, (_, index) => (
          <Stack gap="sm" key={index}>
            <Skeleton shape="text" size="xs" width="sm" />
            <Skeleton shape="text" size="md" width="md" />
          </Stack>
        ))}
      </div>
    </section>
  );
}
