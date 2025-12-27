import { FileText, Scroll, FileUp, HelpCircle } from "lucide-react";

interface DocumentTypeBadgeProps {
  fileType?: string;
  category?: string;
  goNumber?: string;
  size?: "sm" | "md" | "lg";
}

export default function DocumentTypeBadge({
  fileType = "pdf",
  category,
  goNumber,
  size = "md",
}: DocumentTypeBadgeProps) {
  // Determine document type based on category or GO number
  let type = "Document";
  let icon = FileText;
  let bgColor = "bg-blue-50";
  let textColor = "text-blue-700";

  if (goNumber && category?.toLowerCase().includes("government")) {
    type = "GO";
    bgColor = "bg-green-50";
    textColor = "text-green-700";
  } else if (category?.toLowerCase().includes("circular")) {
    type = "Circular";
    icon = Scroll;
    bgColor = "bg-purple-50";
    textColor = "text-purple-700";
  } else if (category?.toLowerCase().includes("form")) {
    type = "Form";
    icon = FileUp;
    bgColor = "bg-orange-50";
    textColor = "text-orange-700";
  } else if (category?.toLowerCase().includes("scheme")) {
    type = "Scheme";
    icon = HelpCircle;
    bgColor = "bg-amber-50";
    textColor = "text-amber-700";
  }

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const Icon = icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${bgColor} ${textColor} ${sizeClasses[size]}`}
      title={`Document Type: ${type}`}
    >
      <Icon size={iconSizes[size]} aria-hidden="true" />
      {type}
    </span>
  );
}
