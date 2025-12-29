"use client";

import React, { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelTamil?: string;
  error?: string;
  hint?: string;
  hintTamil?: string;
  required?: boolean;
  icon?: React.ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      labelTamil,
      error,
      hint,
      hintTamil,
      required,
      icon,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    return (
      <div className="space-y-1">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
          {labelTamil && (
            <span className="block text-xs text-gray-500 tamil" lang="ta">
              {labelTamil}
            </span>
          )}
        </label>

        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-label={labelTamil ? `${label} (${labelTamil})` : label}
            aria-required={required}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={
              [error ? errorId : null, hint ? hintId : null]
                .filter(Boolean)
                .join(" ") || undefined
            }
            className={`
              w-full px-3 py-2 border rounded-lg transition-colors
              focus:ring-2 focus:ring-tn-primary focus:outline-none
              disabled:bg-gray-100 disabled:cursor-not-allowed
              ${icon ? "pl-10" : ""}
              ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1 text-sm text-red-600"
          >
            <AlertCircle size={14} aria-hidden="true" />
            {error}
          </p>
        )}

        {hint && !error && (
          <p id={hintId} className="text-xs text-gray-500">
            {hint}
            {hintTamil && (
              <span className="block tamil" lang="ta">
                {hintTamil}
              </span>
            )}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

interface FormSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  labelTamil?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: Array<{ value: string; label: string; labelTamil?: string }>;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      labelTamil,
      error,
      hint,
      required,
      options,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, "-")}`;
    const errorId = `${selectId}-error`;

    return (
      <div className="space-y-1">
        <label
          htmlFor={selectId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="text-red-500 ml-1" aria-hidden="true">
              *
            </span>
          )}
          {labelTamil && (
            <span className="block text-xs text-gray-500 tamil" lang="ta">
              {labelTamil}
            </span>
          )}
        </label>

        <select
          ref={ref}
          id={selectId}
          aria-label={labelTamil ? `${label} (${labelTamil})` : label}
          aria-required={required}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`
            w-full px-3 py-2 border rounded-lg transition-colors
            focus:ring-2 focus:ring-tn-primary focus:outline-none
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300"}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
              {option.labelTamil && ` (${option.labelTamil})`}
            </option>
          ))}
        </select>

        {error && (
          <p
            id={errorId}
            role="alert"
            className="flex items-center gap-1 text-sm text-red-600"
          >
            <AlertCircle size={14} aria-hidden="true" />
            {error}
          </p>
        )}

        {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

interface FormCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelTamil?: string;
  hint?: string;
}

export const FormCheckbox = forwardRef<HTMLInputElement, FormCheckboxProps>(
  ({ label, labelTamil, hint, className = "", id, ...props }, ref) => {
    const checkboxId =
      id || `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <div className="flex items-start gap-2">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          aria-label={labelTamil ? `${label} (${labelTamil})` : label}
          className={`
            mt-1 h-4 w-4 rounded border-gray-300 text-tn-primary
            focus:ring-2 focus:ring-tn-primary focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        <label htmlFor={checkboxId} className="text-sm text-gray-700">
          {label}
          {labelTamil && (
            <span className="block text-xs text-gray-500 tamil" lang="ta">
              {labelTamil}
            </span>
          )}
          {hint && <span className="block text-xs text-gray-500">{hint}</span>}
        </label>
      </div>
    );
  }
);

FormCheckbox.displayName = "FormCheckbox";

// Results display component with accessibility
interface ResultRowProps {
  label: string;
  labelTamil?: string;
  value: string | number;
  valueTamil?: string;
  highlight?: boolean;
  className?: string;
}

export function ResultRow({
  label,
  labelTamil,
  value,
  valueTamil,
  highlight = false,
  className = "",
}: ResultRowProps) {
  return (
    <div
      className={`
        flex justify-between items-center py-2
        ${highlight ? "font-semibold text-tn-primary bg-emerald-50 px-3 -mx-3 rounded" : ""}
        ${className}
      `}
      role="row"
    >
      <span className="text-gray-600" role="cell">
        {label}
        {labelTamil && (
          <span className="block text-xs text-gray-500 tamil" lang="ta">
            {labelTamil}
          </span>
        )}
      </span>
      <span
        className={`font-medium ${highlight ? "text-lg" : ""}`}
        role="cell"
        aria-label={`${label}: ${value}`}
      >
        {value}
        {valueTamil && (
          <span className="block text-xs text-gray-500 tamil text-right" lang="ta">
            {valueTamil}
          </span>
        )}
      </span>
    </div>
  );
}

// Section header for form groups
interface FormSectionProps {
  title: string;
  titleTamil?: string;
  children: React.ReactNode;
}

export function FormSection({ title, titleTamil, children }: FormSectionProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold text-gray-800 border-b pb-2 w-full">
        {title}
        {titleTamil && (
          <span className="block text-sm font-normal text-gray-500 tamil" lang="ta">
            {titleTamil}
          </span>
        )}
      </legend>
      {children}
    </fieldset>
  );
}
