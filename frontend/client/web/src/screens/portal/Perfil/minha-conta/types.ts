import type { ClientCustomerTabKey } from "@royalprime/client/hooks/useClientCustomer";
import type { ClientStrings } from "@royalprime/client/hooks/useClientStrings";

export type MinhaContaStrings = ClientStrings["minhaContaV2"];

export interface AccountTabItem {
  key: ClientCustomerTabKey;
  label: string;
}
