import React from "react";
import { Stack } from "@foundation/ui/web/Layout";
import { SectionContainer } from "@foundation/ui/web/SectionContainer";
import type { DashboardConfig } from "../config/types";
import { DashboardHeaderSkeleton } from "./DashboardHeaderSkeleton";
import { DashboardKpiSkeleton } from "./DashboardKpiSkeleton";
import { DashboardTableSkeleton } from "./DashboardTableSkeleton";
import styles from "./DashboardPageSkeleton.module.css";

export const DashboardPageSkeleton: React.FC<{ config: DashboardConfig }> = ({ config }) => (
  <div aria-busy className={styles.page}>
    <SectionContainer atmosphere={config.layout.atmosphere} usefulColumns={config.layout.usefulColumns} heightRecipe="auto">
      <Stack className={styles.content} gap="lg">
        <DashboardHeaderSkeleton />
        <DashboardKpiSkeleton columns={config.layout.kpis.columns} count={config.widgets.length} gap={config.layout.kpis.gap} />
        <DashboardTableSkeleton appearance={config.recentOrders.surface.appearance} columnCount={config.recentOrders.columns.length} tone={config.recentOrders.surface.tone} />
        <DashboardTableSkeleton appearance={config.plans.surface.appearance} columnCount={config.plans.columns.length} tone={config.plans.surface.tone} />
      </Stack>
    </SectionContainer>
  </div>
);
