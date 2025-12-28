export default function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://onetn-portal-734553869592.asia-south1.run.app";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "One TN Portal",
    description: "Unofficial portal for Tamil Nadu Education Department employees",
    url: siteUrl,
    logo: `${siteUrl}/favicon.png`,
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "One TN Portal",
    description: "Tamil Nadu Education Department resources - GOs, calculators, and tools",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/go?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "One TN Portal",
    operatingSystem: "Web",
    applicationCategory: "UtilitiesApplication",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.5",
      ratingCount: "100",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tools",
        item: `${siteUrl}/tools`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the current DA rate in Tamil Nadu?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The current DA (Dearness Allowance) rate for Tamil Nadu government employees is 55% effective from January 2025.",
        },
      },
      {
        "@type": "Question",
        name: "How to calculate pension for TN government employees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pension is calculated as 50% of the average of last 10 months basic pay for employees with 33+ years of qualifying service. Use our Pension Calculator tool for exact calculation.",
        },
      },
      {
        "@type": "Question",
        name: "What is the retirement age for Tamil Nadu government employees?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The retirement age for Tamil Nadu government employees is 60 years (superannuation).",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}
