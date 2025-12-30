import type { CardCategory } from "@/components/ui/card";

/**
 * Map FAQ category name to card category color
 */
export function getFaqCardCategory(category: string): CardCategory {
  const categoryMap: Record<string, CardCategory> = {
    "Salary & DA": "salary",
    "Leave": "leave",
    "GPF & Pension": "pension",
    "Transfer": "transfer",
    "Exams": "exam",
    "Service": "reference",
    "All": "default",
  };

  return categoryMap[category] || "default";
}

/**
 * Get icon identifier for FAQ category (not used anymore - kept for compatibility)
 */
export function getFaqCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    "Salary & DA": "wallet",
    "Leave": "calendar",
    "GPF & Pension": "bank",
    "Transfer": "arrow-right-left",
    "Exams": "file-text",
    "Service": "book-open",
  };

  return iconMap[category] || "help-circle";
}
