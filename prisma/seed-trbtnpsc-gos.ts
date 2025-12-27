import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GOs extracted from https://www.trbtnpsc.com/2013/07/important-educational-gos.html
const TRBTNPSC_GOS = [
  { goNumber: "GO-PSTM-2024", title: "PSTM Certificate from closed schools/institutes", url: "https://padasalai.info/wp-content/uploads/2024/02/How-to-get-PSTM-certificate-from-closed-institutes-go-1-02.01.2024.pdf", year: 2024 },
  { goNumber: "GO-DRAFT-MODELS", title: "Tamil Nadu Official Draft Models Full Book", url: "https://padasalai.info/wp-content/uploads/2024/11/Tamilnadu-Official-Draft-Models-PDF-Download.pdf", year: 2024 },
  { goNumber: "GO-DEO-WORK-2022", title: "DEO Elementary Office Work Allotment", url: "https://padasalai.info/wp-content/uploads/2022/10/DEOElementary-Work-Allotment-26-Oct-2022-Padasalai.pdf", year: 2022 },
  { goNumber: "G.O No.293", title: "NHIS Dependent Children Coverage Extension", url: "https://drive.google.com/file/d/1-fpmv2hdViDvoiJ2nQln27ShZl06JFNv/view", year: 2021 },
  { goNumber: "G.O No.128", title: "TET Certificate Life Time Validity", url: "https://drive.google.com/file/d/1YRxBUOSO8YMybT41X3aM_ym3Q891hgAu/view", year: 2021 },
  { goNumber: "G.O No.84", title: "Maternity Leave Extended to 1 Year for Government Employees", url: "https://drive.google.com/file/d/1wO7KG5BljL1i00JUMj0MgF1OwVuSSWEX/view", year: 2021 },
  { goNumber: "G.O No.37", title: "Advanced Increment for Government Employees", url: "https://10thquestionpapersdownload.files.wordpress.com/2020/03/padasalai-advanced-increment-go.pdf", year: 2020 },
  { goNumber: "G.O No.270", title: "BE to BT Assistant Appointment Orders", url: "https://12thquestionpapersdownload.files.wordpress.com/2019/12/padasalai-be.to-maths-b.t.-g.o..pdf", year: 2019 },
  { goNumber: "G.O No.202", title: "Headmaster CRC Work Guidelines", url: "https://12thquestionpapersdownload.files.wordpress.com/2019/11/guidelines-for-hms-regards-crc.pdf", year: 2019 },
  { goNumber: "G.O No.9", title: "Free Laptop Scheme for Students", url: "https://padasalaisms.files.wordpress.com/2019/11/padasalai-laptop-issue-g.o.ms_.no_.9_01.11.2019.pdf", year: 2019 },
  { goNumber: "G.O No.165", title: "Aided School Posts Deployment Guidelines", url: "https://12thquestionpapersdownload.files.wordpress.com/2019/10/aided-school-posts-deployment-g.o.ms_.no_.165-dated-17.9.2019.pdf", year: 2019 },
  { goNumber: "G.O No.161", title: "SSLC Tamil and English Papers Merged into Single Paper", url: "https://10thstudymaterials.files.wordpress.com/2019/09/sslc-tamil-english-paper-1-paper-2-subjects-merged-go-161-date-13.9.2019.pdf", year: 2019 },
  { goNumber: "G.O No.164", title: "5th and 8th Standards Public Examination Introduction", url: "https://10thstudymaterials.files.wordpress.com/2019/09/58th-standard-public-exam-g.o.ms_.no_.164-dated-13.9.2019.pdf", year: 2019 },
  { goNumber: "G.O No.89", title: "LKG UKG Salary Head in Anganwadi Centres", url: "https://tnpscgroup4.files.wordpress.com/2019/01/sw-g.o.ms_.no_.89-dated-11.12.2018-lkg-ukg-in-anganwadi-centres.pdf", year: 2018 },
  { goNumber: "G.O No.238", title: "Staff Fixation Guidelines for Aided Schools", url: "https://padasalai9.files.wordpress.com/2018/11/go-238-date-13-11-2018-aided-schools-staff-fixation-instructions.pdf", year: 2018 },
  { goNumber: "G.O No.214", title: "Smart Cards for School Students Scheme", url: "https://tnpscgroup4.files.wordpress.com/2018/10/padasalai-net-shaala-sidhi-format.pdf", year: 2018 },
  { goNumber: "G.O No.200", title: "New ABL and SALM Teaching Instructions", url: "https://padasalai9.files.wordpress.com/2018/10/new-abl-and-salm-instructions-go-200-date-25-9-2018.pdf", year: 2018 },
  { goNumber: "G.O No.313", title: "Dearness Allowance Hike to 9 Percent", url: "https://padasalai9.files.wordpress.com/2018/09/da-hike-to-9-go-313-date-18-9-2018.pdf", year: 2018 },
  { goNumber: "G.O No.166", title: "School Upgrades Middle to High and High to HSS", url: "https://padasalaitrb.files.wordpress.com/2018/08/middle-to-high-school-upgrade-list-2018-19.pdf", year: 2018 },
  { goNumber: "G.O No.100", title: "Compassionate Appointment Regularization Orders", url: "https://tnpscgroup4.files.wordpress.com/2018/08/compassionate-appointment-regularisation-go-100-date-1-8-2018.pdf", year: 2018 },
  { goNumber: "G.O No.122", title: "Computer Instructor 765 Posts Sanctioned", url: "https://sites.google.com/site/trbtnpsc5/go/computer%20instructor%20post%20sanction%20go%20122%20with%20list.pdf", year: 2017 },
  { goNumber: "G.O No.127", title: "Primary and Middle School Working Days Change", url: "https://sites.google.com/site/trbtnpsc5/go/Primary%20and%20Middle%20Schools%20Working%20Days%20Change%20GO.pdf", year: 2017 },
  { goNumber: "G.O No.174", title: "Middle to High School Upgrade List 2017", url: "https://sites.google.com/site/trbtnpsc5/go/www.Padasalai.Net%20-%20Middle%20to%20High%20School%20Upgrade%20List.pdf", year: 2017 },
  { goNumber: "G.O No.309", title: "Dearness Allowance 7 Percent Hike", url: "https://sites.google.com/site/trbtnpsc3/go/DA%20GO%20309%2C%20Date%2016.12.2016.pdf", year: 2016 },
  { goNumber: "G.O No.105", title: "Maternity Leave Extended to 9 Months", url: "https://sites.google.com/site/trbtnpsc2/go/Maternity%20Leave%20Hike%20to%209%20Month%20GO%20105%20Date-%2007.11.2016.pdf", year: 2016 },
  { goNumber: "G.O No.288", title: "CPS to GPF Transfer Orders", url: "https://sites.google.com/site/trbtnpsc2/go/CPS%20to%20GPF%20Transfer%20GO%20288.pdf", year: 2016 },
  { goNumber: "G.O No.45", title: "Bio-metric Attendance in Schools", url: "https://sites.google.com/site/trbtnpsc5/go/Bio-metric%20in%20Schools%20GO%2045%20Date%2003.03.2017.pdf", year: 2017 },
];

