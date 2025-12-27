import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GOs from https://www.johnsonasirservices.org/government-orders-and-letters/
const JOHNSONASIR_GOS = [
  { goNumber: "G.O Ms No.234", title: "Tamil Nadu Revised Scales of Pay Rules 2009", url: "https://www.johnsonasirservices.org/web/Downloads5/1%20.S.%20fin_e_234_2009.pdf", year: 2009 },
  { goNumber: "G.O Ms No.258", title: "Pay Fixation of fresh recruits on or after 01.01.2006", url: "https://www.johnsonasirservices.org/web/Downloads5/2.S.%20fin_e_258_2009.pdf", year: 2009 },
  { goNumber: "Letter No.39234", title: "Pay Commission arrears for deceased government servants", url: "https://www.johnsonasirservices.org/web/Downloads5/3.S.%20fin_e_39234_2009.pdf", year: 2009 },
  { goNumber: "Letter No.34124", title: "Clarifications on Pay Rules 2009", url: "https://www.johnsonasirservices.org/web/Downloads5/4.S.%20fin_e_34124_2009%20clarifications.pdf", year: 2009 },
  { goNumber: "Letter No.45113", title: "Further Clarifications on Pay Rules", url: "https://www.johnsonasirservices.org/web/Downloads5/5.S.%20fin_e_45113_2009.pdf", year: 2009 },
  { goNumber: "Letter No.45881", title: "Additional Clarifications on Pay Rules", url: "https://www.johnsonasirservices.org/web/Downloads5/6.S.%20fin_e_45881_2009.pdf", year: 2009 },
  { goNumber: "G.O.Ms.Nos.254-340", title: "One Man Commission 2010 Recommendations", url: "https://www.johnsonasirservices.org/web/Downloads_latest/PC%20one%20man%20commn%20fin_e_254_340_2010.pdf", year: 2010 },
  { goNumber: "Letter No.51082", title: "Additional Fitment Table Pay Revision", url: "https://www.johnsonasirservices.org/web/Download2/Files2/Addl.%20Fit.%20Table%20fin_e_51082_2010.pdf", year: 2010 },
  { goNumber: "Letter No.56405", title: "Additional Fitment Tables One Man Commission", url: "https://www.johnsonasirservices.org/web/Download2/Files2/Addl.Fit.Table%20fin_e_56405_2010.pdf", year: 2010 },
  { goNumber: "Letter No.63305-1", title: "Selection Special Grade Pay Fixation Instructions", url: "https://www.johnsonasirservices.org/web/Download2/Files2/fin_e_63305_1_2010.pdf", year: 2010 },
  { goNumber: "Letter No.63305-5", title: "Selection Special Grade Pay Fixation Updated", url: "https://www.johnsonasirservices.org/web/Download2/Files2/fin_e_63305_5_2010.pdf", year: 2010 },
  { goNumber: "Letter No.23373", title: "Selection Grade Service Counting Clarification 2011", url: "https://www.johnsonasirservices.org/web/download4/23373.pdf", year: 2011 },
  { goNumber: "Letter No.7296", title: "Selection Grade Service Counting Clarification 2012", url: "https://www.johnsonasirservices.org/web/download4/letter%20No%207296.pdf", year: 2012 },
  { goNumber: "Letter No.63305-4", title: "Selection Special Grade Monetary Benefits", url: "https://www.johnsonasirservices.org/web/Download2/Files2/fin_e_63305_4_2010.pdf", year: 2010 },
  { goNumber: "Letter No.14483", title: "Teachers Pay Revision and Selection Grade", url: "https://www.johnsonasirservices.org/web/Download2/Files2/TEACHERS%20%20PAY%20REV%20fin_e_14483_2012.pdf", year: 2012 },
  { goNumber: "Letter No.74421", title: "Terminal Benefits Consequential Revision", url: "https://www.johnsonasirservices.org/web/Download2/Files2/pensionary%20benefits%20%20fin_e_74421_2010.pdf", year: 2010 },
  { goNumber: "Letter No.68136", title: "Secondary Grade Teachers Special Allowance", url: "https://www.johnsonasirservices.org/web/Download2/Files2/fin_e_68136_1_2010.pdf", year: 2010 },
  { goNumber: "G.O.No.362", title: "Dearness Allowance Enhancement July 2012", url: "https://www.johnsonasirservices.org/web/Download2/Files2/SERVICE%20%20DA%20%20fin_e_362_2012.pdf", year: 2012 },
  { goNumber: "G.O Ms No.236", title: "Government Order on Allowances", url: "https://www.johnsonasirservices.org/web/Downloads5/17.S.%20fin_e_236_2009%20%20ALLOWANCES.pdf", year: 2009 },
  { goNumber: "G.O Ms No.237", title: "Government Order on Travelling Allowances", url: "https://www.johnsonasirservices.org/web/Downloads5/18.S.%20fin_e_237_2009%20%20TA%20GO..pdf", year: 2009 },
  { goNumber: "Letter No.58007", title: "Travelling Allowances Grade II Eligibility", url: "https://www.johnsonasirservices.org/web/Downloads5/19.S.%20fin_e_58007_2009.pdf", year: 2009 },
  { goNumber: "G.O.No.296", title: "Official Committee on Travelling Allowance Amendment", url: "https://www.johnsonasirservices.org/web/Downloads5/20.S.%20fin_e_296_2009.pdf", year: 2009 },
  { goNumber: "Letter No.29971", title: "Travelling Allowance Cancellation Charges", url: "https://www.johnsonasirservices.org/web/Downloads5/21.S.%20fin_e_29971_2010_Lr.pdf", year: 2010 },
  { goNumber: "G.O.No.119", title: "Classification of Government Servants", url: "https://www.johnsonasirservices.org/web/Downloads/136-137_2.pdf", year: 2009 },
  { goNumber: "Letter No.61569", title: "House Rent Allowance Clarification", url: "https://www.johnsonasirservices.org/web/Downloads/138.pdf", year: 2008 },
  { goNumber: "G.O.No.562", title: "Bonus Increment for Extended Service", url: "https://www.johnsonasirservices.org/web/Downloads/206-207.pdf", year: 1998 },
  { goNumber: "G.O.No.667", title: "Conveyance Allowance Conditions", url: "https://www.johnsonasirservices.org/web/Downloads/216-217.pdf", year: 1989 },
  { goNumber: "G.O.No.442", title: "GPF Nomination and Family Definition", url: "https://www.johnsonasirservices.org/web/Downloads/211-212.pdf", year: 1994 },
  { goNumber: "G.O.No.701", title: "GPF Voluntary Subscription Increase", url: "https://www.johnsonasirservices.org/web/Downloads/n143-144.pdf", year: 1995 },
  { goNumber: "G.O.No.535", title: "GPF 90 Percent Part Final Withdrawal", url: "https://www.johnsonasirservices.org/web/Downloads/n145.pdf", year: 1991 },
  { goNumber: "G.O.No.381", title: "GPF Rule 15B Withdrawal Limit Enhanced to Rs 600000", url: "https://www.johnsonasirservices.org/web/Download2/Files2/GPF-6%20la-fin_e_381_2010.pdf", year: 2010 },
  { goNumber: "Letter No.2670", title: "GPF Withdrawal Limit Clarification Rs 6 Lakh", url: "https://www.johnsonasirservices.org/web/download4/GPF%202.5%20lakhs.pdf", year: 2012 },
  { goNumber: "Letter No.13400", title: "Stoppage of Increment Effect on Promotion", url: "https://www.johnsonasirservices.org/web/Download2/Files2/PERIOD%20OF%20PUNISHMENTpar_e_13400_2009.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.163", title: "Assistant Appointment from Steno Typist", url: "https://www.johnsonasirservices.org/web/Download2/Files2/steno%20par_e_163_2010.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.164", title: "Steno Typist Promotion as Superintendent", url: "https://www.johnsonasirservices.org/web/Download2/Files2/steno%20-supt%20%20par_e_164_2010.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.121", title: "Steno Typist Promotion Order", url: "https://www.johnsonasirservices.org/web/Download2/Files2/STENO%20.%20SUPDT%20par_e_121_2007.pdf", year: 2007 },
  { goNumber: "G.O.Ms.No.52", title: "Promotion Panel Preparation Format", url: "https://www.johnsonasirservices.org/web/Download2/Files2/PROMOTION%20Panel%20par_e_52_2009.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.50", title: "Fundamental Rules Rule 23 Amendment", url: "https://www.johnsonasirservices.org/web/Download2/Files2/FR%20%2023%20par_e_50_2011.pdf", year: 2011 },
  { goNumber: "G.O.Ms.No.51", title: "Maternity Leave Enhancement to 180 days", url: "https://www.johnsonasirservices.org/web/Download2/Files2/MAT.LEAVE%20par_e_51_2011.pdf", year: 2011 },
  { goNumber: "G.O.Ms.No.183", title: "Restricted Holidays for Government Employees", url: "https://www.johnsonasirservices.org/web/Download2/Files2/Restricted%20Holidays%20%20par_e_183_2007.pdf", year: 2007 },
  { goNumber: "G.O.Ms.No.264", title: "Special Casual Leave for Rabies Treatment", url: "https://www.johnsonasirservices.org/web/Download3/GO.%20264%203.6.1997%20-Spl%20%20C.L.pdf", year: 1997 },
  { goNumber: "Letter No.33705", title: "Grade I Typist Selection Grade Pay Fixation", url: "https://www.johnsonasirservices.org/web/Download3/Gr%20I%20.pdf", year: 1997 },
  { goNumber: "G.O.No.753", title: "Financial Officers Duties and Responsibilities", url: "https://www.johnsonasirservices.org/web/Download2/Files2/Duties%20and%20responsibilities%20of%20Financial%20Officers.pdf", year: 1995 },
  { goNumber: "Letter No.59420", title: "Private Individuals in Government Offices", url: "https://www.johnsonasirservices.org/web/Download2/Files2/Private%20persons%20%20%20par_e_59420_2006.pdf", year: 2006 },
  { goNumber: "G.O.Ms.No.130", title: "Computer Qualification for Typists", url: "https://www.johnsonasirservices.org/web/Download2/Files2/computer%20course%20par_e_130_2008.pdf", year: 2008 },
  { goNumber: "G.O.Ms.No.145", title: "Tamil Medium Appointment Preference Ordinance", url: "https://www.johnsonasirservices.org/web/Download2/Files2/TAMIL%20medium%20par_e_145_2010.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.252", title: "Teachers Eligibility Test Weightage", url: "https://www.johnsonasirservices.org/web/download4/TET%20Weightage%20G.O.252_05%2010%202012.pdf", year: 2012 },
  { goNumber: "G.O.No.111", title: "Foreign Service Deputation Terms and Conditions", url: "https://www.johnsonasirservices.org/web/Downloads/203-205.pdf", year: 1994 },
  { goNumber: "Letter No.44316", title: "Break in Service No Condonement Required", url: "https://www.johnsonasirservices.org/web/Downloads/208.pdf", year: 1986 },
  { goNumber: "Letter No.69332", title: "Voluntary Retirement with Pending Disciplinary Cases", url: "https://www.johnsonasirservices.org/web/Downloads/222-223_2.pdf", year: 1993 },
  { goNumber: "Letter No.77839", title: "CID Report Not Required for Voluntary Retirement", url: "https://www.johnsonasirservices.org/web/Downloads/224-225.pdf", year: 1998 },
  { goNumber: "G.O.No.57", title: "Pay Refixation under Rule 4(3)", url: "https://www.johnsonasirservices.org/web/Downloads/218-219.pdf", year: 1991 },
  { goNumber: "G.O.No.859", title: "Junior Senior Pay Anomaly Rectification Guidelines", url: "https://www.johnsonasirservices.org/web/Downloads/214-215.pdf", year: 1986 },
  { goNumber: "Letter No.64345", title: "Personal Pay Absorption Anomaly Delegation", url: "https://www.johnsonasirservices.org/web/Downloads/220-221.pdf", year: 1993 },
  { goNumber: "Letter No.100868", title: "Comparative Statement for Pay Anomaly", url: "https://www.johnsonasirservices.org/web/Downloads/nn-209-210.pdf", year: 1990 },
  { goNumber: "G.O.Ms.No.122", title: "Fundamental Rules Rule 49 Additional Pay Charge", url: "https://www.johnsonasirservices.org/web/Download2/Files2/FR%20%20Rule%2049%20%20par_e_122_2011.pdf", year: 2011 },
  { goNumber: "Letter No.12062", title: "Additional Pay Proposal Details", url: "https://www.johnsonasirservices.org/web/Downloads/186_n.pdf", year: 2000 },
  { goNumber: "G.O.No.276", title: "Selection Special Grade Check Slip", url: "https://www.johnsonasirservices.org/web/Downloads/237-239_2.pdf", year: 1992 },
  { goNumber: "Letter No.7845", title: "Disciplinary Cases Check Slip", url: "https://www.johnsonasirservices.org/web/Download2/Files2/CHECK%20SLIP%20DISCIP.par_e_7845_2011.pdf", year: 2011 },
  { goNumber: "G.O.Ms.No.422", title: "Salary and Non-Salary Bill Forms Introduction", url: "https://www.johnsonasirservices.org/web/Download2/Files2/twobill_form.pdf", year: 2010 },
  { goNumber: "Letter No.9313", title: "Request Transfer Application Format", url: "https://www.johnsonasirservices.org/web/Downloads/195-196.pdf", year: 1994 },
];

