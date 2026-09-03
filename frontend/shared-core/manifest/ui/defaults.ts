import { royalPrimeButtonDefaults } from "./button";
import { royalPrimeCardDefaults } from "./card";
import { royalPrimeIconDefaults } from "./icon";
import { royalPrimeLayoutDefaults } from "./layout";
import { royalPrimeTextDefaults } from "./text";
import { royalPrimeSurfaceDefaults } from "../semi-composed/surface";

export const royalPrimeUiDefaults = {
  componentDensity: "comfortable",
  focusRing: true,
  layout: royalPrimeLayoutDefaults,
  surface: royalPrimeSurfaceDefaults,
  text: royalPrimeTextDefaults,
  icon: royalPrimeIconDefaults,
  button: royalPrimeButtonDefaults,
  card: royalPrimeCardDefaults,
};

export const royalPrimeDesignSystemDefaults = royalPrimeUiDefaults;
