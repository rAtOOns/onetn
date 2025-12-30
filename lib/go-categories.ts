import type { CardCategory } from "@/components/ui/card";

/**
 * Determine the category color based on GO department or type
 */
export function getGOCategory(
  deptCode?: string,
  deptName?: string,
  goType?: string
): CardCategory {
  // Department-based categorization
  if (deptCode === "fd" || deptName?.toLowerCase().includes("finance")) {
    return "salary"; // Finance = Salary & Pay
  }

  if (deptCode === "sed" || deptName?.toLowerCase().includes("school")) {
    return "reference"; // School Education = Reference
  }

  if (deptCode === "hed" || deptName?.toLowerCase().includes("higher")) {
    return "exam"; // Higher Education = Exams
  }

  if (deptCode === "hd" || deptName?.toLowerCase().includes("health")) {
    return "pension"; // Health = Welfare/Pension related
  }

  // Type-based categorization
  if (goType) {
    const type = goType.toLowerCase();

    if (type.includes("salary") || type.includes("pay") || type.includes("da")) {
      return "salary";
    }

    if (type.includes("leave") || type.includes("service")) {
      return "leave";
    }

    if (type.includes("transfer") || type.includes("posting")) {
      return "transfer";
    }

    if (type.includes("pension") || type.includes("retirement") || type.includes("gpf")) {
      return "pension";
    }

    if (type.includes("exam") || type.includes("test")) {
      return "exam";
    }

    if (type.includes("tax") || type.includes("deduction")) {
      return "tax";
    }
  }

  // Default to reference for education-related GOs
  return "reference";
}

/**
 * Get category icon for the GO - kept for backwards compatibility
 * Actual icons are rendered using lucide-react in components
 */
export function getCategoryIcon(category: CardCategory) {
  // Return simple identifiers that can be mapped to lucide icons in components
  const iconMap: Record<CardCategory, string> = {
    salary: "wallet",
    leave: "calendar",
    pension: "building-2",
    tax: "bar-chart-3",
    transfer: "arrow-right-left",
    exam: "file-text",
    gpf: "briefcase",
    reference: "book-open",
    utility: "wrench",
    default: "file",
  };

  return iconMap[category] || "file";
}
