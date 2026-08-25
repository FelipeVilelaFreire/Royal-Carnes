export interface CardConfig {
  defaults: {
    appearance: "solid" | "glass" | "outline";
    level: "sm" | "md" | "lg";
  };
}

export const defaultUiCardConfig: CardConfig = {
  defaults: {
    appearance: "solid",
    level: "md",
  },
};
