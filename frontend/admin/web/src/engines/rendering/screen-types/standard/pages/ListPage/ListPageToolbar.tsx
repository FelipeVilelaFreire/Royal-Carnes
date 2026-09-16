import React from "react";
import { Card } from "@foundation/ui/web/Card";
import { DropdownPicker } from "@foundation/ui/web/DropdownPicker";
import { Input } from "@foundation/ui/web/Input";
import { SearchIcon } from "@foundation/ui/web/Icon/AppIcons";
import type { AdminTranslate } from "@/locales/i18n";
import type { AdminStandardListViewModel } from "@/view-models/standard.view-model";
import styles from "./ListPage.module.css";

interface ListPageToolbarProps { onSearchChange: (value: string) => void; onSetFilter: (key: string, value: string) => void; search: string; t: AdminTranslate; viewModel: AdminStandardListViewModel; }

export const ListPageToolbar: React.FC<ListPageToolbarProps> = ({ onSearchChange, onSetFilter, search, t, viewModel }) => <Card className={styles.toolbarCard} size="sm"><div className={styles.toolbar}><Input className={styles.searchInput} icon={<SearchIcon aria-hidden="true" />} label={t("standard.searchLabel")} onChange={(event) => onSearchChange(event.target.value)} placeholder={t(viewModel.searchPlaceholderKey || "common.searchPlaceholder")} type="search" value={search} />{viewModel.filters.map((filter) => <DropdownPicker ariaLabel={t(filter.labelKey, filter.key)} className={[styles.filterPicker, filter.key === "status" ? styles.statusFilterPicker : ""].filter(Boolean).join(" ")} key={filter.key} label={t(filter.labelKey, filter.key)} onChange={(value) => onSetFilter(filter.key, value)} options={[{ label: `${t("common.allFilter")} ${t(filter.labelKey, filter.key)}`, value: "all" }, ...filter.options.map((option) => ({ label: t(option.labelKey, option.value), value: option.value }))]} value={filter.value} />)}</div></Card>;
