import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GOs from kalviexpress.in/p/government-orders-gos.html with direct download links
const KALVIEXPRESS_PAGE_GOS = [
  // 2023 GOs
  { goNumber: "G.O.No.62-2023", title: "Corona Lockdown Period Non-Attendance as Service/Eligible/Special Leave", url: "https://drive.google.com/file/d/19PQcli3XqeMJcAj4wXkg2zBrURaBmA5o/view?usp=drivesdk", year: 2023 },

  // 2022 GOs
  { goNumber: "G.O.No.1-2022", title: "Pongal Bonus 2022 Finance Department", url: "https://app.box.com/s/kwuk64s1vgtqxwuf50ha08ewxjnccmtj", year: 2022 },
  { goNumber: "G.O.No.3-2022", title: "Dearness Allowance Raised from 17% to 31% January 2022", url: "https://app.box.com/s/o96c6cjacvv43flynavirew7rhk5nwbp", year: 2022 },
  { goNumber: "G.O.No.12-2022", title: "Supernumerary Teacher Repositioning Govt-Aided Schools Procedure", url: "https://app.box.com/s/w0xrthzlpscvs8cx1jj5nrgocf964iv3", year: 2022 },
  { goNumber: "G.O.No.39-2022", title: "New Medical Insurance Scheme COVID-19 Treatment Coverage Expansion", url: "https://drive.google.com/file/d/1jg5Qs2adakfQQnPBuogrjw5QhKM_NnJ7/view?usp=drivesdk", year: 2022 },
  { goNumber: "G.O.No.115-2022", title: "Teacher Reappointment During Mid-Year Retirement Provisions", url: "https://drive.google.com/file/d/1EUVXaS_SP9wUtYSHpE5CrQ_q_Jgf8eTE/view?usp=drivesdk", year: 2022 },
  { goNumber: "G.O.No.77-2022", title: "Eliminate Artificial Vacancy Creation for Promotion Advancement", url: "https://drive.google.com/file/d/185SdzGi1P15RXZ3nR2oRPdHdZr10ZcPI/view?usp=drivesdk", year: 2022 },
  { goNumber: "G.O.No.166-2022", title: "Higher Education Financial Assistance Prestigious Institution Admissions", url: "https://drive.google.com/file/d/17HFYYnHdIbMYS8GCQ6bdOHAQmGFqQL3t/view?usp=sharing", year: 2022 },
  { goNumber: "G.O.No.149-2022", title: "28 Specialized Schools Established in Tamil Nadu Detail Notification", url: "https://drive.google.com/file/d/1rW5Uxb6lU11DXTNnF1TmiHIG4znwtmsV/view?usp=drivesdk", year: 2022 },

  // 2021 GOs
  { goNumber: "G.O.No.1-2021", title: "Pongal Bonus 2021 Active and Pensioners", url: "https://drive.google.com/file/d/1lz-DiUmwtNVfTKhbQyTUfEwk7eKk-seM/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.7-2021", title: "Thai Poosam Government Holiday Declaration", url: "https://drive.google.com/file/d/16nszonbjSlBEioV378gfqNyNqxolhmIY/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.134-2021", title: "25 New Primary Schools Creation 10 Schools Middle Upgradation", url: "https://drive.google.com/file/d/18nsdshZbRqWs3IvmQ05We6MffKy6T7SQ/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.10-2021", title: "Middle to High School Upgrade School List", url: "https://drive.google.com/file/d/1so6v5q9bRK-UDjfusZx1yDtb1FK-hiac/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.11-2021", title: "High to Senior Secondary School Upgrade School List", url: "https://drive.google.com/file/d/1XbYKVcs3KQRdpsyEi-888ynMjyqKEx4V/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.27-2021", title: "Two Wheeler Motor Car Loan Advance Limit Enhancement", url: "https://drive.google.com/file/d/12w1ofcPJWDBitLbiCk5FW-nJX1pZhUpp/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.6-2021", title: "Medical Leave Amendment Certificate Based Leave Authorization", url: "https://drive.google.com/file/d/14O2e2YTAnA65QUdmexIQHaTeiXUqhN2b/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.15-2021", title: "Part Time Teacher Salary Increase Orders", url: "https://drive.google.com/file/d/14m17hM5riSIFaMy4VRT50hdMlnir-6ha/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.18-2021", title: "1575 Graduate Teacher Surpluses Upgraded to Postgraduate Positions", url: "https://drive.google.com/file/d/1m_7zbrjrXAOmCES26ZzyADCfX-7aSvGZ/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.24-2021", title: "House Building Advance Ceiling Raised to Rs 40-60 Lakhs", url: "https://drive.google.com/file/d/1MpCth1CW6ZWtbTlFiphg6SBHqW4NNYLj/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.96-2021", title: "Revised House Building Advance Authorization Expanded Scope", url: "https://drive.google.com/file/d/1XUD_Pfvj-YTSZsxCTvLJHBuHuOA8hgt5/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.9-2021", title: "Jacto-Geo Strike Case Withdrawal Authorization", url: "https://drive.google.com/file/d/1pgy3lnyq8L85VyzS3C1ZxB6LDZOpqfA-/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.12-2021", title: "Earned Leave Salary Amendment Orders", url: "https://drive.google.com/file/d/1PxNsx2vN5aAFlZhsK-tdkldn8RvuJALY/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.326-2021", title: "9th 10th 11th Standard School Closure COVID Orders", url: "https://drive.google.com/file/d/1F2MBEbZPCPabHCrHNZSRUFDFRfpH7EjD/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.188-2021", title: "Election Duty Remuneration Orders", url: "https://drive.google.com/file/d/1OKjn2zvH5OU1gMUTBl7W8RQMjCk1Cy_i/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.251-2021", title: "COVID-19 Private Hospital Treatment Cost Determination", url: "https://drive.google.com/file/d/1joUMjaHh5JEkjea9ANnK-Hh_nNfH0o0p/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.52-2021", title: "One Day Salary for COVID-19 CM Fund", url: "https://drive.google.com/file/d/1CJGPvn12vLCnxKMH99OxvqEUan91qwP7/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.55-2021", title: "Various Departments Name Change Official Notification", url: "https://drive.google.com/file/d/1Kc4ddx22VlfmwgarMch5Cb0v2HUZSTrm/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.24-SW-2021", title: "COVID-19 Orphaned Children Rehabilitation Protection Funding", url: "https://drive.google.com/file/d/1O-hQkcLHO7rqW1QE8aglqllpzvO7Id_p/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.142-2021", title: "GPF Subscriber Dismissal Restriction Implementing Amendment", url: "https://drive.google.com/file/d/1QuiKEzFB6y3xnod0mKNI7_FAY9D_N-gp/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.160-2021", title: "New Health Insurance Scheme NHIS 2021 Implementation", url: "https://drive.google.com/file/d/1zJ7Ua7hxNdL4qI6dHoSTRwfxiF4sKWMf/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.173-2021", title: "GPF Interest Rate 7.1% July-September 2021", url: "https://drive.google.com/file/d/1oSChB1e4q8-BcNn4chgBwPv0-WTNZ0vZ/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.75-2021", title: "Scheduled Caste 27% OBC Reservation Internal Sub-allocation", url: "https://drive.google.com/file/d/1vWsNfUNuYkPmKSFXevVIma3ECTAsLjFU/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.15-Edu-2021", title: "Grades 9-10-11 Pass Only Certificate Elimination from Marksheet", url: "https://drive.google.com/file/d/1yTtVmvOdXo6DKlMGQBa9b1mQHaY_faQR/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.82-2021", title: "Tamil Medium Education Priority Government Job Placement Preference", url: "https://drive.google.com/file/d/1Q-Ag_tXVDhJECW38qMXbHVWtP1ppfevV/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.132-2021", title: "School Recognition Online EMIS Portal Authorization", url: "https://drive.google.com/file/d/1VdGMRHoIU0ybvia9-adlRH1ZKRj-0Ijd/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.92-2021", title: "Government Employee Retirement Age 59 to 60 Year Elevation", url: "https://drive.google.com/file/d/1GeTGRxOMeJezX3t1BigxJ6BuDhShrbxR/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.91-Age-2021", title: "Direct Recruitment Age Ceiling 2 Year Extension", url: "https://drive.google.com/file/d/1yvttZEJXDmkjJQWNRt39CaRAEq2t9Hhm/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.86-2021", title: "Maternity Leave House Rent Allowance 9 to 12 Month Extension", url: "https://drive.google.com/file/d/1IyhCaz8HuiSvXuVc3runc2v0nIsshWqT/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.401-2021", title: "Government Employee Medical Expense Reimbursement 26 Year Revision", url: "https://drive.google.com/file/d/18S5qGXXgaQewhZZORE1dGPSjOB0Lad-W/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.99-2021", title: "Government Conduct Rules 173 Amendment Clause 8(1)(c) Revision", url: "https://drive.google.com/file/d/1Qwd1cjauh6jZfxhaQQk_NCUo71BifCG3/view?usp=sharing", year: 2021 },
  { goNumber: "G.O.No.63-2021", title: "Pre-increment Retirement Salary Raise Entitlement Clarification", url: "https://drive.google.com/file/d/1KNpZN22TzWCkMN60zPbdsVPth4zVYHaY/view?usp=drivesdk", year: 2021 },
  { goNumber: "G.O.No.84-2021", title: "Maternity Leave Extension 9 to 12 Month Provision Implementation", url: "https://drive.google.com/file/d/17pWmpqO-uJcdML45ogIvyn3uLooV6ME_/view?usp=drivesdk", year: 2021 },

  // Historical GO
  { goNumber: "G.O.No.1906-1977", title: "SSLC Exam Age Limit Orders", url: "https://drive.google.com/file/d/1LTUcCoXYUfxv4G3bfuUUJdG1xtlsgnqJ/view?usp=drivesdk", year: 1977 },
];

