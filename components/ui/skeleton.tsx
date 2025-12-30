import React from "react";

interface SkeletonProps {
  variant?: "text" | "card" | "avatar" | "button";
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
}

export function Skeleton({
  variant = "text",
  width = "100%",
  height = "1rem",
  className = "",
  count = 1,
}: SkeletonProps) {
  const baseClass = "animate-pulse bg-gray-200 rounded";

  const variants = {
    text: "h-4 w-full",
    card: "h-48 w-full rounded-xl",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24 rounded-lg",
  };

  const style = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  const skeletons = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={`${baseClass} ${variants[variant]} ${className}`}
      style={style}
    />
  ));

  return count === 1 ? skeletons[0] : <div className="space-y-3">{skeletons}</div>;
}

/**
 * Card skeleton loader
 */
export function CardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <div className="flex items-start gap-3">
        <Skeleton variant="avatar" />
        <div className="flex-1 space-y-2">
          <Skeleton height={20} />
          <Skeleton height={16} width="80%" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton height={16} />
        <Skeleton height={16} />
        <Skeleton height={16} width="90%" />
      </div>
      <div className="flex gap-2 pt-2">
        <Skeleton variant="button" width={80} />
        <Skeleton variant="button" width={80} />
      </div>
    </div>
  );
}

/**
 * Grid skeleton loader
 */
interface GridSkeletonProps {
  cols?: 1 | 2 | 3 | 4;
  count?: number;
}

export function GridSkeleton({ cols = 3, count = 6 }: GridSkeletonProps) {
  const gridColStyles = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridColStyles[cols]} gap-4 md:gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
