const fs = require('fs');
const path = require('path');

// Tool metadata definitions
const toolsMetadata = {
  "pay-matrix": {
    title: "Pay Matrix Lookup",
    titleTamil: "சம்பள அட்டவணை",
    description: "7th Pay Commission Pay Matrix table lookup for Tamil Nadu Government employees",
    keywords: ["pay matrix", "7th CPC", "pay scale", "pay level", "TN pay matrix"],
  },
  "increment-calculator": {
    title: "Increment Calculator",
    titleTamil: "ஊதிய உயர்வு கால்குலேட்டர்",
    description: "Calculate next increment date and amount for TN government employees",
    keywords: ["annual increment", "3% increment", "increment date", "TN increment"],
  },
  "da-rates": {
    title: "DA Rate Table",
    titleTamil: "அகவிலைப்படி விகிதம்",
    description: "Current and historical Dearness Allowance rates for Tamil Nadu from 2001",
    keywords: ["DA rate", "dearness allowance", "DA history", "DA percentage", "TN DA"],
  },
  "arrears-calculator": {
    title: "DA Arrears Calculator",
    titleTamil: "நிலுவை கால்குலேட்டர்",
    description: "Calculate DA arrears when dearness allowance rate increases",
    keywords: ["DA arrears", "arrears calculation", "backpay", "TN arrears"],
  },
  "pay-fixation": {
    title: "Pay Fixation Calculator",
    titleTamil: "ஊதிய நிர்ணய கால்குலேட்டர்",
    description: "Calculate pay fixation on promotion, MACP, or grade change",
    keywords: ["pay fixation", "promotion pay", "MACP", "grade pay"],
  },
  "pay-slip-decoder": {
    title: "Pay Slip Decoder",
    titleTamil: "சம்பள சீட்டு விளக்கி",
    description: "Understand each component of your TN government pay slip",
    keywords: ["pay slip", "salary slip", "pay components", "deductions"],
  },
  "income-tax-calculator": {
    title: "Income Tax Calculator",
    titleTamil: "வருமான வரி கால்குலேட்டர்",
    description: "Compare Old vs New tax regime for TN government employees",
    keywords: ["income tax", "tax regime", "old vs new tax", "section 80C"],
  },
  "hra-calculator": {
    title: "HRA Exemption Calculator",
    titleTamil: "HRA விலக்கு கால்குலேட்டர்",
    description: "Calculate HRA tax exemption under Section 10(13A)",
    keywords: ["HRA exemption", "house rent allowance", "section 10(13A)"],
  },
  "tpf-calculator": {
    title: "TPF Calculator",
    titleTamil: "TPF கால்குலேட்டர்",
    description: "Calculate Tamil Nadu Provident Fund interest and generate statement",
    keywords: ["TPF", "provident fund", "GPF", "PF interest"],
  },
  "loan-calculator": {
    title: "GPF/Loan Calculator",
    titleTamil: "GPF கடன் கால்குலேட்டர்",
    description: "Calculate GPF balance and loan eligibility",
    keywords: ["GPF loan", "provident fund loan", "loan eligibility"],
  },
  "gpf-interest-calculator": {
    title: "GPF Interest Calculator",
    titleTamil: "GPF வட்டி கால்குலேட்டர்",
    description: "Calculate yearly GPF interest with monthly breakdown",
    keywords: ["GPF interest", "GPF rate", "provident fund interest"],
  },
  "nps-calculator": {
    title: "NPS Calculator",
    titleTamil: "NPS கால்குலேட்டர்",
    description: "Calculate NPS corpus for employees who joined after 2003",
    keywords: ["NPS", "National Pension System", "new pension scheme"],
  },
  "retirement-summary": {
    title: "Retirement Summary",
    titleTamil: "ஓய்வு சுருக்கம்",
    description: "One-page view of all retirement benefits including pension, gratuity, GPF",
    keywords: ["retirement benefits", "pension summary", "gratuity", "GPF"],
  },
  "pension-calculator": {
    title: "Pension Calculator",
    titleTamil: "ஓய்வூதிய கால்குலேட்டர்",
    description: "Calculate monthly pension, commutation, and family pension for TN employees",
    keywords: ["pension", "commutation", "family pension", "retirement"],
  },
  "gratuity-calculator": {
    title: "Gratuity Calculator",
    titleTamil: "நன்கொடை கால்குலேட்டர்",
    description: "Calculate gratuity amount based on service and last pay drawn",
    keywords: ["gratuity", "retirement benefit", "service gratuity"],
  },
  "leave-encashment-calculator": {
    title: "Leave Encashment Calculator",
    titleTamil: "விடுப்பு பணமாக்கல் கால்குலேட்டர்",
    description: "Calculate EL and HPL encashment amount at retirement",
    keywords: ["leave encashment", "EL encashment", "HPL", "earned leave"],
  },
  "service-calculator": {
    title: "Service Calculator",
    titleTamil: "பணிக்கால கால்குலேட்டர்",
    description: "Calculate total service period and retirement date",
    keywords: ["service period", "qualifying service", "retirement date"],
  },
  "leave-calculator": {
    title: "Leave Balance Calculator",
    titleTamil: "விடுப்பு நிலுவை கால்குலேட்டர்",
    description: "Track and calculate CL, EL, ML and other leave balances",
    keywords: ["leave balance", "CL", "EL", "ML", "casual leave", "earned leave"],
  },
  "leave-rules": {
    title: "Leave Rules",
    titleTamil: "விடுப்பு விதிகள்",
    description: "Quick reference for TN government leave entitlements and rules",
    keywords: ["leave rules", "leave entitlement", "TN leave policy"],
  },
  "surrender-leave-calculator": {
    title: "Surrender Leave Calculator",
    titleTamil: "விடுப்பு சரண் கால்குலேட்டர்",
    description: "Calculate surrender leave encashment amount",
    keywords: ["surrender leave", "leave encashment", "surrender EL"],
  },
  "ltc-calculator": {
    title: "LTC Calculator",
    titleTamil: "LTC கால்குலேட்டர்",
    description: "Calculate Leave Travel Concession benefits",
    keywords: ["LTC", "leave travel concession", "travel allowance"],
  },
  "transfer-rules": {
    title: "Transfer Rules & Process",
    titleTamil: "இடமாற்ற விதிகள்",
    description: "Transfer counseling process and rules guide for TN education department",
    keywords: ["transfer", "posting", "counseling", "transfer rules"],
  },
  "promotion-info": {
    title: "Promotion Information",
    titleTamil: "பதவி உயர்வு தகவல்",
    description: "Promotion hierarchy, eligibility and requirements for TN education department",
    keywords: ["promotion", "career progression", "eligibility"],
  },
  "age-calculator": {
    title: "Age Calculator",
    titleTamil: "வயது கால்குலேட்டர்",
    description: "Calculate exact age in years, months, and days for admissions and records",
    keywords: ["age calculator", "date of birth", "exact age"],
  },
  "date-difference": {
    title: "Date Difference Calculator",
    titleTamil: "தேதி வேறுபாடு கால்குலேட்டர்",
    description: "Calculate days, months, and years between two dates",
    keywords: ["date difference", "days between dates", "date calculator"],
  },
  "working-days": {
    title: "Working Days Counter",
    titleTamil: "பணி நாட்கள் கணக்கு",
    description: "Count working days excluding weekends and holidays",
    keywords: ["working days", "business days", "exclude holidays"],
  },
  "holiday-calendar": {
    title: "Holiday Calendar 2025",
    titleTamil: "விடுமுறை நாட்கள்",
    description: "Tamil Nadu Government holidays list for 2025",
    keywords: ["TN holidays", "government holidays", "2025 calendar"],
  },
  "voluntary-retirement": {
    title: "Voluntary Retirement Calculator",
    titleTamil: "தன்னார்வ ஓய்வு கால்குலேட்டர்",
    description: "Calculate VRS benefits and eligibility for voluntary retirement",
    keywords: ["VRS", "voluntary retirement", "early retirement"],
  },
};

