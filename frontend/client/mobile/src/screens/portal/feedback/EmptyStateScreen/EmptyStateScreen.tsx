import React, { type ReactNode } from "react";
import { Icon, Stack, Text, useUi } from "@foundation/ui/native";

interface EmptyStateScreenProps {
  actions?: ReactNode;
  description?: string;
  iconIntent?: string;
  title: string;
}

/**
 * Adaptador Native do empty state do Portal. A semantica e as strings ficam
 * na tela; esta camada cuida apenas da composicao nativa centralizada.
 */
export function EmptyStateScreen({
  actions,
  description,
  iconIntent,
  title,
}: EmptyStateScreenProps) {
  const { designSystem, hosts } = useUi();
  const View = hosts.View;
  const spacing = designSystem.theme.tokens.spacing;

  return (
    <View
      style={{
        alignItems: "center",
        flex: 1,
        justifyContent: "center",
        minHeight: "100%",
        paddingHorizontal: spacing.spaceLg,
        paddingVertical: spacing.space3xl,
      }}
    >
      <Stack gap="md" style={{ alignItems: "center" }}>
        {iconIntent ? <Icon intent={iconIntent} /> : null}
        <Text style={{ textAlign: "center" }} variant="h2" weight="bold">
          {title}
        </Text>
        {description ? (
          <Text style={{ textAlign: "center" }} tone="muted">
            {description}
          </Text>
        ) : null}
        {actions ? <View style={{ alignItems: "center" }}>{actions}</View> : null}
      </Stack>
    </View>
  );
}
