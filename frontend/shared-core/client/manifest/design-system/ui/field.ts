export interface FieldConfig {
  defaults: {
    level: "sm" | "md" | "lg";
    tone: "neutral" | "primary" | "danger";
  };
  structure: {
    header: boolean;
    controlSlot: boolean;
    feedback: boolean;
  };
}

export const defaultUiFieldConfig: FieldConfig = {
  defaults: {
    level: "md",
    tone: "neutral",
  },
  structure: {
    header: true,
    controlSlot: true,
    feedback: true,
  },
};
