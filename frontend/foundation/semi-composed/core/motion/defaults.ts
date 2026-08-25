import type { UiMotionRecipeTokens } from "../themeBindings";
import type { MotionRecipe } from "./contract";

export const DEFAULT_MOTION_RECIPES = {
  "2xs": { durationToken: "2xs", easingToken: "2xs", liftToken: "2xs", rotationToken: "2xs", scaleDirection: "down", scaleToken: "2xs", springToken: "2xs" },
  xs: { durationToken: "xs", easingToken: "xs", liftToken: "xs", rotationToken: "xs", scaleDirection: "down", scaleToken: "xs", springToken: "xs" },
  sm: { durationToken: "sm", easingToken: "sm", liftToken: "sm", rotationToken: "sm", scaleDirection: "down", scaleToken: "sm", springToken: "sm" },
  md: { durationToken: "md", easingToken: "md", liftToken: "md", rotationToken: "md", scaleDirection: "up", scaleToken: "md", springToken: "md" },
  lg: { durationToken: "lg", easingToken: "lg", liftToken: "lg", rotationToken: "lg", scaleDirection: "up", scaleToken: "lg", springToken: "lg" },
  xl: { durationToken: "xl", easingToken: "xl", liftToken: "xl", rotationToken: "xl", scaleDirection: "up", scaleToken: "xl", springToken: "xl" },
  "2xl": { durationToken: "2xl", easingToken: "2xl", liftToken: "2xl", rotationToken: "2xl", scaleDirection: "up", scaleToken: "2xl", springToken: "2xl" },
  "3xl": { durationToken: "3xl", easingToken: "3xl", liftToken: "3xl", rotationToken: "3xl", scaleDirection: "up", scaleToken: "3xl", springToken: "3xl" },
} satisfies UiMotionRecipeTokens;
export const DEFAULT_MOTION_RECIPE: MotionRecipe = DEFAULT_MOTION_RECIPES.md;
