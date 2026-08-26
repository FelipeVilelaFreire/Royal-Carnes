import React, { useMemo, useState } from "react";
import { Button } from "@foundation/ui/Button";
import { Text } from "@foundation/ui/Text";
import { Surface } from "@foundation/ui/Surface";
import { SectionContainer } from "@foundation/ui/SectionContainer";
import { adminThemeManifest } from "@/manifests/theme.manifest";
import { EditIcon } from "@foundation/ui/Icon/AppIcons";

export interface ListPageProps {
  entityConfig: any;
  onSelectRow?: (row: any) => void;
  onCreateRow?: () => void;
}

export const ListPage: React.FC<ListPageProps> = ({ entityConfig, onSelectRow, onCreateRow }) => {
  const themeColors = (entityConfig as any)?.theme?.colors || adminThemeManifest.colors;
  const { primary, text, textMuted, border, background, surface } = themeColors;
  const config = entityConfig?.listPage || entityConfig || {};

  const title = config.titleKey || config.title || "Lista";
  const subtitle = config.subtitleKey || config.subtitle || "";
  const actionLabel = config.actionLabelKey || config.ctaText || "+ Novo Registro";
  const searchPlaceholder = config.searchPlaceholderKey || config.searchPlaceholder || "Buscar registros...";
  const columns = config.columns || [];
  const rowsSource = config.rows || [];
  const filters = config.filters || [];

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
          {/* Header da Tela Standard (Título, Subtítulo e Ação Primária) */}
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
                <option value="all">Todos ({filter.labelKey || filter.label || filter.key})</option>
                {filter.options?.map((opt: any) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.labelKey || opt.label}
                  </option>
                ))}
              </select>
            ))}
          </div>

          {/* Tabela de Dados Renderizada Declarativamente a partir da Config */}
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
                        {col.labelKey || col.label}
                      </th>
                    ))}
                    <th style={{ padding: "14px 16px", color: textMuted, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" }}>
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length + 1} style={{ padding: "40px", textAlign: "center", color: textMuted, fontSize: "14px" }}>
                        Nenhum registro encontrado.
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
                            {col.render ? col.render(row) : row[col.key]}
                          </td>
                        ))}
                        <td style={{ padding: "16px" }}>
                          <span style={{ color: primary, fontSize: "13px", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                            <EditIcon size={14} color={primary} /> Editar
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "12px", borderTop: `1px solid ${border}` }}>
              <span style={{ fontSize: "13px", color: textMuted }}>
                Exibindo <strong>{filteredRows.length}</strong> de <strong>{rowsSource.length}</strong> registros
              </span>
            </div>
          </Surface>
        </div>
      </SectionContainer>
    </div>
  );
};
