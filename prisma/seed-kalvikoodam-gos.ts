import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GOs from kalvikoodam.wordpress.com with official cms.tn.gov.in links
const KALVIKOODAM_GOS = [
  // 2018 GOs
  { goNumber: "G.O.Ms.No.222-2018", title: "Medical Aid Health Insurance Scheme 2018 for Pensioners", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_222_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.205-2018", title: "Provident Fund Interest Rate 2017-2018", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_205_2018.pdf", year: 2018 },
  { goNumber: "G.O.No.193-2018", title: "Pension Dearness Allowance January 2018", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_193_2018.pdf", year: 2018 },
  { goNumber: "Letter No.16115-2018", title: "Pay Rules Higher Start of Pay Clarification", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_16115_2018_lr.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.154-2018", title: "Government e-Marketplace Procurement Orders", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_154_2018_1.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.152-2018", title: "Contributory Pension Scheme Interest Rate 2018", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_152_2018_0.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.140-2018", title: "Writ Petitions High Court Orders Compliance", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_140_2018_0.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.138-2018", title: "Pay Rules Pay Anomaly Committee Constitution", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_138_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.135-2018", title: "General Provident Fund Interest Rate 2018-2019", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_135_2018.pdf", year: 2018 },
  { goNumber: "Letter No.23894-2018", title: "Pension Revision Pre-2016 Pensioners Instructions", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_23894_2018_lr.pdf", year: 2018 },
  { goNumber: "Letter No.17977-2018", title: "Retirement Benefits Arrears Payment Instructions", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_17977_2018_lr.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.123-2018", title: "Dearness Allowance Enhancement January 2018", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_123_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.126-2018", title: "Pension Dearness Allowance Revision January 2018", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_126_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.125-2018", title: "Dearness Allowance Pre-2006 and Pre-2016 Pay Scale", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_125_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.124-2018", title: "Ad-hoc Increase Consolidated Pay Employees", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_124_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.119-2018", title: "Government e-Marketplace State Nodal Officer", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_119_2018.pdf", year: 2018 },
  { goNumber: "Letter No.11310-2018", title: "Government e-Marketplace Training Program", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_11310_2018_lr.pdf", year: 2018 },
  { goNumber: "G.O.No.53-2018", title: "Pension Dearness Allowance July 2017", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_53_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.56-2018", title: "Staff Rationalisation Committee Appointment", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_56_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.57-2018", title: "Pay Anomaly Committee Constitution Orders", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_57_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.16-2018", title: "Contributory Pension Scheme Interest Rate 2017-2018", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_16_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.12-2018", title: "Bonus and Pongal Prize Statutory Boards", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_12_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.11-2018", title: "General Provident Fund Interest Rate 2017-2018", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_11_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.7-2018", title: "Pongal Prize Pensioners Grant 2018", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_7_2018.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.6-2018", title: "Bonus and Special Ad-hoc Bonus 2016-17", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_6_2018_0.pdf", year: 2018 },
  { goNumber: "G.O.No.1-2018", title: "Fifteenth Finance Commission Corrigendum", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_1_2018.pdf", year: 2018 },
  // 2017 GOs
  { goNumber: "Letter No.58863-2017", title: "Official Committee 2017 Time Limit Extension", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_58863_2017_0.pdf", year: 2017 },
  { goNumber: "G.O.Ms.No.369-2017", title: "TNPSC Pay Revision Members and Employees", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_369_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.367-2017", title: "Expert Committee Old Pension Scheme Review", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_367_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.363-2017", title: "Fifteenth Finance Commission Orders", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_363_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.330-2017", title: "Contributory Pension Scheme Interest Rate 2017", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_330_2017.pdf", year: 2017 },
  { goNumber: "Letter No.54867-2017", title: "Official Committee 2017 Salary Admission Instructions", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_54867_2017_lr.pdf", year: 2017 },
  { goNumber: "G.O.No.320-2017", title: "General Provident Fund Interest Rate 2017-2018", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_320_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.319-2017", title: "PSUs Statutory Boards Pay Revision Applicability", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_319_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.313-2017", title: "Official Committee 2017 Pension Revision Orders", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_313_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.311-2017", title: "Official Committee 2017 Promotion Pay Fixation", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_311_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.307-2017", title: "Official Committee 2017 Travel Allowance Revision", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_307_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.306-2017", title: "Official Committee 2017 Allowance Revision", url: "http://cms.tn.gov.in/sites/default/files/go/fine_e_306_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.305-2017", title: "Official Committee 2017 HRA and CCA Revision", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_305_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.304-2017", title: "Official Committee 2017 Special Pay Enhancement", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_304_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.303-2017", title: "Official Committee 2017 Pay Revision Orders", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_303_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.302-2017", title: "Ad-hoc Increase Consolidated and Fixed Pay", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_302_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.301-2017", title: "Pension Dearness Allowance July 2017", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_301_2017.pdf", year: 2017 },
  { goNumber: "G.O.No.300-2017", title: "Dearness Allowance Enhancement July 2017", url: "http://cms.tn.gov.in/sites/default/files/go/fin_e_300_2017.pdf", year: 2017 },
];

async function seedKalvikoodamGOs() {
  try {
    console.log("🚀 Seeding GOs from kalvikoodam.wordpress.com...");
    console.log(`📊 Total GOs to process: ${KALVIKOODAM_GOS.length}`);

    let dept = await prisma.department.findFirst({ where: { slug: "finance" } });
    let category = await prisma.category.findFirst({ where: { slug: "government-orders" } });

    let created = 0, skipped = 0;

    for (const go of KALVIKOODAM_GOS) {
      const existing = await prisma.document.findFirst({
        where: { OR: [{ goNumber: go.goNumber }, { fileUrl: go.url }] },
      });

      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: go.title,
          description: `Official GO: ${go.title}. Source: cms.tn.gov.in via kalvikoodam`,
          goNumber: go.goNumber,
          fileName: `${go.goNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 300000) + 50000,
          fileType: "pdf",
          departmentId: dept!.id,
          categoryId: category!.id,
          publishedYear: go.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 200) + 10,
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

seedKalvikoodamGOs();
