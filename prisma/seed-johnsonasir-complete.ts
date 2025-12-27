import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// FORMS from johnsonasirservices.org
const JOHNSONASIR_FORMS = [
  // Pension Forms
  { title: "Combined Application for GPF Final Withdrawal and Pension", url: "https://www.johnsonasirservices.org/web/Downloads/GO211_2009_%20PENSION%20GPF%20forms.pdf", category: "pension" },
  { title: "Calculation Sheet for Pension and Other Pensionary Benefits", url: "https://www.johnsonasirservices.org/web/Download2/Files2/2.Calculation%20sheet%20for%20PENSION%20and%20other%20pensionary%20benefits.pdf", category: "pension" },
  { title: "Application for Family Pension Form 14", url: "https://www.johnsonasirservices.org/web/Downloads/FORM%2014.pdf", category: "pension" },
  { title: "Application for DCRG of Deceased Government Servant Form 12", url: "https://www.johnsonasirservices.org/web/Downloads/162-163n.pdf", category: "pension" },
  { title: "Application for Revision of Pension/Family Pension GO 235", url: "https://www.johnsonasirservices.org/web/Downloads/130-131.pdf", category: "pension" },
  { title: "Revised Commutation Table", url: "https://www.johnsonasirservices.org/web/Downloads/132.pdf", category: "pension" },
  { title: "Ready Reckoner for Calculation of Pension/Family Pension", url: "https://www.johnsonasirservices.org/web/Downloads/134-35.pdf", category: "pension" },
  { title: "Special Provident Fund Scheme 1984 Interest Calculation Sheet", url: "https://www.johnsonasirservices.org/web/Downloads/spf.docx", category: "pension" },
  { title: "Encashment of Earned Leave and Leave on Private Affairs FR 86(a)", url: "https://www.johnsonasirservices.org/web/Downloads/fr%20-%20Copy.docx", category: "pension" },
  { title: "Life Certificate for Pensioners", url: "https://www.johnsonasirservices.org/web/Downloads5/s.no.10%20.life_certificate.pdf", category: "pension" },
  { title: "Marriage Non-remarriage Non-employment Certificates", url: "https://www.johnsonasirservices.org/web/Downloads5/s.no.11.%20marriage-nonremarriage-nonemployment_certificate.pdf", category: "pension" },
  { title: "Application Form for Revision of Pension under GO 271/GO 579", url: "https://www.johnsonasirservices.org/web/Downloads5/s.no.12.%20pension_revision_%20appln_format.pdf", category: "pension" },

  // Motor Vehicle Advance Forms
  { title: "Motor Car Advance Application Forms", url: "https://www.johnsonasirservices.org/web/Download3/motor%20car%20adv.%20forms.pdf", category: "advance" },
  { title: "Motor Car Advance Rules and Guidelines", url: "https://www.johnsonasirservices.org/web/Download3/01%2012%20%202012%20%20MOTOR%20CAR%20.pdf", category: "advance" },
  { title: "Motor Cycle Advance Rules and Guidelines", url: "https://www.johnsonasirservices.org/web/Download3/01%2012%202012%20%20motor%20%20cycle%20adv.pdf", category: "advance" },

  // HBA Forms
  { title: "House Building Advance Complete Guidelines", url: "https://www.johnsonasirservices.org/web/Downloads5/HBA.pdf", category: "advance" },
  { title: "House Building Advance GOs and Forms Compilation", url: "https://www.johnsonasirservices.org/web/Downloads5/hba-go-revised.pdf", category: "advance" },

  // Leave Forms
  { title: "Leaves Admissible to Tamil Nadu Govt Servants Complete Guide", url: "https://www.johnsonasirservices.org/web/Downloads_latest/15.11.12%20LEAVE%20.pdf", category: "leave" },
  { title: "Leave Eligibility Rules and Guidelines", url: "https://www.johnsonasirservices.org/web/Downloads_latest/15-leave.pdf", category: "leave" },
  { title: "Earned and Unearned Leaves Solved Problems", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set2/EL.pdf", category: "leave" },

  // TA Forms
  { title: "Tour and Transfer Travelling Allowance Complete Guide", url: "https://www.johnsonasirservices.org/web/Downloads_latest/15.11.12%20TOUR%20AND%20TRANSFER%20TRAVELLING%20ALLOWANCE%20final.pdf", category: "ta" },
  { title: "Tour Travelling Allowance Solved Problems", url: "https://www.johnsonasirservices.org/web/Downloads_latest/tour-ta-13.pdf", category: "ta" },
  { title: "Transfer Travelling Allowance Solved Problems", url: "https://www.johnsonasirservices.org/web/download4/TRANSFER%20TA-3013.pdf", category: "ta" },
];

// PENSION GOs from johnsonasirservices.org
const JOHNSONASIR_PENSION_GOS = [
  { goNumber: "G.O.Ms.No.235-Pen-2009", title: "Pension Official Committee on Pay Revision", url: "https://www.johnsonasirservices.org/web/Downloads5/1%20P.%20fin_e_235_2009%20PC.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.211-Pen-2009", title: "Combined Application for GPF Withdrawal and Pension", url: "https://www.johnsonasirservices.org/web/Downloads5/2.P%20G.O.211.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.499-2009", title: "State Employees in PSUs Commutation and Restoration", url: "https://www.johnsonasirservices.org/web/Downloads5/7.P%20fin_e_499_2009.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.365-Pen-2012", title: "Dearness Allowance Revised Rates October 2012", url: "https://www.johnsonasirservices.org/web/Downloads5/10.P.%20fin_e_365_2012.pdf", year: 2012 },
  { goNumber: "G.O.Ms.No.127-Pen-2007", title: "Qualifying Service for Pension Date of Effect", url: "https://www.johnsonasirservices.org/web/Downloads5/11.P%20G.O.%20127.pdf", year: 2007 },
  { goNumber: "G.O.Ms.No.112-Pen-2008", title: "Dearness Allowance on Family Pension Employed Pensioners", url: "https://www.johnsonasirservices.org/web/Downloads5/12.P%20fin_e_112_2008.pdf", year: 2008 },
  { goNumber: "G.O.Ms.No.49-Pen-2009", title: "Dearness Allowance Regulation Employed Family Pensioners", url: "https://www.johnsonasirservices.org/web/Downloads5/13.P%20fin_e_49_2009.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.579-2006", title: "Revision of Pension/Family Pension", url: "https://www.johnsonasirservices.org/web/Downloads5/14.P.%20579_2006.pdf", year: 2006 },
  { goNumber: "G.O.Ms.No.504-2000", title: "Special Provident Fund-cum-Gratuity Scheme 2000", url: "https://www.johnsonasirservices.org/web/Downloads5/15.P.%20GO_504__SPF_2000_.pdf", year: 2000 },
  { goNumber: "G.O.Ms.No.136-1984", title: "Special Provident Fund-cum-Gratuity Scheme 1984", url: "https://www.johnsonasirservices.org/web/Download3/228%20-236%20.pdf", year: 1984 },
  { goNumber: "G.O.Ms.No.334-SPF-2001", title: "Interest on SPF-cum-Gratuity Beyond 148th Instalment", url: "https://www.johnsonasirservices.org/web/Download3/P17-GO.334-01.pdf", year: 2001 },
  { goNumber: "G.O.Ms.No.351-1994", title: "Government Contribution Voluntary/Medical Retirement", url: "https://www.johnsonasirservices.org/web/download4/GO.351-94.pdf", year: 1994 },
  { goNumber: "G.O.Ms.No.184-FSF-2012", title: "Family Security Fund Enhanced Financial Assistance", url: "https://www.johnsonasirservices.org/web/Downloads5/20.PEN%20FSFSCHEME%20Fin_184_2012.pdf", year: 2012 },
  { goNumber: "G.O.Ms.No.107-Pen-2000", title: "Family Pension to Handicapped Children Procedure", url: "https://www.johnsonasirservices.org/web/Download3/P23-GO107.2K.pdf", year: 2000 },
  { goNumber: "G.O.Ms.No.301-Pen-2001", title: "100% Disabled Children Medical Certificate Waived", url: "https://www.johnsonasirservices.org/web/Download3/P24-GO301.2001.pdf", year: 2001 },
  { goNumber: "G.O.Ms.No.467-1988", title: "DCRG Permitted Retirement Without Disciplinary Prejudice", url: "https://www.johnsonasirservices.org/web/download4/GO467-88%20Prov%20DCRG%20.docx", year: 1988 },
  { goNumber: "G.O.Ms.No.437-1988", title: "Half of Contingency-paid Service Counted with Regular Service", url: "https://www.johnsonasirservices.org/web/Download3/P27-437-88.docx", year: 1988 },
  { goNumber: "G.O.Ms.No.955-1991", title: "Contingency Service Additional Order", url: "https://www.johnsonasirservices.org/web/Download3/P28-GO955.91.pdf", year: 1991 },
  { goNumber: "G.O.Ms.No.118-1996", title: "Non-pensionable Service Half Counted with Regular Service", url: "https://www.johnsonasirservices.org/web/Download3/P29-GO.118-14.02.1996.pdf", year: 1996 },
  { goNumber: "G.O.Ms.No.679-1998", title: "Non-pensionable Service Conditions and Rule Amendments", url: "https://www.johnsonasirservices.org/web/download4/GO.679-98.pdf", year: 1998 },
  { goNumber: "G.O.Ms.No.408-2009", title: "Non-provincialised Services Half Counted for Pension", url: "https://www.johnsonasirservices.org/web/download4/30.%20Half%20of%20non-provincialised%20Services%20for%20Pension%20408%20.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.575-1994", title: "Provisional Pension Dearness Allowance Inclusion", url: "https://www.johnsonasirservices.org/web/download4/GO575.pdf", year: 1994 },
  { goNumber: "G.O.Ms.No.326-1995", title: "Provisional Pension Medical Allowance Inclusion", url: "https://www.johnsonasirservices.org/web/download4/GO326.pdf", year: 1995 },
  { goNumber: "G.O.Ms.No.85-2002", title: "Provisional Family Pension Death in Harness", url: "https://www.johnsonasirservices.org/web/Downloads/provisional_family_pension.pdf", year: 2002 },
  { goNumber: "G.O.Ms.No.478-1987", title: "Family Pension Unknown Whereabouts", url: "https://www.johnsonasirservices.org/web/Downloads5/32.%20Family%20Pension-%20Govt.%20servant's%20whereabout%20not%20known-%20478%20.pdf", year: 1987 },
  { goNumber: "G.O.Ms.No.569-1991", title: "Family Pension Post-retiral Spouse Eligibility", url: "https://www.johnsonasirservices.org/web/Downloads5/34.%20Family%20Pension%20-to%20post-retiral%20spouse%20-%20G.O.569%20.pdf", year: 1991 },
  { goNumber: "G.O.Ms.No.598-1993", title: "Family Pension Post-retiral Spouse Endorsement Procedure", url: "https://www.johnsonasirservices.org/web/Downloads5/35.%20Family%20Pension%20-%20to%20post-retiral%20spouse%20-%20Procedure%20-%20G.O.598.pdf", year: 1993 },
  { goNumber: "G.O.Ms.No.173-2004", title: "Delayed DCRG Payment GPF Interest Applicable", url: "https://www.johnsonasirservices.org/web/Downloads5/36.%20Interest%20-delayed%20payment%20of%20DCRG%20-%20G.O.173%20.pdf", year: 2004 },
  { goNumber: "G.O.Ms.No.900-1995", title: "Audit Objections Settled on Death", url: "https://www.johnsonasirservices.org/web/download4/GO.900-95.pdf", year: 1995 },
  { goNumber: "G.O.Ms.No.15-2010", title: "Retired Employees Contract Temporary Appointments", url: "https://www.johnsonasirservices.org/web/Download2/Files2/RE%20par_e_15_10.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.170-2009", title: "Retired Employees Temporary Appointments Additional", url: "https://www.johnsonasirservices.org/web/Download2/Files2/RE%20par_e_170_2009.pdf", year: 2009 },
  { goNumber: "G.O.Ms.No.75-FA-2013", title: "Festival Advance to Pensioners Enhanced Quantum", url: "https://www.johnsonasirservices.org/web/Downloads_latest/41PEN-FA-2000-fin_e_75_2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.41-Exgratia-2014", title: "Ex-gratia Payment Deceased Beneficiaries Revision", url: "https://www.johnsonasirservices.org/web/download4/fin_e_41_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.42-Exgratia-2014", title: "Ex-gratia Beneficiaries Dearness Allowance Enhanced", url: "https://www.johnsonasirservices.org/web/download4/fin_e_42_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.363-DP-2013", title: "DA as Dearness Pay Retired 1.6.88 to 31.12.1995", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Pension-DP-363.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.403-PenDA-2013", title: "Dearness Allowance Revised Rate July 2013 Pensioners", url: "https://www.johnsonasirservices.org/web/Downloads_latest/45PEN-DA-07-2013-fin_e_403_2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.100-PenDA-2014", title: "Dearness Allowance Revised Rate January 2014", url: "https://www.johnsonasirservices.org/web/download4/fin_e_100_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.246-PenDA-2014", title: "Dearness Allowance Revised Rate July 2014", url: "https://www.johnsonasirservices.org/web/download4/fin_e_246_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.713-1990", title: "Fifth TN Pay Commission Pension Modifications", url: "https://www.johnsonasirservices.org/web/Downloads_latest/46PEN-G-O-713_28-06-1990.pdf", year: 1990 },
  { goNumber: "G.O.Ms.No.272-1998", title: "DA as Dearness Pay Pension Revision", url: "https://www.johnsonasirservices.org/web/Downloads_latest/47PEN-G.O.272_15-06-1998.pdf", year: 1998 },
  { goNumber: "G.O.Ms.No.437-1997", title: "DCRG to Minors Procedure Simplified", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/PJ182GO437.pdf", year: 1997 },
  { goNumber: "G.O.Ms.No.784-1994", title: "No Commutation of Provisional Pension", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/PJ188GO784.pdf", year: 1994 },
  { goNumber: "G.O.Ms.No.30-PPO-2010", title: "Duplicate Pension Payment Order Revised Procedure", url: "https://www.johnsonasirservices.org/web/Downloads_latest/Set3/SERV-J/PPO%20fin_e_30_2010.pdf", year: 2010 },
  { goNumber: "G.O.Ms.No.5-Pongal-2014", title: "Pongal Festival 2014 Prize to Pensioners", url: "https://www.johnsonasirservices.org/web/download4/PONGAL-FEST-2014fin_e_5_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.10-Pongal-2015", title: "Pongal Festival 2015 Prize to Pensioners", url: "https://www.johnsonasirservices.org/web/Downloads6/Pongal%20-pen-2015fin_e_10_2015.pdf", year: 2015 },
];

// HBA GOs
const JOHNSONASIR_HBA_GOS = [
  { goNumber: "G.O.Ms.No.135-HBA-2012", title: "House Building Advance Guidelines 2012", url: "https://www.johnsonasirservices.org/web/Downloads5/hba-135.pdf", year: 2012 },
  { goNumber: "G.O.Ms.No.131-HBA-2011", title: "HBA Interest Rates 2010-12", url: "https://www.johnsonasirservices.org/web/Downloads5/hba-131.pdf", year: 2011 },
  { goNumber: "G.O.Ms.No.203-HBA-2012", title: "HBA Interest Rates 2012-13", url: "https://www.johnsonasirservices.org/web/Downloads5/hba-203.pdf", year: 2012 },
  { goNumber: "G.O.Ms.No.148-HBA-2013", title: "HBA MCA Interest Rate 2013-2014", url: "https://www.johnsonasirservices.org/web/Downloads_latest/service-10-2013/serv10-2013-2/HBA-MCA-INTfin_e_148_2013.pdf", year: 2013 },
  { goNumber: "G.O.Ms.No.186-HBA-2014", title: "HBA Interest Rate 2014-2015", url: "https://www.johnsonasirservices.org/web/Download3/INTEREST-2014-15-fin_e_186_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.213-HBA-2015", title: "HBA Interest Rates 2015-2016", url: "https://www.johnsonasirservices.org/web/Downloads6/fin_e_213_2015.pdf", year: 2015 },
  { goNumber: "G.O.Ms.No.171-HBA-2014", title: "HBA Ceiling Amendment to 50%", url: "https://www.johnsonasirservices.org/web/download4/HBA-hud_e_171_2014.pdf", year: 2014 },
  { goNumber: "G.O.Ms.No.14-TA-2010", title: "TA Daily Allowance for PSU Employees", url: "https://www.johnsonasirservices.org/web/download4/TA%20Govt%20Undertakings%20GO%2014.pdf", year: 2010 },
];

// SERVICE RULES (as Guidelines category)
const JOHNSONASIR_RULES = [
  { title: "The Fundamental Rules of the Tamil Nadu Government", url: "https://www.johnsonasirservices.org/web/Downloads5/1.R.Fundamental%20Rules(July,%202010).pdf", year: 2010 },
  { title: "Tamil Nadu State and Subordinate Services Rules", url: "https://www.johnsonasirservices.org/web/Downloads5/2.R.%20TN%20State%20and%20Subordinate%20SERVICE%20RULES(2011).pdf", year: 2011 },
  { title: "Tamil Nadu Ministerial Service Rules Section 22", url: "https://www.johnsonasirservices.org/web/Downloads5/3.R.%20TN%20MINISTERIAL%20SERVICE%20RULES(2010).pdf", year: 2010 },
  { title: "Special Rules for Class XXII General Subordinate Service", url: "https://www.johnsonasirservices.org/web/Downloads5/4.R.%20general_subordinate_rules%20XXII%20.(2007).pdf", year: 2007 },
  { title: "Tamil Nadu General Service Rules Classes XII XII-A XII-B XII-C", url: "https://www.johnsonasirservices.org/web/Downloads5/5.R.%20gen-XII-XIIA_(2012).pdf", year: 2012 },
  { title: "Tamil Nadu Basic Service Rules Section 19", url: "https://www.johnsonasirservices.org/web/Downloads5/6.R.%20basic_service_rules%20(2007).pdf", year: 2007 },
  { title: "Tamil Nadu Secretariat Service Rules Section 29", url: "https://www.johnsonasirservices.org/web/Downloads5/7.R,%20TN%20Secretariat%20Service%20rules_revised-(2012).pdf", year: 2012 },
  { title: "Tamil Nadu Public Service Commission Regulations 1954", url: "https://www.johnsonasirservices.org/web/Downloads5/8.R.TNPSC%20Regulations,1954%20(2007).pdf", year: 2007 },
  { title: "Collegiate Educational Service Rules", url: "https://www.johnsonasirservices.org/web/Downloads5/9.R.%20spl%20rules%20forCOLLEGIATE%20EDUCATIONAL%20SERVICE%20ES.pdf", year: 2010 },
  { title: "Tamil Nadu Civil Services Discipline And Appeal Rules", url: "https://www.johnsonasirservices.org/web/Downloads5/10.R.tncsdarules(02-2013).pdf", year: 2013 },
  { title: "Tamil Nadu Civil Services Disciplinary Proceedings Tribunal Rules 1955", url: "https://www.johnsonasirservices.org/web/Downloads5/11.R.TNCS%20Disciplinary%20Pro.%20Tribunal%20-1955.(2011).pdf", year: 2011 },
  { title: "The Tamil Nadu Government Servants Conduct Rules 1973", url: "https://www.johnsonasirservices.org/web/Downloads5/12.CONDUCT%20RULES%20tngsc1973.(2010).pdf", year: 2010 },
  { title: "The General Provident Fund Rules", url: "https://www.johnsonasirservices.org/web/Downloads5/13.GPF_rules(2006).pdf", year: 2006 },
  { title: "Tamil Nadu Travelling Allowance Rules 2005", url: "https://www.johnsonasirservices.org/web/Downloads5/14.%20TA-Rules-2005.pdf", year: 2005 },
  { title: "The Tamil Nadu Pension Rules 1978 Part 1", url: "https://www.johnsonasirservices.org/web/Downloads5/16.1.TN_Pension_Rules,1978_%20(2010)P1to80.pdf", year: 2010 },
  { title: "The Tamil Nadu Pension Rules 1978 Part 2", url: "https://www.johnsonasirservices.org/web/Downloads5/16.2.TN_Pension_Rules_P81to150.pdf", year: 2010 },
  { title: "The Tamil Nadu Pension Rules 1978 Part 3", url: "https://www.johnsonasirservices.org/web/Downloads5/16.3.TN_Pension_Rules_P151to270.pdf", year: 2010 },
  { title: "Tamil Nadu Financial Code Volume I Part 1", url: "https://www.johnsonasirservices.org/web/Downloads5/17.1.R.%20TNFC_Vol1[31.7.1991]_P001to100.pdf", year: 1991 },
  { title: "Tamil Nadu Financial Code Volume II", url: "https://www.johnsonasirservices.org/web/Downloads5/18.R.TNFC_Vol2_P1to600(1993).pdf", year: 1993 },
  { title: "Tamil Nadu Treasury Code Volume I Part 1", url: "https://www.johnsonasirservices.org/web/Downloads5/19.1.R.%20TNTC_Vol1_P1to76.(1991).pdf", year: 1991 },
  { title: "Tamil Nadu Account Code Volume I", url: "https://www.johnsonasirservices.org/web/Downloads5/21.TN%20AccountCode_Vol1_P1to88(1992).pdf", year: 1992 },
  { title: "Tamil Nadu Account Code Volume II", url: "https://www.johnsonasirservices.org/web/Downloads5/22.TN%20Account%20Code_Vol2_%20P1to86(1992).pdf", year: 1992 },
  { title: "Tamil Nadu Budget Manual Part 1", url: "https://www.johnsonasirservices.org/web/Downloads5/24.1.R.TN_budget_Manual_P1to96(1992).pdf", year: 1992 },
  { title: "Tamil Nadu Treasuries and Accounts Subordinate Services Rules", url: "https://www.johnsonasirservices.org/web/Downloads5/25.R.T&A%20Subordinate%20Service%20Rules-sec.31A.pdf", year: 2010 },
  { title: "Tamil Nadu Educational Rules", url: "https://www.johnsonasirservices.org/web/Downloads5/29.R.TN%20educational%20rules%20.pdf", year: 2010 },
  { title: "Tamil Nadu Collegiate Educational Subordinate Service Rules", url: "https://www.johnsonasirservices.org/web/Downloads5/30.R.sp%20lrules_College%20Edn%20Sub%20Serv.pdf", year: 2010 },
  { title: "Tamil Nadu Technical Educational Subordinate Service Rules", url: "https://www.johnsonasirservices.org/web/Downloads5/31.R.spl%20rules_Tech%20Edn%20Sub%20Service.pdf", year: 2010 },
  { title: "Tamil Nadu Recognised Private Schools Regulation Act 1973", url: "https://www.johnsonasirservices.org/web/download4/Tamil%20Nadu%20Recognised%20Private%20Schools%20(Regulation)%20Act,%201973.pdf", year: 1973 },
];

async function seedJohnsonasirComplete() {
  try {
    console.log("Seeding complete johnsonasirservices.org content...");

    // Get/create categories
    let formsCategory = await prisma.category.findFirst({ where: { slug: "forms" } });
    if (!formsCategory) {
      formsCategory = await prisma.category.create({ data: { name: "Forms & Applications", slug: "forms" } });
    }
    let goCategory = await prisma.category.findFirst({ where: { slug: "government-orders" } });
    let guidelinesCategory = await prisma.category.findFirst({ where: { slug: "guidelines" } });
    if (!guidelinesCategory) {
      guidelinesCategory = await prisma.category.create({ data: { name: "Guidelines", slug: "guidelines" } });
    }

    // Get departments
    let financeDept = await prisma.department.findFirst({ where: { slug: "finance" } });

    let created = 0, skipped = 0;

    // Seed Forms
    console.log("\n--- Seeding Forms ---");
    for (const form of JOHNSONASIR_FORMS) {
      const existing = await prisma.document.findFirst({ where: { fileUrl: form.url } });
      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: form.title,
          description: `${form.title}. Source: johnsonasirservices.org`,
          fileName: form.title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50) + ".pdf",
          fileUrl: form.url,
          fileSize: Math.floor(Math.random() * 500000) + 50000,
          fileType: form.url.endsWith(".docx") ? "docx" : "pdf",
          departmentId: financeDept!.id,
          categoryId: formsCategory.id,
          isPublished: true,
          downloads: Math.floor(Math.random() * 100) + 10,
        },
      });
      created++;
    }

    // Seed Pension GOs
    console.log("\n--- Seeding Pension GOs ---");
    for (const go of JOHNSONASIR_PENSION_GOS) {
      const existing = await prisma.document.findFirst({
        where: { OR: [{ goNumber: go.goNumber }, { fileUrl: go.url }] },
      });
      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: go.title,
          description: `Official Pension GO: ${go.title}. Source: johnsonasirservices.org`,
          goNumber: go.goNumber,
          fileName: go.goNumber.replace(/[^a-zA-Z0-9]/g, "_") + ".pdf",
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 400000) + 50000,
          fileType: go.url.endsWith(".docx") ? "docx" : "pdf",
          departmentId: financeDept!.id,
          categoryId: goCategory!.id,
          publishedYear: go.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 150) + 10,
        },
      });
      created++;
    }

    // Seed HBA GOs
    console.log("\n--- Seeding HBA GOs ---");
    for (const go of JOHNSONASIR_HBA_GOS) {
      const existing = await prisma.document.findFirst({
        where: { OR: [{ goNumber: go.goNumber }, { fileUrl: go.url }] },
      });
      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: go.title,
          description: `Official HBA GO: ${go.title}. Source: johnsonasirservices.org`,
          goNumber: go.goNumber,
          fileName: go.goNumber.replace(/[^a-zA-Z0-9]/g, "_") + ".pdf",
          fileUrl: go.url,
          fileSize: Math.floor(Math.random() * 300000) + 50000,
          fileType: "pdf",
          departmentId: financeDept!.id,
          categoryId: goCategory!.id,
          publishedYear: go.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 100) + 10,
        },
      });
      created++;
    }

    // Seed Service Rules
    console.log("\n--- Seeding Service Rules ---");
    for (const rule of JOHNSONASIR_RULES) {
      const existing = await prisma.document.findFirst({ where: { fileUrl: rule.url } });
      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: rule.title,
          description: `Official Rules: ${rule.title}. Source: johnsonasirservices.org`,
          fileName: rule.title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50) + ".pdf",
          fileUrl: rule.url,
          fileSize: Math.floor(Math.random() * 1000000) + 100000,
          fileType: "pdf",
          departmentId: financeDept!.id,
          categoryId: guidelinesCategory.id,
          publishedYear: rule.year,
          isPublished: true,
          downloads: Math.floor(Math.random() * 200) + 20,
        },
      });
      created++;
    }

    console.log(`\n=== COMPLETE ===`);
    console.log(`Created: ${created}, Skipped: ${skipped}`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedJohnsonasirComplete();
