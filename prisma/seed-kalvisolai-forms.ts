import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Forms from kalvisolai.com - 149 forms
const KALVISOLAI_FORMS = [
  // Administrative & Financial Forms
  { title: "New Group Permission Form", url: "https://drive.google.com/uc?export=download&id=1NFoIV7K1cS1b8YMwtvCS-9f6UVtVraro" },
  { title: "DSE High School Admission Form 2023-2024", url: "https://drive.google.com/uc?export=download&id=11I5sPO7Y9uHZLf-kPpspizrX5HiKUQHa" },
  { title: "DSE HSC Admission Form 2023-2024", url: "https://drive.google.com/uc?export=download&id=1_OLAtOeo5A5myoUdo-ARa3zTOFmj4PCa" },
  { title: "TNPSC Tamil Medium Certificate Format", url: "https://drive.google.com/uc?export=download&id=1827GZj-NxzoUXLGPL0QBZidWlfIaDxLd" },
  { title: "GPF Part Final Empty Form", url: "https://drive.google.com/uc?export=download&id=1o3H0q3emeKBxw6XuKWknLtsKv-0LFP_j" },
  { title: "TNPSC NOC Formats 2021", url: "https://drive.google.com/uc?export=download&id=1vP7K-Ibc0MPOlMugbOxogLiEgjyVgIBd" },
  { title: "TNPSC PSTM Formats 2021", url: "https://drive.google.com/uc?export=download&id=1v-nvmCixnaEmnpkZq0Nh8NEA5TK4DHfy" },
  { title: "Form 10BA Section 80GG Declaration", url: "https://drive.google.com/uc?export=download&id=1sempAPha-QskZ7WzUfkJNWrSRFBeXWyt" },
  { title: "Income Tax Form 16", url: "https://drive.google.com/uc?export=download&id=1FxwO9ePHMKX_uZxcpSSt1HZSyxbuwIx0" },
  { title: "Pay Certificate", url: "https://drive.google.com/uc?export=download&id=1FHMr1H5_9U8J7NA1y3SFI8r9VTj6Phqy" },
  { title: "Yearly Increment Certificate", url: "https://drive.google.com/uc?export=download&id=1ig-drRRskDN8iVpS-1Mf7z87_Gv9tsjo" },

  // GPF & Pension Forms
  { title: "GPF Temporary Advance Application", url: "https://drive.google.com/uc?export=download&id=15tYP7wlbkMZ80UUBewzt3zdjdXn8EkxD" },
  { title: "GPF Closure Application", url: "https://drive.google.com/uc?export=download&id=1HtL3fb39x_DZNJ9xgvPqP_ujC8kIIscC" },
  { title: "Combined GPF Final Closure and Pension Application", url: "https://drive.google.com/uc?export=download&id=1eQQMVHw-HUel1lrbd81yh8YhcQn9AtwO" },
  { title: "CPS Settlement Form GO No 59-2016", url: "https://drive.google.com/uc?export=download&id=1rUrGFsNgy1AMh8dBIKJhI-RX1nU-_jp-" },
  { title: "CPS PRAN Application Form", url: "https://drive.google.com/uc?export=download&id=1adsjKmWbC8CjezR01HjZRpZhj3kYm3By" },
  { title: "CPS Missing Credit Form", url: "https://drive.google.com/uc?export=download&id=1qy_9mpWM_FGxIgM9wc3RYifjrL4hzHum" },
  { title: "CPS Application Covering Letter", url: "https://drive.google.com/uc?export=download&id=1FnY0d7qq5QZQX2QG32ZVrCtldAI7GIlW" },

  // Leave & Transfer Forms
  { title: "Casual Leave CL Form", url: "https://drive.google.com/uc?export=download&id=1GNRZWTt50y3-F6A6bfHqMSEzRNWKDX6B" },
  { title: "Earned Leave Sanction Order", url: "https://drive.google.com/uc?export=download&id=1QNM8LJlpqZqatO-34ZseNMUSb-_WFwSX" },
  { title: "Medical Leave ML Application", url: "https://drive.google.com/uc?export=download&id=1d7oNLHAwWH2yLpcVnwPf_3poCE6noLUM" },
  { title: "Leave EL Surrender Application", url: "https://drive.google.com/uc?export=download&id=1KaPm5PicGGXQP-wZUsqPkmgDYM-qHoXT" },
  { title: "Teachers Mutual Transfer Application", url: "https://drive.google.com/uc?export=download&id=1rTUhEemqbY7m5lC7VBDLwCJdJAUmYNGH" },
  { title: "Teachers Transfer Relieving Order", url: "https://drive.google.com/uc?export=download&id=1t09D9dN-6qa6tx40JVtOMGdX-3a4sR9K" },
  { title: "DSE Transfer Application Mutual", url: "https://drive.google.com/uc?export=download&id=1KQLJtdDf-iJ4BpPKnwcHfZ_jHB613pGU" },
  { title: "DSE Transfer Application", url: "https://drive.google.com/uc?export=download&id=1V_kHjXpp_MOf1AoUKzmV6amOg1sD5pFz" },
  { title: "DSE New Transfer Application", url: "https://drive.google.com/uc?export=download&id=1T36PWnIyGgZfhszVlT6DrIQzwIDAoU9q" },
  { title: "DEE Transfer Application", url: "https://drive.google.com/uc?export=download&id=1FnUQmt8ACTQmaLyhk9lzmno8rmxMdMc5" },
  { title: "Unit Transfer NOC Request", url: "https://drive.google.com/uc?export=download&id=1l0Sc7apHAwFBeE-T5szm8eaQK_lDN-BL" },

  // Advancement & Career Forms
  { title: "Festival Advance Application Model 1", url: "https://drive.google.com/uc?export=download&id=1mh8-r6ru8WTH_syyfcxcwzoF0JCj4JFo" },
  { title: "Festival Advance Application Model 2", url: "https://drive.google.com/uc?export=download&id=1LJZXqHrMRTeQNHsX1XA0rARGVpFrkJJG" },
  { title: "Festival Advance Proceedings", url: "https://drive.google.com/uc?export=download&id=1xLs86PVS8irDN-cick9bcDtSIUNlEgKV" },
  { title: "Vehicle Advance Format", url: "https://drive.google.com/uc?export=download&id=1NwW9amt4oHmD_LKc3B9UchI8x7ApaS2s" },
  { title: "Conveyance Allowance Format", url: "https://drive.google.com/uc?export=download&id=14SRAVcvoNNGsoG71tR00-Xb7FPupqxEC" },
  { title: "VRS Voluntary Retirement Scheme Form", url: "https://drive.google.com/uc?export=download&id=1jdRQi2zrSo0j6TpAdJehs0Cs4QJLN5qN" },
  { title: "Re-Employment Form Retired Teachers", url: "https://drive.google.com/uc?export=download&id=1EQ_hW6rh4rlZvz7PnXhwlok-OQo0cT0p" },

  // Education & Qualification Forms
  { title: "MPhil PhD Permission Letter", url: "https://drive.google.com/uc?export=download&id=1zyw4DXCgtXA4th38i8IqAeRGNga89DNs" },
  { title: "Higher Studies Permission MSc", url: "https://drive.google.com/uc?export=download&id=1BPbZg__zzn4crh5wQjU3xUhDxjS6rh9k" },
  { title: "IGNOU MEd Convocation Form", url: "https://drive.google.com/uc?export=download&id=1ouA_x6SW_kJyabfyoqccxxLRhymY8IjH" },
  { title: "IGNOU Genuineness Application", url: "https://drive.google.com/uc?export=download&id=1JdUyDXbDuiRFcefmSOmiTTZ7siUD1Qz8" },

  // Promotion & Grade Forms
  { title: "Probation Selection Grade Special Grade Forms", url: "https://drive.google.com/uc?export=download&id=1a1RT_N70LwQl-Xp4DlC0l6r18L5-t_1t" },
  { title: "Selection Grade Format", url: "https://drive.google.com/uc?export=download&id=1lTlR5ROM7bEW3aMGdB_LutagRa1oAgrH" },
  { title: "Promotion Panel Seniority Correction", url: "https://drive.google.com/uc?export=download&id=1veqRsYaq8ciU1N6UyDJZYMMaTcQQ7nsY" },

  // Certificate & Document Forms
  { title: "Tamil Medium Certificate", url: "https://drive.google.com/uc?export=download&id=1fKHH0tNZA319WNq_Ao8KYzVauC2h_vRU" },
  { title: "Attendance Certificate Student", url: "https://drive.google.com/uc?export=download&id=1ihVJzH3bt74bnT5Xgxi1LdJj_z8dd526" },
  { title: "Conduct and Attendance Certificate", url: "https://drive.google.com/uc?export=download&id=1q5ohJqC3Eb-1pSXwqvuB45emuVp8-IVb" },
  { title: "Community Income Nativity Certificates", url: "https://drive.google.com/uc?export=download&id=17EmUj2D2MzjAsKSYgNZsxsl1tSDxwGJG" },
  { title: "Passport NOC Application", url: "https://drive.google.com/uc?export=download&id=1fvFfJLQCWQN7CcZGJHArZX_NjOLytqKz" },
  { title: "Land and House Purchase Permission", url: "https://drive.google.com/uc?export=download&id=1oq_WJ2LHJCLk1JxOQ9YuEaz92Twy3GHG" },
  { title: "Experience Certificate", url: "https://drive.google.com/uc?export=download&id=1BvT37qcq55KolHkAEjgJ5yHXPK19vOmw" },
  { title: "Extension Form", url: "https://drive.google.com/uc?export=download&id=1OfTgHyPf5AIgMGDRNhajuuTm0bpxxmAs" },
  { title: "LPC Leaving Character Certificate", url: "https://drive.google.com/uc?export=download&id=1WCPT5lkk-lmvaNjKNV04_7YhOCwdkK9c" },

  // Student Records
  { title: "Student Cumulative Record", url: "https://drive.google.com/uc?export=download&id=1qjGuKm4Yiv8799oyZ84819HvW0d48R7-" },
  { title: "Student Admission Application", url: "https://drive.google.com/uc?export=download&id=1fKWx729lXec4257d9V3VUTjeMPEs6V3z" },
  { title: "Admission Form School", url: "https://drive.google.com/uc?export=download&id=1_seRjjHaZyrE5hmistX2srK4oGt18wlo" },
  { title: "DEE Student Admission Form", url: "https://drive.google.com/uc?export=download&id=1T70nX-NrgnClXLEPLMrm03i6rVTe9Y8u" },
  { title: "DEE Student Cumulative Record", url: "https://drive.google.com/uc?export=download&id=1kvP0VEJm3ndC5fpB1wGCtuUpWAVMxWlE" },
  { title: "Age Certificate", url: "https://drive.google.com/uc?export=download&id=1WK_VkHKb7BmLaQz4AEkYpL0PlQ5XsBTn" },
  { title: "Degree Evaluation Application", url: "https://drive.google.com/uc?export=download&id=14j1bVBVTyOP-tYde0Bqw5FvYp8Qy1qTt" },

  // Examination Forms
  { title: "Form 33 Answer Books Account", url: "https://drive.google.com/uc?export=download&id=1G7V5UmcN_PG6_2cGSFrbbVBMbIcO1eUu" },
  { title: "SSLC Challan Form", url: "https://drive.google.com/uc?export=download&id=1IHyT5pSZ1uyzQjBhZ-dics9UsODWHd2f" },
  { title: "Exam DGE CSD Form", url: "https://drive.google.com/uc?export=download&id=1xEEj8Id9cC-pCOszYaCyMcZA6_ax6Cdg" },
  { title: "Exam DGE Form 37 Question Paper Account", url: "https://drive.google.com/uc?export=download&id=1WTPToEUCDJ_9MsUST0PiGS0ao7z4Vq8v" },
  { title: "HSE Exam Duty Remuneration Form", url: "https://drive.google.com/uc?export=download&id=1PdRjmIFyVMi18fDBqe6pBTJkuYQh_hV3" },
  { title: "All Practical Exam Forms", url: "https://drive.google.com/uc?export=download&id=1PJi97bWy174d5SUmnX-JkVRYN3msZrjH" },
  { title: "SSLC Model Vouchers", url: "https://drive.google.com/uc?export=download&id=1BmrrVqAeOvudju8FlbBl8yfo-u-3EYl3" },

  // Exam Certificate Applications
  { title: "HSC Duplicate Mark Certificate Application", url: "https://drive.google.com/uc?export=download&id=16Jiorc7XZSMPw_JFLprPBU6MVDlhbQk_" },
  { title: "HSC Certified Copy Mark Certificate Application", url: "https://drive.google.com/uc?export=download&id=1ZfFkpwglICvoagFefgm35Wv6RUhXKP0D" },
  { title: "HSC Migration Certificate Application", url: "https://drive.google.com/uc?export=download&id=1CxXCFCslglVvVZ8FfsQZmuoZRu41ddu_" },
  { title: "SSLC Duplicate Mark Certificate Application", url: "https://drive.google.com/uc?export=download&id=1vQLtuWU1Ah_hjqv-COzQTqzAmp_tOX-9" },
  { title: "SSLC Certified Copy Mark Certificate Application", url: "https://drive.google.com/uc?export=download&id=1GgfjpIGhurOtIf61xLMeTzJFLrL1EtPa" },
  { title: "SSLC Migration Certificate Application", url: "https://drive.google.com/uc?export=download&id=1BmC9HakG-K-IL9roBO4F6b60Ba4MUtLA" },
  { title: "Matric Duplicate Mark Certificate Application", url: "https://drive.google.com/uc?export=download&id=1SJPSixwPqXR6YQjO-sGz-yO8cK1zF4EG" },
  { title: "Matric Certified Copy Mark Certificate Application", url: "https://drive.google.com/uc?export=download&id=1iEmk1UIdaHlbex_ghfw9bIhtc2hbvD6C" },
  { title: "Matric Migration Certificate Application", url: "https://drive.google.com/uc?export=download&id=1jidgeumGZgBIuk-kO56IvNCXJko9aYaE" },
  { title: "ESLC Exam Application", url: "https://drive.google.com/uc?export=download&id=1_2Ha_5YqchQ8qEsgMHBFq7lPPv1KZVm8" },

  // School Recognition Forms
  { title: "Recognition Form I Permission Application", url: "https://drive.google.com/uc?export=download&id=1Y_QpLDnpV8s5uS9wQstf_Xjdirfm8sld" },
  { title: "Recognition Form II Statement by Private Schools", url: "https://drive.google.com/uc?export=download&id=1x4TItgM36sXGEDZq5Lrzr609Vz9zSDMI" },
  { title: "Recognition Form III Change in Constitution", url: "https://drive.google.com/uc?export=download&id=1d58ce_BNjG0b_qAvHnldAUlQal1De19D" },
  { title: "Recognition Form IV Management Transfer Approval", url: "https://drive.google.com/uc?export=download&id=1L_5j2Rjg7Et8M1Gb2CTEg2DgZNyAWo7i" },
  { title: "Recognition Form V Post Transfer Approval", url: "https://drive.google.com/uc?export=download&id=1hDBc2UJw0CwwTzesQijYcoKRc6kEML8z" },
  { title: "Recognition Form VI Minority School Statement", url: "https://drive.google.com/uc?export=download&id=1QsJf4DJvmkAgTud2Wrz_lf5t5uFGjr7c" },
  { title: "Recognition Form VIII Recognition Application", url: "https://drive.google.com/uc?export=download&id=1-YgWSEyXAVom0uxo7pkceGm2iqJoWNeF" },
  { title: "Recognition Form IX Certificate", url: "https://drive.google.com/uc?export=download&id=1-2exNiuFcE9HX7ssffjy3O5Fj0FOGMM3" },
  { title: "Recognition Form X Grant in Aid Application", url: "https://drive.google.com/uc?export=download&id=1OgL3XOMLn9KKj42QR24IIjQARwZagBn5" },
  { title: "Recognition Form XI Property Statement", url: "https://drive.google.com/uc?export=download&id=1LHQCLKz8Khz3MMrGOWwdxddXjdXLHS7x" },
  { title: "Recognition Form XII Property Transfer Permission", url: "https://drive.google.com/uc?export=download&id=182N8hLSwkqr44hBruPJML-pqhKd-UCUp" },
  { title: "Recognition Form XIII Financial Statement", url: "https://drive.google.com/uc?export=download&id=16YgITRRwOdSVo-R9et7cvWTrHqgElB2l" },
  { title: "Recognition Appendix I Approved Expenditure Items", url: "https://drive.google.com/uc?export=download&id=1eGlqJkU36hMPhcAHGK-xvN-_EdxOb6sk" },

  // DMS Matriculation School Forms
  { title: "DMS Open New Matriculation School Form A", url: "https://drive.google.com/uc?export=download&id=1gFHGezG-AU7W_NU90nNK4Uh079v-_BDQ" },
  { title: "DMS Open Matriculation School Form B", url: "https://drive.google.com/uc?export=download&id=1xbktruCkvhOBVAesWxQVch7Crw3Bu7B-" },
  { title: "DMS Renewal of Schools Form C", url: "https://drive.google.com/uc?export=download&id=1y9_reF1I2tiCAgNLlb1W8bHJDyI6eXgl" },
  { title: "DMS Additional Standards Form D", url: "https://drive.google.com/uc?export=download&id=1d1wOoUB48uwGJtci-qdKMS3U3xXHlJVa" },
  { title: "DMS HrSec Group Opening Application", url: "https://drive.google.com/uc?export=download&id=1zD1vx5AG4NrakVAq5ShWq7s86axa25RK" },
  { title: "DMS Inspection Form", url: "https://drive.google.com/uc?export=download&id=1zmFiSAvrr_4CzdXQZCuw-E4Anhqo6Dbm" },
  { title: "DMS Matriculation Schools Challan Remittance Details", url: "https://drive.google.com/uc?export=download&id=1wWtiIlq32q75O7x9d7jGTJJrDO5JT1Fh" },
  { title: "DMS Matric School Recognition Checklist", url: "https://drive.google.com/uc?export=download&id=1Z4O8icifeZn4Bghe5zWKWnmjrOyS_POn" },

  // Inspection & Reporting Forms
  { title: "Annual Inspection Report", url: "https://drive.google.com/uc?export=download&id=1Aoh0TDdlwVotQ_tbL3hfVX2PVVhmWvea" },
  { title: "CEO Inspection Format School Annual Report", url: "https://drive.google.com/uc?export=download&id=1-RzwA5WodWE7U2idYaXd9dPLoE2q-y0b" },
  { title: "CEO Inspection Visit Particulars", url: "https://drive.google.com/uc?export=download&id=1MmZVdPDaFWj6_9wm2XIU-Olxi7ZPjQwd" },
  { title: "CEO Class Observation Form", url: "https://drive.google.com/uc?export=download&id=1I4EXsnt1deJzdbQRvmk3oPBrBxQ_Uc4s" },

  // Miscellaneous Forms
  { title: "RTI Application Form", url: "https://drive.google.com/uc?export=download&id=1b7oPQsNxXEdT2jiXOIoiWph6u9gYA1PF" },
  { title: "Teachers Personal Profile", url: "https://drive.google.com/uc?export=download&id=1T89CuZUmccatkR9J6NM0VP2YLfMpBC1R" },
  { title: "RH Residential Application", url: "https://drive.google.com/uc?export=download&id=1W1VtlMIMJQUpK3RNzUsK3FjyRMzUi8rn" },
  { title: "EBS Form I II III", url: "https://drive.google.com/uc?export=download&id=1LMaAm7IsT6znJimKUYrVEOjGp8BaNRE7" },
  { title: "DGE Form I II III", url: "https://drive.google.com/uc?export=download&id=1wu2oP3EyJHaLgr5DqmYazdcpG1D7NRXt" },
  { title: "SBI Auto Debit Form", url: "https://drive.google.com/uc?export=download&id=1PqpJMXX7jXDHxroSzGA1QR1iaBWs1_qh" },
  { title: "Admission Free Higher Education Scheme", url: "https://drive.google.com/uc?export=download&id=1tA4wYBZlyAjVUhT7buS7ITZxxQXaNqSA" },
  { title: "National Teachers Welfare Fund Scholarship", url: "https://drive.google.com/uc?export=download&id=1XpdVE2dBkliOxirtnLBZrGDs2jc9zJiF" },
  { title: "SPF Closure Form 40A", url: "https://drive.google.com/uc?export=download&id=16AU_P3rPF8wnBRW_WI7O84DTVEtfSYPY" },
  { title: "FBF Sanction Order", url: "https://drive.google.com/uc?export=download&id=1F6wyiBmVE0xB4hlrn9mZIEMvwPVzHwv8" },
  { title: "Transfer Online Application Form", url: "https://drive.google.com/uc?export=download&id=1q6uFWVkYMdfvndxxzpMYDi58PGrv6nki" },
  { title: "English Medium Class Opening", url: "https://drive.google.com/uc?export=download&id=10aV1Hybv82EPxI91QX7P6wckRaAvjnnV" },
  { title: "Award Application Dr Radhakrishnan Best Teacher", url: "https://drive.google.com/uc?export=download&id=1L0uGHIb5bbsJzrWyi6H_mqARBE9N8iKH" },
  { title: "Reimbursement Non Critical COVID19 Claims", url: "https://drive.google.com/uc?export=download&id=1EU-SJL9zkT9XHl3Y8K9wQy2sDgX8lHi0" },
];

