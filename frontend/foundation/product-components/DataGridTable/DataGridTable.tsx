import React from "react";
import { Card } from "../../ui/Card/Card";

export interface DataGridColumn<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataGridTableProps<T> {
  columns: DataGridColumn<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataGridTable<T>({
  columns,
  data,
  emptyMessage = "Nenhum registro encontrado."
}: DataGridTableProps<T>) {
  return (
    <Card style={{ padding: 0, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "rgba(255, 255, 255, 0.05)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: "14px 18px", fontSize: "14px", fontWeight: "600" }}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: "24px", textAlign: "center", opacity: 0.6 }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: "14px 18px", fontSize: "14px" }}>
                    {col.render ? col.render(row) : (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}
