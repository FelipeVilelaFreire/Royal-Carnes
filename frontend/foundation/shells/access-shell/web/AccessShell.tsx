"use client";

import React, { useEffect, useMemo, useState } from "react";
import { BottomModal, Button, Input, Modal, Stack, Surface, Text } from "@foundation/ui";
import { UserIcon } from "@foundation/ui/web/Icon/AppIcons";
import type {
  AccessShellConfig,
  AccessShellFieldKey,
  AccessShellFlowKey,
  AccessShellPresentation,
  AccessShellStrings,
  AccessShellValues,
} from "../types";
import styles from "./AccessShell.module.css";

export interface AccessShellProps {
  config: AccessShellConfig;
  errorMessage?: string | null;
  isLoading?: boolean;
  onClose?: () => void;
  onSubmit: (flow: AccessShellFlowKey, values: AccessShellValues) => Promise<unknown> | unknown;
  open?: boolean;
  strings: AccessShellStrings;
}

const fieldInputType: Record<AccessShellFieldKey, "email" | "password" | "text"> = {
  email: "email",
  name: "text",
  password: "password",
};

const getPresentation = (config: AccessShellConfig, isMobile: boolean): AccessShellPresentation =>
  isMobile ? config.presentation.mobile : config.presentation.desktop;

export const AccessShell: React.FC<AccessShellProps> = ({
  config,
  errorMessage,
  isLoading = false,
  onClose,
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
    <div className={styles.content}>
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

      {config.flows.length > 1 ? (
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

      <Surface appearance="soft" className={styles.formPanel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {activeFlowConfig.fieldKeys.map((fieldKey) => (
            <Input
              autoComplete={fieldKey === "password" ? "current-password" : fieldKey === "email" ? "email" : "name"}
              key={fieldKey}
              label={strings.fields[fieldKey]}
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

      {config.visual.showLegal && strings.legal ? (
        <Text as="p" className={styles.legal} tone="inherit" variant="caption">
          {strings.legal}
        </Text>
      ) : null}
    </div>
  );

  if (presentation === "screen") {
    return <section className={styles.screen}>{content}</section>;
  }

  const modalProps = {
    ariaLabel: activeCopy.title,
    closeLabel: strings.close,
    description: activeCopy.description,
    onClose: onClose || (() => undefined),
    open,
    title: activeCopy.title,
  };

  return presentation === "bottomModal" ? (
    <BottomModal {...modalProps}>{content}</BottomModal>
  ) : (
    <Modal {...modalProps} size="md" variant="center">
      {content}
    </Modal>
  );
};
