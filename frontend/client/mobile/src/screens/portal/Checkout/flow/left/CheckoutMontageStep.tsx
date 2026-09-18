import React from "react";
import { ActiveCycleSummary } from "../../cycle/ActiveCycleSummary";
import { ProductCatalogStep } from "../../catalog/ProductCatalogStep";

interface CheckoutMontageStepProps {
  cycle?: React.ComponentProps<typeof ActiveCycleSummary>;
  catalog: React.ComponentProps<typeof ProductCatalogStep>;
}

export const CheckoutMontageStep: React.FC<CheckoutMontageStepProps> = ({ catalog, cycle }) => (
  <>
    {cycle ? <ActiveCycleSummary {...cycle} /> : null}
    <ProductCatalogStep {...catalog} />
  </>
);
