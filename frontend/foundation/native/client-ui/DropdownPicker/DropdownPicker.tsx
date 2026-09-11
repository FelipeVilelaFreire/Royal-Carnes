import React, { useMemo, useState } from "react";
import { Button } from "../Button";
import { Surface } from "../Surface";
import { Text } from "../Text";
import { mergeStyles, useUi } from "../context";

export interface DropdownPickerOption {
  disabled?: boolean;
  label: string;
  value: string;
}

export interface DropdownPickerProps {
  accessibilityLabel?: string;
  onChange?: (value: string) => void;
  options: DropdownPickerOption[];
  placeholder?: string;
  style?: any;
  value?: string;
}

export const DropdownPicker: React.FC<DropdownPickerProps> = ({
  accessibilityLabel,
  onChange,
  options,
  placeholder,
  style,
  value,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { designSystem } = useUi();
  const selected = useMemo(() => options.find((option) => option.value === value), [options, value]);
  const selectedLabel = selected?.label || placeholder || options[0]?.label;

  return (
    <Surface style={mergeStyles(designSystem.primitives.DropdownPicker?.states.default, style)}>
      <Button
        accessibilityLabel={accessibilityLabel}
        appearance="outline"
        onAction={() => setIsOpen((current) => !current)}
        tone="neutral"
      >
        {selectedLabel}
      </Button>
      {isOpen ? (
        <Surface>
          {options.map((option) => (
            <Button
              disabled={option.disabled}
              key={option.value}
              onAction={() => {
                if (option.disabled) return;
                onChange?.(option.value);
                setIsOpen(false);
              }}
              tone={option.value === value ? "primary" : "neutral"}
            >
              {option.label}
            </Button>
          ))}
        </Surface>
      ) : null}
    </Surface>
  );
};
