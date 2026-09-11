import type { clientPtBR } from "./pt-BR";

export type ClientStrings = typeof clientPtBR;
export type ClientLocale = "pt-BR" | "en-US" | "de-DE";

export type ClientStringsOverrides = {
  [Key in keyof ClientStrings]?: ClientStrings[Key] extends readonly unknown[]
    ? ClientStrings[Key]
    : ClientStrings[Key] extends object
      ? ClientStringsOverridesFor<ClientStrings[Key]>
      : ClientStrings[Key];
};

type ClientStringsOverridesFor<Value extends object> = {
  [Key in keyof Value]?: Value[Key] extends readonly unknown[]
    ? Value[Key]
    : Value[Key] extends object
      ? ClientStringsOverridesFor<Value[Key]>
      : Value[Key];
};
