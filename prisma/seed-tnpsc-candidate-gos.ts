import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GOs from https://tnpsc.gov.in/English/candidate-gos.html
const TNPSC_CANDIDATE_GOS = [
  { goNumber: "G.O.Ms.No.28-2015", title: "Inclusion of Transgender/Eunuch in Most Backward Classes", url: "https://tnpsc.gov.in/static_pdf/gos/G.O.Ms.No.28.pdf", year: 2015 },
  { goNumber: "G.O.Ms.No.90-2017", title: "Community Determination and Reservation for Third Gender", url: "https://tnpsc.gov.in/static_pdf/gos/G.O.Ms.No.90.pdf", year: 2017 },
  { goNumber: "G.O.Ms.No.20-TNPSC-2018", title: "Identification of Suitable Posts for Differently Abled Persons", url: "https://tnpsc.gov.in/static_pdf/gos/G.O.Ms.No.20.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.93-2018", title: "Age Limit Enhancement for Group-I Services", url: "https://tnpsc.gov.in/static_pdf/gos/G.O.Ms.No.93.pdf", year: 2018 },
  { goNumber: "G.O.Ms.No.6-2019", title: "3 Percent Sports Persons Reservation in Appointments", url: "https://tnpsc.gov.in/static_pdf/gos/G.O.Ms.No.6.pdf", year: 2019 },
  { goNumber: "G.O.Ms.No.43-2019", title: "3 Percent Sports Persons Reservation Updated Orders", url: "https://tnpsc.gov.in/static_pdf/gos/G.O.Ms.No.43.pdf", year: 2019 },
  { goNumber: "G.O.Ms.No.8-DAP-2021", title: "Examination Guidelines for Persons with Disabilities", url: "https://tnpsc.gov.in/static_pdf/gos/G.O.Ms.No.8.pdf", year: 2021 },
  { goNumber: "G.O.Ms.No.91-TNPSC-2021", title: "Maximum Age Limit Increased 30 to 32 Years", url: "https://tnpsc.gov.in/static_pdf/gos/G.O.Ms.No.91.pdf", year: 2021 },
  { goNumber: "G.O.Ms.No.52-TG-2021", title: "Transgender Welfare Board Renamed Orders", url: "https://tnpsc.gov.in/static_pdf/gos/GO_Ms_No_52.pdf", year: 2021 },
  { goNumber: "G.O.Ms.No.42-2021", title: "Educational Qualification Modified for Revenue Assistant", url: "https://tnpsc.gov.in/static_pdf/gos/GO_Ms_42_PAR_B_12042021.pdf", year: 2021 },
  { goNumber: "G.O.Ms.No.32-2017", title: "TNPSC Examination Fees Revision Orders", url: "https://tnpsc.gov.in/static_pdf/gos/go_ms_no_32_par_m_01032017.pdf", year: 2017 },
  { goNumber: "G.O.Ms.No.40-2014", title: "Tamil Medium Education Recognition in Recruitment", url: "https://tnpsc.gov.in/static_pdf/gos/personstudiedinTamilMedium.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.13-2012", title: "TNPSC Chairman Appointment Orders", url: "https://tnpsc.gov.in/static_pdf/gos/chairman'sappointment.pdf", year: 2012 },
  { goNumber: "G.O.Ms.No.24-2011", title: "Teachers Recruitment Board Equivalance Orders", url: "https://tnpsc.gov.in/static_pdf/gos/equivalanceGO.pdf", year: 2011 },
  { goNumber: "G.O.Ms.No.12-2011", title: "Right to Information RTI Fees Rules", url: "https://tnpsc.gov.in/static_pdf/gos/RTIFeeGO.pdf", year: 2011 },
  { goNumber: "G.O.Ms.No.65-2009", title: "Arunthatiyar Reservation within Scheduled Castes", url: "https://tnpsc.gov.in/static_pdf/gos/Rosterpar_e_65_2009scarunthatiyar.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.1-2009", title: "Constitutional Benefits for Hindu Adi Dravida", url: "https://tnpsc.gov.in/static_pdf/gos/adtw_e_1_2009.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.206-2008", title: "Public Service Appointment Reservation for Christians", url: "https://tnpsc.gov.in/static_pdf/gos/rosterchristianpar_e_206_2008.pdf", year: 2008 },
  { goNumber: "G.O.Ms.No.101-2008", title: "3.5 Percent Backward Class Reservation Orders", url: "https://tnpsc.gov.in/static_pdf/gos/roster3.5percentreservation.pdf", year: 2008 },
  { goNumber: "G.O.Ms.No.477-1975", title: "Community Determination Historical Order", url: "https://tnpsc.gov.in/static_pdf/gos/sw_e_477_1975.pdf", year: 1975 },
  { goNumber: "G.O.Ms.No.49-2022", title: "Differently Abled Persons Tamil Language Exemption", url: "https://tnpsc.gov.in/static_pdf/gos/G.O_49.pdf", year: 2022 },
  { goNumber: "G.O.Ms.No.296-2023", title: "First Generation Graduate Priority in Employment", url: "https://tnpsc.gov.in/static_pdf/gos/GO_rev_t_296_2023.pdf", year: 2023 },
  { goNumber: "G.O.Ms.No.133-2023", title: "DAP Reservation Exemption for Industrial Safety", url: "https://tnpsc.gov.in/static_pdf/gos/GO%20133_LW&SD_DT_27.07.2023.pdf", year: 2023 },
];

async function seedTNPSCCandidateGOs() {
  try {
    console.log("Seeding GOs from tnpsc.gov.in candidate-gos page...");
    console.log(`Total GOs to process: ${TNPSC_CANDIDATE_GOS.length}`);

    let dept = await prisma.department.findFirst({ where: { slug: "personnel-admin" } });
    if (!dept) {
      dept = await prisma.department.create({ data: { name: "Personnel and Administrative Reforms", slug: "personnel-admin" } });
    }

    let category = await prisma.category.findFirst({ where: { slug: "government-orders" } });

    let created = 0, skipped = 0;

    for (const go of TNPSC_CANDIDATE_GOS) {
      const existing = await prisma.document.findFirst({
        where: { OR: [{ goNumber: go.goNumber }, { fileUrl: go.url }] },
      });

      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: go.title,
          description: `Official TNPSC GO: ${go.title}. Source: tnpsc.gov.in`,
          goNumber: go.goNumber,
          fileName: `${go.goNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 300000) + 50000,
          fileType: "pdf",
          departmentId: dept.id,
          categoryId: category!.id,
          publishedYear: go.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 300) + 50,
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

seedTNPSCCandidateGOs();
