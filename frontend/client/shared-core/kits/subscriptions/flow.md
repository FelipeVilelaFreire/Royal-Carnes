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

Backend authority:

```text
backend decides entitlement, quantity, unit, attributes and availability
client shared-core only maps DTO and exposes action state
screen never calculates plan limits
```
