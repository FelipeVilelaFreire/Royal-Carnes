"use client";

import React, { useEffect, useState } from "react";
import { BottomModal, Button, Input, Modal, Stack, Surface, Text } from "@foundation/ui";
import { UserIcon } from "@foundation/ui/Icon/AppIcons";
import { useClientStrings } from "@royalprime/client/hooks/useClientStrings";
import styles from "./AuthModal.module.css";

export interface AuthModalProps {
  context?: "landing" | "portal";
  isDark?: boolean;
  onAuthenticated?: () => void;
  onClose: () => void;
  open: boolean;
}

type AuthMode = "login" | "register";

const authStorageKey = "royal_prime_mock_authenticated";
const authChangedEvent = "royal_auth_changed";

export const AuthModal: React.FC<AuthModalProps> = ({
  context = "portal",
  onAuthenticated,
  onClose,
  open,
}) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isMobile, setIsMobile] = useState(false);
  const strings = useClientStrings().authModal;
  const contextCopy = context === "landing" ? strings.landing : strings.portal;
  const activeCopy = mode === "login" ? contextCopy.login : contextCopy.register;

  useEffect(() => {
    const updateViewportMode = () => setIsMobile(window.innerWidth <= 768);
    updateViewportMode();
    window.addEventListener("resize", updateViewportMode);
    return () => window.removeEventListener("resize", updateViewportMode);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    localStorage.setItem(authStorageKey, "true");
    window.dispatchEvent(new Event(authChangedEvent));
    onAuthenticated?.();
    onClose();
  };

  const content = (
    <div className={styles.content}>
      <Surface appearance="soft" className={styles.callout}>
        <Stack gap="xs">
          <Text as="span" className={styles.eyebrow} tone="inherit" variant="caption">
            {contextCopy.badge}
          </Text>
          <Text as="strong" className={styles.calloutTitle} tone="inherit" variant="h3">
            {contextCopy.calloutTitle}
          </Text>
          <Text className={styles.calloutDescription} tone="inherit" variant="body">
            {contextCopy.calloutDescription}
          </Text>
        </Stack>
      </Surface>

      <div className={styles.tabs}>
        {(["login", "register"] as const).map((item) => (
          <Button
            appearance={mode === item ? "solid" : "transparent"}
            aria-pressed={mode === item}
            className={styles.tabButton}
            key={item}
            onClick={() => setMode(item)}
            size="sm"
            tone={mode === item ? "primary" : "neutral"}
            type="button"
          >
            {strings.tabs[item]}
          </Button>
        ))}
      </div>

      <Surface appearance="soft" className={styles.formPanel}>
        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === "register" ? (
            <Input label={strings.fields.name} name="name" placeholder={strings.placeholders.name} />
          ) : null}
          <Input
            defaultValue={mode === "login" ? strings.demo.email : undefined}
            label={strings.fields.email}
            name="email"
            placeholder={strings.placeholders.email}
            type="email"
          />
          <Input
            defaultValue={mode === "login" ? strings.demo.password : undefined}
            label={strings.fields.password}
            name="password"
            placeholder={strings.placeholders.password}
            type="password"
          />

          <div className={styles.formMeta}>
            <Text as="span" className={styles.hint} tone="inherit" variant="caption">
              {mode === "login" ? strings.demo.hint : strings.registerHint}
            </Text>
            {mode === "login" ? (
              <Button appearance="transparent" className={styles.forgotButton} size="sm" tone="neutral" type="button">
                {strings.forgotPassword}
              </Button>
            ) : null}
          </div>

          <Button
            appearance="solid"
            className={styles.submitButton}
            icon={<UserIcon />}
            size="md"
            tone="primary"
            type="submit"
          >
            {activeCopy.submit}
          </Button>
        </form>
      </Surface>

      <div className={styles.separator}>
        <span className={styles.separatorLine} aria-hidden="true" />
        <span className={styles.separatorText}>{strings.separator}</span>
        <span className={styles.separatorLine} aria-hidden="true" />
      </div>

      <div className={styles.providerGrid}>
        {strings.providers.map((provider) => (
          <Button
            appearance="outline"
            aria-label={provider.label}
            className={styles.providerButton}
            key={provider.key}
            size="sm"
            tone="neutral"
            type="button"
          >
            {provider.shortLabel}
          </Button>
        ))}
      </div>

      <Text as="p" className={styles.legal} tone="inherit" variant="caption">
        {strings.legal}
      </Text>
    </div>
  );

  const modalProps = {
    ariaLabel: activeCopy.title,
    closeLabel: strings.close,
    description: activeCopy.description,
    onClose,
    open,
    title: activeCopy.title,
  };

  return isMobile ? (
    <BottomModal {...modalProps}>{content}</BottomModal>
  ) : (
    <Modal {...modalProps} size="md" variant="center">
      {content}
    </Modal>
  );
};
