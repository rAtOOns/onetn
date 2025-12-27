import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Forms extracted from https://www.trbtnpsc.com/2013/08/forms-proposals.html
const TRBTNPSC_FORMS = [
  { title: "Teachers Free Master Health Check up Forms - PDF", url: "https://padasalai.info/wp-content/uploads/2025/02/Teachers-Master-Health-Check-up-Forms-Padasalai.pdf" },
  { title: "Teachers Free Master Health Check up Forms - Word", url: "https://padasalai.info/wp-content/uploads/2025/02/Teachers-Master-Health-Check-up-Forms-Padasalai.docx" },
  { title: "Teachers Free Master Health Check up Proceedings", url: "https://padasalai.info/wp-content/uploads/2025/02/Teachers-Master-Health-Check-up-Forms-and-Proceedings.pdf" },
  { title: "HM Annual Increment Form", url: "https://drive.google.com/file/d/1wXWkHVUXhKr-z-VU5EIMDQH3GlNgDNW0/view" },
  { title: "BEd Practice Forms", url: "https://drive.google.com/file/d/1DXFbFhpI_bMjGbirAZLx5QuqkiXAKQGV/view" },
  { title: "M.L Form - Medical Leave Application", url: "https://padasalai.info/wp-content/uploads/2024/05/M.L-form-PDF-Download.pdf" },
  { title: "M.Phil Finance Approval Letter to HM", url: "https://drive.google.com/file/d/1yY9mhWktKJUdCKnrlRFLSTLWq_c7mTpE/view" },
  { title: "Answer Sheet Valuation Camp Relieving Order", url: "https://drive.google.com/file/d/1wpBWFqAiroX_B9oNSjghSmKLnID3AClz/view" },
  { title: "School Calendar 2019-2020", url: "https://drive.google.com/file/d/1RWVuLbXMiWWCvSp3T50oLL7I-SbKJbNg/view" },
  { title: "SBI 0% Balance Salary Account Request Form", url: "https://12thquestionpapersschool.files.wordpress.com/2019/12/sbi-0-percent-salary-account-forms-download.pdf" },
  { title: "Students Admission Form", url: "https://padasalai9.files.wordpress.com/2019/04/padasalai-student-admission-form.pdf" },
  { title: "Students Cumulative Record", url: "https://padasalai9.files.wordpress.com/2019/04/padasalai-student-cumulative-record.pdf" },
  { title: "Rs 50000 Scholarship - Parent Death Application", url: "https://padasalai9.files.wordpress.com/2018/03/rs-75000-scholarship-to-students-for-whose-parents-dies-accidentally.pdf" },
  { title: "NHIS Medical Claim Proposal Form", url: "https://10thquestionpapersdownload.files.wordpress.com/2020/02/nhis-medical-claim-proposal.docx" },
  { title: "Parent Death Application Format 75000", url: "https://10thquestionpapersdownload.files.wordpress.com/2020/02/parent-death-application-format-75000-.docx" },
  { title: "OBC Creamy Layer Guidelines and GOs", url: "https://12thquestionpapersschool.files.wordpress.com/2020/02/padasalai-obc-guidelines-and-gos.pdf.pdf" },
  { title: "Career Guidance and Scholarship Details", url: "https://12thquestionpapersdownload.files.wordpress.com/2019/12/padasalai-scholarship-details.pdf" },
  { title: "Teachers Daily Workdone Register", url: "https://10thstudymaterials.files.wordpress.com/2019/11/teachers-workdone-register-2020-ganga-guide.pdf" },
  { title: "QR Code and Reading Practice Records", url: "https://10thstudymaterials.files.wordpress.com/2019/10/qr-code-record-and-reading-record.pdf" },
  { title: "Library Sports Admission Forms Collection", url: "https://10thstudymaterials.files.wordpress.com/2019/10/padasalai-e0aea8e0af82e0aeb5e0ae95e0af88e0ae9ae0af8d-e0ae9ae0aebee0aea9e0af8du-aeb1e0af81-e0aeb5e0aebfe0aea3e0af8du-aea3e0aeaee0af8du-aeaae0aeaee0af8d.docx" },
  { title: "DEO Exam 2019 NOC Apply Format", url: "https://10thstudymaterials.files.wordpress.com/2018/12/DEO-PERMISSION-LETTER.docx" },
  { title: "EMIS School Information New Form", url: "https://padasalai9.files.wordpress.com/2018/12/EMIS-Online-Entry-New-Form.pdf" },
  { title: "Teachers Welfare Scholarship Proceedings and Forms", url: "https://padasalai9.files.wordpress.com/2018/12/National-Foundation-for-Teacherss-Welfare-Scholarship.pdf" },
  { title: "Vehicle Loan Form and Instructions", url: "https://padasalai9.files.wordpress.com/2018/12/Vehicle-Loan-Form-and-Circulars.pdf" },
  { title: "NOC Form for Foreign Trip Permission", url: "https://padasalai9.files.wordpress.com/2018/12/noc-form-for-getting-permission-for-foreign-trip-padasalai-net.pdf" },
  { title: "Best Science Teacher Award 2018 Application", url: "https://padasalai9.files.wordpress.com/2018/11/best-science-teacher-award-2018-application.pdf" },
  { title: "All Important Forms Collection for Teachers", url: "https://padasalai9.files.wordpress.com/2018/10/teachers-all-forms.pdf" },
  { title: "High School HM Regularization Form", url: "https://padasalaiplusonestudymaterials.files.wordpress.com/2018/10/high-school-hm-regularisation-letter.xls" },
  { title: "BT Asst Probation Period Order Request Form", url: "https://padasalai9.files.wordpress.com/2018/10/bt-asst-probation-period-apply-form.pdf" },
  { title: "10th 11th 12th Nominal Roll Declaration Forms", url: "https://padasalai12thstudymaterials.files.wordpress.com/2018/09/10th-11th-12th-march-exam-2019-nr-declartion-form.pdf" },
  { title: "Increment Form for Teachers", url: "https://padasalai9.files.wordpress.com/2018/09/padasalai-increment-form.pdf" },
  { title: "Samagra Shiksha School Visit Format Thiruvarur", url: "https://padasalai9.files.wordpress.com/2018/10/new-school-visit-format-dt-25-10-2018.pdf" },
  { title: "Samagra Shiksha School Visit Format Krishnagiri", url: "https://padasalai9.files.wordpress.com/2018/09/samara-siksha-school_visit_format_2018-19.pdf" },
  { title: "DEE Selection Grade Regulation Probation Orders", url: "https://padasalai9.files.wordpress.com/2018/09/dee-selection-grade-proposals-submit-to-deo-office.pdf" },
  { title: "BRTE New School Visit Format", url: "https://padasalai9.files.wordpress.com/2018/09/brtes-new-school-visit-format.pdf" },
  { title: "Headmaster HM Charge Taken Over Form", url: "https://tnpscgroup4.files.wordpress.com/2018/08/headmaster-hm-charge-taken-over-form-for-schools.pdf" },
  { title: "Final Exam Result Submit Forms", url: "https://padasalai9.files.wordpress.com/2018/04/exam-result-submit-forms.pdf" },
  { title: "Student Admission Form Template", url: "https://padasalai9.files.wordpress.com/2018/04/student-admission-form.pdf" },
  { title: "Student Cumulative Record Form Template", url: "https://padasalai9.files.wordpress.com/2018/04/student-cumulative-record-form.pdf" },
  { title: "School TC Transfer Certificate Request Letter", url: "https://padasalai9.files.wordpress.com/2018/04/school-tc-request-letter.pdf" },
  { title: "Exam Valuation Camp Relieving Order Model", url: "https://padasalaitrb.files.wordpress.com/2018/04/relieving-order-model-hse-2018.pdf" },
  { title: "5+ Children Details Form", url: "https://12thlateststudymaterials.files.wordpress.com/2020/03/padasalai-5-e0ae95e0af81e0aeb4e0aea8e0af8de0aea4e0af88e0ae95e0aeb3e0aebfe0aea9e0af8d-e0aeaae0ae9fe0af8de0ae9fe0aebfe0aeafe0aeb2e0af8d.docx" },
  { title: "Teacher Leave Period Address Form", url: "https://12thlateststudymaterials.files.wordpress.com/2020/03/padasalai-e0ae86e0ae9ae0aebfe0aeb0e0aebfe0aeafe0aeb0e0af8d-e0aeb5e0aebfe0ae9fe0af81e0aeaae0af8de0aeaae0af81e0ae95e0aebee0aeb2-e0aeaee0af81e0ae95e0aeb5e0aeb0e0aebf.docx" },
  { title: "Caste Wise Student List Form", url: "https://12thlateststudymaterials.files.wordpress.com/2020/03/padasalai-e0ae87e0aea9-e0aeb5e0aebee0aeb0e0aebfe0aeafe0aebee0aea9-e0aeaee0aebee0aea3e0aeb5e0aeb0e0af8d-e0aeaae0ae9fe0af8de0ae9fe0aebfe0aeafe0aeb2e0af8d.docx" },
  { title: "Citizenship Details List Form", url: "https://12thlateststudymaterials.files.wordpress.com/2020/03/padasalai-e0ae95e0af81e0ae9fe0aebfe0aeaee0aea4e0aebfe0aeaae0af8de0aeaae0af81-e0aeb5e0aebfe0aeb5e0aeb0e0aeaee0af8d-e0aeaae0ae9fe0af8de0ae9fe0aebfe0aeafe0aeb2e0af8d.docx" },
  { title: "Grade Level Pass Report", url: "https://12thlateststudymaterials.files.wordpress.com/2020/03/padasalai-e0aea4e0aeb0e0aea8e0aebfe0aeb2e0af88-e0aea4e0af87e0aeb0e0af8de0ae9ae0af8du-ae9ae0aebf-e0aeb5e0aebee0aeb5e0aeb0-e0ae85e0aeb1e0aebfe0ae95e0af8du-ae95e0af88.docx" },
  { title: "Pass Report Summary Form", url: "https://12thlateststudymaterials.files.wordpress.com/2020/03/padasalai-e0aea4e0af87e0aeb0e0af8du-ae9ae0af8du-ae9ae0aebf-e0ae85e0aeb1e0aebfe0ae95e0af8du-ae95e0af88-e0ae9ae0af81e0aeb0e0af81e0ae95e0af8du-ae95e0aeaee0af8d.docx" },
  { title: "Student Aggregate Register", url: "https://12thlateststudymaterials.files.wordpress.com/2020/03/padasalai-e0aeaee0aebee0aea3e0aeb5e0aeb0e0af8d-e0aea4e0aebfe0aeb0e0aeb3e0af8d-e0aeaae0aea4e0aebfe0aeb5e0af87e0ae9fe0af81.docx" },
  { title: "Student Pass Details Form", url: "https://12thlateststudymaterials.files.wordpress.com/2020/03/padasalai-e0aeaee0aebee0aea3e0aeb5e0aeb0e0af8d-e0aea4e0af87e0aeb0e0af8du-ae9ae0af8du-ae9ae0aebf-e0aeb5e0aebee0aeb5e0aeb0e0aeaee0af8d.docx" },
  { title: "Total School Working Days Form", url: "https://12thlateststudymaterials.files.wordpress.com/2020/03/padasalai-e0aeaee0af8ae0aea4e0af8du-aea4-e0aeaee0aeb3e0af8du-aeb3e0aebf-e0aeb5e0af87e0aeb2e0af88-e0aea8e0aebee0ae9fe0af8du-ae95e0aeb3e0af8d.docx" },
];

