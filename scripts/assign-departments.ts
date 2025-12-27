import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Department keywords mapping
const deptKeywords: Record<string, string[]> = {
  "school-education": [
    "school", "education", "teacher", "student", "sslc", "hsc", "exam", "admission",
    "bt", "pgt", "hm", "headmaster", "tet", "trb", "dse", "dee", "ceo", "deo",
    "kalvi", "பள்ளி", "கல்வி", "ஆசிரியர்", "மாணவர்", "தேர்வு", "பள்ளிக்கல்வி"
  ],
  "finance": [
    "finance", "pay", "salary", "da", "hra", "pension", "gpf", "bonus", "advance",
    "loan", "budget", "nhis", "insurance", "medical", "fd-", "ஊதியம்", "சம்பளம்"
  ],
  "health": [
    "health", "hospital", "medical", "doctor", "nurse", "covid", "treatment",
    "maternity", "சுகாதார"
  ],
  "higher-education": [
    "higher education", "college", "university", "degree", "pg ", "ug ",
    "undergraduate", "postgraduate", "lecturer", "professor"
  ],
  "revenue": [
    "revenue", "land", "survey", "registration", "stamp", "வருவாய்"
  ],
  "rural-development": [
    "rural", "panchayat", "village", "anganwadi", "icds", "கிராம"
  ],
  "transport": [
    "transport", "bus", "vehicle", "motor", "driving", "license", "போக்குவரத்து"
  ],
  "home": [
    "police", "home department", "security", "fire", "prison", "காவல்"
  ]
};

async function main() {
  console.log("=== Assign Departments to Documents ===\n");

  // Get all departments
  const departments = await prisma.department.findMany();
  const deptMap = new Map(departments.map(d => [d.slug, d.id]));

  console.log("Available departments:", departments.map(d => d.slug).join(", "));

  // Get all documents
  const docs = await prisma.document.findMany({
    select: { id: true, title: true, departmentId: true }
  });

  console.log(`\nTotal documents: ${docs.length}\n`);

  let updated = 0;
  const deptCounts: Record<string, number> = {};

  for (const doc of docs) {
    const titleLower = doc.title.toLowerCase();
    let matchedDept: string | null = null;

    // Check each department's keywords
    for (const [deptSlug, keywords] of Object.entries(deptKeywords)) {
      for (const keyword of keywords) {
        if (titleLower.includes(keyword.toLowerCase())) {
          matchedDept = deptSlug;
          break;
        }
      }
      if (matchedDept) break;
    }

    // Update if we found a match and it's different
    if (matchedDept && deptMap.has(matchedDept)) {
      const newDeptId = deptMap.get(matchedDept)!;

      if (doc.departmentId !== newDeptId) {
        await prisma.document.update({
          where: { id: doc.id },
          data: { departmentId: newDeptId }
        });
        updated++;
      }

      deptCounts[matchedDept] = (deptCounts[matchedDept] || 0) + 1;
    } else {
      // Keep as school-education (default)
      deptCounts["school-education"] = (deptCounts["school-education"] || 0) + 1;
    }
  }

  console.log(`Updated: ${updated} documents\n`);

  console.log("=== Department Distribution ===");
  for (const [dept, count] of Object.entries(deptCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${dept}: ${count}`);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
