# Tamil Nadu GO Portal - Quality First Plan

## Goal
Build a high-quality GO portal where each document has:
- Proper metadata (GO#, Date, Department, Type)
- **Description/Summary** explaining what the GO is about
- Bilingual support (Tamil + English)
- Clean, watermark-free PDFs
- Searchable by any field

## Current State (Keep Running)
- 846 documents with basic metadata
- Some have GO numbers, dates
- Most lack descriptions
- Continue running at current domain

## New Quality Portal (Separate Project)

### Phase 1: Data Model
```
GO {
  goNumber:     264
  goType:       "Ms"           // Ms, RT, OP, D
  date:         "2025-12-10"
  department:   "Finance"
  deptCode:     "FD"

  // Rich content (what competitors have)
  titleEn:      "New Health Insurance Scheme Guidelines"
  titleTa:      "புதிய மருத்துவக் காப்பீட்டு திட்ட வழிகாட்டுதல்கள்"
  summaryEn:    "This GO announces the new NHIS 2025 scheme..."
  summaryTa:    "இந்த அரசாணை புதிய NHIS 2025 திட்டத்தை..."

  // Categories
  topic:        "Health Insurance"
  tags:         ["NHIS", "Insurance", "Health", "2025"]

  // Files
  pdfUrl:       "/documents/GO-Ms-264-2025-12-10.pdf"
  pdfClean:     true  // watermark removed

  // Source
  sourceUrl:    "https://tngo.kalvisolai.com/..."
  officialUrl:  "https://tn.gov.in/..."  // if available
}
```

### Phase 2: Data Sources

#### Source 1: tngo.kalvisolai.com (Primary)
- Scrape with full metadata + descriptions
- Extract Tamil descriptions from titles
- Download clean PDFs

#### Source 2: Official tn.gov.in
- Check for official versions
- Get authentic metadata

#### Source 3: AI Enhancement
- Use Claude/GPT to generate English summaries from Tamil
- Generate descriptions from PDF content (OCR)
- Categorize and tag documents

### Phase 3: Scraping Strategy

```
For each GO page on kalvisolai:
1. Extract GO metadata (number, date, type)
2. Extract Tamil title/description
3. Translate to English (AI)
4. Download PDF
5. Remove watermark
6. Generate summary if missing (AI)
7. Store in new database
```

### Phase 4: Quality Gates

Before adding a GO to portal:
- [ ] Has valid GO number
- [ ] Has date
- [ ] Has department
- [ ] Has Tamil description OR English description
- [ ] PDF is clean (no watermark)
- [ ] PDF is valid (not corrupted)

### Phase 5: Frontend

GO Detail Page (like kalvisolai but better):
```
┌────────────────────────────────────────────┐
│  G.O. (Ms) No. 264                         │
│  Date: 10.12.2025                          │
│  Department: Finance                        │
├────────────────────────────────────────────┤
│  🇬🇧 English                                │
│  New Health Insurance Scheme Guidelines    │
│                                            │
│  This Government Order announces the new   │
│  NHIS 2025 scheme providing enhanced       │
│  health coverage for government employees..│
├────────────────────────────────────────────┤
│  🇮🇳 தமிழ்                                   │
│  புதிய மருத்துவக் காப்பீட்டு திட்ட         │
│  வழிகாட்டுதல்கள்                           │
│                                            │
│  இந்த அரசாணை புதிய NHIS 2025 திட்டத்தை     │
│  அறிவிக்கிறது...                           │
├────────────────────────────────────────────┤
│  📥 Download PDF  |  👁️ View Online         │
├────────────────────────────────────────────┤
│  Tags: #NHIS #Health #Insurance #2025      │
│  Related GOs: GO 145, GO 148               │
└────────────────────────────────────────────┘
```

### Phase 6: Implementation Steps

1. **Create new database** for quality GOs
2. **Build scraper** that extracts full metadata + descriptions
3. **Add AI enhancement** for missing descriptions
4. **Quality check** each GO before adding
5. **Build new frontend** with rich GO pages
6. **Test on subdomain** (e.g., go.onetn.in)
7. **Replace main site** when ready

### Phase 7: Timeline

| Step | Description |
|------|-------------|
| 1 | Design new schema + API |
| 2 | Build quality scraper |
| 3 | Process 100 GOs with full quality |
| 4 | Build new GO detail page |
| 5 | Add search + filters |
| 6 | Process remaining GOs |
| 7 | Launch on new domain |

### Technology

- **Database**: PostgreSQL (better search)
- **Search**: Full-text search in Tamil + English
- **AI**: Claude API for translations/summaries
- **PDF**: PyMuPDF for watermark removal
- **Frontend**: Next.js with Tamil font support

### Success Metrics

- Each GO has description in at least one language
- Search finds GOs by content, not just title
- Users can browse by department, year, topic
- PDFs are clean and load fast

---

## Next Action

Start with **100 quality GOs** as proof of concept:
1. Pick 100 most important/recent GOs
2. Scrape with full metadata
3. Add descriptions (scrape or AI)
4. Build single GO page
5. Demo and iterate
