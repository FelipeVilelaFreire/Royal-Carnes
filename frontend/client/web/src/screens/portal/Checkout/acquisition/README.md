# Checkout acquisition

This folder owns only the Web composition of the acquisition phase: choosing between Royal Assinatura, Royal Box, and Royal Delivery. It does not fetch APIs, calculate checkout data, or define product rules.

## Required structure

```text
acquisition/
├─ CheckoutAcquisition.tsx          # composition and real loading boundary
├─ AcquisitionIntro.tsx/.module.css # outer phase spacing and compact state
├─ AcquisitionModeGrid.tsx/.module.css
│                                  # list order and responsive grid only
├─ AcquisitionModeCard.tsx/.module.css
│                                  # one selectable mode card and its visuals
├─ AcquisitionModeSkeleton.tsx/.module.css
│                                  # non-interactive loading representation
└─ README.md                        # ownership and delivery contract
```

## Hard ownership rules

- `CheckoutAcquisition.tsx` composes children and switches between the grid and skeleton. It receives state and callbacks; it never calls an API.
- `AcquisitionModeGrid.tsx` owns order, collection layout, and mapping. It must not absorb a complete card UI.
- `AcquisitionModeCard.tsx` owns a single selectable card, accessibility state, and Foundation icons/components. User-facing text always arrives from `strings`.
- Each visual TSX has its matching CSS Module. CSS consumes theme tokens only; it does not add literal colors, spacing, or a parallel component recipe.
- `AcquisitionModeSkeleton.tsx` is shown only while the catalog request is loading. It has no buttons, no selection state, and no invented product data.

## Shared-core boundary

`shared-core` owns the checkout mode contract, current subscription state, mode ordering, locale strings, and the actual catalog loading state. The Web folder receives those values and renders them. The Native acquisition folder must mirror this interaction contract with platform-native composition, not duplicate Web CSS.

## Delivery checklist

- New UI copy is added to the active locale before use.
- A card change touches `AcquisitionModeCard`, not the grid, unless the layout itself changed.
- Loading changes touch the skeleton and use a real shared-core loading signal.
- Test desktop three-card layout, compact selected state, horizontal tablet rail, and mobile layout in the browser with live API data.
- When shared-core reports an active subscription, the card may show the compact active-plan badge in its upper-right corner. The badge is visual state only: it must not expand the card or replace the configured cycle action.
