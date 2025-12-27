#!/usr/bin/env python3
"""
Batch watermark removal - process files in chunks to avoid memory issues.
"""

import fitz
import os
import sys
import gc
from pathlib import Path

sys.stdout.reconfigure(line_buffering=True)

WATERMARK_PATTERNS = [
    "www.kalviexpress.in", "kalviexpress.in", "kalviexpress",
    "www.padasalai.net", "padasalai.net", "padasalai",
    "www.kalvisolai.com", "kalvisolai.com", "kalvisolai",
]

def has_watermark(pdf_path):
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
    except:
        return False

def remove_watermarks(input_path):
    try:
        doc = fitz.open(input_path)
        modified = False

        for page in doc:
            for pattern in WATERMARK_PATTERNS:
                instances = page.search_for(pattern, quads=True)
                if instances:
                    modified = True
                    for inst in instances:
                        page.add_redact_annot(inst.rect)
                    page.apply_redactions()

        if modified:
            temp_path = input_path + ".tmp"
            doc.save(temp_path, garbage=4, deflate=True)
            doc.close()
            os.replace(temp_path, input_path)
            return True
        doc.close()
        return False
    except Exception as e:
        print(f"  Error: {e}")
        return False

if __name__ == "__main__":
    docs_dir = "/Users/ratoon/Projects/Transformation/onetn/public/documents"

    # Get start and end from args
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    end = int(sys.argv[2]) if len(sys.argv) > 2 else 845

    pdf_files = sorted(Path(docs_dir).glob("*.pdf"))
    total = len(pdf_files)

    print(f"Processing files {start} to {end} of {total}")

    modified = 0
    skipped = 0

    for i, pdf_path in enumerate(pdf_files[start:end], start=start):
        try:
            if not has_watermark(str(pdf_path)):
                skipped += 1
                continue

            if remove_watermarks(str(pdf_path)):
                print(f"[{i+1}] Modified: {pdf_path.name}")
                modified += 1

            # Clear memory
            gc.collect()

        except Exception as e:
            print(f"[{i+1}] Error: {pdf_path.name}")

    print(f"\nDone: {modified} modified, {skipped} clean")
