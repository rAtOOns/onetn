import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);
const prisma = new PrismaClient();
const DOCS_DIR = path.join(process.cwd(), "public", "documents");

async function main() {
  console.log("=== Cleanup Fake PDFs ===\n");

  // Get all PDF files
  const files = fs.readdirSync(DOCS_DIR).filter(f => f.endsWith('.pdf'));
  console.log(`Total PDF files: ${files.length}\n`);

  const fakePdfs: string[] = [];
  const realPdfs: string[] = [];

  // Check each file
  for (const file of files) {
    const filePath = path.join(DOCS_DIR, file);
    try {
      const { stdout } = await execAsync(`file "${filePath}"`, { timeout: 5000 });
      if (stdout.includes('PDF document')) {
        realPdfs.push(file);
      } else {
        fakePdfs.push(file);
        console.log(`Fake: ${file} - ${stdout.split(':')[1]?.trim().substring(0, 40)}`);
      }
    } catch {
      fakePdfs.push(file);
    }
  }

  console.log(`\nReal PDFs: ${realPdfs.length}`);
  console.log(`Fake PDFs: ${fakePdfs.length}\n`);

  if (fakePdfs.length === 0) {
    console.log("No fake PDFs found!");
    await prisma.$disconnect();
    return;
  }

  // Delete fake files from disk and database
  console.log("Deleting fake PDFs...\n");
  let deleted = 0;

  for (const file of fakePdfs) {
    const filePath = path.join(DOCS_DIR, file);

    // Delete from database
    const doc = await prisma.document.findFirst({
      where: { fileName: file }
    });

    if (doc) {
      await prisma.document.delete({ where: { id: doc.id } });
      console.log(`  DB: Deleted ${doc.title.substring(0, 40)}...`);
    }

    // Delete from disk
    try {
      fs.unlinkSync(filePath);
      deleted++;
    } catch {}
  }

  console.log(`\n=== Summary ===`);
  console.log(`Deleted: ${deleted} fake files`);

  const remaining = await prisma.document.count();
  console.log(`Remaining documents: ${remaining}`);

  await prisma.$disconnect();
}

main().catch(console.error);
