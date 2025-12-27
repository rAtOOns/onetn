import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GOs from https://chennai.nic.in/acts-rules-guidelines-and-government-orders/
const CHENNAI_NIC_GOS = [
  { goNumber: "RPWD Act 2016", title: "The Rights of Persons With Disabilities Act 2016", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113064.pdf", year: 2016 },
  { goNumber: "RCI Act 1992", title: "Rehabilitation Council of India Act 1992", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113077.pdf", year: 1992 },
  { goNumber: "NT Act 1999", title: "The National Trust Act 1999", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113045.pdf", year: 1999 },
  { goNumber: "Rule No.49-2017", title: "Rights of Persons with Disabilities Rules 2017", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113032.pdf", year: 2017 },
  { goNumber: "Rule No.60-2018", title: "Tamil Nadu Rights of Persons with Disabilities Rules 2018", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113082.pdf", year: 2018 },
  { goNumber: "Rule No.608-2002", title: "Tamil Nadu Registration of Psychiatric Rehabilitation Center Rules 2002", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113092.pdf", year: 2002 },
  { goNumber: "NT Rules 2000", title: "The National Trust Rules 2000", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113028.pdf", year: 2000 },
  { goNumber: "NT Regulation 2001", title: "The National Trust Regulation 2001", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120284.pdf", year: 2001 },
  { goNumber: "G.O.Ms.No.704", title: "10 Years Age Concession in Employment for Differently Abled", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120291.pdf", year: 1964 },
  { goNumber: "G.O.Ms.No.51-2017", title: "Reservation for C and D Category Posts for Differently Abled", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120242.pdf", year: 2017 },
  { goNumber: "G.O.Ms.No.21-2017", title: "4 Percent Reservation for Differently Abled Persons", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120235.pdf", year: 2017 },
  { goNumber: "Act No.30-2017", title: "Reservation Roster for Benchmark Disabilities", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120279.pdf", year: 2017 },
  { goNumber: "G.O.Ms.No.76", title: "Unregulated Vacant Posts Policy for Differently Abled", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120289-1.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.20-2018", title: "Suitable Posts Identification Group A and B for Differently Abled", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120284-1.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.100-2000", title: "Urban Local Bodies Shop Allocation for Differently Abled", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120257-1.pdf", year: 2000 },
  { goNumber: "G.O.Ms.No.307", title: "Increase of Rs 2500 Travel Allowance for Differently Abled", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120295.pdf", year: 2017 },
  { goNumber: "No.145-2012", title: "Professional Tax Exemption for Differently Abled Employees", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020072890.pdf", year: 2012 },
  { goNumber: "Letter No.92-S-09", title: "Transfer to Nearby Hometown for Differently Abled Employees", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120286.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.72-2009", title: "Special Casual Leave on International Day for Differently Abled", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120272.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.315", title: "Travel Allowances Authority for Differently Abled", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120277.pdf", year: 2017 },
  { goNumber: "G.O.Ms.No.149", title: "Early Office Departure Permission for Differently Abled", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120285.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.204", title: "Traveling Allowance for Hearing Impaired Employees", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120236.pdf", year: 2015 },
  { goNumber: "G.O.Ms.No.6", title: "Exemption from Basic Training for Differently Abled Teachers", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120231-3.pdf", year: 2016 },
];

async function seedChennaiNICGOs() {
  try {
    console.log("🚀 Seeding GOs from chennai.nic.in...");
    console.log(`📊 Total GOs to process: ${CHENNAI_NIC_GOS.length}`);

    let dept = await prisma.department.findFirst({ where: { slug: "social-welfare" } });
    if (!dept) {
      dept = await prisma.department.create({ data: { name: "Social Welfare", slug: "social-welfare" } });
    }

    let category = await prisma.category.findFirst({ where: { slug: "government-orders" } });

    let created = 0, skipped = 0;

    for (const go of CHENNAI_NIC_GOS) {
      const existing = await prisma.document.findFirst({
        where: { OR: [{ goNumber: go.goNumber }, { fileUrl: go.url }] },
      });

      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: go.title,
          description: `${go.title}. Source: chennai.nic.in - Differently Abled Welfare`,
          goNumber: go.goNumber,
          fileName: `${go.goNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 500000) + 50000,
          fileType: "pdf",
          departmentId: dept.id,
          categoryId: category!.id,
          publishedYear: go.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 150) + 10,
        },
      });
      created++;
    }

    console.log(`\n📊 Created: ${created}, Skipped: ${skipped}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChennaiNICGOs();
