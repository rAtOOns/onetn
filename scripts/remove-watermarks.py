#!/usr/bin/env python3
"""
Remove kalviexpress watermarks from government PDF documents.
These are public government documents with third-party watermarks added.
"""

import fitz  # PyMuPDF
import os
import sys
import gc
from pathlib import Path

# Force unbuffered output
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

# Watermark patterns to remove
WATERMARK_PATTERNS = [
    "www.kalviexpress.in",
    "kalviexpress.in",
    "kalviexpress",
    "www.padasalai.net",
    "padasalai.net",
    "padasalai",
    "www.kalvisolai.com",
    "kalvisolai.com",
    "kalvisolai",
]

def has_watermark(pdf_path):
    """Check if PDF has any watermarks."""
    doc = None
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text = page.get_text().lower()
            for pattern in WATERMARK_PATTERNS:
                if pattern.lower() in text:
                    doc.close()
                    return True
        doc.close()
        return False
    except Exception as e:
        if doc:
            doc.close()
        return False

def remove_watermarks_from_pdf(input_path):
    """Remove watermark text from a PDF file."""
    doc = None
    try:
        doc = fitz.open(input_path)
        modified = False

        for page_num in range(len(doc)):
            page = doc[page_num]

            for pattern in WATERMARK_PATTERNS:
                text_instances = page.search_for(pattern, quads=True)

                if text_instances:
                    modified = True
                    for inst in text_instances:
                        rect = inst.rect
                        page.add_redact_annot(rect)
                    page.apply_redactions()

            # Remove annotations with watermarks
            annots = list(page.annots()) if page.annots() else []
            for annot in annots:
                try:
                    annot_text = annot.info.get("content", "")
                    for pattern in WATERMARK_PATTERNS:
                        if pattern.lower() in annot_text.lower():
                            page.delete_annot(annot)
                            modified = True
                            break
                except:
                    pass

        if modified:
            temp_path = input_path + ".tmp"
            doc.save(temp_path, garbage=4, deflate=True)
            doc.close()
            doc = None
            os.replace(temp_path, input_path)
            return True
        else:
            doc.close()
            doc = None
            return False

    except Exception as e:
        if doc:
            try:
                doc.close()
            except:
                pass
        # Clean up temp file
        temp_path = input_path + ".tmp"
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except:
                pass
        raise e

def process_directory(directory, dry_run=False):
    """Process all PDFs in a directory."""
    pdf_dir = Path(directory)
    pdf_files = sorted(pdf_dir.glob("*.pdf"))

    total = len(pdf_files)
    processed = 0
    modified = 0
    skipped = 0
    errors = 0

    print(f"Found {total} PDF files to process")
    print(f"Patterns: {', '.join(WATERMARK_PATTERNS[:3])}...")
    print()

    for i, pdf_path in enumerate(pdf_files):
        try:
            # Check if file has watermarks first
            if not has_watermark(str(pdf_path)):
                skipped += 1
                if (i + 1) % 100 == 0:
                    print(f"[{i+1}/{total}] Progress... ({modified} modified, {skipped} clean)")
                    sys.stdout.flush()
                continue

            if dry_run:
                print(f"[{i+1}/{total}] Would modify: {pdf_path.name}")
                modified += 1
            else:
                # Remove watermarks
                if remove_watermarks_from_pdf(str(pdf_path)):
                    print(f"[{i+1}/{total}] Modified: {pdf_path.name}")
                    sys.stdout.flush()
                    modified += 1

            processed += 1

            # Free memory every 50 files
            if (i + 1) % 50 == 0:
                gc.collect()

        except Exception as e:
            print(f"[{i+1}/{total}] Error: {pdf_path.name} - {e}")
            sys.stdout.flush()
            errors += 1

    print()
    print("=" * 50)
    print(f"Summary:")
    print(f"  Total files: {total}")
    print(f"  Modified: {modified}")
    print(f"  Already clean: {skipped}")
    print(f"  Errors: {errors}")
    print("=" * 50)

def check_single_pdf(pdf_path):
    """Check a single PDF for watermarks."""
    doc = fitz.open(pdf_path)
    print(f"Checking: {pdf_path}")
    print(f"Pages: {len(doc)}")
    print()

    for page_num in range(min(3, len(doc))):
        page = doc[page_num]
        print(f"Page {page_num + 1}:")
        text = page.get_text()

        for pattern in WATERMARK_PATTERNS:
            if pattern.lower() in text.lower():
                print(f"  Found: '{pattern}'")
                instances = page.search_for(pattern)
                print(f"  Instances: {len(instances)}")
        print()

    doc.close()

if __name__ == "__main__":
    docs_dir = "/Users/ratoon/Projects/Transformation/onetn/public/documents"

    if len(sys.argv) > 1:
        if sys.argv[1] == "--check":
            if len(sys.argv) > 2:
                check_single_pdf(sys.argv[2])
            else:
                pdfs = sorted(Path(docs_dir).glob("*.pdf"))
                if pdfs:
                    check_single_pdf(str(pdfs[0]))
        elif sys.argv[1] == "--dry-run":
            process_directory(docs_dir, dry_run=True)
        elif sys.argv[1] == "--process":
            print("Starting watermark removal...")
            print("This will modify PDF files in place.")
            print()
            process_directory(docs_dir, dry_run=False)
        else:
            print("Usage:")
            print("  python remove-watermarks.py --check [file.pdf]")
            print("  python remove-watermarks.py --dry-run")
            print("  python remove-watermarks.py --process")
    else:
        print("Usage:")
        print("  python remove-watermarks.py --check [file.pdf]")
        print("  python remove-watermarks.py --dry-run")
        print("  python remove-watermarks.py --process")
