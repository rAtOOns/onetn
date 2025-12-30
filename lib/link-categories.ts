import type { CardCategory } from "@/components/ui/card";

/**
 * Map link category name to card category color
 */
export function getLinkCardCategory(category: string): CardCategory {
  const categoryMap: Record<string, CardCategory> = {
    "School Education": "reference",
    "Teacher Recruitment": "exam",
    "Higher Education": "reference",
    "Employee Services": "salary",
    "Official Orders": "reference",
    "all": "default",
  };

  return categoryMap[category] || "default";
}

/**
 * Get icon emoji for link category
 */
export function getLinkCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    "School Education": "🏫",
    "Teacher Recruitment": "👨‍🏫",
    "Higher Education": "🎓",
    "Employee Services": "💼",
    "Official Orders": "📋",
  };

  return iconMap[category] || "🔗";
}
