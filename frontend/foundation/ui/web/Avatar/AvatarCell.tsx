import React from "react";
import styles from "./AvatarCell.module.css";

export interface AvatarCellProps {
  accentColor?: string;
  as?: "div" | "span";
  name?: string;
  image?: string;
  size?: "sm" | "md" | "lg";
  showInitials?: boolean;
  subtitle?: string;
  showName?: boolean;
  style?: React.CSSProperties;
}

function getInitials(name?: string): string {
  if (!name) return "RP";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function resolveAccentStyle(accentColor?: string): React.CSSProperties | undefined {
  if (!accentColor || !/^#[0-9a-f]{6}$/i.test(accentColor)) return undefined;
  return { "--ui-avatar-accent-color": accentColor } as React.CSSProperties;
}

export const AvatarCell: React.FC<AvatarCellProps> = ({
  accentColor,
  as: Component = "div",
  name = "",
  image,
  size = "md",
  showInitials = true,
  subtitle,
  showName = true,
  style
}) => {
  const initials = getInitials(name);
  const accentStyle = resolveAccentStyle(accentColor);
  const avatarStyle = { ...accentStyle, ...style };

  return (
    <Component className={styles.root} data-size={size} style={avatarStyle}>
      {image ? (
        <img
          alt={name}
          className={styles.media}
          src={image}
        />
      ) : (
        <div aria-hidden={showInitials ? undefined : true} className={styles.initials} data-accent-color={accentStyle ? "true" : undefined}>
          {showInitials ? initials : null}
        </div>
      )}

      {showName && name && (
        <div className={styles.content}>
          <span className={styles.name}>
            {name}
          </span>
          {subtitle && (
            <span className={styles.subtitle}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Component>
  );
};
