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
 * Get icon emoji for FAQ category
 */
export function getFaqCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    "Salary & DA": "💰",
    "Leave": "📅",
    "GPF & Pension": "🏦",
    "Transfer": "🔄",
    "Exams": "📝",
    "Service": "📚",
  };

  return iconMap[category] || "❓";
}
