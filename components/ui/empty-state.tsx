import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  titleTamil?: string;
  description?: string;
  descriptionTamil?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  titleTamil,
  description,
  descriptionTamil,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center py-12 px-4
        rounded-xl bg-gray-50 border border-gray-200
        ${className}
      `}
    >
      {icon && (
        <div className="mb-4 p-4 rounded-lg bg-gray-100 text-gray-400">
          {icon}
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-900 text-center">
        {title}
      </h3>
      {titleTamil && (
        <p className="text-sm text-gray-600 tamil text-center" lang="ta">
          {titleTamil}
        </p>
      )}

      {description && (
        <p className="mt-2 text-sm text-gray-600 text-center max-w-md">
          {description}
        </p>
      )}
      {descriptionTamil && (
        <p className="text-xs text-gray-500 tamil text-center max-w-md" lang="ta">
          {descriptionTamil}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 px-4 py-2 bg-tn-primary text-white rounded-lg hover:bg-tn-highlight transition-colors text-sm font-medium"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