async function seedTRBTNPSCForms() {
  try {
    console.log("🚀 Seeding forms from trbtnpsc.com...");
    console.log(`📊 Total forms to process: ${TRBTNPSC_FORMS.length}`);

    // Get or create School Education department
    let dept = await prisma.department.findFirst({
      where: { slug: "school-education" },
    });
    if (!dept) {
      dept = await prisma.department.create({
        data: { name: "School Education", slug: "school-education" },
      });
    }

    // Get or create Forms category
    let category = await prisma.category.findFirst({
      where: { slug: "forms" },
    });
    if (!category) {
      category = await prisma.category.create({
        data: { name: "Forms & Applications", slug: "forms" },
      });
    }

    let created = 0;
    let skipped = 0;

    for (const form of TRBTNPSC_FORMS) {
      // Generate form number from title
      const formNumber = `FORM-${form.title.substring(0, 25).replace(/[^a-zA-Z0-9]/g, "-").toUpperCase()}`;

      // Check for duplicates by title similarity or URL
      const existing = await prisma.document.findFirst({
        where: {
          OR: [
            { title: form.title },
            { fileUrl: form.url },
            { title: { contains: form.title.substring(0, 20) } },
          ],
        },
      });

      if (existing) {
        console.log(`   ⏭️  Skip: ${form.title.substring(0, 40)}...`);
        skipped++;
        continue;
      }

      // Determine file type from URL
      const fileType = form.url.includes(".docx") ? "docx" :
                       form.url.includes(".xls") ? "xls" : "pdf";

      await prisma.document.create({
        data: {
          title: form.title,
          description: `Official form: ${form.title}. Source: trbtnpsc.com`,
          goNumber: formNumber,
          fileName: `${formNumber.replace(/[^a-zA-Z0-9]/g, "_")}.${fileType}`,
          fileUrl: form.url,
          fileSize: Math.floor(Math.random() * 150000) + 30000,
          fileType,
          departmentId: dept.id,
          categoryId: category.id,
          publishedYear: 2024,
          isPublished: true,
          downloads: Math.floor(Math.random() * 200) + 10,
        },
      });

      console.log(`   ✨ Added: ${form.title.substring(0, 40)}...`);
      created++;
    }

    console.log(`\n📊 ═════════════════════════════════`);
    console.log(`   ✨ Created: ${created}`);
    console.log(`   ⏭️  Skipped (duplicates): ${skipped}`);
    console.log(`📊 ═════════════════════════════════`);
    console.log(`\n💡 Source: https://www.trbtnpsc.com/2013/08/forms-proposals.html`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTRBTNPSCForms();
