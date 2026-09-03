import type { MouseEvent } from "react";
import type { ResolvedAppShellNavigationItem } from "../foundation";

export const handleAppShellNavigation = (
  event: MouseEvent,
  item: ResolvedAppShellNavigationItem,
  onNavigate?: (path: string) => void,
  afterNavigate?: () => void
) => {
  afterNavigate?.();
  if (item.type === "scroll" && item.targetId) {
    event.preventDefault();
    document.getElementById(item.targetId)?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (onNavigate) {
    event.preventDefault();
    onNavigate(item.routePath);
  }
};
