"use client";

import React, { useEffect, useRef, useState } from "react";

export interface ScrollToAppearProps {
  children: React.ReactNode;
  delayMs?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  distancePx?: number;
  durationMs?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const ScrollToAppear: React.FC<ScrollToAppearProps> = ({
  children,
  delayMs = 0,
  direction = "up",
  distancePx = 32,
  durationMs = 800,
  style,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      {
        root: null,
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return "translate3d(0, 0, 0)";
    switch (direction) {
      case "up":
        return `translate3d(0, ${distancePx}px, 0)`;
      case "down":
        return `translate3d(0, -${distancePx}px, 0)`;
      case "left":
        return `translate3d(${distancePx}px, 0, 0)`;
      case "right":
        return `translate3d(-${distancePx}px, 0, 0)`;
      case "none":
        return "translate3d(0, 0, 0)";
    }
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms, transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delayMs}ms`,
        willChange: "opacity, transform",
        width: "100%",
        ...style
      }}
    >
      {children}
    </div>
  );
};
