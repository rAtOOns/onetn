import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// DSE, DEE Proceedings and TRB Notifications from kalviexpress.in
const EDUCATION_PROCEEDINGS = [
  // DSE Proceedings 2025
  { refNumber: "DSE-PROC-2025-VIOLENCE", title: "DSE Proceeding Avoid Violence Based on Caste and Community Among Students", url: "https://www.kalviexpress.in/2025/06/dse-avoid-violence-based-on-caste.html", year: 2025, category: "circulars" },
  { refNumber: "DSE-DEE-PROC-2025-REOPEN", title: "Schools Reopen DSE DEE Instructions 2025-26 Academic Year", url: "https://www.kalviexpress.in/2025/05/schools-reopen-dse-dee-instructions.html", year: 2025, category: "circulars" },

  // DSE Proceedings 2024
  { refNumber: "DSE-PROC-2024-KALANJIYAM", title: "Teaching and Non Teaching Staff Leaves Kalanjiyam App Instructions", url: "https://www.kalviexpress.in/2024/09/dse-teaching-non-teaching-staff-leaves.html", year: 2024, category: "circulars" },
  { refNumber: "DSE-PROC-2024-REOPEN", title: "School Reopen Date 2024-25 Academic Year June 6 2024", url: "https://www.kalviexpress.in/2024/05/school-reopen-date-for-2024-25.html", year: 2024, category: "circulars" },
  { refNumber: "DSE-DEE-PROC-2024-CORPORAL", title: "Corporal Punishment in Schools Strict Action DSE DEE Proceeding", url: "https://www.kalviexpress.in/2024/04/corporal-punishment-in-schools-dse-dee.html", year: 2024, category: "circulars" },
  { refNumber: "DSE-PROC-2024-RETIREMENT", title: "Teachers Retirement Benefits DSE Guidelines for Aided Schools", url: "https://www.kalviexpress.in/2024/04/teachers-retirement-benefits-dse.html", year: 2024, category: "guidelines" },

  // DSE Proceedings 2023
  { refNumber: "DSE-PROC-2023-AUDIT", title: "DSE Audit General Instruction for Schools and Offices", url: "https://www.kalviexpress.in/2023/10/dse-audit-general-instruction.html", year: 2023, category: "circulars" },

  // DEE Proceedings
  { refNumber: "DEE-GAZETTE-2024-SENIORITY", title: "DEE State Seniority Gazette for Elementary Teachers", url: "https://www.kalviexpress.in/2024/01/dee-state-seniority-gazette.html", year: 2024, category: "notifications" },
  { refNumber: "DEE-PROC-2024-HM-PANEL", title: "DEE Middle School HM Panel Preparation 01.01.2024", url: "https://www.kalviexpress.in/2024/01/dee-middle-school-hm-panel.html", year: 2024, category: "circulars" },
  { refNumber: "DEE-PROC-2022-REOPEN", title: "DEE School Reopening Circular December 2022 to January 2023", url: "https://www.kalviexpress.in/2022/12/dee-school-reopening-circular.html", year: 2022, category: "circulars" },
  { refNumber: "DEE-PROC-2022-BEO", title: "BEO Office Work Allotment Distribution Directives", url: "https://www.kalviexpress.in/2022/09/beo-office-work-allotment.html", year: 2022, category: "circulars" },
  { refNumber: "DEE-PROC-2022-DUTIES", title: "DEE New Office Duties and Responsibilities Assignment", url: "https://www.kalviexpress.in/2022/09/dee-new-office-duties.html", year: 2022, category: "circulars" },
  { refNumber: "DEE-PROC-2022-TRANSFER", title: "DEE District Transfer Counselling 2022 Procedures", url: "https://www.kalviexpress.in/2022/07/dee-district-transfer-counselling-2022.html", year: 2022, category: "circulars" },
  { refNumber: "DEE-PROC-2022-SGT", title: "DEE SGT Deployment Revised Instruction February 2022", url: "https://www.kalviexpress.in/2022/02/dee-sgt-deployment-revised.html", year: 2022, category: "circulars" },
  { refNumber: "DEE-PROC-2021-REOPEN", title: "DEE School Reopening Instruction November 2021", url: "https://www.kalviexpress.in/2021/10/dee-school-reopening-instruction.html", year: 2021, category: "circulars" },

  // TRB Notifications
  { refNumber: "TRB-PLANNER-2025", title: "TRB Annual Planner 2025 PG Assistants 1915 Vacancies", url: "https://www.kalviexpress.in/2025/03/trb-annual-planner-2025.html", year: 2025, category: "notifications" },
  { refNumber: "TRB-PLANNER-2024", title: "TRB Tentative Annual Planner 2024 SGT Positions", url: "https://www.kalviexpress.in/2024/01/trb-tentative-annual-planner-2024.html", year: 2024, category: "notifications" },
  { refNumber: "TRB-GT-BRTE-2023", title: "TRB Direct Recruitment of Graduate Teachers BRTE 2023", url: "https://www.kalviexpress.in/2023/10/direct-recruitment-of-graduate-teachers.html", year: 2023, category: "notifications" },
  { refNumber: "TRB-PLANNER-2022-REV", title: "TRB Revised Tentative Annual Planner 2022 PG 2407 Vacancies", url: "https://www.kalviexpress.in/2022/07/trb-revised-tentative-annual-planner.html", year: 2022, category: "notifications" },
  { refNumber: "TRB-PG-2022-1030", title: "PG TRB Additional 1030 Post Notification 2022", url: "https://www.kalviexpress.in/2022/08/pg-trb-additional-1030-post-notification.html", year: 2022, category: "notifications" },
];

async function seedEducationProceedings() {
  try {
    console.log("🚀 Seeding DSE/DEE Proceedings and TRB Notifications...");
    console.log(`📊 Total documents to process: ${EDUCATION_PROCEEDINGS.length}`);

    // Get School Education department
    let dept = await prisma.department.findFirst({
      where: { slug: "school-education" },
    });
    if (!dept) {
      dept = await prisma.department.create({
        data: { name: "School Education", slug: "school-education" },
      });
    }

    // Get categories
    const categories: Record<string, any> = {};
    for (const slug of ["circulars", "notifications", "guidelines"]) {
      let cat = await prisma.category.findFirst({ where: { slug } });
      if (!cat) {
        const names: Record<string, string> = {
          circulars: "Circulars",
          notifications: "Notifications",
          guidelines: "Guidelines"
        };
        cat = await prisma.category.create({
          data: { name: names[slug], slug },
        });
      }
      categories[slug] = cat;
    }

    let created = 0;
    let skipped = 0;

    for (const doc of EDUCATION_PROCEEDINGS) {
      // Check for duplicates
      const existing = await prisma.document.findFirst({
        where: {
          OR: [
            { goNumber: doc.refNumber },
            { title: doc.title },
            { fileUrl: doc.url },
          ],
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.document.create({
        data: {
          title: doc.title,
          description: `School Education Department: ${doc.title}. Source: kalviexpress.in`,
          goNumber: doc.refNumber,
          fileName: `${doc.refNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          fileUrl: doc.url,
          fileSize: Math.floor(Math.random() * 200000) + 30000,
          fileType: "pdf",
          departmentId: dept.id,
          categoryId: categories[doc.category].id,
          publishedYear: doc.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 300) + 20,
        },
      });

      console.log(`   ✅ Added: ${doc.refNumber}`);
      created++;
    }

    console.log(`\n✅ Done! Created: ${created}, Skipped: ${skipped}`);
  } catch (error) {
    console.error("Error seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEducationProceedings();
