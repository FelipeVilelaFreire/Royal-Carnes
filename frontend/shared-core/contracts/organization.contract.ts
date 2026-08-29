import type {
  OrganizationId,
  OrganizationSlug,
} from "../types/organization.types";

export interface OrganizationBase {
  id: OrganizationId;
  slug: OrganizationSlug;
  name: string;
  businessName?: string | null;
  locale?: string | null;
  timezone?: string | null;
  currency?: string | null;
}

