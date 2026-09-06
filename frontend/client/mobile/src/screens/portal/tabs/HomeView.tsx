import React from "react";
import { Stack } from "../../../ui/Layout";
import { createHomeModel, type HomeModelInput } from "./home.model";

export interface HomeViewProps extends HomeModelInput {}

export const HomeView: React.FC<HomeViewProps> = (props) => {
  const model = createHomeModel(props);

  return <Stack>{model.sections}</Stack>;
};
