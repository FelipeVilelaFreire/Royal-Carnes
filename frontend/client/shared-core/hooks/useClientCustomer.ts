import { useCallback, useMemo, useState } from "react";
import type {
  ClientCustomerProfileDraft,
  ClientCustomerTabKey,
} from "../types/customer.types";
import type {
  ClientCustomerNotificationPreferences,
  ClientCustomerSubscriptionTier,
} from "../contracts/customer.contract";
import { customerFallbackDataSource } from "../data-sources/customer.fallback";
import {
  createClientCustomerAccountViewModel,
  updateClientCustomerNotifications,
} from "../view-models/customer.view-model";

export type {
  ClientCustomerProfileDraft,
  ClientCustomerTabKey,
} from "../types/customer.types";

const createProfileDraft = (): ClientCustomerProfileDraft => ({
  name: customerFallbackDataSource.customer.name,
  email: customerFallbackDataSource.customer.email,
  phone: customerFallbackDataSource.customer.phone,
  cpf: customerFallbackDataSource.customer.cpf,
  birthdate: customerFallbackDataSource.customer.birthdate,
  preferredDoneness: customerFallbackDataSource.customer.preferredDoneness,
});

export function useClientCustomer() {
  const dataSource = customerFallbackDataSource;
  const [activeTab, setActiveTab] = useState<ClientCustomerTabKey>("overview");
  const [profileDraft, setProfileDraft] = useState<ClientCustomerProfileDraft>(createProfileDraft);
  const [notifications, setNotifications] = useState<ClientCustomerNotificationPreferences>(
    dataSource.customer.notifications,
  );
  const [selectedPlanKey, setSelectedPlanKey] = useState<ClientCustomerSubscriptionTier>(
    dataSource.customer.activeSubscription?.planKey || "pro",
  );
  const [pendingPlanKey, setPendingPlanKey] = useState<ClientCustomerSubscriptionTier>(selectedPlanKey);
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved">("idle");

  const viewModel = useMemo(
    () => createClientCustomerAccountViewModel({ dataSource, selectedPlanKey }),
    [dataSource, selectedPlanKey],
  );

  const updateProfileDraft = useCallback((field: keyof ClientCustomerProfileDraft, value: string) => {
    setProfileDraft((current) => ({ ...current, [field]: value }));
    setSaveState("idle");
  }, []);

  const saveProfileDraft = useCallback(() => {
    setSaveState("saved");
  }, []);

  const updateNotification = useCallback((key: keyof ClientCustomerNotificationPreferences, value: boolean) => {
    setNotifications((current) => updateClientCustomerNotifications(current, key, value));
  }, []);

  const openPlansModal = useCallback(() => {
    setPendingPlanKey(selectedPlanKey);
    setIsPlansModalOpen(true);
  }, [selectedPlanKey]);

  const confirmPlanChange = useCallback(() => {
    setSelectedPlanKey(pendingPlanKey);
    setIsPlansModalOpen(false);
  }, [pendingPlanKey]);

  return {
    activeTab,
    dataSource,
    isPlansModalOpen,
    notifications,
    pendingPlanKey,
    profileDraft,
    saveState,
    selectedPlanKey,
    source: "fallback" as const,
    viewModel,
    actions: {
      confirmPlanChange,
      openPlansModal,
      saveProfileDraft,
      setActiveTab,
      setIsPlansModalOpen,
      setPendingPlanKey,
      updateNotification,
      updateProfileDraft,
    },
  };
}
