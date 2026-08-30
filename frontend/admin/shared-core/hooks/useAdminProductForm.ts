import { useMemo, useState } from "react";
import type { AdminProductFormInput } from "../contracts/catalog.contract";
import { createAdminProductFormViewModel } from "../view-models/catalog.view-model";

export function useAdminProductForm(initialInput?: Partial<AdminProductFormInput>) {
  const [input, setInput] = useState<AdminProductFormInput>({
    key: initialInput?.key || "",
    name: initialInput?.name || "",
    categoryKeys: initialInput?.categoryKeys || [],
    unit: initialInput?.unit || "unit",
    priceCents: initialInput?.priceCents,
    priceType: initialInput?.priceType || "base",
    commercialModeKeys: initialInput?.commercialModeKeys || [],
    collectionKeys: initialInput?.collectionKeys || [],
    variants: initialInput?.variants || [],
  });

  return useMemo(
    () => ({
      input,
      setInput,
      viewModel: createAdminProductFormViewModel(input),
    }),
    [input],
  );
}
