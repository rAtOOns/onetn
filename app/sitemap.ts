import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://onetn-portal-734553869592.asia-south1.run.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const tools = [
    "salary-calculator",
    "pay-matrix",
    "increment-calculator",
    "da-rates",
    "arrears-calculator",
    "pay-fixation",
    "income-tax-calculator",
    "hra-calculator",
    "tpf-calculator",
    "loan-calculator",
    "gpf-interest-calculator",
    "retirement-summary",
    "pension-calculator",
    "gratuity-calculator",
    "leave-encashment-calculator",
    "service-calculator",
    "leave-calculator",
    "leave-rules",
    "surrender-leave-calculator",
    "ltc-calculator",
    "transfer-rules",
    "promotion-info",
    "loans-advances",
    "age-calculator",
    "date-difference",
    "working-days",
    "holiday-calendar",
    "important-dates",
    "ta-da-rates",
    "contact-directory",
    "abbreviations",
    "number-to-words",
  ];

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
    ...toolPages,
  ];
}
