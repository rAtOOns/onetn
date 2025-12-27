import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Additional GOs from johnsonasirservices.org/government-orders-i (Service Matters)
const JOHNSONASIR_SERVICE_GOS = [
  // Pay Rules 2009
  { goNumber: "G.O.Ms.No.258-2009", title: "Pay Fixation of Fresh Recruits on or after 01.01.2006", url: "https://www.johnsonasirservices.org/web/Downloads5/2.S.%20fin_e_258_2009.pdf", year: 2009 },
  { goNumber: "Letter No.39234-2009", title: "Pay Commission Arrears for Government Servants Who Died", url: "https://www.johnsonasirservices.org/web/Downloads5/3.S.%20fin_e_39234_2009.pdf", year: 2009 },
  { goNumber: "Letter No.34124-2009", title: "Clarifications on Tamil Nadu Revised Scales of Pay Rules 2009", url: "https://www.johnsonasirservices.org/web/Downloads5/4.S.%20fin_e_34124_2009%20clarifications.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.296-2009", title: "Official Committee Recommendations on Travelling Allowance", url: "https://www.johnsonasirservices.org/web/Downloads5/20.S.%20fin_e_296_2009.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.119-2009", title: "Classification of Government Servants", url: "https://www.johnsonasirservices.org/web/Downloads/136-137_2.pdf", year: 2009 },

  // One Man Commission 2010
  { goNumber: "G.O.Ms.Nos.254-340-2010", title: "One Man Commission 2010 Government Orders", url: "https://www.johnsonasirservices.org/web/Downloads_latest/PC%20%20%20one%20man%20commn%20fin_e_254_340_2010.pdf", year: 2010 },
  { goNumber: "Letter No.51082-2010", title: "One Man Commission 2010 Additional Fitment Table", url: "https://www.johnsonasirservices.org/web/Download2/Files2/Addl.%20Fit.%20Table%20fin_e_51082_2010.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.117-2010", title: "Fixed Travelling Allowance Orders", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/17FTA-%20GO_117-2010.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.111-2010", title: "Revised Pay Scales for Polytechnic Colleges", url: "https://www.johnsonasirservices.org/web/download4/G.O.%20%28Ms%29.%20No.%20111%20Higher%20Education%20%28C2%29%20Dept%20Dated%2025.05.2010.pdf", year: 2010 },

  // Pay Grievance Redressal Cell 2013
  { goNumber: "G.O.Ms.No.239-2013", title: "Special Compensatory Allowance for Office Assistants", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/32SPL-%20COMP-%20ALLOW-239-2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.237-2013", title: "Additional Increment on Selection Grade/Special Grade Award", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/33Sel-spl%20gr-addl.incement-%20fin_e_237_2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.240-2013", title: "Permission for Re-option to Revised Scales of Pay", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/34Option%20fin_e_240_2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.242-2013", title: "Review of Earlier Pay Orders", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/35REVISION%20OF%20PAY_fin_e_242_2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.238-2013", title: "Enhancement of Special Pay", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/36SPL-%20PAY-238-2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.244-2013", title: "Revision of Promotional Post Pay Scales", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/38PC-ATO-AAO-G.O.244-22.07.2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.319-2013", title: "Sub-Treasury Officers Pay Revision", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/39T%20-A%20Dept-STO-319-2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.248-2013", title: "Agriculture Department Pay Revision", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/40PC-AGRI-G.O.248-22.07.2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.285-2013", title: "Medical Education Department Pay Revision", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/41medi-tech_285-2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.289-2013", title: "Junior Administrative Officer Pay Revision", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/42JAO-%20M%20fin_e_289_2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.243-2013", title: "Typist Grade-I and Head Record Assistant Pay Revision", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/43Typist%20Gr.%20I%20fin_e_243_2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.241-2013", title: "Higher Start of Pay Dispensation", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/44HIGHER%20START%20fin_e_241_2013.pdf", year: 2013 },

  // Pay Fixation Historical
  { goNumber: "G.O.Ms.No.57-1991", title: "Refixation of Pay under Rule 4(3)", url: "https://www.johnsonasirservices.org/web/Download3/S1-46-GO57-91.pdf", year: 1991 },
  { goNumber: "G.O.Ms.No.120-2001", title: "Pay Fixation Notional Fixation after Restoration", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/46.pdf", year: 2001 },
  { goNumber: "G.O.Ms.No.50-2011", title: "Fundamental Rules Rule 23 Amendment", url: "https://www.johnsonasirservices.org/web/Download2/Files2/FR%20%2023%20par_e_50_2011.pdf", year: 2011 },

  // Increments
  { goNumber: "G.O.Ms.No.370-1989", title: "Counting Training Period for Increment", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J159GO370.pdf", year: 1989 },
  { goNumber: "G.O.Ms.No.618-1987", title: "Sanction of First and Second Increments", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J155GO618.pdf", year: 1987 },
  { goNumber: "G.O.Ms.No.397-1992", title: "Increment Date Accrual for Government Servant on Leave", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J139GO397.pdf", year: 1992 },
  { goNumber: "G.O.Ms.No.1072-1986", title: "Counting Past Service Prior to Discharge", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/139A-INCREMENTpar-e-1072.pdf", year: 1986 },
  { goNumber: "G.O.Ms.No.311-2014", title: "Notional Increment for Superannuation Retirement", url: "https://www.johnsonasirservices.org/web/Downloads6/Notional%20increment-fin_e_311_2014.pdf", year: 2014 },

  // Incentive Increments
  { goNumber: "G.O.Ms.No.531-1963", title: "Advance Increment for Passing Account Test", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/55Advance%20Inc.%20for%20ACCOUNTS%20TEST-531-1963.pdf", year: 1963 },
  { goNumber: "G.O.Ms.No.301-1985", title: "Account Test Advance Increment FR Amendment", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J133GO301.pdf", year: 1985 },
  { goNumber: "G.O.Ms.No.825-1977", title: "Advance Increment for Post Graduate Management Degree", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/105A-INCENTIVE-INC-par-e-825.pdf", year: 1977 },
  { goNumber: "G.O.Ms.No.42-1969", title: "Incentive Payments and Awards Scheme for Teachers", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J105GO42.pdf", year: 1969 },
  { goNumber: "G.O.Ms.No.1032-1971", title: "Advance Increments to Teachers", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J111GO1032.pdf", year: 1971 },
  { goNumber: "G.O.Ms.No.107-1976", title: "Incentive Increments to Tamil Pandits", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J114GO107.pdf", year: 1976 },
  { goNumber: "G.O.Ms.No.95-1980", title: "Incentive Increments to Physical Directors", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J116GO95.pdf", year: 1980 },
  { goNumber: "G.O.Ms.No.907-1986", title: "Incentive Increments Higher Qualification Requirement", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/57Incentive-increment-par-e-907-1986.pdf", year: 1986 },
  { goNumber: "G.O.Ms.No.624-1992", title: "Incentive Increments to Teachers Conditions", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J108GO624.pdf", year: 1992 },
  { goNumber: "G.O.Ms.No.1023-1993", title: "Incentive Increments Number Admissibility", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J100GO1023.pdf", year: 1993 },
  { goNumber: "G.O.Ms.No.18-2013", title: "M.Ed/M.Phil/Ph.D Qualifications Incentive Increment", url: "https://www.johnsonasirservices.org/web/Download3/S1-77-GO.18-14.pdf", year: 2013 },

  // Selection Grade/Special Grade
  { goNumber: "G.O.Ms.No.992-1979", title: "Selection Grade to Teachers Service Counting", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J123GO992.pdf", year: 1979 },
  { goNumber: "G.O.Ms.No.68-1986", title: "Selection Grade/Special Grade Advancement Guidelines", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/61SELECTION%20GRADE-68-1986.pdf", year: 1986 },
  { goNumber: "G.O.Ms.No.215-1993", title: "Selection Grade/Special Grade Amendment", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/63.pdf", year: 1993 },
  { goNumber: "G.O.Ms.No.216-1993", title: "Selection/Special Grade Admissibility", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J146GO216.pdf", year: 1993 },
  { goNumber: "G.O.Ms.No.62-SGr-2015", title: "Secondary Grade Teachers Selection/Special Grade Eligibility", url: "https://www.johnsonasirservices.org/web/Downloads6/GO.62%20DT.09.03.2015.pdf", year: 2015 },
  { goNumber: "G.O.Ms.No.304-1990", title: "Selection Grade/Special Grade Restriction", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/GO304-28.03.1990.pdf", year: 1990 },
  { goNumber: "G.O.Ms.No.375-1993", title: "Special Temporary Junior Assistant Service Counting", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J273GO375.pdf", year: 1993 },
  { goNumber: "G.O.Ms.No.114-2014", title: "Drivers Selection Grade/Special Grade Pay Scale", url: "https://www.johnsonasirservices.org/web/download4/SEL.GR.-SPL.GR-fin_e_114_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.562-1998", title: "Bonus Increment for 30+ Years Stagnation", url: "https://www.johnsonasirservices.org/web/Download3/S1-89GO562-98.docx", year: 1998 },

  // Allowances
  { goNumber: "G.O.Ms.No.667-1989", title: "Conveyance Allowance Conditions", url: "https://www.johnsonasirservices.org/web/Downloads/216-217.pdf", year: 1989 },
  { goNumber: "G.O.Ms.No.445-1998", title: "Blind/Orthopaedically Handicapped Conveyance Allowance", url: "https://www.johnsonasirservices.org/web/download4/GO445-98CA.pdf", year: 1998 },
  { goNumber: "G.O.Ms.No.499-1998", title: "Allowances Medical Reimbursement", url: "https://www.johnsonasirservices.org/web/download4/GO499-98A.pdf", year: 1998 },
  { goNumber: "G.O.Ms.No.47-2014", title: "Hill and Winter Allowance Enhancement", url: "https://www.johnsonasirservices.org/web/download4/fin_e_47_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.401-DA-2013", title: "Dearness Allowance Enhancement October 2013", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/131Serv-DA-07-2013-fin_e_401_2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.96-2014", title: "Dearness Allowance Enhancement April 2014", url: "https://www.johnsonasirservices.org/web/download4/GO-DA-96.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.245-2014", title: "Dearness Allowance Enhancement October 2014", url: "https://www.johnsonasirservices.org/web/download4/fin_e_245_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.402-2013", title: "Ad-hoc Increase for Consolidated Pay Employees", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/132Adhoc-incr-07-2013-fin_e_402_2013.pdf", year: 2013 },

  // Cash Incentive
  { goNumber: "G.O.Ms.No.390-2012", title: "Cash Incentive for 25 Years Unblemished Service", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/121Prizes-awards-G.O.390.pdf", year: 2012 },
  { goNumber: "G.O.Ms.No.222-Cash-2013", title: "25 Years Service Delegation of Powers", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/122-25years-District%20officer-GO222-1.7.2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.204-1993", title: "Driver Incentives for Accident-free Service", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/122A-CA-Drivers-par-e-204.pdf", year: 1993 },

  // Leave Travel Concession
  { goNumber: "G.O.Ms.No.407-1981", title: "Leave Travel Concession Scheme", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J125GO407.docx.pdf", year: 1981 },
  { goNumber: "G.O.Ms.No.2-1994", title: "Leave Travel Concession to Other States", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J271G2.pdf", year: 1994 },

  // Miscellaneous
  { goNumber: "G.O.Ms.No.210-1972", title: "Last Pay Certificate Orders", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J191GO210.pdf", year: 1972 },
  { goNumber: "G.O.Ms.No.175-2010", title: "Electronic Clearance System Acquittance Withdrawal", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/ECS%20aquittance%20fin_e_175_2010.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.422-2010", title: "Salary and Non-Salary Bill Forms Introduction", url: "https://www.johnsonasirservices.org/web/Download2/Files2/twobill_form.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.339-2002", title: "Deceased Government Servants Claims TNTC Amendment", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/137deceased-claim-339-02.pdf", year: 2002 },
  { goNumber: "G.O.Ms.No.1699-1978", title: "Educational Concessions for Children of Deceased Servants", url: "https://www.johnsonasirservices.org/web/download4/GO1699-78Ed.Con.pdf", year: 1978 },
  { goNumber: "G.O.Ms.No.148-1995", title: "Accounting Procedure Cash Rounding", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/138Rounding-off-148-95.pdf", year: 1995 },
  { goNumber: "G.O.Ms.No.4-Bonus-2014", title: "Special Adhoc Bonus 2012-2013", url: "https://www.johnsonasirservices.org/web/download4/BONUS-fin_e_4_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.9-Bonus-2015", title: "Special Adhoc Bonus 2013-2014", url: "https://www.johnsonasirservices.org/web/Downloads6/BONUS-2015-fin_e_9_2015.pdf", year: 2015 },

  // 2014-2015 Additional
  { goNumber: "G.O.Ms.No.364-2014", title: "Contract Nurses Payment Enhancement", url: "https://www.johnsonasirservices.org/web/download4/Pay%20-Contract%20Nurses-hfw_e_364_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.443-2014", title: "Sector Health Nurses Selection Grade Pay", url: "https://www.johnsonasirservices.org/web/Downloads6/nurses-hfw_e_443_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.143-2014", title: "5% Personal Pay to Steno Typist", url: "https://www.johnsonasirservices.org/web/Download3/5pc%20-pp-Steno-2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.176-2009", title: "5% Personal Pay to Grade I Typist", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J120GO176.pdf", year: 2009 },
];

async function seedJohnsonasirServiceGOs() {
  try {
    console.log("Seeding GOs from johnsonasirservices.org/government-orders-i...");
    console.log(`Total GOs to process: ${JOHNSONASIR_SERVICE_GOS.length}`);

    let dept = await prisma.department.findFirst({ where: { slug: "finance" } });
    let category = await prisma.category.findFirst({ where: { slug: "government-orders" } });

    let created = 0, skipped = 0;

    for (const go of JOHNSONASIR_SERVICE_GOS) {
      const existing = await prisma.document.findFirst({
        where: { OR: [{ goNumber: go.goNumber }, { fileUrl: go.url }] },
      });

      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: go.title,
          description: `Official GO: ${go.title}. Source: johnsonasirservices.org Service Matters`,
          goNumber: go.goNumber,
          fileName: `${go.goNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 400000) + 50000,
          fileType: "pdf",
          departmentId: dept!.id,
          categoryId: category!.id,
          publishedYear: go.year,
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

seedJohnsonasirServiceGOs();
