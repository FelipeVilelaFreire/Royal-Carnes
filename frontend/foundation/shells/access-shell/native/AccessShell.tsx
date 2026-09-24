import React, { useMemo, useState } from "react";
import {
  Button,
  Inline,
  Input,
  Stack,
  Surface,
  Text,
  UiProvider,
  type NativeFoundationDesignSystem,
  type FoundationHostComponents,
} from "../../../native";
import type {
  AccessShellConfig,
  AccessShellFieldKey,
  AccessShellFlowKey,
  AccessShellProviderKey,
  AccessShellStrings,
  AccessShellValues,
} from "../types";

export interface NativeAccessShellProps {
  config: AccessShellConfig;
  designSystem?: NativeFoundationDesignSystem;
  errorMessage?: string | null;
  hosts: FoundationHostComponents;
  isLoading?: boolean;
  onClose?: () => void;
  onProviderAction?: (provider: AccessShellProviderKey) => void;
  onSubmit: (flow: AccessShellFlowKey, values: AccessShellValues) => Promise<unknown> | unknown;
  strings: AccessShellStrings;
  themeMode?: "dark" | "light";
}

const fieldInputType: Record<AccessShellFieldKey, string> = {
  email: "email-address",
  name: "default",
  password: "default",
};

export const NativeAccessShell: React.FC<NativeAccessShellProps> = ({
  config,
  designSystem,
  errorMessage,
  hosts,
  isLoading = false,
  onClose,
  onProviderAction,
  onSubmit,
  strings,
  themeMode = "dark",
}) => {
  const [activeFlow, setActiveFlow] = useState<AccessShellFlowKey>(config.defaultFlow);
  const [values, setValues] = useState<AccessShellValues>({});
  const activeFlowConfig = useMemo(
    () => config.flows.find((flow) => flow.key === activeFlow) || config.flows[0],
    [activeFlow, config.flows],
  );
  const flowSwitcher = config.visual.flowSwitcher || "tabs";
  const switcher = strings.switcher?.[activeFlowConfig.key];
  const header: AccessShellConfig["header"] = config.header || config.brand;
  const BrandImage = hosts.Image;
  const updateValue = (key: AccessShellFieldKey, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <UiProvider designSystem={designSystem} hosts={hosts} mode={themeMode}>
      <Stack fill fullWidth gap="lg" justify="center" padding="lg">
        {header ? <Stack gap="xs" style={{ alignItems: "center" }}>
          {header.logo && BrandImage ? (
            <BrandImage
              accessibilityLabel={header.name}
              source={{ uri: header.logo }}
              style={{ height: designSystem?.theme.tokens.spacing?.space3xl, width: "100%" }}
            />
          ) : header.name ? (
            <Text tone="primary" variant="h3">{header.name}</Text>
          ) : null}
          {header.logo && BrandImage && header.name ? (
            <Text tone="primary" variant="h3">{header.name}</Text>
          ) : null}
          {header.showClose !== false && onClose ? (
            <Button appearance="transparent" onPress={onClose} tone="neutral">
              {strings.close}
            </Button>
          ) : null}
        </Stack> : null}
        {config.visual.showCallout && strings.callout ? (
          <Surface appearance="soft" padding="lg" tone="primary">
            <Stack gap="xs">
              <Text tone="primary" variant="caption">{strings.callout.badge}</Text>
              <Text variant="h3">{strings.callout.title}</Text>
              <Text tone="muted">{strings.callout.description}</Text>
            </Stack>
          </Surface>
        ) : null}

        {config.flows.length > 1 && flowSwitcher === "tabs" ? (
          <Inline gap="xs">
            {config.flows.map((flow) => (
              <Button
                accessibilityRole="tab"
                accessibilityState={{ selected: activeFlow === flow.key }}
                key={flow.key}
                onPress={() => setActiveFlow(flow.key)}
                appearance={activeFlow === flow.key ? "soft" : "transparent"}
                style={{ flex: 1 }}
                tone={activeFlow === flow.key ? "primary" : "neutral"}
              >
                {strings.tabs[flow.key]}
              </Button>
            ))}
          </Inline>
        ) : null}

        <Surface appearance={config.visual.formSurface === "flat" ? "transparent" : "soft"} padding="lg">
          <Stack gap="md">
          <Text variant="h3">{strings.flows[activeFlowConfig.key].title}</Text>
          <Text tone="muted">{strings.flows[activeFlowConfig.key].description}</Text>
          {activeFlowConfig.fieldKeys.map((fieldKey) => (
            <Stack gap="xs" key={fieldKey}>
              {config.visual.showFieldLabels === false ? null : <Text variant="caption">{strings.fields[fieldKey]}</Text>}
              <Input
                accessibilityLabel={strings.fields[fieldKey]}
                keyboardType={fieldInputType[fieldKey]}
                onChangeText={(value: string) => updateValue(fieldKey, value)}
                placeholder={strings.placeholders[fieldKey]}
                secureTextEntry={fieldKey === "password"}
                value={values[fieldKey] || ""}
              />
              {config.visual.showForgotPassword && activeFlowConfig.key === "login" && fieldKey === "password" && strings.forgotPassword ? (
                <Button appearance="transparent" onPress={() => undefined} tone="primary">
                  {strings.forgotPassword}
                </Button>
              ) : null}
            </Stack>
          ))}

          {errorMessage ? <Text tone="danger">{errorMessage}</Text> : null}

          <Button
            disabled={isLoading}
            onPress={() => void onSubmit(activeFlowConfig.key, values)}
          >{strings.flows[activeFlowConfig.key].submit}</Button>
          {config.providers?.length && strings.providers ? (
            <Stack gap="xs">
              <Inline style={{ alignItems: "center", justifyContent: "center" }}>
                <Text tone="muted" variant="caption">{strings.providers.divider}</Text>
              </Inline>
              {config.providers.map((provider) => (
                <Button
                  appearance="soft"
                  disabled={!onProviderAction}
                  key={provider}
                  onPress={() => onProviderAction?.(provider)}
                  tone="neutral"
                >
                  {strings.providers[provider]}
                </Button>
              ))}
            </Stack>
          ) : null}
          </Stack>
        </Surface>

        {config.visual.showLegal && strings.legal ? <Text tone="muted" variant="caption">{strings.legal}</Text> : null}
        {config.flows.length > 1 && flowSwitcher === "footerLink" && switcher ? (
          <Inline gap="xs" style={{ justifyContent: "center" }}>
            <Text tone="muted" variant="caption">{switcher.hint}</Text>
            <Button
              appearance="transparent"
              onPress={() => setActiveFlow(activeFlowConfig.key === "login" ? "register" : "login")}
              tone="primary"
            >
              {switcher.action}
            </Button>
          </Inline>
        ) : null}
      </Stack>
    </UiProvider>
  );
};
