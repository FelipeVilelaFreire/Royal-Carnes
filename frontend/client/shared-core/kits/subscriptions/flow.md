# Client Subscriptions Flow

Plans:

```text
screen render-only
  -> useClientPlans().load()
  -> clientSubscriptionsApi.listPlans()
  -> GET /api/v1/subscriptions/plans/
  -> mapClientPlanDto()
  -> createClientPlansViewModel()
```

Current subscription:

```text
screen render-only
  -> useClientSubscription().load()
  -> clientSubscriptionsApi.me()
  -> GET /api/v1/subscriptions/me/
  -> mapClientSubscriptionDto()
```

Current cycle:

```text
screen render-only
  -> useClientCurrentCycle().load()
  -> clientSubscriptionsApi.currentCycle()
  -> GET /api/v1/subscriptions/me/cycles/current/
```

Select cycle item:

```text
screen render-only
  -> useClientCurrentCycle().selectItem(input)
  -> clientSubscriptionsApi.selectCurrentCycleItem(input)
  -> POST /api/v1/subscriptions/me/cycles/current/items/
  -> backend validate_cycle_item_selection()
```

Submit subscription order:

```text
screen render-only
  -> POST /api/v1/orders/me/
  -> backend reserve_cycle_order_items()
  -> locks the cycle, resolves the entitlement and checks the remaining balance
  -> reserves the selected quantities only when the complete request is valid
```

Backend authority:

```text
backend decides entitlement, quantity, unit, attributes, availability and remaining cycle balance
client shared-core maps DTOs and may present a non-authoritative preview
screen never grants access or confirms a plan limit
```
