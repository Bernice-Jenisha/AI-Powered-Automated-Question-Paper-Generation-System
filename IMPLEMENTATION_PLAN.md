# AI-Powered Automated Question Paper Generation System
## Using Bloom's Taxonomy, RAG & Generative AI

---

## 📌 Project Overview

Faculty uploads a textbook → AI extracts knowledge → Faculty configures exam blueprint → AI generates balanced questions → Export as PDF/DOCX.

**One-line description:**
> "An AI-powered Automated Question Paper Generation System that generates examination papers from textbooks based on Bloom's Taxonomy, difficulty levels, mark distribution, and syllabus coverage."

---

## 🏗️ System Architecture

```
Faculty
   ↓
[1] Upload Textbook (PDF/Text)
   ↓
[2] PDF/Text Extraction (PyMuPDF / pdfplumber)
   ↓
[3] Topic & Concept Extraction (spaCy + NLP)
   ↓
[4] Bloom's Taxonomy Mapping (LangChain + LLM)
   ↓
[5] RAG Indexing (Sentence Transformers + ChromaDB)
   ↓
[6] Blueprint Configuration by Faculty (React UI)
   ↓
[7] AI Question Generation (Groq / OpenAI + LangChain)
   ↓
[8] Validation Module (Duplicate Detection + Quality Check)
   ↓
[9] Question Paper Assembly
   ↓
[10] PDF / DOCX Export (ReportLab / python-docx)
```

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React + Tailwind CSS |
| **Backend** | FastAPI (Python) |
| **AI/LLM** | Groq API (LLaMA 3) or OpenAI GPT-4 |
| **RAG Pipeline** | LangChain + ChromaDB |
| **NLP** | spaCy, NLTK, Sentence Transformers |
| **PDF Processing** | PyMuPDF (`fitz`), pdfplumber |
| **Database** | MongoDB (Atlas or local) |
| **Export** | ReportLab (PDF), python-docx (DOCX) |
| **Vector Store** | ChromaDB (local) |
| **Embeddings** | `all-MiniLM-L6-v2` (HuggingFace) |

---

## 📁 Project Structure

```
bloom_tax_ques/
│
├── frontend/                    # React App
│   ├── src/
│   │   ├── components/
│   │   │   ├── Upload.jsx       # File upload component
│   │   │   ├── Blueprint.jsx    # Exam configuration form
│   │   │   ├── Preview.jsx      # Question paper preview
│   │   │   └── Export.jsx       # Download buttons
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Generate.jsx
│   │   └── App.jsx
│   └── package.json
│
├── backend/                     # FastAPI App
│   ├── main.py                  # Entry point
│   ├── routers/
│   │   ├── upload.py            # PDF upload & extraction
│   │   ├── blueprint.py         # Blueprint configuration
│   │   ├── generate.py          # Question generation
│   │   ├── validate.py          # QA validation
│   │   └── export.py            # PDF/DOCX export
│   ├── services/
│   │   ├── pdf_extractor.py     # PyMuPDF extraction
│   │   ├── topic_extractor.py   # NLP topic extraction
│   │   ├── bloom_mapper.py      # Bloom's taxonomy mapping
│   │   ├── rag_pipeline.py      # RAG + ChromaDB
│   │   ├── question_gen.py      # LLM question generation
│   │   ├── validator.py         # Duplicate detection
│   │   └── exporter.py          # PDF/DOCX generation
│   ├── models/
│   │   ├── schemas.py           # Pydantic models
│   │   └── db.py                # MongoDB connection
│   └── requirements.txt
│
└── README.md
```

---

## 🧩 Module Breakdown

### Module 1: Content Analysis & Knowledge Extraction
**Goal:** Extract structured knowledge from uploaded textbook.

**Steps:**
1. Accept PDF/Text file via API
2. Extract raw text using `PyMuPDF` or `pdfplumber`
3. Chunk text into paragraphs/sections
4. Use `spaCy` to extract:
   - Named entities (terms, concepts)
   - Key phrases and definitions
   - Formulas and important sentences
5. Store chunks in ChromaDB with embeddings

**Key Files:** `pdf_extractor.py`, `topic_extractor.py`, `rag_pipeline.py`

---

### Module 2: Examination Blueprint Configuration
**Goal:** Let faculty define exact exam requirements via UI.

**Faculty Inputs:**
| Parameter | Example |
|-----------|---------|
| Total Marks | 100 |
| Number of Questions | 10 |
| Mark Distribution | 2M × 3, 5M × 4, 10M × 3 |
| Bloom's Level Distribution | Remember 20%, Apply 40%, Analyze 20%, Evaluate 20% |
| Difficulty | Easy 30%, Medium 50%, Hard 20% |
| Topic Weightage | Chapter 1: 30%, Chapter 2: 40%... |

**UI:** React form with sliders, dropdowns, and live preview of blueprint.

---

### Module 3: Bloom's Taxonomy Intelligence
**Goal:** Classify and generate questions at specific cognitive levels.

**Bloom's 6 Levels + Action Verbs:**