async function seedJohnsonAsirGOs() {
  try {
    console.log("🚀 Seeding GOs from johnsonasirservices.org...");
    console.log(`📊 Total GOs to process: ${JOHNSONASIR_GOS.length}`);

    let dept = await prisma.department.findFirst({ where: { slug: "finance" } });
    if (!dept) {
      dept = await prisma.department.create({ data: { name: "Finance", slug: "finance" } });
    }

    let category = await prisma.category.findFirst({ where: { slug: "government-orders" } });
    if (!category) {
      category = await prisma.category.create({ data: { name: "Government Orders", slug: "government-orders" } });
    }

    let created = 0, skipped = 0;

    for (const go of JOHNSONASIR_GOS) {
      const existing = await prisma.document.findFirst({
        where: { OR: [{ goNumber: go.goNumber }, { title: go.title }, { fileUrl: go.url }] },
      });

      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: go.title,
          description: `Government Order: ${go.title}. Source: johnsonasirservices.org`,
          goNumber: go.goNumber,
          fileName: `${go.goNumber.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 300000) + 50000,
          fileType: "pdf",
          departmentId: dept.id,
          categoryId: category.id,
          publishedYear: go.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 200) + 10,
        },
      });
      created++;
    }

    console.log(`\n📊 Created: ${created}, Skipped: ${skipped}`);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedJohnsonAsirGOs();
