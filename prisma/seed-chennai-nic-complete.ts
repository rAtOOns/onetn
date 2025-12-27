import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Complete content from chennai.nic.in - Acts, Rules, Guidelines, GOs
const CHENNAI_NIC_DOCS = [
  // ACTS
  { type: "act", title: "The Rights of Persons With Disabilities Act 2016", docNumber: "RPWD-Act-2016", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113064.pdf", year: 2016 },
  { type: "act", title: "Rehabilitation Council of India Act 1992", docNumber: "RCI-Act-1992", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113077.pdf", year: 1992 },
  { type: "act", title: "The National Trust Act 1999", docNumber: "NT-Act-1999", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113045.pdf", year: 1999 },

  // RULES
  { type: "rules", title: "Rights of Persons with Disabilities Rules 2017", docNumber: "RPWD-Rules-2017", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113032.pdf", year: 2017 },
  { type: "rules", title: "Tamil Nadu Rights of Persons with Disabilities Rules 2018", docNumber: "TN-RPWD-Rules-2018", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113082.pdf", year: 2018 },
  { type: "rules", title: "Tamil Nadu Registration of Psychiatric Rehabilitation Center Rules 2002", docNumber: "TN-Psych-Rules-2002", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113092.pdf", year: 2002 },
  { type: "rules", title: "The National Trust Rules 2000", docNumber: "NT-Rules-2000", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/11/2019113028.pdf", year: 2000 },
  { type: "rules", title: "The National Trust Regulation 2001", docNumber: "NT-Regulation-2001", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120284.pdf", year: 2001 },

  // DISABILITY ASSESSMENT GUIDELINES
  { type: "guidelines", title: "Evaluation and Certification of 21 Identified Disabilities 2018", docNumber: "Disability-Eval-2018", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120219.pdf", year: 2018 },
  { type: "guidelines", title: "Guidelines for Evaluation and Assessment of Autism", docNumber: "Autism-Assessment-2016", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120256.pdf", year: 2016 },
  { type: "guidelines", title: "Assessment of High Support Need RPWD Amendment Rules 2019", docNumber: "HSN-Assessment-2019", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120276.pdf", year: 2019 },
  { type: "guidelines", title: "Authority to Issue Disability Certificate on Specific Disability", docNumber: "Disability-Cert-Auth-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020070920-1.pdf", year: 2020 },

  // EDUCATION GOs
  { type: "go", title: "Guidelines for Written Examination for Benchmark Disabilities", docNumber: "G.O-Exam-Guidelines-2018", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120259.pdf", year: 2018 },
  { type: "go", title: "Exemption from Special Fees for Differently Abled Students", docNumber: "G.O.Ms.No.30-DAP-2010", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120231.pdf", year: 2010 },
  { type: "go", title: "Full Exemption from Education Fees in State Institutions", docNumber: "G.O.Ms.No.135-SW-2008", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120257.pdf", year: 2008 },

  // EMPLOYMENT GOs
  { type: "go", title: "Reservation for Persons with Benchmark Disabilities Central", docNumber: "OM-Reservation-2018", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120215.pdf", year: 2018 },
  { type: "go", title: "Unregulated Vacant Posts Management for DAP", docNumber: "G.O.Ms.No.76-PAR-2009", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120289-1.pdf", year: 2009 },
  { type: "go", title: "Identification of Suitable Posts Groups A and B for DAP", docNumber: "G.O.Ms.No.20-DAP-2018", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120284-1.pdf", year: 2018 },

  // AIDS AND APPLIANCES
  { type: "go", title: "25% Increased Subsidy Amma Two Wheeler Scheme for DAP", docNumber: "G.O.Ms.No.143-RD-2018", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120220.pdf", year: 2018 },

  // TRAVEL CONCESSION
  { type: "go", title: "Three Fourth Concession in State Transport Buses for DAP", docNumber: "G.O.Ms.No.153-SW-2008", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120217.pdf", year: 2008 },
  { type: "go", title: "Exemption from Toll Fees for Modified Vehicles DAP", docNumber: "NHAI-Toll-Exempt-2016", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120213.pdf", year: 2016 },

  // HEALTH
  { type: "go", title: "Chief Minister Comprehensive Health Insurance Scheme", docNumber: "G.O.Ms.No.341-HFW-2012", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120260.pdf", year: 2012 },

  // SOCIAL SECURITY
  { type: "go", title: "Differently Abled Pension Minimum Age Reduction", docNumber: "G.O.Ms.No.121-SW-2011", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120215-1.pdf", year: 2011 },
  { type: "go", title: "Pension for Unemployed Persons with 40% Disabilities", docNumber: "G.O.Ms.No.41-SW-2018", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120230.pdf", year: 2018 },
  { type: "go", title: "Change of Eligibility Criteria for DAP Pension", docNumber: "G.O.Ms.No.27-SW-2016", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120231-1.pdf", year: 2016 },

  // LEGAL
  { type: "go", title: "Designation of Special Courts for DAP Cases", docNumber: "G.O.Ms.No.246-Home-2019", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120284-2.pdf", year: 2019 },

  // ACCESSIBILITY GUIDELINES
  { type: "guidelines", title: "CPWD Guidelines and Space Standards for Accessibility 1998", docNumber: "CPWD-Access-1998", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120261.pdf", year: 1998 },
  { type: "go", title: "Tamil Nadu Urban Local Bodies Accessibility Rules", docNumber: "G.O.Ms.No.21-MA-2013", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120269.pdf", year: 2013 },
  { type: "guidelines", title: "Harmonized Guidelines and Space Standards for Accessibility 2016", docNumber: "MoUD-Access-2016", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120280.pdf", year: 2016 },
  { type: "rules", title: "Tamil Nadu Combined Development and Building Rules 2019", docNumber: "TN-Building-Rules-2019", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2019/12/2019120294.pdf", year: 2019 },

  // COVID-19 GOs
  { type: "go", title: "COVID-19 Duty Exemption for DAP 24.03.2020 to 14.04.2020", docNumber: "G.O.Ms.No.2-DAP-COVID-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020070968.pdf", year: 2020 },
  { type: "go", title: "COVID-19 Duty Exemption for DAP 4.05.2020 to 17.05.2020", docNumber: "G.O.Ms.No.4-DAP-COVID-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020070950.pdf", year: 2020 },
  { type: "go", title: "COVID-19 Duty Exemption for DAP 18.05.2020 to 31.05.2020", docNumber: "G.O.Ms.No.5-DAP-COVID-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020070978.pdf", year: 2020 },
  { type: "go", title: "COVID-19 Duty Exemption for DAP Multiple Districts June 2020", docNumber: "G.O.Ms.No.6-DAP-COVID-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020070977.pdf", year: 2020 },
  { type: "go", title: "COVID-19 Duty Exemption for DAP 1.07.2020 to 15.07.2020", docNumber: "G.O.Ms.No.7-DAP-COVID-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020070920.pdf", year: 2020 },
  { type: "go", title: "COVID-19 Absence Regulation During Lockdown", docNumber: "G.O.Ms.No.304-Rev-COVID-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020070910.pdf", year: 2020 },
  { type: "go", title: "COVID-19 Duty Exemption for DAP 16.07.2020 to 31.07.2020", docNumber: "G.O.Ms.No.11-DAP-COVID-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020072410.pdf", year: 2020 },
  { type: "go", title: "COVID-19 Duty Exemption for DAP August 2020", docNumber: "G.O.Ms.No.12-DAP-COVID-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/08/2020081959.pdf", year: 2020 },

  // COVID ASSISTANCE
  { type: "guidelines", title: "COVID-19 Movement Passes for Caregivers of High Support Need", docNumber: "COVID-Caregiver-Pass-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020071094.pdf", year: 2020 },
  { type: "guidelines", title: "COVID-19 Prioritized Ration Distribution for DAP", docNumber: "COVID-Ration-DAP-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020071074.pdf", year: 2020 },
  { type: "go", title: "COVID-19 Cash Assistance Rs 1000 to 13.35 Lakhs DAP", docNumber: "G.O.Ms.No.311-Rev-COVID-2020", url: "https://cdn.s3waas.gov.in/s3c81e728d9d4c2f636f067f89cc14862c/uploads/2020/07/2020071026.pdf", year: 2020 },
];

async function seedChennaiNICComplete() {
  try {
    console.log("Seeding complete chennai.nic.in content...");
    console.log(`Total documents to process: ${CHENNAI_NIC_DOCS.length}`);

    // Get/create categories
    let goCategory = await prisma.category.findFirst({ where: { slug: "government-orders" } });
    let guidelinesCategory = await prisma.category.findFirst({ where: { slug: "guidelines" } });
    if (!guidelinesCategory) {
      guidelinesCategory = await prisma.category.create({ data: { name: "Guidelines", slug: "guidelines" } });
    }

    // Get department
    let swDept = await prisma.department.findFirst({ where: { slug: "social-welfare" } });
    if (!swDept) {
      swDept = await prisma.department.create({ data: { name: "Social Welfare", slug: "social-welfare" } });
    }

    let created = 0, skipped = 0;

    for (const doc of CHENNAI_NIC_DOCS) {
      const existing = await prisma.document.findFirst({
        where: { OR: [{ goNumber: doc.docNumber }, { fileUrl: doc.url }] },
      });

      if (existing) { skipped++; continue; }

      const categoryId = doc.type === "go" ? goCategory!.id : guidelinesCategory.id;

      await prisma.document.create({
        data: {
          title: doc.title,
          description: `${doc.title}. Source: chennai.nic.in - Differently Abled Welfare`,
          goNumber: doc.docNumber,
          fileName: doc.docNumber.replace(/[^a-zA-Z0-9]/g, "_") + ".pdf",
          fileUrl: doc.url,
          fileSize: Math.floor(Math.random() * 500000) + 50000,
          fileType: "pdf",
          departmentId: swDept.id,
          categoryId: categoryId,
          publishedYear: doc.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 150) + 10,
        },
      });
      created++;
    }

    console.log(`\nCreated: ${created}, Skipped: ${skipped}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedChennaiNICComplete();
