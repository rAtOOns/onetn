import React from "react";

export type CardCategory =
  | "salary"
  | "leave"
  | "pension"
  | "tax"
  | "transfer"
  | "exam"
  | "gpf"
  | "reference"
  | "utility"
  | "default";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  category?: CardCategory;
  variant?: "default" | "elevated" | "outlined";
  hoverable?: boolean;
  children: React.ReactNode;
}

const categoryColors: Record<CardCategory, { bg: string; border: string; accent: string }> = {
  salary: {
    bg: "bg-pink-50",
    border: "border-pink-200",
    accent: "from-pink-500 to-pink-600",
  },
  leave: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    accent: "from-blue-500 to-blue-600",
  },
  pension: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    accent: "from-amber-500 to-amber-600",
  },
  tax: {
    bg: "bg-red-50",
    border: "border-red-200",
    accent: "from-red-500 to-red-600",
  },
  transfer: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    accent: "from-purple-500 to-purple-600",
  },
  exam: {
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    accent: "from-cyan-500 to-cyan-600",
  },
  gpf: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    accent: "from-emerald-500 to-emerald-600",
  },
  reference: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    accent: "from-indigo-500 to-indigo-600",
  },
  utility: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    accent: "from-orange-500 to-orange-600",
  },
  default: {
    bg: "bg-white",
    border: "border-gray-200",
    accent: "from-tn-primary to-tn-secondary",
  },
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      category = "default",
      variant = "default",
      hoverable = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const colors = categoryColors[category];

    const variantStyles = {
      default: `${colors.bg} border border-gray-200`,
      elevated: `${colors.bg} border border-gray-200 shadow-md`,
      outlined: `bg-white border-2 ${colors.border}`,
    };

    const hoverClass = hoverable
      ? "transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
      : "transition-all duration-200";

    return (
      <div
        ref={ref}
        className={`
          rounded-xl p-6
          ${variantStyles[variant]}
          ${hoverClass}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

/**
 * Card header with optional category accent
 */
interface CardHeaderProps {
  title: string;
  titleTamil?: string;
  subtitle?: string;
  subtitleTamil?: string;
  icon?: React.ReactNode;
  category?: CardCategory;
  className?: string;
}

export function CardHeader({
  title,
  titleTamil,
  subtitle,
  subtitleTamil,
  icon,
  category = "default",
  className = "",
}: CardHeaderProps) {
  const colors = categoryColors[category];

  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className={`
              w-12 h-12 rounded-lg bg-gradient-to-br ${colors.accent}
              p-2.5 flex-shrink-0 text-white
            `}
          >
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {titleTamil && (
            <p className="text-sm text-gray-600 tamil" lang="ta">
              {titleTamil}
            </p>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
          {subtitleTamil && (
            <p className="text-sm text-gray-500 tamil" lang="ta">
              {subtitleTamil}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Card content area
 */
interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`space-y-3 ${className}`}>{children}</div>;
}

/**
 * Card footer
 */
interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-200 flex gap-2 ${className}`}>
      {children}
    </div>
  );
}
