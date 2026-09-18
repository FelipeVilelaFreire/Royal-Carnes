export const FORMATTED_INPUT_FORMATS = ["cpf", "cnpj", "taxIdBR", "phoneBR", "postalCodeBR", "decimalBR"] as const;

export type FormattedInputFormat = (typeof FORMATTED_INPUT_FORMATS)[number];
