import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://onetn-portal-734553869592.asia-south1.run.app";

// All 65 tools - keep this list in sync with app/tools/layout.tsx
const tools = [
  // Salary & Pay (9 tools)
  "salary-calculator",
  "pay-matrix",
  "increment-calculator",
  "da-rates",
  "arrears-calculator",
  "pay-fixation",
  "pay-slip-decoder",
  "increment-arrears",
  "stepping-up-calculator",
  // Tax & Deductions (3 tools)
  "income-tax-calculator",
  "hra-calculator",
  "hra-city-category",
  // Provident Fund (5 tools)
  "tpf-calculator",
  "loan-calculator",
  "gpf-interest-calculator",
  "nps-calculator",
  "tngis-calculator",
  // Retirement Planning (7 tools)
  "retirement-summary",
  "pension-calculator",
  "gratuity-calculator",
  "leave-encashment-calculator",
  "die-in-harness",
  "voluntary-retirement",
  "commutation-restoration",
  // Service & Leave (9 tools)
  "service-calculator",
  "leave-calculator",
  "leave-rules",
  "surrender-leave-calculator",
  "ltc-calculator",
  "eol-impact",
  "special-leave-calculator",
  "probation-tracker",
  "study-leave",
  // Service Matters (22 tools)
  "transfer-rules",
  "promotion-info",
  "loans-advances",
  "exam-duty-calculator",
  "medical-reimbursement",
  "ta-bill-calculator",
  "service-book-checklist",
  "document-checklists",
  "seniority-calculator",
  "tntet-score-calculator",
  "student-strength-calculator",
  "loan-emi-calculator",
  "rte-compliance",
  "deputation-guide",
  "compassionate-appointment",
  "apar-guide",
  "children-education-allowance",
  "festival-advance",
  "hostel-subsidy",
  "workload-calculator",
  "staff-pattern",
  // Date & Time (3 tools)
  "age-calculator",
  "date-difference",
  "working-days",
  // Reference (7 tools)
  "holiday-calendar",
  "important-dates",
  "ta-da-rates",
  "contact-directory",
  "abbreviations",
  "emis-guide",
  "academic-calendar",
  // Utilities (1 tool)
  "number-to-words",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages = tools.map((tool) => ({
    url: `${siteUrl}/tools/${tool}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/go`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/exams`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/forms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/links`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...toolPages,
  ];
}
