import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://onetn-portal-734553869592.asia-south1.run.app";

interface ToolMetadataParams {
  title: string;
  titleTamil: string;
  description: string;
  keywords?: string[];
  slug: string;
}

/**
 * Generate SEO metadata for tool pages
 */
export function generateToolMetadata({
  title,
  titleTamil,
  description,
  keywords = [],
  slug,
}: ToolMetadataParams): Metadata {
  const fullTitle = `${title} | One TN Portal`;
  const fullDescription = `${description} | ${titleTamil} - Free online calculator for Tamil Nadu government employees.`;

  const defaultKeywords = [
    "Tamil Nadu",
    "TN Government",
    "Education Department",
    "Calculator",
    "Government Employee",
    titleTamil,
  ];

  return {
    title: fullTitle,
    description: fullDescription,
    keywords: [...defaultKeywords, ...keywords],
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}/tools/${slug}`,
      siteName: "One TN Portal",
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    alternates: {
      canonical: `${siteUrl}/tools/${slug}`,
    },
  };
}

// Pre-defined metadata for all tools
export const TOOL_METADATA: Record<string, ToolMetadataParams> = {
  "salary-calculator": {
    title: "Salary Calculator",
    titleTamil: "சம்பள கால்குலேட்டர்",
    description: "Calculate TN Government employee salary with 7th Pay Commission, DA, HRA, and all allowances",
    keywords: ["7th pay commission", "DA calculator", "HRA calculator", "TN salary"],
    slug: "salary-calculator",
  },
  "pay-matrix": {
    title: "Pay Matrix Lookup",
    titleTamil: "சம்பள அட்டவணை",
    description: "7th Pay Commission Pay Matrix table lookup for Tamil Nadu Government employees",
    keywords: ["pay matrix", "7th CPC", "pay scale", "pay level"],
    slug: "pay-matrix",
  },
  "increment-calculator": {
    title: "Increment Calculator",
    titleTamil: "ஊதிய உயர்வு கால்குலேட்டர்",
    description: "Calculate next increment date and amount for TN government employees",
    keywords: ["annual increment", "3% increment", "increment date"],
    slug: "increment-calculator",
  },
  "da-rates": {
    title: "DA Rate Table",
    titleTamil: "அகவிலைப்படி விகிதம்",
    description: "Current and historical Dearness Allowance rates for Tamil Nadu from 2001",
    keywords: ["DA rate", "dearness allowance", "DA history", "DA percentage"],
    slug: "da-rates",
  },
  "arrears-calculator": {
    title: "DA Arrears Calculator",
    titleTamil: "நிலுவை கால்குலேட்டர்",
    description: "Calculate DA arrears when dearness allowance rate increases",
    keywords: ["DA arrears", "arrears calculation", "backpay"],
    slug: "arrears-calculator",
  },
  "pay-fixation": {
    title: "Pay Fixation Calculator",
    titleTamil: "ஊதிய நிர்ணய கால்குலேட்டர்",
    description: "Calculate pay fixation on promotion, MACP, or grade change",
    keywords: ["pay fixation", "promotion pay", "MACP", "grade pay"],
    slug: "pay-fixation",
  },
  "pension-calculator": {
    title: "Pension Calculator",
    titleTamil: "ஓய்வூதிய கால்குலேட்டர்",
    description: "Calculate monthly pension, commutation, and family pension for TN employees",
    keywords: ["pension", "commutation", "family pension", "retirement"],
    slug: "pension-calculator",
  },
  "gratuity-calculator": {
    title: "Gratuity Calculator",
    titleTamil: "நன்கொடை கால்குலேட்டர்",
    description: "Calculate gratuity amount based on service and last pay drawn",
    keywords: ["gratuity", "retirement benefit", "service gratuity"],
    slug: "gratuity-calculator",
  },
  "leave-encashment-calculator": {
    title: "Leave Encashment Calculator",
    titleTamil: "விடுப்பு பணமாக்கல் கால்குலேட்டர்",
    description: "Calculate EL and HPL encashment amount at retirement",
    keywords: ["leave encashment", "EL encashment", "HPL", "earned leave"],
    slug: "leave-encashment-calculator",
  },
  "income-tax-calculator": {
    title: "Income Tax Calculator",
    titleTamil: "வருமான வரி கால்குலேட்டர்",
    description: "Compare Old vs New tax regime for TN government employees",
    keywords: ["income tax", "tax regime", "old vs new tax", "section 80C"],
    slug: "income-tax-calculator",
  },
  "hra-calculator": {
    title: "HRA Exemption Calculator",
    titleTamil: "HRA விலக்கு கால்குலேட்டர்",
    description: "Calculate HRA tax exemption under Section 10(13A)",
    keywords: ["HRA exemption", "house rent allowance", "section 10(13A)"],
    slug: "hra-calculator",
  },
  "tpf-calculator": {
    title: "TPF Calculator",
    titleTamil: "TPF கால்குலேட்டர்",
    description: "Calculate Tamil Nadu Provident Fund interest and generate statement",
    keywords: ["TPF", "provident fund", "GPF", "PF interest"],
    slug: "tpf-calculator",
  },
  "gpf-interest-calculator": {
    title: "GPF Interest Calculator",
    titleTamil: "GPF வட்டி கால்குலேட்டர்",
    description: "Calculate yearly GPF interest with monthly breakdown",
    keywords: ["GPF interest", "GPF rate", "provident fund interest"],
    slug: "gpf-interest-calculator",
  },
  "nps-calculator": {
    title: "NPS Calculator",
    titleTamil: "NPS கால்குலேட்டர்",
    description: "Calculate NPS corpus for employees who joined after 2003",
    keywords: ["NPS", "National Pension System", "new pension scheme"],
    slug: "nps-calculator",
  },
  "service-calculator": {
    title: "Service Calculator",
    titleTamil: "பணிக்கால கால்குலேட்டர்",
    description: "Calculate total service period and retirement date",
    keywords: ["service period", "qualifying service", "retirement date"],
    slug: "service-calculator",
  },
  "leave-calculator": {
    title: "Leave Balance Calculator",
    titleTamil: "விடுப்பு நிலுவை கால்குலேட்டர்",
    description: "Track and calculate CL, EL, ML and other leave balances",
    keywords: ["leave balance", "CL", "EL", "ML", "casual leave", "earned leave"],
    slug: "leave-calculator",
  },
  "age-calculator": {
    title: "Age Calculator",
    titleTamil: "வயது கால்குலேட்டர்",
    description: "Calculate exact age in years, months, and days for admissions and records",
    keywords: ["age calculator", "date of birth", "exact age"],
    slug: "age-calculator",
  },
  "retirement-summary": {
    title: "Retirement Summary",
    titleTamil: "ஓய்வு சுருக்கம்",
    description: "One-page view of all retirement benefits including pension, gratuity, GPF",
    keywords: ["retirement benefits", "pension summary", "gratuity", "GPF"],
    slug: "retirement-summary",
  },
  "holiday-calendar": {
    title: "Holiday Calendar 2025",
    titleTamil: "விடுமுறை நாட்கள்",
    description: "Tamil Nadu Government holidays list for 2025",
    keywords: ["TN holidays", "government holidays", "2025 calendar"],
    slug: "holiday-calendar",
  },
  "transfer-rules": {
    title: "Transfer Rules & Process",
    titleTamil: "இடமாற்ற விதிகள்",
    description: "Transfer counseling process and rules guide for TN education department",
    keywords: ["transfer", "posting", "counseling", "transfer rules"],
    slug: "transfer-rules",
  },
  "surrender-leave-calculator": {
    title: "Surrender Leave Calculator",
    titleTamil: "விடுப்பு சரண் கால்குலேட்டர்",
    description: "Calculate surrender leave encashment amount",
    keywords: ["surrender leave", "leave encashment", "surrender EL"],
    slug: "surrender-leave-calculator",
  },
  "voluntary-retirement": {
    title: "Voluntary Retirement Calculator",
    titleTamil: "தன்னார்வ ஓய்வு கால்குலேட்டர்",
    description: "Calculate VRS benefits and eligibility for voluntary retirement",
    keywords: ["VRS", "voluntary retirement", "early retirement"],
    slug: "voluntary-retirement",
  },
};

/**
 * Get metadata for a specific tool
 */
export function getToolMetadata(slug: string): Metadata {
  const toolData = TOOL_METADATA[slug];
  if (!toolData) {
    return {
      title: "Tool | One TN Portal",
      description: "Calculator tool for Tamil Nadu government employees",
    };
  }
  return generateToolMetadata(toolData);
}
