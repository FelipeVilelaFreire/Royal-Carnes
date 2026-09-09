import type {
  AdminPaymentCreateDto,
  AdminPaymentDto,
  AdminPaymentFormInput,
  AdminPaymentUpdateDto,
  AdminPaymentUpdateInput,
  AdminPaymentView,
} from "../contracts/payments.contract";

export function mapAdminPaymentDto(dto: AdminPaymentDto): AdminPaymentView {
  return {
    id: dto.id,
    reference: dto.reference,
    customerId: dto.customer_id,
    customerName: dto.customer_name,
    subscriptionId: dto.subscription_id ?? null,
    subscriptionPlanName: dto.subscription_plan_name ?? null,
    orderId: dto.order_id ?? null,
    orderCode: dto.order_code ?? null,
    status: dto.status,
    currency: dto.currency,
    amountCents: dto.amount_cents,
    dueAt: dto.due_at ?? null,
    paidAt: dto.paid_at ?? null,
    notes: dto.notes || "",
    metadata: dto.metadata || {},
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

export function mapAdminPaymentFormInput(input: AdminPaymentFormInput): AdminPaymentCreateDto {
  return {
    reference: input.reference,
    customer_id: input.customerId,
    subscription_id: input.subscriptionId || null,
    order_id: input.orderId || null,
    status: input.status,
    currency: input.currency,
    amount_cents: input.amountCents,
    due_at: input.dueAt,
    paid_at: input.paidAt,
    notes: input.notes,
    metadata: input.metadata,
  };
}

export function mapAdminPaymentUpdateInput(input: AdminPaymentUpdateInput): AdminPaymentUpdateDto {
  return {
    reference: input.reference,
    status: input.status,
    currency: input.currency,
    amount_cents: input.amountCents,
    due_at: input.dueAt,
    paid_at: input.paidAt,
    notes: input.notes,
    metadata: input.metadata,
  };
}

