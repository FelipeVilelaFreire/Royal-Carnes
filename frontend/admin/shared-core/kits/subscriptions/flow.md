# Admin Subscriptions Flow

Load operation:

```text
admin screen render-only
  -> useAdminSubscriptions().load()
  -> adminSubscriptionsApi.listPlans()
  -> adminSubscriptionsApi.listSubscriptions()
  -> adminSubscriptionsApi.listCycles()
  -> backend admin endpoints
  -> mappers
  -> createAdminSubscriptionsViewModel()
```

Create plan:

```text
admin screen render-only
  -> useAdminPlanForm()
  -> useAdminSubscriptions().createPlan(input)
  -> mapAdminPlanFormInput()
  -> POST /api/v1/subscriptions/admin/plans/
  -> backend upsert_plan(), set_plan_price(), upsert_plan_entitlement()
```

Create subscription:

```text
admin screen render-only
  -> useAdminSubscriptionForm()
  -> useAdminSubscriptions().createSubscription(input)
  -> POST /api/v1/subscriptions/admin/subscriptions/
  -> backend upsert_subscription()
```

Backend authority:

```text
backend validates customer, plan, entitlement target, permissions and organization
frontend never hardcodes plan names, product names or business names
```