// Generate layout content
function generateLayout(slug, meta) {
  return `import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "${meta.title} | One TN Portal",
  description: "${meta.description}. ${meta.titleTamil} - Free online calculator for Tamil Nadu government employees.",
  keywords: ${JSON.stringify(meta.keywords)},
  openGraph: {
    title: "${meta.title} | One TN Portal",
    description: "${meta.description}",
    type: "website",
  },
};

export default function ${toPascalCase(slug)}Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
`;
}

function toPascalCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

// Main execution
const toolsDir = path.join(__dirname, '../app/tools');

let created = 0;
let skipped = 0;

for (const [slug, meta] of Object.entries(toolsMetadata)) {
  const toolDir = path.join(toolsDir, slug);
  const layoutPath = path.join(toolDir, 'layout.tsx');

  // Check if tool directory exists
  if (!fs.existsSync(toolDir)) {
    console.log(`Skipping ${slug}: directory does not exist`);
    skipped++;
    continue;
  }

  // Check if layout already exists
  if (fs.existsSync(layoutPath)) {
    console.log(`Skipping ${slug}: layout.tsx already exists`);
    skipped++;
    continue;
  }

  // Generate and write layout
  const content = generateLayout(slug, meta);
  fs.writeFileSync(layoutPath, content);
  console.log(`Created: ${slug}/layout.tsx`);
  created++;
}

console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
