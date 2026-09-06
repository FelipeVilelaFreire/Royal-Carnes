export const formatClientCheckoutMoney = (value: number, locale = "pt-BR", currency = "BRL") =>
  new Intl.NumberFormat(locale, {
    currency,
    style: "currency",
  }).format(value);

export const formatClientCheckoutMeasure = (value: number, unit: string) =>
  `${Number(value.toFixed(1))}${unit}`;
