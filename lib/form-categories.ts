import type { CardCategory } from "@/components/ui/card";

/**
 * Map form category name to card category color
 */
export function getFormCardCategory(category: string): CardCategory {
  const categoryMap: Record<string, CardCategory> = {
    "Leave": "leave",
    "GPF": "gpf",
    "Transfer": "transfer",
    "Pension": "pension",
    "Service": "reference",
    "Loan": "salary", // Loans are salary-related advances
    "All": "default",
  };

  return categoryMap[category] || "default";
}

/**
 * Get icon emoji for form category
 */
export function getFormCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    "Leave": "📅",
    "GPF": "💼",
    "Transfer": "🔄",
    "Pension": "🏛️",
    "Service": "📚",
    "Loan": "💰",
  };

  return iconMap[category] || "📄";
}
