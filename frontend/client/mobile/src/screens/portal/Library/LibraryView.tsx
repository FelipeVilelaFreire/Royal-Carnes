import React from "react";
import { ScreenHeader } from "@foundation/product-components/screens/native/ScreenHeader";
import { Button } from "@foundation/ui/native/Button";
import { Input } from "@foundation/ui/native/Input";
import { Container, Stack } from "@foundation/ui/native/Layout";
import { Surface } from "@foundation/ui/native/Surface";
import { Text } from "@foundation/ui/native/Text";
import { useUi } from "@foundation/ui/native/context";
import type { useClientStrings } from "@royalprime/client/hooks/useClientStrings";

const buttonAppearances = ["solid", "soft", "outline", "transparent"] as const;
const surfaceAppearances = ["solid", "soft", "outline", "transparent", "glass"] as const;

export interface LibraryViewProps {
  strings: ReturnType<typeof useClientStrings>;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ strings }) => {
  const { hosts } = useUi();
  const ScrollContainer = hosts.ScrollView || hosts.View;
  const library = strings.library;

  return (
    <ScrollContainer>
      <ScreenHeader
        description={library.page.description}
        mobileMode="collapsible"
        mobileTitle={library.page.mobileTitle}
        title={library.page.title}
      />
      <Container gap="xl">
        <Stack gap="md">
          <Text variant="h2">{library.button.title}</Text>
          <Text tone="muted">{library.button.description}</Text>
          {buttonAppearances.map((appearance) => (
            <Button accessibilityLabel={library.button.appearances[appearance]} appearance={appearance} key={appearance} tone="primary">
              {library.button.appearances[appearance]}
            </Button>
          ))}
          <Button disabled>{library.button.states.disabled}</Button>
        </Stack>

        <Stack gap="md">
          <Text variant="h2">{library.surface.title}</Text>
          <Text tone="muted">{library.surface.description}</Text>
          {surfaceAppearances.map((appearance) => (
            <Surface appearance={appearance} key={appearance} tone="primary">
              <Text weight="semibold">{library.surface.appearances[appearance]}</Text>
              <Text>{library.surface.sampleDescription}</Text>
            </Surface>
          ))}
        </Stack>

        <Stack gap="md">
          <Text variant="h2">{library.input.title}</Text>
          <Text tone="muted">{library.input.description}</Text>
          <Input accessibilityLabel={library.input.default.label} placeholder={library.input.default.placeholder} />
          <Input accessibilityLabel={library.input.icon.label} iconIntent="search" placeholder={library.input.icon.placeholder} />
          <Input accessibilityLabel={library.input.disabled.label} placeholder={library.input.disabled.placeholder} />
        </Stack>
      </Container>
    </ScrollContainer>
  );
};
