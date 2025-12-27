import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GOs from johnsonasirservices.org/government-orders-ii/ and /government-orders-s-3/
const JOHNSONASIR_GOS_II_III = [
  // GPF GOs
  { goNumber: "G.O.No.442-GPF-1994", title: "GPF Nomination Family Definition", url: "https://www.johnsonasirservices.org/web/Downloads/211-212.pdf", year: 1994 },
  { goNumber: "G.O.No.701-GPF-1995", title: "GPF Voluntary Subscription Increase", url: "https://www.johnsonasirservices.org/web/Downloads/n143-144.pdf", year: 1995 },
  { goNumber: "G.O.No.535-GPF-1991", title: "GPF 90% Partial Final Withdrawal", url: "https://www.johnsonasirservices.org/web/Downloads/n145.pdf", year: 1991 },
  { goNumber: "G.O.No.381-GPF-2010", title: "GPF Withdrawal Rule 15-B Max Limit Rs 600000", url: "https://www.johnsonasirservices.org/web/Download2/Files2/GPF-6%20la-fin_e_381_2010.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.103-GPF-2013", title: "GPF Amendments Rules 15A and 15-B", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/GPF-fin_e_103_2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.113-GPF-2014", title: "GPF Temporary Advances Authorities Rule 14 Amendment", url: "https://www.johnsonasirservices.org/web/download4/GPF%20fin_e_113_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.127-GPF-2013", title: "GPF Interest Rate 2012-2013 and 2013-2014", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/GPF%20INT%20fin_e_127_2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.295-GPF-2002", title: "GPF Temporary Advance Sanction to B and C Group", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/72T&A-GPF-Temp-adv-fin295-e-2002.pdf", year: 2002 },
  { goNumber: "G.O.Ms.No.412-GPF-2013", title: "GPF Deceased Nominee Share per Legal Heirship", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/GPF%20NOMINEE-fin_e_412_2013.pdf", year: 2013 },

  // Leave GOs
  { goNumber: "G.O.Ms.No.237-ML-1993", title: "Maternity Leave Restrictions and Abortion", url: "https://www.johnsonasirservices.org/web/Download3/S2-GO237-93-ML.pdf", year: 1993 },
  { goNumber: "G.O.Ms.No.51-ML-2011", title: "Enhanced Maternity Leave to 180 Days", url: "https://www.johnsonasirservices.org/web/Download2/Files2/MAT.LEAVE%20par_e_51_2011.pdf", year: 2011 },
  { goNumber: "G.O.Ms.No.105-ML-2016", title: "Maternity Leave Enhanced to 270 Days", url: "https://www.johnsonasirservices.org/web/Downloads6/par_e_105_2016.pdf", year: 2016 },
  { goNumber: "G.O.Ms.No.183-RH-2007", title: "Restricted Holidays Orders", url: "https://www.johnsonasirservices.org/web/Download2/Files2/Restricted%20Holidays%20%20par_e_183_2007.pdf", year: 2007 },
  { goNumber: "G.O.Ms.No.264-SCL-1997", title: "Special Casual Leave Rabies", url: "https://www.johnsonasirservices.org/web/Download3/GO.%20264%203.6.1997%20-Spl%20%20C.L.pdf", year: 1997 },
  { goNumber: "G.O.Ms.No.1119-UEL-1979", title: "Restrictions on Unearned Leave Medical Certificate", url: "https://www.johnsonasirservices.org/web/Download3/S2-1119-79.pdf", year: 1979 },
  { goNumber: "G.O.Ms.No.411-UEL-1980", title: "Unearned Leave Medical Board Reference", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J184GO411.pdf", year: 1980 },
  { goNumber: "G.O.Ms.No.153-Leave-2000", title: "Long Leave Disciplinary Action Instructions", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/77GO153-2K.pdf", year: 2000 },
  { goNumber: "G.O.Ms.No.154-FR-2000", title: "Fundamental Rules Amendment Leave", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/78GO154.pdf", year: 2000 },
  { goNumber: "G.O.Ms.No.1089-EL-1980", title: "Earned Leave Surrender and Salary Payment", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/78A-EL-SURRENDERpar_e_1089_1980.pdf", year: 1980 },
  { goNumber: "G.O.Ms.No.299-Leave-1995", title: "Competent Authority for Leave Sanction", url: "https://www.johnsonasirservices.org/web/download4/GO.299-95.pdf", year: 1995 },

  // Foreign Service
  { goNumber: "G.O.Ms.No.111-FS-1994", title: "Foreign Service General Terms and Conditions", url: "https://www.johnsonasirservices.org/web/Download3/S2-16-GO111-94-FS.pdf", year: 1994 },
  { goNumber: "G.O.Ms.No.177-FS-1999", title: "Foreign Service Pension Contribution DA Inclusion", url: "https://www.johnsonasirservices.org/web/Download3/S2-FS-par-e-177-99.pdf", year: 1999 },
  { goNumber: "G.O.Ms.No.179-FS-1999", title: "Foreign Service Leave Salary Contribution Levy", url: "https://www.johnsonasirservices.org/web/Download3/S2-FS-par-e-179.pdf", year: 1999 },

  // Transfer
  { goNumber: "G.O.Ms.No.267-Transfer-1998", title: "Transfer Unearned Leave on Medical Certificate", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J172GO267.pdf", year: 1998 },

  // Promotion Panel
  { goNumber: "G.O.Ms.No.22-Panel-2014", title: "General Rule 4a Amendment Promotion Panel", url: "https://www.johnsonasirservices.org/web/download4/par_goms_22_s_14.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.52-Panel-2009", title: "Proforma II Column Inclusion Amendment", url: "https://www.johnsonasirservices.org/web/Download2/Files2/PROMOTION%20Panel%20par_e_52_2009.pdf", year: 2009 },

  // Disciplinary Cases
  { goNumber: "G.O.Ms.No.40-Disc-1996", title: "Suspension Time Limit Finalization", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/91discipline-time-40-96.pdf", year: 1996 },
  { goNumber: "G.O.Ms.No.62-Disc-1996", title: "Punishment Imposition Rule 8 Amendment", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/93imp.punishmentdispl-62-96.pdf", year: 1996 },
  { goNumber: "G.O.Ms.No.43-Disc-1996", title: "Prosecution Sanction Procedure", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/94san-proc43-96.pdf", year: 1996 },
  { goNumber: "G.O.Ms.No.55-Disc-2002", title: "Unexpired Punishment Monetary Recovery", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/90punish-recovery-55-02.pdf", year: 2002 },
  { goNumber: "G.O.Ms.No.103-Disc-2014", title: "Contingencies Provision Percentage Reduction", url: "https://www.johnsonasirservices.org/web/Downloads6/Promo-panel-MS%20103%202014.pdf", year: 2014 },

  // Voluntary Retirement
  { goNumber: "G.O.Ms.No.376-VR-1995", title: "FR 56(3) Consolidated Instructions Voluntary Retirement", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/100vol-retire-376-95.pdf", year: 1995 },
  { goNumber: "G.O.Ms.No.197-VR-2008", title: "Weightage Amendment to FR 56(3) Voluntary Retirement", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/103Vol-retire-weightage-par_e_197_2008.pdf", year: 2008 },

  // Typist/Steno-Typist
  { goNumber: "G.O.Ms.No.45-Typist-1994", title: "New Category Typist Grade I Created", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J152GO45.pdf", year: 1994 },
  { goNumber: "G.O.Ms.No.285-Typist-1995", title: "Typist Special Rules Amendment", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/104.pdf", year: 1995 },
  { goNumber: "G.O.Ms.No.417-Typist-1993", title: "Promotion Junior Assistant/Typist to Assistant", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J278GO417.pdf", year: 1993 },
  { goNumber: "G.O.Ms.No.34-Steno-2001", title: "Steno-Typist Gr III to Assistant Promotion", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J257GO34.pdf", year: 2001 },
  { goNumber: "G.O.Ms.No.130-Computer-2008", title: "Computer Qualification Prescription", url: "https://www.johnsonasirservices.org/web/Download2/Files2/computer%20course%20par_e_130_2008.pdf", year: 2008 },
  { goNumber: "G.O.Ms.No.163-Steno-2010", title: "Steno-Typist Appointment as Assistant by Transfer", url: "https://www.johnsonasirservices.org/web/Download2/Files2/steno%20par_e_163_2010.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.164-Steno-2010", title: "Steno-Typist Promotion as Superintendent Service Rules", url: "https://www.johnsonasirservices.org/web/Download2/Files2/steno%20-supt%20%20par_e_164_2010.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.121-Steno-2007", title: "Steno-Typist Promotion Superintendent", url: "https://www.johnsonasirservices.org/web/Download2/Files2/STENO%20.%20SUPDT%20par_e_121_2007.pdf", year: 2007 },

  // TNPSC/Recruitment
  { goNumber: "G.O.Ms.No.275-TNPSC-1988", title: "Beyond Six Months Joining Seniority", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J151GO275.pdf", year: 1988 },
  { goNumber: "G.O.Ms.No.732-TNPSC-1973", title: "Permitted Continued Studies TNPSC Selection", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/112tnpsc-seln-studies-732-1973.pdf", year: 1973 },
  { goNumber: "G.O.Ms.No.1069-Emp-1980", title: "Employment Office Registration Permission", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/113Employed-can-register-G.O.1069.pdf", year: 1980 },
  { goNumber: "G.O.Ms.No.188-Emp-1976", title: "Employment Exchange Priority Order", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/149AEMPLEx188.pdf", year: 1976 },
  { goNumber: "G.O.Ms.No.244-Age-1991", title: "Age Reckoning for Appointment", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J149GO244.pdf", year: 1991 },
  { goNumber: "G.O.Ms.No.198-Name-1998", title: "Change of Name by Servants", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J168GO198.pdf", year: 1998 },

  // Other Establishment
  { goNumber: "G.O.Ms.No.89-Tamil-1996", title: "Tamil Language Test Two Year Period", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/114tamil-test-89-96.pdf", year: 1996 },
  { goNumber: "G.O.Ms.No.200-Corresp-1996", title: "Correspondence Course Prior Permission", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/115corres-evecoll-200-96.pdf", year: 1996 },
  { goNumber: "G.O.Ms.No.366-Corresp-1992", title: "Correspondence Course Suspended Servants", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/115ACORRES-COURSE-SESPENSION-CASEpar-e-362.pdf", year: 1992 },
  { goNumber: "G.O.Ms.No.1046-SR-1984", title: "Service Register Entries Punishments Exams", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/116SREntries-1046-84.pdf", year: 1984 },
  { goNumber: "G.O.Ms.No.74-DailyWage-2013", title: "Daily Wage Regularization 10 Year Service", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/117Daily-wages-Go.74%20Dt27.6.%202013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.143-Compassionate-1998", title: "Compassionate Appointment Regularization", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/J165GO143.pdf", year: 1998 },
  { goNumber: "G.O.Ms.No.121-ConfReport-2011", title: "Confidential Report Revised Format", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/124Confid.report-G.O.121-29.9.2011.pdf", year: 2011 },
  { goNumber: "G.O.Ms.No.147-Supernumerary-1996", title: "Supernumerary Post Creation FR 9", url: "https://www.johnsonasirservices.org/web/download4/GO147-96.pdf", year: 1996 },
  { goNumber: "G.O.Ms.No.117-NOC-2014", title: "NOC for Passport Form II", url: "https://www.johnsonasirservices.org/web/Downloads6/P&AR-24A-117.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.145-TamilMedium-2010", title: "Tamil Medium Studied Preferential Appointment", url: "https://www.johnsonasirservices.org/web/Download2/Files2/TAMIL%20medium%20par_e_145_2010.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.252-TET-2012", title: "TET Weightage by TRB", url: "https://www.johnsonasirservices.org/web/download4/TET%20Weightage%20G.O.252_05%2010%202012.pdf", year: 2012 },
  { goNumber: "G.O.Ms.No.29-TET-2014", title: "TET Marks Weightage Partial Modification", url: "https://www.johnsonasirservices.org/web/download4/sedu_e_29_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.71-TET-2014", title: "TET Secondary Graduate Teachers Weightage Revised", url: "https://www.johnsonasirservices.org/web/download4/TET-Revised-%20sedu_e_71_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.189-Attestation-2007", title: "Attestation by Group B Servants", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/Attestation-par_e_189_2007.pdf", year: 2007 },
  { goNumber: "G.O.Ms.No.96-SelfAttest-2014", title: "Self Attestation Certificates Abolition", url: "https://www.johnsonasirservices.org/web/download4/G.O.%20MSNo_96_ar1_14.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.185-Bribery-2006", title: "Bribery Prevention Orders", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/BRIBERY-par_e_185_2006.pdf", year: 2006 },
  { goNumber: "G.O.Ms.No.665-Tender-1998", title: "Tender Procedure Transparency", url: "https://www.johnsonasirservices.org/web/download4/GO.665-98.pdf", year: 1998 },
  { goNumber: "G.O.Ms.No.78-VAO-2015", title: "VAO Promotion as Assistant Qualifying Service", url: "https://www.johnsonasirservices.org/web/Downloads6/VAO%20-Asst-rev_e_78_2015.pdf", year: 2015 },

  // Government Orders S-3 (2015-2018)
  { goNumber: "G.O.No.121-DA-2015", title: "Dearness Allowance Enhanced Rate January 2015", url: "https://www.johnsonasirservices.org/web/Downloads6/DA-01.01-fin_e_121_2015.pdf", year: 2015 },
  { goNumber: "G.O.No.122-Adhoc-2015", title: "Ad-hoc Increase Consolidated Fixed Pay January 2015", url: "https://www.johnsonasirservices.org/web/Downloads6/AInc.-FP-CP-fin_e_122_2015.pdf", year: 2015 },
  { goNumber: "G.O.No.262-DA-2015", title: "Dearness Allowance Enhanced Rate July 2015", url: "https://www.johnsonasirservices.org/web/Downloads6/fin_e_262_2015.pdf", year: 2015 },
  { goNumber: "G.O.No.263-Adhoc-2015", title: "Ad-hoc Increase July 2015", url: "https://www.johnsonasirservices.org/web/Downloads6/fin_e_263_2015.pdf", year: 2015 },
  { goNumber: "G.O.Ms.No.527-UEL-1988", title: "Unearned Leave on Medical Certificate", url: "https://www.johnsonasirservices.org/web/Downloads6/GO527.pdf", year: 1988 },
  { goNumber: "G.O.No.562-Bonus-1998", title: "Bonus Increment for Stagnating Beyond 30 Years", url: "https://www.johnsonasirservices.org/web/Downloads6/G.O.562.docx", year: 1998 },
  { goNumber: "G.O.Ms.No.1-Bonus-2016", title: "Special Adhoc Bonus 2014-2015", url: "https://www.johnsonasirservices.org/web/Downloads6/fin_e_1_2016_0.pdf", year: 2016 },
  { goNumber: "G.O.No.282-FSF-2015", title: "Family Security Fund Advance Enhancement Rs 25000", url: "https://www.johnsonasirservices.org/web/Downloads6/fin_e_282_2015.pdf", year: 2015 },
  { goNumber: "G.O.Ms.No.169-TPF-2015", title: "Teacher Provident Fund Accounts Transfer", url: "https://www.johnsonasirservices.org/web/Downloads6/sedu_e_169_2015%20(1).pdf", year: 2015 },
  { goNumber: "G.O.No.117-DA-2016", title: "Dearness Allowance Enhanced Rate January 2016", url: "https://www.johnsonasirservices.org/web/Downloads6/fin_e_117_2016.pdf", year: 2016 },
  { goNumber: "G.O.No.309-DA-2016", title: "Dearness Allowance Enhanced Rate July 2016", url: "https://www.johnsonasirservices.org/web/Downloads6/fin_e_309_2016.pdf", year: 2016 },
  { goNumber: "G.O.No.316-Adhoc-2016", title: "Ad-hoc Increase July 2016", url: "https://www.johnsonasirservices.org/web/Downloads6/consolid.pay-DA-fin_e_316_2016.pdf", year: 2016 },
  { goNumber: "G.O.Ms.No.6-Bonus-2017", title: "Special Adhoc Bonus 2015-2016", url: "https://www.johnsonasirservices.org/web/Downloads6/2017-bonus-fin_e_6_2017_1.pdf", year: 2017 },
  { goNumber: "G.O.Ms.No.114-Passport-2016", title: "Passport Intimation Letter Format Conduct Rules Amendment", url: "https://www.johnsonasirservices.org/web/Downloads6/permn-passport-par_e_114_2016.pdf", year: 2016 },
  { goNumber: "G.O.No.105-DA-2017", title: "Dearness Allowance Enhanced Rate January 2017", url: "https://www.johnsonasirservices.org/web/Downloads6/fin_e_105_2017.pdf", year: 2017 },
  { goNumber: "G.O.Ms.No.28-SCL-2017", title: "Special Casual Leave for Infectious Diseases", url: "https://www.johnsonasirservices.org/web/Downloads6/par_e_28_2017%20(1).pdf", year: 2017 },
  { goNumber: "G.O.Ms.No.123-DA-2018", title: "Dearness Allowance Enhanced Rate January 2018", url: "https://www.johnsonasirservices.org/web/Downloads6/fin_e_123_2018.pdf", year: 2018 },
];

async function seedJohnsonasirGOsIIIII() {
  try {
    console.log("Seeding GOs from johnsonasir government-orders-ii and government-orders-s-3...");
    console.log(`Total GOs to process: ${JOHNSONASIR_GOS_II_III.length}`);

    let dept = await prisma.department.findFirst({ where: { slug: "finance" } });
    let category = await prisma.category.findFirst({ where: { slug: "government-orders" } });

    let created = 0, skipped = 0;

    for (const go of JOHNSONASIR_GOS_II_III) {
      const existing = await prisma.document.findFirst({
        where: { OR: [{ goNumber: go.goNumber }, { fileUrl: go.url }] },
      });

      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: go.title,
          description: `Official GO: ${go.title}. Source: johnsonasirservices.org`,
          goNumber: go.goNumber,
          fileName: go.goNumber.replace(/[^a-zA-Z0-9]/g, "_") + ".pdf",
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 400000) + 50000,
          fileType: go.url.endsWith(".docx") ? "docx" : "pdf",
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

seedJohnsonasirGOsIIIII();
