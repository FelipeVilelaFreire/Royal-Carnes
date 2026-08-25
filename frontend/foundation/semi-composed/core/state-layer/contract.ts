import type { UiStateLayerLevel, UiStateLayerRecipe } from "../themeBindings";
export type StateLayerRecipeLevel = UiStateLayerLevel;
export type StateLayerRecipe = UiStateLayerRecipe;
export type ResolvedStateLayerRecipe = StateLayerRecipe & {
  hoverColor: string;
  hoverOpacity: number;
  pressedColor: string;
  pressedOpacity: number;
  selectedColor: string;
  selectedOpacity: number;
};
