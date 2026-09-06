import {
  catalogSubscriptionPlansMock,
  productCategoriesMock,
  productsMock,
} from "../mocks/catalog";
import { royalCustomerMock } from "../mocks/customer.mock";
import { royalCustomerOrdersMock } from "../mocks/orders";
import { freightOptionsMock, freightPoliciesMock } from "../mocks/freight.mock";
import { paymentInstallmentsMock, paymentMethodsMock } from "../mocks/payment.mock";

export const checkoutFallbackDataSource = {
  customer: royalCustomerMock,
  customerOrders: royalCustomerOrdersMock,
  freightOptions: freightOptionsMock,
  freightPolicies: freightPoliciesMock,
  paymentInstallments: paymentInstallmentsMock,
  paymentMethods: paymentMethodsMock,
  productCategories: productCategoriesMock,
  products: productsMock,
  subscriptionPlans: catalogSubscriptionPlansMock,
};
