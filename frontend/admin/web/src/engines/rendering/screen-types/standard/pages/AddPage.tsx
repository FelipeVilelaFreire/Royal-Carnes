import React, { useState } from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { adminThemeManifest } from "@/manifests/theme.manifest";
import { adminPtBR } from "@/locales/pt-BR";
import { ArrowBackIcon } from "@foundation/ui/Icon/AppIcons";
import type { EntityFormConfig } from "../../config/types";

export interface AddPageProps {
  entityName: string;
  formConfig?: EntityFormConfig;
  onBack: () => void;
  onSubmit: (values: Record<string, any>) => void;
}

function t(key: string, fallback?: string): string {
  if (!key) return fallback || "";
  const parts = key.split(".");
  let current: any = adminPtBR;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = current[part];
    } else {
      return fallback !== undefined ? fallback : key;
    }
  }
  return typeof current === "string" ? current : (fallback || key);
}

export const AddPage: React.FC<AddPageProps> = ({ entityName, formConfig, onBack, onSubmit }) => {
  const themeColors = adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface, surfaceContainer } = themeColors;
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  const handleFieldChange = (key: string, val: any) => {
    setFormValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  return (
    <div style={{ width: "100%", background, minHeight: "100vh", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "20px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Button appearance="outline" tone="neutral" size="sm" onClick={onBack}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <ArrowBackIcon size={16} color={text} /> {adminPtBR.common.back}
              </span>
            </Button>
            <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "36px", margin: 0, fontWeight: "800" }}>
              {adminPtBR.forms.addTitle} {entityName}
            </Text>
          </div>

          <Surface
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "24px",
              padding: "36px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              boxSizing: "border-box",
              maxWidth: "720px"
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {formConfig?.fields?.map((field) => {
                const labelText = t(field.labelKey);
                return (
                  <div key={field.key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={{ fontSize: "14px", color: text, fontWeight: "600" }}>
                      {labelText} {field.required && <span style={{ color: primary }}>*</span>}
                    </label>

                    {field.type === "select" ? (
                      <select
                        value={formValues[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        style={{
                          background: surfaceContainer || surface,
                          border: `1px solid ${border}`,
                          borderRadius: "12px",
                          padding: "14px 16px",
                          color: text,
                          fontSize: "14px",
                          outline: "none"
                        }}
                      >
                        <option value="">{adminPtBR.forms.selectOption}</option>
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {t(opt.labelKey)}
                          </option>
                        ))}
                      </select>
                    ) : field.type === "textarea" ? (
                      <textarea
                        rows={4}
                        value={formValues[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={`${adminPtBR.forms.typePlaceholder} ${labelText.toLowerCase()}...`}
                        style={{
                          background: surfaceContainer || surface,
                          border: `1px solid ${border}`,
                          borderRadius: "12px",
                          padding: "14px 16px",
                          color: text,
                          fontSize: "14px",
                          outline: "none"
                        }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={formValues[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        placeholder={`${adminPtBR.forms.typePlaceholder} ${labelText.toLowerCase()}...`}
                        style={{
                          background: surfaceContainer || surface,
                          border: `1px solid ${border}`,
                          borderRadius: "12px",
                          padding: "14px 16px",
                          color: text,
                          fontSize: "14px",
                          outline: "none"
                        }}
                      />
                    )}
                  </div>
                );
              })}

              <div style={{ display: "flex", gap: "16px", paddingTop: "16px", borderTop: `1px solid ${border}` }}>
                <Button appearance="outline" tone="neutral" size="md" type="button" onClick={onBack} style={{ flex: 1 }}>
                  {adminPtBR.common.cancel}
                </Button>
                <Button appearance="solid" tone="primary" size="md" type="submit" style={{ flex: 1 }}>
                  {adminPtBR.common.save} {entityName}
                </Button>
              </div>
            </form>
          </Surface>
        </div>
      </SectionContainer>
    </div>
  );
};
