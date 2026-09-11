import React from "react";
import { useClientStrings } from "../../../../shared-core/hooks/useClientStrings";
import { Button } from "@foundation/ui/native/Button";
import { Container, Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";

export interface LandingViewProps {
  onNavigate: (path: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate }) => {
  const strings = useClientStrings().landing;

  return (
    <Container>
      <Stack gap="lg">
        <Surface appearance="soft" padding="lg">
          <Stack gap="sm">
            <Text tone="primary" variant="caption">{strings.hero.badge}</Text>
            <Text variant="h3">{strings.hero.title}</Text>
            <Text tone="muted">{strings.hero.subtitle}</Text>
            <Button onAction={() => onNavigate("/montar-box")}>{strings.hero.ctaPlans}</Button>
            <Button appearance="outline" tone="neutral" onAction={() => onNavigate("/cortes")}>
              {strings.hero.ctaShowcase}
            </Button>
          </Stack>
        </Surface>

        <Stack gap="sm">
          <Text tone="primary" variant="caption">{strings.productOptions.badge}</Text>
          <Text variant="h3">{`${strings.productOptions.titleLead} ${strings.productOptions.titleAccent} ${strings.productOptions.titleTail}`}</Text>
          <Text tone="muted">{strings.productOptions.subtitle}</Text>
          {strings.productOptions.options.map((option) => (
            <Surface key={option.key} appearance="soft" padding="md">
              <Stack gap="xs">
                <Text variant="h3">{option.title}</Text>
                <Text tone="muted">{option.description}</Text>
                <Button appearance="outline" tone="neutral" onAction={() => onNavigate("/montar-box")}>
                  {option.cta}
                </Button>
              </Stack>
            </Surface>
          ))}
        </Stack>

        <Stack gap="sm">
          <Text tone="primary" variant="caption">{strings.howItWorks.badge}</Text>
          <Text variant="h3">{`${strings.howItWorks.titleLead} ${strings.howItWorks.titleAccent}`}</Text>
          {strings.howItWorks.steps.map((step) => (
            <Surface key={step.number} appearance="soft" padding="md">
              <Stack gap="xs">
                <Text tone="primary" variant="caption">{step.number}</Text>
                <Text variant="h3">{step.title}</Text>
                <Text tone="muted">{step.description}</Text>
              </Stack>
            </Surface>
          ))}
        </Stack>

        <Surface appearance="soft" padding="lg">
          <Stack gap="sm">
            <Text tone="primary" variant="caption">{strings.gift.badge}</Text>
            <Text variant="h3">{strings.gift.title}</Text>
            <Text tone="muted">{strings.gift.description}</Text>
            <Button onAction={() => onNavigate("/montar-box")}>{strings.gift.cta}</Button>
          </Stack>
        </Surface>
      </Stack>
    </Container>
  );
};
