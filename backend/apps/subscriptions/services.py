from datetime import datetime, timedelta
from django.utils import timezone
from apps.core.models import Organization, Customer
from apps.plans.models import Plan
from apps.subscriptions.models import Subscription, PauseLog

def create_subscription(
    organization: Organization,
    customer: Customer,
    plan: Plan,
    start_date: datetime | None = None
) -> Subscription:
    start = start_date or timezone.now()
    end = start + timedelta(days=30)
    return Subscription.objects.create(
        organization=organization,
        customer=customer,
        plan=plan,
        status="active",
        current_period_start=start,
        current_period_end=end,
        cancel_at_period_end=False
    )

def pause_subscription(subscription: Subscription, reason: str = "", resumes_at: datetime | None = None) -> Subscription:
    subscription.status = "paused"
    subscription.save()
    PauseLog.objects.create(
        subscription=subscription,
        reason=reason,
        resumes_at=resumes_at
    )
    return subscription

def cancel_subscription(subscription: Subscription, immediately: bool = False) -> Subscription:
    if immediately:
        subscription.status = "canceled"
    else:
        subscription.cancel_at_period_end = True
    subscription.save()
    return subscription
