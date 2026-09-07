import React, { useState, type FormEvent } from "react";
import { Button, Card, Input, Text } from "@foundation/ui";
import { CheckIcon } from "@foundation/ui/Icon/AppIcons";
import type { AdminLoginInput } from "@royalprime/admin";
import { useAdminI18n } from "@/locales/i18n";
import styles from "./LoginScreen.module.css";

export interface LoginScreenProps {
  errorMessage?: string | null;
  isLoading?: boolean;
  onLogin: (input: AdminLoginInput) => Promise<unknown>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  errorMessage,
  isLoading = false,
  onLogin,
}) => {
  const { t } = useAdminI18n();
  const [email, setEmail] = useState("admin@royalprime.local");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onLogin({ email, password }).catch(() => undefined);
  };

  return (
    <div className={styles.page}>
      <Card className={styles.panel} size="lg">
        <div className={styles.header}>
          <Text as="h1" variant="h2">
            {t("auth.title")}
          </Text>
          <Text tone="muted">{t("auth.subtitle")}</Text>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fields}>
            <Input
              autoComplete="email"
              label={t("auth.emailLabel")}
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("auth.emailPlaceholder")}
              required
              type="email"
              value={email}
            />
            <Input
              autoComplete="current-password"
              label={t("auth.passwordLabel")}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder={t("auth.passwordPlaceholder")}
              required
              type="password"
              value={password}
            />
          </div>

          {errorMessage ? (
            <div className={styles.error} role="alert">
              <Text tone="danger">{errorMessage}</Text>
            </div>
          ) : null}

          <Button icon={<CheckIcon />} loading={isLoading} size="lg" tone="neutral" type="submit">
            {isLoading ? t("auth.loading") : t("auth.submit")}
          </Button>
        </form>

        <div className={styles.hint}>
          <Text variant="caption" tone="muted">
            {t("auth.seedHint")}
          </Text>
        </div>
      </Card>
    </div>
  );
};
