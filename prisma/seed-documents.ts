import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Sample GO documents based on real Tamil Nadu Government Orders
const sampleDocuments = [
  // DA/Allowances
  {
    title: "Dearness Allowance increased to 50% from January 2024",
    titleTamil: "அகவிலைப்படி 50% ஆக உயர்வு - ஜனவரி 2024 முதல்",
    description: "Government of Tamil Nadu announces DA increase from 46% to 50% for all state government employees with effect from January 2024. Arrears to be paid in April 2024.",
    goNumber: "G.O.(Ms).No.98/2024",
    department: "finance",
    category: "government-orders",
    topic: "allowances",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 245000,
  },
  {
    title: "House Rent Allowance Revision for State Government Employees",
    titleTamil: "வீட்டு வாடகை படி திருத்தம் - அரசு ஊழியர்கள்",
    description: "Revised HRA rates for different city classifications. Chennai - 24%, Other municipalities - 16%, Rural areas - 8%.",
    goNumber: "G.O.(Ms).No.156/2024",
    department: "finance",
    category: "government-orders",
    topic: "allowances",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 189000,
  },
  // Pension Orders
  {
    title: "Family Pension - Enhanced rates for government employees",
    titleTamil: "குடும்ப ஓய்வூதியம் - மேம்படுத்தப்பட்ட விகிதங்கள்",
    description: "Enhanced family pension rates announced. Minimum family pension increased to Rs.9000 per month.",
    goNumber: "G.O.(Ms).No.67/2024",
    department: "finance",
    category: "government-orders",
    topic: "pension",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 312000,
  },
  {
    title: "Pension Commutation - Revised Table 2024",
    titleTamil: "ஓய்வூதிய மாற்றம் - திருத்தப்பட்ட அட்டவணை 2024",
    description: "New commutation table for pension calculation based on age at retirement. Applicable from 01.04.2024.",
    goNumber: "G.O.(Ms).No.89/2024",
    department: "finance",
    category: "government-orders",
    topic: "pension",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 156000,
  },
  {
    title: "Contributory Pension Scheme - Settlement Guidelines",
    titleTamil: "பங்களிப்பு ஓய்வூதிய திட்டம் - தீர்வு வழிகாட்டுதல்கள்",
    description: "Guidelines for settlement of CPS accumulation for employees who retired, resigned or died in service.",
    goNumber: "G.O.(Ms).No.59/2024",
    department: "finance",
    category: "government-orders",
    topic: "pension",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 278000,
  },
  // Pay & Salary
  {
    title: "Pay Fixation on Promotion - Revised Guidelines",
    titleTamil: "பதவி உயர்வில் சம்பள நிர்ணயம் - திருத்தப்பட்ட வழிகாட்டுதல்கள்",
    description: "Official Committee 2017 recommendations on fixation of pay on promotion in revised pay structure.",
    goNumber: "G.O.(Ms).No.311/2024",
    department: "finance",
    category: "government-orders",
    topic: "salary",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 423000,
  },
  {
    title: "Pay Matrix Table 2024 - Level 1 to Level 32",
    titleTamil: "சம்பள அணி அட்டவணை 2024 - நிலை 1 முதல் 32 வரை",
    description: "Complete pay matrix table as per Tamil Nadu Revised Pay Rules 2017 with 2024 revisions.",
    goNumber: "G.O.(Ms).No.303/2024",
    department: "finance",
    category: "government-orders",
    topic: "salary",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 567000,
  },
  {
    title: "Increment Grant for Government Servants - Clarification",
    titleTamil: "அரசு ஊழியர்களுக்கு ஊதிய உயர்வு - விளக்கம்",
    description: "Clarification on grant of notional increment to government servants who retire on superannuation on preceding day of increment.",
    goNumber: "G.O.(Ms).No.145/2024",
    department: "finance",
    category: "circulars",
    topic: "salary",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 134000,
  },
  // Transfers
  {
    title: "General Transfer Guidelines 2024 - Teaching Staff",
    titleTamil: "பொது இடமாற்ற வழிகாட்டுதல்கள் 2024 - ஆசிரியர்கள்",
    description: "Guidelines for general transfer and posting of teaching staff in government schools for the year 2024-25.",
    goNumber: "G.O.(Ms).No.78/2024",
    department: "school-education",
    category: "government-orders",
    topic: "transfers",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 345000,
  },
  {
    title: "Inter-District Transfer Policy - Revenue Department",
    titleTamil: "மாவட்டங்களுக்கு இடையேயான இடமாற்றக் கொள்கை - வருவாய் துறை",
    description: "Policy for inter-district transfers of revenue department officials including VAOs and Revenue Inspectors.",
    goNumber: "G.O.(Ms).No.112/2024",
    department: "revenue",
    category: "government-orders",
    topic: "transfers",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 234000,
  },
  // Promotions
  {
    title: "Promotion Policy - Selection Grade Posts",
    titleTamil: "பதவி உயர்வு கொள்கை - தேர்வு நிலை பதவிகள்",
    description: "Grant of one additional increment of 3% of basic pay to employees on award of Selection Grade/Special Grade.",
    goNumber: "G.O.(Ms).No.237/2024",
    department: "finance",
    category: "government-orders",
    topic: "promotions",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 198000,
  },
  {
    title: "Seniority List - Assistant Engineers (PWD)",
    titleTamil: "மூப்பு பட்டியல் - உதவி பொறியாளர்கள் (பொதுப்பணி)",
    description: "Provisional seniority list of Assistant Engineers in Public Works Department as on 01.01.2024.",
    goNumber: "G.O.(Ms).No.156/2024",
    department: "public-works",
    category: "notifications",
    topic: "promotions",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 890000,
  },
  // Recruitment
  {
    title: "Direct Recruitment - Group 2 Services 2024",
    titleTamil: "நேரடி ஆட்சேர்ப்பு - குரூப் 2 சேவைகள் 2024",
    description: "Notification for direct recruitment to various posts in Group 2 Services through TNPSC for the year 2024.",
    goNumber: "G.O.(Ms).No.45/2024",
    department: "finance",
    category: "notifications",
    topic: "recruitment",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 456000,
  },
  {
    title: "Teacher Recruitment - TRB Notification 2024",
    titleTamil: "ஆசிரியர் ஆட்சேர்ப்பு - TRB அறிவிப்பு 2024",
    description: "Teachers Recruitment Board notification for recruitment of Post Graduate Assistants and Physical Directors.",
    goNumber: "G.O.(Ms).No.89/2024",
    department: "school-education",
    category: "notifications",
    topic: "recruitment",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 567000,
  },
  // Leave Rules
  {
    title: "Earned Leave Encashment - Revised Rules",
    titleTamil: "ஈட்டிய விடுப்பு பணமாக்கல் - திருத்தப்பட்ட விதிகள்",
    description: "Revised rules for encashment of earned leave on retirement. Maximum 300 days allowed.",
    goNumber: "G.O.(Ms).No.178/2024",
    department: "finance",
    category: "government-orders",
    topic: "leave",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 167000,
  },
  {
    title: "Maternity Leave - Enhanced Benefits",
    titleTamil: "மகப்பேறு விடுப்பு - மேம்படுத்தப்பட்ட சலுகைகள்",
    description: "Enhanced maternity leave benefits for women government employees. 180 days with full pay.",
    goNumber: "G.O.(Ms).No.234/2024",
    department: "finance",
    category: "government-orders",
    topic: "leave",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 145000,
  },
  // GPF & Loans
  {
    title: "GPF Interest Rate 2024-25",
    titleTamil: "வருங்கால வைப்பு நிதி வட்டி விகிதம் 2024-25",
    description: "General Provident Fund interest rate fixed at 7.1% for the financial year 2024-25.",
    goNumber: "G.O.(Ms).No.34/2024",
    department: "finance",
    category: "government-orders",
    topic: "gpf-loans",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 98000,
  },
  {
    title: "House Building Advance - Revised Limits",
    titleTamil: "வீடு கட்டும் முன்பணம் - திருத்தப்பட்ட வரம்புகள்",
    description: "Revised limits for house building advance. Maximum limit increased to Rs.40 lakhs for Group A officers.",
    goNumber: "G.O.(Ms).No.167/2024",
    department: "finance",
    category: "government-orders",
    topic: "gpf-loans",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 234000,
  },
  // Medical
  {
    title: "Medical Reimbursement - Empanelled Hospitals List 2024",
    titleTamil: "மருத்துவ திருப்பி செலுத்துதல் - அங்கீகரிக்கப்பட்ட மருத்துவமனைகள் 2024",
    description: "Updated list of empanelled private hospitals for medical reimbursement under CGHS rates.",
    goNumber: "G.O.(Ms).No.256/2024",
    department: "health",
    category: "government-orders",
    topic: "medical",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 789000,
  },
  {
    title: "Health Insurance Scheme - Premium Revision",
    titleTamil: "சுகாதார காப்பீட்டு திட்டம் - பிரீமியம் திருத்தம்",
    description: "Revised premium rates for government employees health insurance scheme. Coverage increased to Rs.5 lakhs.",
    goNumber: "G.O.(Ms).No.289/2024",
    department: "health",
    category: "government-orders",
    topic: "medical",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 345000,
  },
  // Service Rules
  {
    title: "Disciplinary Proceedings - Revised Procedure",
    titleTamil: "ஒழுங்கு நடவடிக்கைகள் - திருத்தப்பட்ட நடைமுறை",
    description: "Revised procedure for disciplinary proceedings against government servants. Timeline reduced to 6 months.",
    goNumber: "G.O.(Ms).No.123/2024",
    department: "finance",
    category: "government-orders",
    topic: "service-rules",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 456000,
  },
  {
    title: "Retirement Age - Clarification for Different Services",
    titleTamil: "ஓய்வு வயது - வெவ்வேறு சேவைகளுக்கான விளக்கம்",
    description: "Clarification on retirement age for different categories of government servants. General - 60 years.",
    goNumber: "G.O.(Ms).No.78/2024",
    department: "finance",
    category: "circulars",
    topic: "service-rules",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 123000,
  },
  // Forms
  {
    title: "GPF Final Withdrawal Application Form",
    titleTamil: "வருங்கால வைப்பு நிதி இறுதி திரும்பப்பெறுதல் விண்ணப்பப் படிவம்",
    description: "Standard form for final withdrawal from General Provident Fund on retirement.",
    goNumber: "Form-GPF-01",
    department: "finance",
    category: "forms",
    topic: "gpf-loans",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 89000,
  },
  {
    title: "Pension Application Form - State Government Employees",
    titleTamil: "ஓய்வூதிய விண்ணப்பப் படிவம் - மாநில அரசு ஊழியர்கள்",
    description: "Standard pension application form for state government employees retiring from service.",
    goNumber: "Form-PEN-01",
    department: "finance",
    category: "forms",
    topic: "pension",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 156000,
  },
  {
    title: "Transfer Request Application Form",
    titleTamil: "இடமாற்ற கோரிக்கை விண்ணப்பப் படிவம்",
    description: "Standard form for requesting transfer to another district/department.",
    goNumber: "Form-TR-01",
    department: "finance",
    category: "forms",
    topic: "transfers",
    publishedYear: 2024,
    fileType: "pdf",
    fileSize: 67000,
  },
];

