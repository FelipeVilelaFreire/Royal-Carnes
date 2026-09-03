import React, { useMemo, useState } from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { AvatarCell } from "@foundation/ui/Avatar";
import { adminThemeManifest } from "@/manifest/theme.manifest";
import { adminPtBR } from "@/locales/pt-BR";
import { EditIcon } from "@foundation/ui/Icon/AppIcons";

export interface ListPageProps {
  entityConfig: any;
  onSelectRow?: (row: any) => void;
  onCreateRow?: () => void;
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

export const ListPage: React.FC<ListPageProps> = ({ entityConfig, onSelectRow, onCreateRow }) => {
  const themeColors = (entityConfig as any)?.theme?.colors || adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface } = themeColors;
  const config = entityConfig?.listPage || entityConfig || {};

  const title = t(config.titleKey, config.title || adminPtBR.common.records);
  const subtitle = t(config.subtitleKey, config.subtitle || "");
  const actionLabel = t(config.actionLabelKey, config.ctaText || "+ Novo Registro");
  const searchPlaceholder = t(config.searchPlaceholderKey, adminPtBR.common.searchPlaceholder);
  const columns = config.columns || [];
  const rowsSource = config.rows || [];
  const filters = config.filters || [];
  const showActions = Boolean(config.showActions);

  const [search, setSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(filters.map((f: any) => [f.key, "all"]))
  );

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return rowsSource.filter((row: any) => {
      const rowValuesString = Object.values(row).join(" ").toLowerCase();
      const matchesSearch = !normalizedSearch || rowValuesString.includes(normalizedSearch);

      const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
        if (value === "all") return true;
        const rowVal = String(row[key] || "").toLowerCase();
        return rowVal === value.toLowerCase();
      });

      return matchesSearch && matchesFilters;
    });
  }, [rowsSource, search, filterValues]);

  return (
    <div style={{ width: "100%", background, minHeight: "100vh", paddingBottom: "60px" }}>
      <SectionContainer atmosphere="solid" usefulColumns={20} heightRecipe="auto">
        <div style={{ display: "flex", flexDirection: "column", gap: "32px", paddingTop: "20px", width: "100%" }}>
          {/* Header da Tela Standard */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <Text variant="h1" style={{ fontFamily: "'Playfair Display', serif", color: text, fontSize: "40px", margin: 0, fontWeight: "800" }}>
                {title}
              </Text>
              {subtitle && (
                <Text variant="body" style={{ color: textMuted, fontSize: "15px", marginTop: "4px" }}>
                  {subtitle}
                </Text>
              )}
            </div>
            {onCreateRow && (
              <Button appearance="solid" tone="primary" size="md" onClick={onCreateRow}>
                {actionLabel}
              </Button>
            )}
          </div>

          {/* Barra de Busca e Filtros Dinâmicos */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "280px" }}>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: "16px",
                  padding: "12px 20px",
                  color: text,
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            {filters.map((filter: any) => (
              <select
                key={filter.key}
                value={filterValues[filter.key] || "all"}
                onChange={(e) => setFilterValues((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                style={{
                  background: surface,
                  border: `1px solid ${border}`,
                  borderRadius: "16px",
                  padding: "12px 16px",
                  color: text,
                  fontSize: "14px",
                  outline: "none",
                  cursor: "pointer"
                }}
              >
                <option value="all">{adminPtBR.common.allFilter} ({t(filter.labelKey, filter.label || filter.key)})</option>
                {filter.options?.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>
                    {t(opt.labelKey, opt.label)}
                  </option>
                ))}
              </select>
            ))}
          </div>

          {/* Tabela de Dados */}
          <Surface
            style={{
              background: surface,
              border: `1px solid ${border}`,
              borderRadius: "24px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              boxSizing: "border-box"
            }}
          >
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${border}` }}>
                    {columns.map((col: any) => (
                      <th key={col.key} style={{ padding: "14px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {t(col.labelKey, col.label)}
                      </th>
                    ))}
                    {showActions && (
                      <th style={{ padding: "14px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {adminPtBR.common.actions}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + (showActions ? 1 : 0)} style={{ padding: "40px", textAlign: "center", color: textMuted, fontSize: "14px" }}>
                        {adminPtBR.common.emptyState}
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((row: any, idx: number) => (
                      <tr
                        key={idx}
                        style={{ borderBottom: `1px solid ${border}`, cursor: "pointer", transition: "background 0.2s ease" }}
                        onClick={() => onSelectRow && onSelectRow(row)}
                      >
                        {columns.map((col: any) => (
                          <td key={col.key} style={{ padding: "16px", color: text, fontSize: "14px" }}>
                            {col.showAvatar ? (
                              <AvatarCell
                                name={String(row[col.key] || row.name || row.customerName || "")}
                                image={row.image}
                              />
                            ) : col.showMedia ? (
                              <div style={{ display: "inline-flex", alignItems: "center", gap: "12px" }}>
                                {row.image && (
                                  <img
                                    src={row.image}
                                    alt={String(row[col.key] || "")}
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      borderRadius: "10px",
                                      objectFit: "cover",
                                      border: `1px solid ${border}`,
                                      flexShrink: 0
                                    }}
                                  />
                                )}
                                <span style={{ fontWeight: "700", color: text }}>{String(row[col.key] || "")}</span>
                              </div>
                            ) : col.render ? (
                              col.render(row)
                            ) : (
                              row[col.key]
                            )}
                          </td>
                        ))}
                        {showActions && (
                          <td style={{ padding: "16px" }}>
                            <span style={{ color: primary, fontSize: "13px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                              <EditIcon size={14} color={primary} /> {adminPtBR.common.edit}
                            </span>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: `1px solid ${border}` }}>
              <span style={{ fontSize: "13px", color: textMuted }}>
                {adminPtBR.common.showing} <strong>{filteredRows.length}</strong> {adminPtBR.common.of} <strong>{rowsSource.length}</strong> {adminPtBR.common.records}
              </span>
            </div>
          </Surface>
        </div>
      </SectionContainer>
    </div>
  );
};
