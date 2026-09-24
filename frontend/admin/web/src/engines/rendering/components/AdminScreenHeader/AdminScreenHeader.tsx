import React from "react";
import { ScreenHeader } from "@foundation/product-components/screens/web/ScreenHeader";

export interface AdminScreenHeaderProps {
  actions?: React.ReactNode;
  description?: string;
  eyebrow?: string;
  metadata?: React.ReactNode;
  title: string;
}

export const AdminScreenHeader: React.FC<AdminScreenHeaderProps> = ({ actions, description, eyebrow, metadata, title }) => (
  <ScreenHeader
    actions={actions}
    actionsAlign="end"
    contentWidth="full"
    containerInset="sectionFull"
    containerWidth="full"
    description={description}
    descriptionVariant="caption"
    eyebrow={eyebrow}
    mobileGutter="none"
    mobileMode="collapsible"
    metadata={metadata}
    metadataPosition="title"
    title={title}
  />
);