async function seedDocuments() {
  console.log("Seeding sample documents...");

  // Get all departments, categories, topics
  const departments = await prisma.department.findMany();
  const categories = await prisma.category.findMany();
  const topics = await prisma.topic.findMany();

  const deptMap = Object.fromEntries(departments.map(d => [d.slug, d.id]));
  const catMap = Object.fromEntries(categories.map(c => [c.slug, c.id]));
  const topicMap = Object.fromEntries(topics.map(t => [t.slug, t.id]));

  let created = 0;
  for (const doc of sampleDocuments) {
    const departmentId = deptMap[doc.department];
    const categoryId = catMap[doc.category];
    const topicId = topicMap[doc.topic];

    if (!departmentId || !categoryId) {
      console.log(`Skipping ${doc.title} - missing dept or category`);
      continue;
    }

    // Check if already exists
    const existing = await prisma.document.findFirst({
      where: { goNumber: doc.goNumber }
    });

    if (existing) {
      console.log(`Skipping ${doc.goNumber} - already exists`);
      continue;
    }

    await prisma.document.create({
      data: {
        title: doc.title,
        titleTamil: doc.titleTamil,
        description: doc.description,
        goNumber: doc.goNumber,
        fileName: `${doc.goNumber?.replace(/[^a-zA-Z0-9]/g, "_") || "document"}.pdf`,
        fileUrl: `/sample-docs/${doc.goNumber?.replace(/[^a-zA-Z0-9]/g, "_") || "document"}.pdf`,
        fileSize: doc.fileSize,
        fileType: doc.fileType,
        departmentId,
        categoryId,
        topicId: topicId || null,
        publishedYear: doc.publishedYear,
        isPublished: true,
        downloads: Math.floor(Math.random() * 500) + 50,
      },
    });
    created++;
    console.log(`Created: ${doc.goNumber} - ${doc.title}`);
  }

  console.log(`\nSeeded ${created} documents successfully!`);
}

seedDocuments()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