| Level | Action Verbs Used in Prompts |
|-------|------------------------------|
| **Remember** | Define, List, Recall, State, Identify |
| **Understand** | Explain, Describe, Summarize, Interpret |
| **Apply** | Apply, Solve, Use, Demonstrate, Calculate |
| **Analyze** | Compare, Differentiate, Examine, Break down |
| **Evaluate** | Justify, Assess, Critique, Judge, Evaluate |
| **Create** | Design, Construct, Formulate, Propose |

**Implementation:** LLM prompt engineering using these verbs to force the correct cognitive level.

---

### Module 4: Intelligent Question Generation Engine
**Goal:** Use RAG + LLM to generate contextually accurate questions.

**Flow:**
1. Parse blueprint → create question slots (e.g., 3 × Remember, 4 × Apply...)
2. For each slot:
   - Query ChromaDB for relevant context chunks
   - Build prompt: `"Using the following context: {chunk}, generate a {bloom_level} level, {difficulty} difficulty, {marks}-mark question using the verb '{verb}'"`
   - Call Groq/OpenAI API
   - Parse and store generated question
3. Repeat until all slots are filled

**Key File:** `question_gen.py`

---

### Module 5: Question Validation & Quality Assurance
**Goal:** Ensure questions are unique, relevant, and well-formed.

**Checks:**
- ✅ **Duplicate Detection:** Sentence similarity using `Sentence Transformers` (cosine similarity > 0.85 = duplicate)
- ✅ **Relevance Check:** Question must be grounded in uploaded textbook content
- ✅ **Bloom's Verification:** Confirm question uses correct cognitive level verbs
- ✅ **Marks Validation:** Total marks sum equals configured total
- ✅ **Coverage Check:** All specified topics are represented

**Key File:** `validator.py`

---

### Module 6: Question Paper Assembly & Export
**Goal:** Generate professional question paper in PDF and DOCX.

**Output Format:**
```
[University Name] - [Course Name]
[Exam Type] | Total Marks: 100 | Time: 3 Hours

Section A (2 Marks each)
Q1. Define Deadlock. [Remember] [Easy]
Q2. State Little's Law. [Remember] [Easy]

Section B (5 Marks each)
Q3. Apply Banker's Algorithm for... [Apply] [Medium]
...
```

**Export Options:**
- `ReportLab` → styled PDF with university header
- `python-docx` → editable DOCX

**Key File:** `exporter.py`

---

## 🗂️ Example Output

| Q.No | Marks | Bloom Level | Difficulty | Question |
|------|-------|-------------|------------|----------|
| 1 | 2 | Remember | Easy | Define Deadlock. |
| 2 | 2 | Understand | Easy | Explain the role of semaphores. |
| 3 | 5 | Apply | Medium | Apply Banker's Algorithm for the given scenario. |
| 4 | 5 | Analyze | Medium | Compare paging and segmentation. |
| 5 | 10 | Evaluate | Hard | Evaluate the effectiveness of CPU scheduling algorithms. |
| 6 | 10 | Create | Hard | Design an OS architecture for an IoT device. |

---

## 🚀 Implementation Phases

### Phase 1 — Foundation (Week 1–2)
- [ ] Setup FastAPI backend skeleton
- [ ] Setup React frontend with Tailwind
- [ ] MongoDB connection
- [ ] PDF upload & text extraction working

### Phase 2 — AI Core (Week 3–4)
- [ ] spaCy topic extraction
- [ ] ChromaDB RAG pipeline
- [ ] Bloom's taxonomy mapping logic
- [ ] LLM question generation (Groq API)

### Phase 3 — Blueprint & Generation (Week 5–6)
- [ ] Blueprint configuration UI
- [ ] Question generation from blueprint
- [ ] Validation module (duplicate detection)

### Phase 4 — Export & Polish (Week 7–8)
- [ ] PDF export with ReportLab
- [ ] DOCX export with python-docx
- [ ] Frontend preview & download
- [ ] End-to-end testing

---

## 🔑 Innovation Points (What Makes It Special)

1. **Textbook Understanding** — Doesn't just use a topic list; actually reads and understands the textbook
2. **Bloom's Taxonomy Mapping** — Automatically classifies content to appropriate cognitive levels
3. **Automatic Syllabus Coverage** — Guarantees all topics are represented proportionally
4. **Difficulty Balancing** — Ensures Easy/Medium/Hard distribution is met exactly
5. **Duplicate Detection** — Semantic similarity check prevents repeated questions
6. **Professional Paper Generation** — University-format output with sections and headers

---

## ❓ Open Questions (Please Clarify)

> [!IMPORTANT]
> **Q1: LLM Provider** — Do you have access to an OpenAI API key, or should we use Groq (free tier available)?

> [!IMPORTANT]
> **Q2: Deployment** — Is this purely local/demo, or should it be deployed (Render, Railway, Vercel)?

> [!NOTE]
> **Q3: Authentication** — Should there be a faculty login system, or is a single-user demo sufficient?

> [!NOTE]
> **Q4: Database** — Use MongoDB Atlas (cloud) or local MongoDB? Or even SQLite for simplicity?

---

## ✅ Verification Plan

- Upload an OS textbook PDF and verify topic extraction
- Configure a blueprint (100 marks, 10 questions) and generate paper
- Check that Bloom's distribution matches configured percentages
- Verify no duplicate questions using similarity threshold
- Download and inspect PDF/DOCX output
