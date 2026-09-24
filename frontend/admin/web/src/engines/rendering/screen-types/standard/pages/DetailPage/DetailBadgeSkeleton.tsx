import React from "react";
import { Skeleton } from "@foundation/ui/web/Skeleton";
import styles from "./DetailPageSkeleton.module.css";

export const DetailBadgeSkeleton: React.FC = () => <Skeleton className={styles.badge} shape="text" size="sm" width="sm" />;
