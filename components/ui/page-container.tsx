import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: "none" | "sm" | "md" | "lg";
}

const maxWidthStyles: Record<string, string> = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-full",
  full: "max-w-full",
};

const paddingStyles: Record<string, string> = {
  none: "px-0 py-0",
  sm: "px-4 py-4 md:px-6 md:py-6",
  md: "px-4 py-6 md:px-8 md:py-8",
  lg: "px-4 py-8 md:px-10 md:py-12",
};

export default function PageContainer({
  children,
  className = "",
  maxWidth = "lg",
  padding = "md",
}: PageContainerProps) {
  return (
    <div className={`w-full ${paddingStyles[padding]}`}>
      <div
        className={`
          container mx-auto
          ${maxWidthStyles[maxWidth]}
          ${className}
        `}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Content section component for consistent spacing between sections
 */
interface SectionProps {
  children: React.ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg";
}

const spacingStyles: Record<string, string> = {
  sm: "space-y-4",
  md: "space-y-6 md:space-y-8",
  lg: "space-y-8 md:space-y-10",
};

export function Section({
  children,
  className = "",
  spacing = "md",
}: SectionProps) {
  return <section className={`${spacingStyles[spacing]} ${className}`}>{children}</section>;
}

/**
 * Grid layout component for consistent responsive grids
 */
interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
  gap?: "sm" | "md" | "lg";
  className?: string;
}

const gridColStyles: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

const gapStyles: Record<string, string> = {
  sm: "gap-3 md:gap-4",
  md: "gap-4 md:gap-6",
  lg: "gap-6 md:gap-8",
};

export function Grid({
  children,
  cols = 3,
  gap = "md",
  className = "",
}: GridProps) {
  return (
    <div
      className={`
        grid
        ${gridColStyles[cols]}
        ${gapStyles[gap]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
