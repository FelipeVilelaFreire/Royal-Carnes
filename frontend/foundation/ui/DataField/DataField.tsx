"use client";

import React, { type HTMLAttributes } from "react";
import { Field, type FieldProps } from "../Field";
import { Text } from "../Text";
import styles from "./DataField.module.css";

export type DataFieldTone = "default" | "muted" | "success" | "warning" | "danger" | "primary";
export type DataFieldValueWeight = "regular" | "semibold" | "bold";

export interface DataFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  description?: React.ReactNode;
  emptyValue?: React.ReactNode;
  label: React.ReactNode;
  level?: FieldProps["level"];
  tone?: DataFieldTone;
  value?: React.ReactNode;
  valueWeight?: DataFieldValueWeight;
  width?: FieldProps["width"];
}

const weightMap: Record<DataFieldValueWeight, string> = {
  bold: "bold",
  regular: "regular",
  semibold: "semibold",
};

export const DataField: React.FC<DataFieldProps> = ({
  className,
  description,
  emptyValue = "",
  label,
  level,
  tone = "default",
  value,
  valueWeight = "semibold",
  width = "full",
  ...props
}) => {
  const resolvedValue = value === undefined || value === null || value === "" ? emptyValue : value;

  return (
    <Field
      {...props}
      className={[styles.dataField, className].filter(Boolean).join(" ")}
      description={description}
      label={label}
      level={level}
      width={width}
    >
      {React.isValidElement(resolvedValue) ? (
        resolvedValue
      ) : (
        <Text
          as="strong"
          className={styles.value}
          data-tone={tone}
          tone={tone === "default" ? "text" : tone}
          variant="body"
          weight={weightMap[valueWeight]}
        >
          {resolvedValue}
        </Text>
      )}
    </Field>
  );
};
