"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@foundation/ui/web/Button";
import { Divider } from "@foundation/ui/web/Divider";
import { Input } from "@foundation/ui/web/Input";
import { Stack } from "@foundation/ui/web/Layout";
import { BottomModal, Modal } from "@foundation/ui/web/Modal";
import { Surface } from "@foundation/ui/web/Surface";
import { Text } from "@foundation/ui/web/Text";
import { CloseIcon, LockIcon, UserIcon } from "@foundation/ui/web/Icon/AppIcons";
import type {
  AccessShellConfig,
  AccessShellFieldKey,
  AccessShellFlowKey,
  AccessShellPresentation,
  AccessShellProviderKey,
  AccessShellStrings,
  AccessShellValues,
} from "../types";
import styles from "./AccessShell.module.css";

export interface AccessShellProps {
  config: AccessShellConfig;
  errorMessage?: string | null;
  isLoading?: boolean;
  onClose?: () => void;
  onProviderAction?: (provider: AccessShellProviderKey) => void;
  onSubmit: (flow: AccessShellFlowKey, values: AccessShellValues) => Promise<unknown> | unknown;
  open?: boolean;
  strings: AccessShellStrings;
}

const fieldInputType: Record<AccessShellFieldKey, "email" | "password" | "text"> = {
  email: "email",
  name: "text",
  password: "password",
};

const fieldIcon: Record<AccessShellFieldKey, React.ReactNode> = {
  email: <UserIcon />,
  name: <UserIcon />,
  password: <LockIcon />,
};

const getPresentation = (config: AccessShellConfig, isMobile: boolean): AccessShellPresentation =>
  isMobile ? config.presentation.mobile : config.presentation.desktop;

