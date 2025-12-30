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
 * Get icon identifier for link category (not used anymore - kept for compatibility)
 */
export function getLinkCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    "School Education": "building",
    "Teacher Recruitment": "users",
    "Higher Education": "graduation-cap",
    "Employee Services": "briefcase",
    "Official Orders": "file-text",
  };

  return iconMap[category] || "link";
}
