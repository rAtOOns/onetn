import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("\n=== Creating Test Article ===\n");

  // Get the first pending lead
  const lead = await prisma.newsLead.findFirst({
    where: { status: "pending" },
    orderBy: { fetchedAt: "desc" },
  });

  if (!lead) {
    console.log("No pending leads found!");
    await prisma.$disconnect();
    return;
  }

  console.log("Using lead: " + lead.title);
  console.log("Source: " + lead.sourceName);

  // Create an article from this lead
  const article = await prisma.newsArticle.create({
    data: {
      title: "New Income Tax Rules: Up to Rs 12 Lakh Tax Exemption",
      titleTamil: "புதிய வருமான வரிச் சட்டம்: ரூ.12 லட்சம் வரை வரி விலக்கு",
      summary: "The government has announced new income tax rules providing tax exemption for income up to Rs 12 lakh annually. This is a significant relief for middle-class taxpayers.",
      summaryTamil: "ஆண்டுக்கு ரூ.12 லட்சம் வரை வருமானத்திற்கு வரி விலக்கு அளிக்கும் புதிய வருமான வரி விதிகளை அரசு அறிவித்துள்ளது. நடுத்தர வர்க்க வரி செலுத்துவோருக்கு இது குறிப்பிடத்தக்க நிவாரணம்.",
      content: `
## Key Highlights

The Union Budget 2025-26 has brought significant changes to the income tax structure:

- **No tax** for annual income up to Rs 12 lakh
- Revised tax slabs for higher income brackets
- Standard deduction increased to Rs 75,000
- Simplified filing process for salaried employees

## Who Benefits?

This change primarily benefits:
1. Salaried employees in the Rs 7-12 lakh income bracket
2. Small business owners and professionals
3. Senior citizens with pension income

## Official Sources

- [Finance Ministry Press Release](https://pib.gov.in)
- [Income Tax Department](https://incometaxindia.gov.in)

Teachers and government employees in Tamil Nadu will see immediate benefits in their take-home salary from April 2025.
      `.trim(),
      contentTamil: `
## முக்கிய அம்சங்கள்

2025-26 மத்திய பட்ஜெட் வருமான வரி கட்டமைப்பில் குறிப்பிடத்தக்க மாற்றங்களைக் கொண்டு வந்துள்ளது:

- ஆண்டு வருமானம் ரூ.12 லட்சம் வரை **வரி இல்லை**
- உயர் வருமான வரம்புகளுக்கு திருத்தப்பட்ட வரி வரம்புகள்
- நிலையான கழிவு ரூ.75,000 ஆக உயர்த்தப்பட்டது

## யாருக்கு பயன்?

இந்த மாற்றம் முக்கியமாக பயனளிக்கிறது:
1. ரூ.7-12 லட்சம் வருமான வரம்பில் உள்ள சம்பளதாரர்கள்
2. சிறு வணிக உரிமையாளர்கள் மற்றும் தொழில் வல்லுநர்கள்
3. ஓய்வூதிய வருமானம் உள்ள மூத்த குடிமக்கள்

தமிழ்நாட்டில் உள்ள ஆசிரியர்கள் மற்றும் அரசு ஊழியர்கள் ஏப்ரல் 2025 முதல் தங்கள் கை ஊதியத்தில் உடனடி பலன்களைக் காண்பார்கள்.
      `.trim(),
      status: "published",
      publishedAt: new Date(),
      createdBy: "system",
    },
  });

  console.log("\nArticle created with ID: " + article.id);

  // Update the lead status
  await prisma.newsLead.update({
    where: { id: lead.id },
    data: {
      status: "published",
      articleId: article.id,
      reviewedAt: new Date(),
      reviewedBy: "system",
    },
  });

  console.log("Lead marked as published");

  // Show stats
  const publishedArticles = await prisma.newsArticle.count({ where: { status: "published" } });
  const pendingLeads = await prisma.newsLead.count({ where: { status: "pending" } });

  console.log("\n=== Current Status ===");
  console.log("Published articles: " + publishedArticles);
  console.log("Pending leads: " + pendingLeads);

  await prisma.$disconnect();
}

main().catch(console.error);
