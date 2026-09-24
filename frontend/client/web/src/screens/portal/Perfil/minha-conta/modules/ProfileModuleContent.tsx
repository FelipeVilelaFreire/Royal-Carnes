import React from "react";
import type { useClientCustomer } from "@royalprime/client/hooks/useClientCustomer";
import type { MinhaContaStrings } from "../types";
import { OverviewModule } from "./OverviewModule";
import { SubscriptionModule } from "./SubscriptionModule";
import { OrdersModule } from "./OrdersModule";
import { PersonalDataModule } from "./PersonalDataModule";
import { AddressesModule } from "./AddressesModule";
import { PaymentModule } from "./PaymentModule";
import { PreferencesModule } from "./PreferencesModule";
import { SecurityModule } from "./SecurityModule";
import { OverviewModuleSkeleton } from "./OverviewModule/OverviewModuleSkeleton";
import { SubscriptionModuleSkeleton } from "./SubscriptionModule/SubscriptionModuleSkeleton";
import { OrdersModuleSkeleton } from "./OrdersModule/OrdersModuleSkeleton";
import { PersonalDataModuleSkeleton } from "./PersonalDataModule/PersonalDataModuleSkeleton";
import { AddressesModuleSkeleton } from "./AddressesModule/AddressesModuleSkeleton";
import { PaymentModuleSkeleton } from "./PaymentModule/PaymentModuleSkeleton";
import { PreferencesModuleSkeleton } from "./PreferencesModule/PreferencesModuleSkeleton";
import { SecurityModuleSkeleton } from "./SecurityModule/SecurityModuleSkeleton";

type CustomerController = ReturnType<typeof useClientCustomer>;

export function ProfileModuleContent({
  customer,
  onNavigate,
  onLogoutRequest,
  strings,
}: {
  customer: CustomerController;
  onNavigate?: (path: string) => void;
  onLogoutRequest?: () => void;
  strings: MinhaContaStrings;
}) {
  if (customer.isLoading) {
    if (customer.activeTab === "subscription") return <SubscriptionModuleSkeleton />;
    if (customer.activeTab === "orders") return <OrdersModuleSkeleton />;
    if (customer.activeTab === "data") return <PersonalDataModuleSkeleton />;
    if (customer.activeTab === "addresses") return <AddressesModuleSkeleton />;
    if (customer.activeTab === "payments") return <PaymentModuleSkeleton />;
    if (customer.activeTab === "notifications") return <PreferencesModuleSkeleton />;
    if (customer.activeTab === "security") return <SecurityModuleSkeleton />;
    return <OverviewModuleSkeleton />;
  }
  if (customer.activeTab === "subscription") return <SubscriptionModule currentPlanKey={customer.selectedPlanKey} plans={customer.dataSource.plans} strings={strings} viewModel={customer.viewModel} />;
  if (customer.activeTab === "orders") return <OrdersModule onNavigate={onNavigate} orders={customer.dataSource.recentOrders} strings={strings} />;
  if (customer.activeTab === "data") return <PersonalDataModule draft={customer.profileDraft} onSave={customer.actions.saveProfileDraft} onUpdate={customer.actions.updateProfileDraft} saveState={customer.saveState} strings={strings} />;
  if (customer.activeTab === "addresses") return <AddressesModule addresses={customer.dataSource.customer.addresses} onCreate={customer.actions.createAddress} onUpdate={customer.actions.updateAddress} onLookupPostalCode={customer.actions.lookupAddressByPostalCode} strings={strings} />;
  if (customer.activeTab === "payments") return <PaymentModule invoices={customer.dataSource.invoices} strings={strings} />;
  if (customer.activeTab === "notifications") return <PreferencesModule notifications={customer.notifications} onUpdate={customer.actions.updateNotification} strings={strings} />;
  if (customer.activeTab === "security") return <SecurityModule onLogoutRequest={onLogoutRequest} strings={strings} />;
  return <OverviewModule onNavigate={onNavigate} orders={customer.dataSource.recentOrders} strings={strings} viewModel={customer.viewModel} />;
}
