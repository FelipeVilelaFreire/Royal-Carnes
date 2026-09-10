import React, { type ReactNode } from "react";
import { mergeStyles, useUi } from "./context";
import { Text } from "./Text";

export type DataFieldTone = "default" | "muted" | "success" | "warning" | "danger" | "primary";
export type DataFieldValueWeight = "regular" | "semibold" | "bold";

export interface DataFieldProps {
  description?: ReactNode;
  emptyValue?: ReactNode;
  label: ReactNode;
  style?: any;
  tone?: DataFieldTone;
  value?: ReactNode;
  valueWeight?: DataFieldValueWeight;
}

const toneMap: Record<DataFieldTone, "danger" | "inherit" | "muted" | "primary"> = {
  danger: "danger",
  default: "inherit",
  muted: "muted",
  primary: "primary",
  success: "primary",
  warning: "muted",
};

export const DataField: React.FC<DataFieldProps> = ({
  description,
  emptyValue = "",
  label,
  style,
  tone = "default",
  value,
  valueWeight = "semibold",
}) => {
  const { designSystem, hosts } = useUi();
  const spacing = designSystem.theme.tokens.spacing || {};
  const typography = designSystem.theme.tokens.typography || {};
  const resolvedValue = value === undefined || value === null || value === "" ? emptyValue : value;
  const weightMap: Record<DataFieldValueWeight, string | number | undefined> = {
    bold: typography.bold,
    regular: typography.regular,
    semibold: typography.semibold,
  };

  return (
    <hosts.View style={mergeStyles({ gap: spacing.space2xs, minWidth: 0 }, style)}>
      <Text tone="muted" variant="caption">
        {label}
      </Text>
      {React.isValidElement(resolvedValue) ? (
        resolvedValue
      ) : (
        <Text style={{ fontWeight: weightMap[valueWeight] }} tone={toneMap[tone]} variant="body">
          {resolvedValue}
        </Text>
      )}
      {description ? (
        <Text tone="muted" variant="caption">
          {description}
        </Text>
      ) : null}
    </hosts.View>
  );
};
