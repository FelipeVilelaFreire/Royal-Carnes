import React, { type ReactNode } from "react";
import { Button } from "../Button";
import { Stack } from "../Layout";
import { Text } from "../Text";
import { mergeStyles, useUi } from "../context";

export interface ModalProps {
  children?: ReactNode;
  closeLabel: string;
  description?: string;
  onClose: () => void;
  open: boolean;
  title: string;
}

export const Modal: React.FC<ModalProps> = ({
  children,
  closeLabel,
  description,
  onClose,
  open,
  title,
}) => {
  const { designSystem, hosts } = useUi();
  const { Pressable, View } = hosts;
  const surface = designSystem.primitives.Surface?.states.default || {};

  if (!open) return null;

  return (
    <View
      style={{
        bottom: 0,
        left: 0,
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: designSystem.theme.tokens.zIndex?.modal,
      }}
    >
      <View
        style={{
          backgroundColor: designSystem.theme.colors.background,
          bottom: 0,
          left: 0,
          opacity: 0.72,
          position: "absolute",
          right: 0,
          top: 0,
        }}
      />
      <Pressable accessibilityRole="button" onPress={onClose} style={{ flex: 1 }} />
      <View
        style={mergeStyles(surface, {
          borderTopLeftRadius: designSystem.theme.tokens.radius?.xl,
          borderTopRightRadius: designSystem.theme.tokens.radius?.xl,
          maxHeight: "82%",
          padding: designSystem.theme.tokens.spacing?.spaceLg,
        })}
      >
        <Stack style={{ gap: designSystem.theme.tokens.spacing?.spaceMd }}>
          <Stack style={{ gap: designSystem.theme.tokens.spacing?.spaceXs }}>
            <Text variant="h2" weight="bold">{title}</Text>
            {description ? <Text tone="muted">{description}</Text> : null}
          </Stack>
          {children}
          <Button appearance="outline" onPress={onClose} tone="neutral">
            {closeLabel}
          </Button>
        </Stack>
      </View>
    </View>
  );
};