async function seedKalviexpressPageGOs() {
  try {
    console.log("Seeding GOs from kalviexpress.in/p/government-orders page...");
    console.log(`Total GOs to process: ${KALVIEXPRESS_PAGE_GOS.length}`);

    let dept = await prisma.department.findFirst({ where: { slug: "finance" } });
    if (!dept) {
      dept = await prisma.department.create({ data: { name: "Finance", slug: "finance" } });
    }

    let eduDept = await prisma.department.findFirst({ where: { slug: "school-education" } });
    if (!eduDept) {
      eduDept = await prisma.department.create({ data: { name: "School Education", slug: "school-education" } });
    }

    let category = await prisma.category.findFirst({ where: { slug: "government-orders" } });
    if (!category) {
      category = await prisma.category.create({ data: { name: "Government Orders", slug: "government-orders" } });
    }

    let created = 0, skipped = 0;

    for (const go of KALVIEXPRESS_PAGE_GOS) {
      const existing = await prisma.document.findFirst({
        where: { OR: [{ goNumber: go.goNumber }, { fileUrl: go.url }] },
      });

      if (existing) {
        skipped++;
        continue;
      }

      // Determine department based on title keywords
      const isEducation = go.title.toLowerCase().includes("school") ||
                          go.title.toLowerCase().includes("teacher") ||
                          go.title.toLowerCase().includes("student") ||
                          go.title.toLowerCase().includes("education") ||
                          go.title.toLowerCase().includes("sslc") ||
                          go.title.toLowerCase().includes("exam");

      await prisma.document.create({
        data: {
          title: go.title,
          description: `Official GO: ${go.title}. Source: kalviexpress.in Government Orders page`,
          goNumber: go.goNumber,
          fileName: `${go.goNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 400000) + 50000,
          fileType: "pdf",
          departmentId: isEducation ? eduDept.id : dept.id,
          categoryId: category.id,
          publishedYear: go.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 200) + 10,
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

seedKalviexpressPageGOs();