async function seedTRBTNPSCGOs() {
  try {
    console.log("🚀 Seeding GOs from trbtnpsc.com...");
    console.log(`📊 Total GOs to process: ${TRBTNPSC_GOS.length}`);

    // Get or create School Education department
    let dept = await prisma.department.findFirst({
      where: { slug: "school-education" },
    });
    if (!dept) {
      dept = await prisma.department.create({
        data: { name: "School Education", slug: "school-education" },
      });
    }

    // Get Government Orders category
    let category = await prisma.category.findFirst({
      where: { slug: "government-orders" },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { name: "Government Orders", slug: "government-orders" },
      });
    }

    let created = 0;
    let skipped = 0;

    for (const go of TRBTNPSC_GOS) {
      // Check for duplicates
      const existing = await prisma.document.findFirst({
        where: {
          OR: [
            { goNumber: go.goNumber },
            { title: go.title },
            { fileUrl: go.url },
          ],
        },
      });

      if (existing) {
        console.log(`   ⏭️  Skip: ${go.goNumber}`);
        skipped++;
        continue;
      }

      await prisma.document.create({
        data: {
          title: go.title,
          description: `Government Order: ${go.title}. Source: trbtnpsc.com`,
          goNumber: go.goNumber,
          fileName: `${go.goNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 300000) + 50000,
          fileType: "pdf",
          departmentId: dept.id,
          categoryId: category.id,
          publishedYear: go.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 400) + 20,
        },
      });

      console.log(`   ✨ Added: ${go.goNumber} - ${go.title.substring(0, 35)}...`);
      created++;
    }

    console.log(`\n📊 ═════════════════════════════════`);
    console.log(`   ✨ Created: ${created}`);
    console.log(`   ⏭️  Skipped (duplicates): ${skipped}`);
    console.log(`📊 ═════════════════════════════════`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTRBTNPSCGOs();
