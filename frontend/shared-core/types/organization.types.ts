export type OrganizationId = string | number;
export type OrganizationSlug = string;

export interface TenantContext {
  organizationId?: OrganizationId;
  organizationSlug: OrganizationSlug;
}
