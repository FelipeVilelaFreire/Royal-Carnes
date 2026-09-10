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
  const updateValue = (key: AccessShellFieldKey, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  return (
    <UiProvider designSystem={designSystem} hosts={hosts} mode={themeMode}>
      <Stack fill fullWidth gap="lg" justify="center" padding="lg">
        {config.visual.showCallout && strings.callout ? (
          <Surface appearance="soft" padding="lg" tone="primary">
            <Stack gap="xs">
              <Text tone="primary" variant="caption">{strings.callout.badge}</Text>
              <Text variant="h3">{strings.callout.title}</Text>
              <Text tone="muted">{strings.callout.description}</Text>
            </Stack>
          </Surface>
        ) : null}

        {config.flows.length > 1 ? (
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

        <Surface appearance="soft" padding="lg">
          <Stack gap="md">
          <Text variant="h3">{strings.flows[activeFlowConfig.key].title}</Text>
          <Text tone="muted">{strings.flows[activeFlowConfig.key].description}</Text>
          {activeFlowConfig.fieldKeys.map((fieldKey) => (
            <Stack gap="xs" key={fieldKey}>
              <Text variant="caption">{strings.fields[fieldKey]}</Text>
              <Input
                accessibilityLabel={strings.fields[fieldKey]}
                keyboardType={fieldInputType[fieldKey]}
                onChangeText={(value: string) => updateValue(fieldKey, value)}
                placeholder={strings.placeholders[fieldKey]}
                secureTextEntry={fieldKey === "password"}
                value={values[fieldKey] || ""}
              />
            </Stack>
          ))}

          {errorMessage ? <Text tone="danger">{errorMessage}</Text> : null}

          <Button
            disabled={isLoading}
            onPress={() => void onSubmit(activeFlowConfig.key, values)}
          >{strings.flows[activeFlowConfig.key].submit}</Button>
          </Stack>
        </Surface>

        {config.visual.showLegal && strings.legal ? <Text tone="muted" variant="caption">{strings.legal}</Text> : null}
        {onClose ? (
          <Button appearance="transparent" onPress={onClose} tone="neutral">{strings.close}</Button>
        ) : null}
      </Stack>
    </UiProvider>
  );
};