async function seedKalvisolaiForms() {
  try {
    console.log("Seeding forms from kalvisolai.com...");
    console.log(`Total forms to process: ${KALVISOLAI_FORMS.length}`);

    let formsCategory = await prisma.category.findFirst({ where: { slug: "forms" } });
    if (!formsCategory) {
      formsCategory = await prisma.category.create({ data: { name: "Forms & Applications", slug: "forms" } });
    }

    let eduDept = await prisma.department.findFirst({ where: { slug: "school-education" } });
    if (!eduDept) {
      eduDept = await prisma.department.create({ data: { name: "School Education", slug: "school-education" } });
    }

    let created = 0, skipped = 0;

    for (const form of KALVISOLAI_FORMS) {
      const existing = await prisma.document.findFirst({ where: { fileUrl: form.url } });
      if (existing) { skipped++; continue; }

      await prisma.document.create({
        data: {
          title: form.title,
          description: `${form.title}. Source: kalvisolai.com Forms Collection`,
          fileName: form.title.replace(/[^a-zA-Z0-9]/g, "_").substring(0, 50) + ".pdf",
          fileUrl: form.url,
          fileSize: Math.floor(Math.random() * 200000) + 20000,
          fileType: "pdf",
          departmentId: eduDept.id,
          categoryId: formsCategory.id,
          isPublished: true,
          downloads: Math.floor(Math.random() * 100) + 10,
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

seedKalvisolaiForms();
