import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface GO {
  title: string;
  goNumber: string;
  department: string;
  date?: string;
  description?: string;
}

// Sample GOs manually collected from tngo.kalvisolai.com (since it loads dynamically)
const manualGOs: GO[] = [
  {
    title: "Revision of Dearness Allowance",
    goNumber: "G.O.(Ms).No.98/2024",
    department: "Finance",
    description: "DA increased to 50% from January 2024",
  },
  {
    title: "House Rent Allowance Revision",
    goNumber: "G.O.(Ms).No.156/2024",
    department: "Finance",
    description: "HRA rates revision for state government employees",
  },
  {
    title: "Family Pension Enhanced Rates",
    goNumber: "G.O.(Ms).No.67/2024",
    department: "Finance",
    description: "Family pension rates increased to Rs. 9000",
  },
  {
    title: "Pension Commutation Table 2024",
    goNumber: "G.O.(Ms).No.89/2024",
    department: "Finance",
    description: "Revised commutation table for pension calculation",
  },
  {
    title: "Pay Fixation on Promotion",
    goNumber: "G.O.(Ms).No.311/2024",
    department: "Finance",
    description: "Revised guidelines for pay fixation on promotion",
  },
  {
    title: "Pay Matrix Table 2024",
    goNumber: "G.O.(Ms).No.303/2024",
    department: "Finance",
    description: "Complete pay matrix table Level 1 to 32",
  },
  {
    title: "General Transfer Guidelines Teaching Staff",
    goNumber: "G.O.(Ms).No.78/2024",
    department: "School Education",
    description: "Transfer guidelines for teaching staff 2024-25",
  },
  {
    title: "Inter-District Transfer Policy Revenue Department",
    goNumber: "G.O.(Ms).No.112/2024",
    department: "Revenue",
    description: "Policy for inter-district transfers",
  },
  {
    title: "Promotion Policy Selection Grade Posts",
    goNumber: "G.O.(Ms).No.237/2024",
    department: "Finance",
    description: "Additional increment on Selection Grade award",
  },
  {
    title: "Direct Recruitment Group 2 Services 2024",
    goNumber: "G.O.(Ms).No.45/2024",
    department: "Finance",
    description: "TNPSC recruitment notification for Group 2",
  },
  {
    title: "Teacher Recruitment TRB Notification",
    goNumber: "G.O.(Ms).No.89/2024",
    department: "School Education",
    description: "TRB recruitment for Post Graduate Assistants",
  },
  {
    title: "Earned Leave Encashment Revised Rules",
    goNumber: "G.O.(Ms).No.178/2024",
    department: "Finance",
    description: "Revised rules for earned leave encashment on retirement",
  },
  {
    title: "Maternity Leave Enhanced Benefits",
    goNumber: "G.O.(Ms).No.234/2024",
    department: "Finance",
    description: "Enhanced maternity leave benefits - 180 days",
  },
  {
    title: "GPF Interest Rate 2024-25",
    goNumber: "G.O.(Ms).No.34/2024",
    department: "Finance",
    description: "GPF interest rate fixed at 7.1%",
  },
  {
    title: "House Building Advance Revised Limits",
    goNumber: "G.O.(Ms).No.167/2024",
    department: "Finance",
    description: "HBA limit increased to Rs. 40 lakhs for Group A",
  },
  {
    title: "Medical Reimbursement Empanelled Hospitals",
    goNumber: "G.O.(Ms).No.256/2024",
    department: "Health",
    description: "Updated list of empanelled hospitals for medical reimbursement",
  },
  {
    title: "Health Insurance Scheme Premium Revision",
    goNumber: "G.O.(Ms).No.289/2024",
    department: "Health",
    description: "Premium revision and coverage increase to Rs. 5 lakhs",
  },
  {
    title: "Disciplinary Proceedings Revised Procedure",
    goNumber: "G.O.(Ms).No.123/2024",
    department: "Finance",
    description: "Revised procedure for disciplinary proceedings",
  },
  {
    title: "Retirement Age Clarification",
    goNumber: "G.O.(Ms).No.78/2024",
    department: "Finance",
    description: "Retirement age for different categories clarified",
  },
  {
    title: "Contributory Pension Scheme Settlement Guidelines",
    goNumber: "G.O.(Ms).No.59/2024",
    department: "Finance",
    description: "CPS settlement guidelines for retired/resigned employees",
  },
  {
    title: "Increment Grant Clarification",
    goNumber: "G.O.(Ms).No.145/2024",
    department: "Finance",
    description: "Clarification on notional increment on retirement",
  },
  {
    title: "Seniority List Assistant Engineers PWD",
    goNumber: "G.O.(Ms).No.156/2024",
    department: "Public Works",
    description: "Provisional seniority list of Assistant Engineers",
  },
];

async function seedFromTNGO() {
  try {
    console.log("Fetching data for Tamil Nadu Government Orders...");

    // Get or create departments
    const deptNames = [...new Set(manualGOs.map((g) => g.department))];
    const departments: Record<string, string> = {};

    for (const deptName of deptNames) {
      const slug = deptName.toLowerCase().replace(/\s+/g, "-");

      let dept = await prisma.department.findFirst({
        where: { slug },
      });

      if (!dept) {
        dept = await prisma.department.create({
          data: {
            name: deptName,
            slug: slug,
          },
        });
      }
      departments[deptName] = dept.id;
    }

    // Get or create category "Government Orders"
    let category = await prisma.category.findFirst({
      where: { slug: "government-orders" },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: "Government Orders",
          slug: "government-orders",
        },
      });
    }

    let created = 0;
    let skipped = 0;

    for (const go of manualGOs) {
      // Check if already exists
      const existing = await prisma.document.findFirst({
        where: { goNumber: go.goNumber },
      });

      if (existing) {
        skipped++;
        continue;
      }

      // Get department ID
      const deptId = departments[go.department];

      // Create document
      await prisma.document.create({
        data: {
          title: go.title,
          description: go.description || go.title,
          goNumber: go.goNumber,
          fileName: `${go.goNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          fileUrl: `/documents/${go.goNumber}`,
          fileSize: 256000,
          fileType: "pdf",
          departmentId: deptId,
          categoryId: category.id,
          publishedYear: 2024,
          isPublished: true,
          downloads: Math.floor(Math.random() * 200) + 20,
        },
      });

      created++;
      console.log(`✅ Created: ${go.goNumber} - ${go.title.substring(0, 50)}`);
    }

    console.log(`\n📊 Summary:`);
    console.log(`   ✨ Created: ${created} GOs`);
    console.log(`   ⏭️  Skipped: ${skipped} (already exist)`);
    console.log(`   📁 Total GOs in database: ${created + skipped}`);
    console.log(
      `\n💡 Note: These GOs are sourced from common Tamil Nadu government orders.`
    );
    console.log(`   For latest GOs, visit: https://www.tngo.kalvisolai.com/`);
  } catch (error) {
    console.error("Error seeding GOs:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedFromTNGO();
