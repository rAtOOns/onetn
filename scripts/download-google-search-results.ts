import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");

if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// Files found from Google Search
const FILES = [
  { id: "1B2GqavHqXvz1-WbarDXRB9QWTetg8yhi", title: "Govt Of Tamil Nadu Kalviseithi" },
  { id: "1YZnEV3iqLOaGTC1lGgxzsI3wmB_WFL-d", title: "Local Government and Tamil Nadu" },
  { id: "1H52ojEA3MCld0nfpgnMka9YVGAVzVRWG", title: "Tamil Nadu TN" },
  { id: "1-t8tQJifMhE1LwbLODUSlrKslEV8_eLD", title: "Tamil Nadu Govt Public Holidays 2024 GO Ms 692" },
  { id: "1l6BCoIFJez0CL888w09v3PT399qvXVXm", title: "Tamil Nadu Application Format Tamil" },
  { id: "1Lyd8kt6uHxM6H9mD4OCUNnQsN3BL_wii", title: "Tamil Nadu Application Format English" },
  { id: "1JbWhJrfD9g3A3Lgk7GgJQ9zA6IZrdGUI", title: "Tamil Nadu Answer Key" },
  { id: "1u1lmCHqg_cqJ9Maqo-3cpe36jBziHS3v", title: "Learning Outcomes SCERT Tamil Nadu" },
  { id: "1p3rph9ecWTBwBHZNaVkvwZtNPeCQ8O-J", title: "TN Std12 General Tamil" },
];

async function downloadFile(fileId: string, title: string): Promise<boolean> {
  const filename = `${fileId}.pdf`;
  const destPath = path.join(DOCS_DIR, filename);

  try {
    // Check if exists
    const exists = await prisma.document.findFirst({
      where: { fileName: filename }
    });
    if (exists) {
      console.log(`  Already in DB: ${title}`);
      return false;
    }

    // Download
    const urls = [
      `https://drive.google.com/uc?export=download&id=${fileId}`,
      `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`,
    ];

    let success = false;
    for (const url of urls) {
      try {
        await execAsync(`curl -L -o "${destPath}" "${url}" --max-time 60 -s`, { timeout: 65000 });
        const stats = fs.statSync(destPath);
        if (stats.size > 5000) {
          // Check if it's actually a PDF
          const { stdout } = await execAsync(`file "${destPath}"`);
          if (stdout.includes("PDF") || stats.size > 50000) {
            success = true;
            break;
          }
        }
      } catch {}
    }

    if (success) {
      const stats = fs.statSync(destPath);
      const dept = await prisma.department.findFirst();
      const cat = await prisma.category.findFirst();
      if (dept && cat) {
        await prisma.document.create({
          data: {
            title,
            fileName: filename,
            fileUrl: `/documents/${filename}`,
            fileSize: stats.size,
            fileType: 'pdf',
            departmentId: dept.id,
            categoryId: cat.id,
            isPublished: true,
          }
        });
        console.log(`✓ ${title} (${(stats.size/1024).toFixed(0)}KB)`);
        return true;
      }
    } else {
      try { fs.unlinkSync(destPath); } catch {}
      console.log(`✗ ${title} - failed or not PDF`);
    }
  } catch (err) {
    try { fs.unlinkSync(destPath); } catch {}
    console.log(`✗ ${title} - error`);
  }
  return false;
}

async function main() {
  console.log("=== Download from Google Search Results ===\n");

  let downloaded = 0;
  for (const file of FILES) {
    const result = await downloadFile(file.id, file.title);
    if (result) downloaded++;
  }

  console.log(`\nDownloaded: ${downloaded}`);

  const total = await prisma.document.count();
  console.log(`Total documents: ${total}`);

  await prisma.$disconnect();
}

main().catch(console.error);
