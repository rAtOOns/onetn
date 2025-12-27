import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Comprehensive Education Department GOs from kalviexpress.in and other sources
const EDUCATION_GOS = [
  // 2025 GOs
  { goNumber: "G.O.Ms.No.130-2025", title: "Computer Instructor Grade I Amendment to Special Rules", url: "https://www.kalviexpress.in/2025/06/computer-instructor-grade-i-amendment.html", year: 2025 },
  { goNumber: "G.O.Ms.No.21-2025", title: "Probation Period Included in Maternity Leave Calculation", url: "https://www.kalviexpress.in/2025/05/probation-included-in-maternity-leave.html", year: 2025 },
  { goNumber: "G.O.Ms.No.103-2025", title: "Direct Retotal Method Cancelled for HSC Examinations", url: "https://www.kalviexpress.in/2025/05/direct-retotal-method-cancel-for-hsc.html", year: 2025 },
  { goNumber: "G.O.Ms.No.19-2025", title: "All Temporary Posts Converted to Permanent Posts", url: "https://www.kalviexpress.in/2025/01/GO-No-19-Date-27-01-2025-All-Temporar-Post-Converted-Permanent-Post-Head.html", year: 2025 },
  { goNumber: "G.O.Ms.No.261-2024", title: "DSE 2% Quota for PG Teacher Promotions", url: "https://www.kalviexpress.in/2025/01/go-no-261-date-09-12-24.html", year: 2024 },

  // 2024 GOs
  { goNumber: "G.O.Ms.No.41-2024", title: "Health Checkup for Teachers Annual Medical Examination", url: "https://www.kalviexpress.in/2024/02/health-checkup-for-teachers-go-no-41.html", year: 2024 },
  { goNumber: "G.O.Ms.No.23-2024", title: "Part Time Teacher Salary Increase Orders", url: "https://www.kalviexpress.in/2024/01/part-time-teacher-salary-hiked-go-no-23.html", year: 2024 },
  { goNumber: "G.O.Ms.No.26-2024", title: "BT Teacher Posting Orders 2024", url: "https://www.kalviexpress.in/2024/01/bt-teacher-posting-go-no-26-date-24.html", year: 2024 },
  { goNumber: "G.O.Ms.No.7-2024", title: "1500 Secondary Grade Teachers Posts Sanctioned", url: "https://www.kalviexpress.in/2024/01/1500-sec-gr-teachers-post-sanction.html", year: 2024 },
  { goNumber: "G.O.Ms.No.8-2024", title: "Pongal Bonus 2024 for Government Employees", url: "https://www.kalviexpress.in/2024/01/pongal-bonus-go-2024.html", year: 2024 },

  // 2023 GOs
  { goNumber: "G.O.Ms.No.310-2023", title: "Dearness Allowance Enhanced 42% to 46% from July 2023", url: "https://www.kalviexpress.in/2023/10/da-increased-42-to-46-effect-from-july.html", year: 2023 },
  { goNumber: "G.O.Ms.No.95-2023", title: "Lumpsum Amount for Additional Qualification", url: "https://www.kalviexpress.in/2023/10/lumpsum-amount-for-additional.html", year: 2023 },
  { goNumber: "G.O.Ms.No.185-2023", title: "Age Limit Raised for Teaching Post Recruitment", url: "https://www.kalviexpress.in/2023/10/GO-No-185-Raising-the-age-limit-for-joining-the-Teaching.html", year: 2023 },
  { goNumber: "G.O.Ms.No.243-2023", title: "DEE State Level Seniority List Preparation", url: "https://www.kalviexpress.in/2023/12/dee-state-level-seniority-go-no-243.html", year: 2023 },
  { goNumber: "G.O.Ms.No.245-2023", title: "State Level Monitoring Committee SLMC Formation", url: "https://www.kalviexpress.in/2023/12/state-level-monitoring-committee-slmc.html", year: 2023 },
  { goNumber: "G.O.Ms.No.17-2023", title: "Michaung Cyclone Relief One Day Salary to CMPRF", url: "https://www.kalviexpress.in/2023/12/michaung-cyclone-one-day-salary-to.html", year: 2023 },
  { goNumber: "G.O.Ms.No.211-2023", title: "SSLC 10th Retotal and Revaluation Fee Structure", url: "https://www.kalviexpress.in/2023/12/sslc-10th-retotal-revaluation-go-ms-no.html", year: 2023 },
  { goNumber: "GAZETTE-No.384-2023", title: "Removal of 50% Rule in Degree and BEd for Teacher Recruitment", url: "https://www.kalviexpress.in/2023/11/gazette-no-384-removal-of-rule.html", year: 2023 },
  { goNumber: "G.O.Ms.No.528-2023", title: "Vinayagar Chaturthi Holiday Date Change", url: "https://www.kalviexpress.in/2023/08/holiday-vinayagar-chathurthi-date.html", year: 2023 },
  { goNumber: "G.O.Ms.No.296-2023", title: "First Graduate Certificate Issuance Guidelines", url: "https://www.kalviexpress.in/2023/07/first-graduate-certificate-go-no-296.html", year: 2023 },
  { goNumber: "G.O.Ms.No.142-2023", title: "42% DA for TN Government Employees and Teachers", url: "https://www.kalviexpress.in/2023/05/42-da-for-tn-govt-employees-and.html", year: 2023 },
  { goNumber: "G.O.Ms.No.62-2023", title: "COVID Lockdown Leave Treated as Duty Period", url: "https://www.kalviexpress.in/2023/02/go-no-62-date-13-02-2023-lock-down.html", year: 2023 },
  { goNumber: "G.O.Ms.No.25-2023", title: "Equal Pay for Equal Work Committee Formation", url: "https://www.kalviexpress.in/2023/02/committee-for-equal-pay-for-equal-work.html", year: 2023 },
  { goNumber: "G.O.Ms.No.1-2023", title: "TRB Restructuring Orders", url: "https://www.kalviexpress.in/2023/01/restructuring-of-trb-go-no-1-dated-03.html", year: 2023 },

  // 2022 GOs
  { goNumber: "G.O.Ms.No.213-2022", title: "Middle School Headmaster Special Grade Pay", url: "https://www.kalviexpress.in/2022/12/go-no-213-date-02-12-22-middle-school.html", year: 2022 },
  { goNumber: "G.O.Ms.No.164-2022", title: "LKG UKG Temporary Teachers Appointment at Rs.5000", url: "https://www.kalviexpress.in/2022/10/lkg-ukg-temporary-teachers-appointment.html", year: 2022 },
  { goNumber: "G.O.Ms.No.151-2022", title: "Restructuring School Education Department Administrative Setup", url: "https://www.kalviexpress.in/2022/09/go-no151-date-09-09-2022-restructuring.html", year: 2022 },
  { goNumber: "G.O.Ms.No.44-2022", title: "Surrogate Mother 270 Days Childcare Leave for Female Employees", url: "https://www.kalviexpress.in/2022/08/go-no-44-date-29-07-22-270.html", year: 2022 },
  { goNumber: "G.O.Ms.No.415-2022", title: "Superannuation Age Extension Orders", url: "https://www.kalviexpress.in/2022/06/superannuation-go-no-415-date-28-06-2022.html", year: 2022 },
  { goNumber: "G.O.Ms.No.114-2022", title: "Special Fees Cancelled for Computer Group Students", url: "https://www.kalviexpress.in/2022/06/go-no-114-special-fees-cancel-for.html", year: 2022 },
  { goNumber: "G.O.Ms.No.53-2022", title: "Weightage for Government Servants in Recruitment", url: "https://www.kalviexpress.in/2022/06/go-no-53-weightage-govt-servants.html", year: 2022 },
  { goNumber: "G.O.Ms.No.108-2022", title: "Oonchal Thensittu Kanavu Teacher Magazines Publication", url: "https://www.kalviexpress.in/2022/06/go-no-108-date-22-06-2022.html", year: 2022 },
  { goNumber: "G.O.Ms.No.34-2022-ITI", title: "ITI Certificate Equivalence to 10th and 12th Standards", url: "https://www.kalviexpress.in/2022/05/iti-certificate-equivalence-to-10th-std.html", year: 2022 },
  { goNumber: "G.O.Ms.No.34-2022-EL", title: "Earned Leave Surrender Suspended", url: "https://www.kalviexpress.in/2022/04/el-surrender-suspended-go-no-34-date-11.html", year: 2022 },

  // 2021 GOs
  { goNumber: "G.O.Ms.No.1037-2021", title: "Tamil Thai Valthu State Anthem Official Orders", url: "https://www.kalviexpress.in/2021/12/tamil-thai-valthu-state-anthem-go-no.html", year: 2021 },
  { goNumber: "G.O.Ms.No.176-2021", title: "Teacher Transfer Counselling Policy Guidelines", url: "https://www.kalviexpress.in/2021/12/teacher-transfer-counselling-policy-for.html", year: 2021 },
  { goNumber: "G.O.Ms.No.133-2021", title: "Tamil Paper Compulsory in All Competitive Exams", url: "https://www.kalviexpress.in/2021/12/tamil-paper-compulsory-all-compertitive.html", year: 2021 },
  { goNumber: "G.O.Ms.No.548-2021", title: "Employment Renewal at Employment Exchange", url: "https://www.kalviexpress.in/2021/12/employment-renewal-go-no-548-date-02-12.html", year: 2021 },
  { goNumber: "G.O.Ms.No.226-2021", title: "PG Teacher Temporary Appointment through PTA", url: "https://www.kalviexpress.in/2021/11/pg-appointment-temporarily-by-pta-go-no.html", year: 2021 },
  { goNumber: "G.O.Ms.No.122-2021", title: "Priority for First Generation Graduate and Tamil Medium Students", url: "https://www.kalviexpress.in/2021/11/priority-for-first-generation-graduate.html", year: 2021 },
  { goNumber: "G.O.Ms.No.29-2021-Email", title: "Email Account for Government Employees", url: "https://www.kalviexpress.in/2021/11/e-mail-account-for-govt-employee-go-no.html", year: 2021 },
  { goNumber: "G.O.Ms.No.120-2021", title: "Incentive for Higher Education Qualification", url: "https://www.kalviexpress.in/2021/11/incentive-for-higher-education-go-no120.html", year: 2021 },
  { goNumber: "G.O.Ms.No.144-2021", title: "TRB Recruitment Age Relaxation", url: "https://www.kalviexpress.in/2021/10/trb-age-relaxation-go-no-144.html", year: 2021 },
  { goNumber: "G.O.Ms.No.113-2021", title: "JACTO-GEO Strike Period Regularised as Working Days", url: "https://www.kalviexpress.in/2021/10/jacto-geo-strike-period-regularised-as.html", year: 2021 },
  { goNumber: "G.O.Ms.No.98-2021", title: "Annual Increment Amendment to Fundamental Rules", url: "https://www.kalviexpress.in/2021/09/go-no-98-date-21-09-2021-annual-increment.html", year: 2021 },
  { goNumber: "G.O.Ms.No.197-2021", title: "FBF Family Benefit Fund Subscription Increased", url: "https://www.kalviexpress.in/2021/09/fbf-subscription-increased-go-ms-no197.html", year: 2021 },
  { goNumber: "G.O.Ms.No.128-2021-TET", title: "TET Certificate Lifetime Validity Orders", url: "https://www.kalviexpress.in/2021/08/tet-lifetime-validity-go-no-128-dated.html", year: 2021 },
  { goNumber: "G.O.Ms.No.84-2021", title: "Maternity Leave Extended to 1 Year", url: "https://www.kalviexpress.in/2021/08/matarnity-leave-extension-1-year-go-no.html", year: 2021 },
  { goNumber: "G.O.Ms.No.105-2021", title: "12th Standard Mark Calculation Formula", url: "https://www.kalviexpress.in/2021/07/12th-mark-calculation-go-no-105-date-12.html", year: 2021 },
  { goNumber: "G.O.Ms.No.165-2021", title: "Pensioners Family Security Fund Enhancement", url: "https://www.kalviexpress.in/2021/07/go-ms-no-165-25.html", year: 2021 },
  { goNumber: "G.O.Ms.No.164-2021", title: "Pensioners Family Security Fund Subscription Increase", url: "https://www.kalviexpress.in/2021/07/go-ms-no-164-pensioners-family-security.html", year: 2021 },
  { goNumber: "G.O.Ms.No.160-2021", title: "NHIS New Health Insurance Scheme 2021", url: "https://www.kalviexpress.in/2021/07/nhis-2021-go-ms-no-160-date-29-06-2021.html", year: 2021 },
  { goNumber: "G.O.Ms.No.18-2021", title: "1575 BT Posts Upgraded to PG Teacher Posts", url: "https://www.kalviexpress.in/2021/06/1575-bt-post-upgrade-to-pg-post-go-no18.html", year: 2021 },
  { goNumber: "G.O.Ms.No.52-2021", title: "One Day Salary for COVID-19 CM Relief Fund", url: "https://www.kalviexpress.in/2021/05/one-day-salary-for-covid19-cm-fund-go.html", year: 2021 },
  { goNumber: "G.O.Ms.No.83-2021", title: "Differently Abled Employees Duty Exemption COVID", url: "https://www.kalviexpress.in/2021/05/go-no-83.html", year: 2021 },
  { goNumber: "G.O.Ms.No.48-2021-EL", title: "Earned Leave Surrender Suspension for One Year", url: "https://www.kalviexpress.in/2021/05/el-surrender-suspension-for-one-year-go.html", year: 2021 },
  { goNumber: "G.O.Ms.No.367-2021", title: "TN Government Offices 50% Staff Attendance COVID", url: "https://www.kalviexpress.in/2021/05/tn-govt-office-function-50-of-workers.html", year: 2021 },
  { goNumber: "G.O.Ms.No.91-2021", title: "40 Years Service Bonus Increment", url: "https://www.kalviexpress.in/2021/03/40year-bonus-increment-go-no-91-date-26.html", year: 2021 },
  { goNumber: "G.O.Ms.No.48-2021", title: "9th 10th 11th Standards All Pass Orders 2021", url: "https://www.kalviexpress.in/2021/02/9-10-11-all-pass-go-no-48-date-25-02.html", year: 2021 },
  { goNumber: "G.O.Ms.No.29-2021", title: "Government Servant Retirement Age Increased to 60", url: "https://www.kalviexpress.in/2021/02/govt-servant-age-increased-go-no-29.html", year: 2021 },
  { goNumber: "G.O.Ms.No.25-2021", title: "ADW Adi Dravidar Welfare Deployment Orders", url: "https://www.kalviexpress.in/2021/02/adw-deployment-go-25-date-08-02-2021.html", year: 2021 },
  { goNumber: "G.O.Ms.No.20-2021", title: "Part Time Teacher Salary Correction Orders", url: "https://www.kalviexpress.in/2021/02/part-time-teacher-salary-go-correction.html", year: 2021 },
  { goNumber: "G.O.Ms.No.9-2021", title: "JACTO-GEO Strike Case Withdrawal Orders", url: "https://www.kalviexpress.in/2021/02/jacto-geo-strike-case-withdraw-go-no-9.html", year: 2021 },
  { goNumber: "G.O.Ms.No.15-2021", title: "Part Time Teacher Salary Increased", url: "https://www.kalviexpress.in/2021/02/part-time-teacher-salary-increased-go.html", year: 2021 },
  { goNumber: "G.O.Ms.No.6-2021", title: "Medical Leave Amendment Orders", url: "https://www.kalviexpress.in/2021/01/medical-leave-go-6.html", year: 2021 },

  // TRB Specific GOs
  { goNumber: "G.O.Ms.No.252-2012", title: "TET Weightage for Teacher Recruitment Board Selection", url: "https://www.johnsonasirservices.org/web/download4/TET%20Weightage%20G.O.252_05%2010%202012.pdf", year: 2012 },

  // Additional Education GOs from various years
  { goNumber: "G.O.Ms.No.326-2021", title: "9th 10th 11th Standard School Closure COVID Orders", url: "https://cms.tn.gov.in/sites/default/files/go/edu_e_326_2021.pdf", year: 2021 },
  { goNumber: "G.O.Ms.No.82-2021", title: "Tamil Medium Education Priority for Government Jobs", url: "https://cms.tn.gov.in/sites/default/files/go/edu_e_82_2021.pdf", year: 2021 },
  { goNumber: "G.O.Ms.No.132-2021", title: "School Recognition Online EMIS Portal Authorization", url: "https://cms.tn.gov.in/sites/default/files/go/edu_e_132_2021.pdf", year: 2021 },
  { goNumber: "G.O.Ms.No.134-2021", title: "25 New Primary Schools Creation and Middle School Upgrades", url: "https://cms.tn.gov.in/sites/default/files/go/edu_e_134_2021.pdf", year: 2021 },
  { goNumber: "G.O.Ms.No.149-2022", title: "28 Specialized Schools Established in Tamil Nadu Districts", url: "https://cms.tn.gov.in/sites/default/files/go/edu_e_149_2022.pdf", year: 2022 },
  { goNumber: "G.O.Ms.No.166-2022", title: "Higher Education Financial Assistance for Prestigious Institutions", url: "https://cms.tn.gov.in/sites/default/files/go/edu_e_166_2022.pdf", year: 2022 },
  { goNumber: "G.O.Ms.No.115-2022", title: "Teacher Reappointment During Mid-Year Retirement Period", url: "https://cms.tn.gov.in/sites/default/files/go/edu_e_115_2022.pdf", year: 2022 },
  { goNumber: "G.O.Ms.No.12-2022", title: "Supernumerary Teacher Repositioning in Govt-Aided Schools", url: "https://cms.tn.gov.in/sites/default/files/go/edu_e_12_2022.pdf", year: 2022 },
  { goNumber: "G.O.Ms.No.10-2021", title: "Middle to High School Upgrade School List", url: "https://cms.tn.gov.in/sites/default/files/go/edu_e_10_2021.pdf", year: 2021 },
  { goNumber: "G.O.Ms.No.11-2021", title: "High to Higher Secondary School Upgrade School List", url: "https://cms.tn.gov.in/sites/default/files/go/edu_e_11_2021.pdf", year: 2021 },
];

async function seedEducationGOs() {
  try {
    console.log("🚀 Seeding comprehensive Education Department GOs...");
    console.log(`📊 Total GOs to process: ${EDUCATION_GOS.length}`);

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
        data: { name: "Government Orders (GOs)", slug: "government-orders" },
      });
    }

    let created = 0;
    let skipped = 0;

    for (const go of EDUCATION_GOS) {
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
        skipped++;
        continue;
      }

      await prisma.document.create({
        data: {
          title: go.title,
          description: `School Education Department Government Order: ${go.title}. Source: kalviexpress.in`,
          goNumber: go.goNumber,
          fileName: `${go.goNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 300000) + 50000,
          fileType: "pdf",
          departmentId: dept.id,
          categoryId: category.id,
          publishedYear: go.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 500) + 50,
        },
      });

      console.log(`   ✅ Added: ${go.goNumber}`);
      created++;
    }

    console.log(`\n✅ Done! Created: ${created}, Skipped: ${skipped}`);
  } catch (error) {
    console.error("Error seeding education GOs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedEducationGOs();