export const AccessShell: React.FC<AccessShellProps> = ({
  config,
  errorMessage,
  isLoading = false,
  onClose,
  onProviderAction,
  onSubmit,
  open = true,
  strings,
}) => {
  const [activeFlow, setActiveFlow] = useState<AccessShellFlowKey>(config.defaultFlow);
  const [isMobile, setIsMobile] = useState(false);
  const [values, setValues] = useState<AccessShellValues>({});
  const activeFlowConfig = useMemo(
    () => config.flows.find((flow) => flow.key === activeFlow) || config.flows[0],
    [activeFlow, config.flows],
  );
  const activeCopy = strings.flows[activeFlowConfig.key];
  const presentation = getPresentation(config, isMobile);
  const flowSwitcher = config.visual.flowSwitcher || "tabs";
  const switcher = strings.switcher?.[activeFlowConfig.key];
  const header = config.header || config.brand;
  const isRoomyModal = config.visual.modalDensity === "roomy";

  useEffect(() => {
    const updateViewport = () => setIsMobile(window.matchMedia("(max-width: 48em)").matches);
    updateViewport();
    window.addEventListener("resize", updateViewport);
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const updateValue = (key: AccessShellFieldKey, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(activeFlowConfig.key, values);
  };

  const content = (
    <div className={`${styles.content} ${presentation === "screen" ? "" : styles.modalContent}`}>
      {header ? <div className={styles.brandHeader}>
        <span aria-hidden="true" className={styles.brandSpacer} />
        <div className={styles.brand}>
          {header.logo ? <img alt="" className={styles.brandLogo} src={header.logo} /> : null}
          {header.name ? (
            <Text as="span" className={styles.brandName} tone="inherit" variant="h3">
              {header.name}
            </Text>
          ) : null}
        </div>
        {header.showClose !== false ? <Button
          aria-label={strings.close}
          appearance="transparent"
          className={styles.closeButton}
          icon={<CloseIcon size={18} />}
          iconPosition="only"
          onClick={onClose || (() => undefined)}
          size="sm"
          tone="neutral"
          type="button"
        /> : <span aria-hidden="true" className={styles.brandSpacer} />}
      </div> : null}
      {config.visual.showCallout && strings.callout ? (
        <Surface appearance="soft" className={styles.callout}>
          <Stack gap="xs">
            <Text as="span" className={styles.eyebrow} tone="inherit" variant="caption">
              {strings.callout.badge}
            </Text>
            <Text as="strong" className={styles.calloutTitle} tone="inherit" variant="h3">
              {strings.callout.title}
            </Text>
            <Text className={styles.calloutDescription} tone="inherit" variant="body">
              {strings.callout.description}
            </Text>
          </Stack>
        </Surface>
      ) : null}

      {config.flows.length > 1 && flowSwitcher === "tabs" ? (
        <div className={styles.tabs}>
          {config.flows.map((flow) => (
            <Button
              appearance={activeFlow === flow.key ? "solid" : "transparent"}
              aria-pressed={activeFlow === flow.key}
              className={styles.tabButton}
              key={flow.key}
              onClick={() => setActiveFlow(flow.key)}
              size="sm"
              tone={activeFlow === flow.key ? "primary" : "neutral"}
              type="button"
            >
              {strings.tabs[flow.key]}
            </Button>
          ))}
        </div>
      ) : null}

      <Surface appearance="soft" className={`${styles.formPanel} ${config.visual.formSurface === "flat" ? styles.formPanelFlat : ""}`}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHeading}>
            <Text as="h2" className={styles.formTitle} tone="inherit" variant="h3">
              {activeCopy.title}
            </Text>
            <Text as="p" className={styles.formDescription} tone="inherit" variant="caption">
              {activeCopy.description}
            </Text>
          </div>
          {activeFlowConfig.fieldKeys.map((fieldKey) => (
            <Input
              autoComplete={fieldKey === "password" ? "current-password" : fieldKey === "email" ? "email" : "name"}
              key={fieldKey}
              aria-label={strings.fields[fieldKey]}
              icon={fieldIcon[fieldKey]}
              label={config.visual.showFieldLabels === false ? undefined : strings.fields[fieldKey]}
              name={fieldKey}
              onChange={(event) => updateValue(fieldKey, event.target.value)}
              placeholder={strings.placeholders[fieldKey]}
              required
              type={fieldInputType[fieldKey]}
              value={values[fieldKey] || ""}
            />
          ))}

          {errorMessage ? (
            <div className={styles.error} role="alert">
              <Text tone="danger">{errorMessage}</Text>
            </div>
          ) : null}

          {config.visual.showForgotPassword && activeFlowConfig.key === "login" && strings.forgotPassword ? (
            <div className={styles.formMeta}>
              <Text as="span" className={styles.hint} tone="inherit" variant="caption">
                {strings.registerHint}
              </Text>
              <Button appearance="transparent" className={styles.forgotButton} size="sm" tone="neutral" type="button">
                {strings.forgotPassword}
              </Button>
            </div>
          ) : null}

          <Button appearance="solid" className={styles.submitButton} icon={<UserIcon />} loading={isLoading} size="md" tone="primary" type="submit">
            {activeCopy.submit}
          </Button>
        </form>
      </Surface>

      {config.providers?.length && strings.providers ? (
        <div className={styles.providers}>
          <div className={styles.providerDivider}>
            <Divider />
            <Text as="span" className={styles.providerDividerLabel} tone="inherit" variant="caption">
              {strings.providers.divider}
            </Text>
            <Divider />
          </div>
          <div className={styles.providerButtons}>
            {config.providers.map((provider) => (
              <Button
                appearance="outline"
                className={styles.providerButton}
                disabled={!onProviderAction}
                key={provider}
                onClick={() => onProviderAction?.(provider)}
                size="md"
                tone="neutral"
                type="button"
              >
                {strings.providers[provider]}
              </Button>
            ))}
          </div>
        </div>
      ) : null}

      {config.visual.showLegal && strings.legal ? (
        <Text as="p" className={styles.legal} tone="inherit" variant="caption">
          {strings.legal}
        </Text>
      ) : null}

      {config.flows.length > 1 && flowSwitcher === "footerLink" && switcher ? (
        <div className={styles.flowSwitcher}>
          <Text as="span" className={styles.switcherHint} tone="inherit" variant="caption">
            {switcher.hint}
          </Text>
          <Button
            appearance="transparent"
            className={styles.switcherAction}
            onClick={() => setActiveFlow(activeFlowConfig.key === "login" ? "register" : "login")}
            size="sm"
            tone="primary"
            type="button"
          >
            {switcher.action}
          </Button>
        </div>
      ) : null}
    </div>
  );

  if (presentation === "screen") {
    return <section className={styles.screen}>{content}</section>;
  }

  const modalProps = {
    ariaLabel: activeCopy.title,
    closeLabel: strings.close,
    hideHeader: true,
    onClose: onClose || (() => undefined),
    open,
  };

  return presentation === "bottomModal" ? (
    <BottomModal {...modalProps}>{content}</BottomModal>
  ) : (
    <Modal {...modalProps} size={isRoomyModal ? "roomy" : "compact"} variant="center">
      {content}
    </Modal>
  );
};
