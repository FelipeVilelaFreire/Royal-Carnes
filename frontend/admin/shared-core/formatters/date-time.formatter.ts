const ADMIN_TIME_ZONE = "America/Sao_Paulo";

function parseDateTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatAdminDate(value: string | null | undefined): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }
  const date = parseDateTime(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    timeZone: ADMIN_TIME_ZONE,
    year: "numeric",
  }).format(date);
}

export function formatAdminDateTime(value: string | null | undefined): string {
  const date = parseDateTime(value);
  if (!date) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: ADMIN_TIME_ZONE,
  }).format(date);
}
