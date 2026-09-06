"use client";

import React from "react";
import styles from "./styles.module.css";

export function AccountAvatar({ initials }: { initials: string }) {
  return <span className={styles.avatar}>{initials}</span>;
}

export function AccountChip({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <span className={[styles.chip, muted ? styles.mutedChip : ""].filter(Boolean).join(" ")}>
      {children}
    </span>
  );
}

export function AccountProgress({ value }: { value: number }) {
  const normalizedValue = Math.max(0, Math.min(100, value));

  return (
    <div
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={normalizedValue}
      className={styles.metricBar}
      role="progressbar"
    >
      <div className={styles.metricFill} style={{ width: `${normalizedValue}%` }} />
    </div>
  );
}
