import { BloomsLevel, DifficultyLevel, GeneratedQuestion, QAValidationReport, DuplicatePair, TextbookChunk, TextbookKnowledgeBase } from '../types';
import { BLOOMS_TAXONOMY } from '../data/bloomsTaxonomy';

// Simple TF-IDF / Token overlap vectorizer for fast in-browser RAG and duplicate detection
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

// Stopwords list for academic text
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'that', 'this', 'from', 'which', 'are', 'was',
  'were', 'been', 'have', 'has', 'had', 'what', 'when', 'where', 'how', 'why',
  'who', 'each', 'such', 'into', 'than', 'over', 'more', 'some', 'also', 'their'
]);

export function cleanTokens(text: string): string[] {
  return tokenize(text).filter((w) => !STOPWORDS.has(w));
}

// Calculate Cosine Similarity between two text strings using term frequencies
export function calculateTextSimilarity(text1: string, text2: string): number {
  const tokens1 = cleanTokens(text1);
  const tokens2 = cleanTokens(text2);

  if (tokens1.length === 0 || tokens2.length === 0) return 0;

  const freq1: Record<string, number> = {};
  const freq2: Record<string, number> = {};
  const allWords = new Set<string>();

  tokens1.forEach((w) => {
    freq1[w] = (freq1[w] || 0) + 1;
    allWords.add(w);
  });
  tokens2.forEach((w) => {
    freq2[w] = (freq2[w] || 0) + 1;
    allWords.add(w);
  });

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  allWords.forEach((w) => {
    const v1 = freq1[w] || 0;
    const v2 = freq2[w] || 0;
    dotProduct += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  });

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

// RAG Retriever: Finds top relevant chunks from a knowledge base
export function retrieveRelevantChunks(
  kb: TextbookKnowledgeBase,
  chapterId?: string,
  bloomsLevel?: BloomsLevel,
  queryConcepts: string[] = [],
  topK = 2
): TextbookChunk[] {
  let candidateChunks: TextbookChunk[] = [];

  if (chapterId) {
    const chapter = kb.chapters.find((c) => c.id === chapterId);
    if (chapter) {
      candidateChunks = [...chapter.chunks];
    }
  }

  if (candidateChunks.length === 0) {
    // fallback across all chapters
    candidateChunks = kb.chapters.flatMap((c) => c.chunks);
  }

  // Score candidates
  const scored = candidateChunks.map((chunk) => {
    let score = 0;

    // Cognitive affinity match
    if (bloomsLevel && chunk.cognitiveAffinity.includes(bloomsLevel)) {
      score += 3.0;
    }

    // Concept matches
    if (queryConcepts.length > 0) {
      for (const qc of queryConcepts) {
        const lowerQc = qc.toLowerCase();
        if (chunk.keyConcepts.some((c) => c.toLowerCase().includes(lowerQc))) {
          score += 4.0;
        }
        if (chunk.content.toLowerCase().includes(lowerQc)) {
          score += 2.0;
        }
      }
    }

    // Default weight
    score += Math.random() * 0.5;

    return { chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK).map((s) => s.chunk);
}

// Check for duplicates across questions (Module 5)
export function runDuplicateDetection(questions: GeneratedQuestion[], threshold = 0.80): DuplicatePair[] {
  const duplicates: DuplicatePair[] = [];

  for (let i = 0; i < questions.length; i++) {
    for (let j = i + 1; j < questions.length; j++) {
      const q1 = questions[i];
      const q2 = questions[j];
      const similarity = calculateTextSimilarity(q1.questionText, q2.questionText);

      if (similarity >= threshold) {
        duplicates.push({
          q1Index: i + 1,
          q2Index: j + 1,
          q1Text: q1.questionText,
          q2Text: q2.questionText,
          similarity: Math.round(similarity * 100) / 100
        });
      }
    }
  }

  return duplicates;
}

// Validate Bloom's Action Verb conformity
export function verifyBloomsActionVerb(questionText: string, level: BloomsLevel): { isValid: boolean; matchedVerb?: string } {
  const definition = BLOOMS_TAXONOMY[level];
  const lowerText = questionText.toLowerCase();

  // Find if any action verb from this level is in the question
  for (const verb of definition.actionVerbs) {
    const regex = new RegExp(`\\b${verb.toLowerCase()}\\b`, 'i');
    if (regex.test(lowerText)) {
      return { isValid: true, matchedVerb: verb };
    }
  }

  return { isValid: false };
}

// Compute comprehensive QA Validation Report
export function computeQAReport(
  questions: GeneratedQuestion[],
  targetTotalMarks: number,
  targetBlooms: Record<BloomsLevel, number>,
  targetDifficulty: Record<DifficultyLevel, number>,
  allChapterIds: string[]
): QAValidationReport {
  const actualTotalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const isTotalMarksValid = actualTotalMarks === targetTotalMarks;

  // Blooms distribution
  const bloomsCounts: Record<BloomsLevel, number> = {
    Remember: 0,
    Understand: 0,
    Apply: 0,
    Analyze: 0,
    Evaluate: 0,
    Create: 0
  };

  const diffCounts: Record<DifficultyLevel, number> = {
    Easy: 0,
    Medium: 0,
    Hard: 0
  };

  const coveredChapters = new Set<string>();
  let verbViolations = 0;

  questions.forEach((q) => {
    bloomsCounts[q.bloomsLevel] = (bloomsCounts[q.bloomsLevel] || 0) + 1;
    diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1;
    coveredChapters.add(q.chapterId);

    const verbCheck = verifyBloomsActionVerb(q.questionText, q.bloomsLevel);
    if (!verbCheck.isValid) {
      verbViolations++;
    }
  });

  const totalQ = Math.max(1, questions.length);
  const actualBloomsDistribution: Record<BloomsLevel, number> = {
    Remember: Math.round((bloomsCounts.Remember / totalQ) * 100),
    Understand: Math.round((bloomsCounts.Understand / totalQ) * 100),
    Apply: Math.round((bloomsCounts.Apply / totalQ) * 100),
    Analyze: Math.round((bloomsCounts.Analyze / totalQ) * 100),
    Evaluate: Math.round((bloomsCounts.Evaluate / totalQ) * 100),
    Create: Math.round((bloomsCounts.Create / totalQ) * 100)
  };

  const actualDifficultyDistribution: Record<DifficultyLevel, number> = {
    Easy: Math.round((diffCounts.Easy / totalQ) * 100),
    Medium: Math.round((diffCounts.Medium / totalQ) * 100),
    Hard: Math.round((diffCounts.Hard / totalQ) * 100)
  };

  // Bloom's compliance metric: sum of absolute differences
  let totalDelta = 0;
  for (const level of Object.keys(targetBlooms) as BloomsLevel[]) {
    totalDelta += Math.abs((targetBlooms[level] || 0) - (actualBloomsDistribution[level] || 0));
  }
  // Max possible delta is 200, so compliance score ranges from 0 to 100%
  const bloomsComplianceScore = Math.max(0, Math.round(100 - (totalDelta / 2)));

  const uncoveredChapterIds = allChapterIds.filter((id) => !coveredChapters.has(id));
  const allTopicsCovered = uncoveredChapterIds.length === 0;

  const duplicatePairs = runDuplicateDetection(questions);

  const warnings: string[] = [];
  if (!isTotalMarksValid) {
    warnings.push(`Marks mismatch: Configured ${targetTotalMarks} marks, generated paper totals ${actualTotalMarks} marks.`);
  }
  if (duplicatePairs.length > 0) {
    warnings.push(`${duplicatePairs.length} potential duplicate questions detected with >80% semantic similarity.`);
  }
  if (!allTopicsCovered && uncoveredChapterIds.length > 0) {
    warnings.push(`${uncoveredChapterIds.length} syllabus chapter(s) lack representation in the generated paper.`);
  }
  if (verbViolations > 0) {
    warnings.push(`${verbViolations} question(s) may need realignment with their assigned Bloom's cognitive action verbs.`);
  }

  return {
    isTotalMarksValid,
    actualTotalMarks,
    targetTotalMarks,
    bloomsComplianceScore,
    actualBloomsDistribution,
    actualDifficultyDistribution,
    duplicatePairs,
    allTopicsCovered,
    uncoveredChapterIds,
    verbIntegrityValid: verbViolations === 0,
    warnings
  };
}

// Text Chunking for Custom Uploaded Text or PDF
export function chunkUploadedText(
  rawText: string,
  bookTitle: string
): TextbookKnowledgeBase {
  // Split into chapters by looking for Chapter / Section keywords or double newlines
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  
  const chaptersData: { title: string; paragraphs: string[] }[] = [];
  let currentTitle = 'Chapter 1: Foundations & Core Concepts';
  let currentParagraphs: string[] = [];

  const chapterRegex = /^(chapter\s+\d+|unit\s+\d+|section\s+\d+|module\s+\d+)/i;

  for (const line of lines) {
    if (chapterRegex.test(line) && line.length < 80) {
      if (currentParagraphs.length > 0) {
        chaptersData.push({ title: currentTitle, paragraphs: currentParagraphs });
        currentParagraphs = [];
      }
      currentTitle = line;
    } else {
      currentParagraphs.push(line);
    }
  }

  if (currentParagraphs.length > 0) {
    chaptersData.push({ title: currentTitle, paragraphs: currentParagraphs });
  }

  if (chaptersData.length === 0) {
    // If no chapter headers, chunk into groups of 3 paragraphs
    const groups: string[][] = [];
    for (let i = 0; i < lines.length; i += 4) {
      groups.push(lines.slice(i, i + 4));
    }
    groups.forEach((g, idx) => {
      chaptersData.push({
        title: `Module ${idx + 1}: Content Section`,
        paragraphs: g
      });
    });
  }

  const allLevels: BloomsLevel[] = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

  const chapters = chaptersData.map((cd, chIdx) => {
    const chId = `custom-ch-${chIdx + 1}`;
    const fullText = cd.paragraphs.join(' ');
    
    // Extract key concepts (capitalized terms or common tech terms)
    const tokens = tokenize(fullText);
    const wordFreq: Record<string, number> = {};
    tokens.forEach((t) => {
      if (!STOPWORDS.has(t) && t.length > 3) {
        wordFreq[t] = (wordFreq[t] || 0) + 1;
      }
    });

    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

    // Chunk into ~150-word chunks
    const chunks: TextbookChunk[] = [];
    const paragraphText = cd.paragraphs.join('\n\n');
    const sections = paragraphText.split(/\n\n+/).filter((p) => p.length > 50);

    const safeSections = sections.length > 0 ? sections : [fullText.slice(0, 1000)];

    safeSections.forEach((sec, sIdx) => {
      const assignedLevel = allLevels[(chIdx + sIdx) % allLevels.length];
      chunks.push({
        id: `${chId}-chunk-${sIdx + 1}`,
        chapterId: chId,
        chapterTitle: cd.title,
        sectionTitle: `Section ${chIdx + 1}.${sIdx + 1}: Key Principles`,
        content: sec.slice(0, 800),
        keyConcepts: sortedWords.slice(sIdx % 3, (sIdx % 3) + 3),
        cognitiveAffinity: [assignedLevel, allLevels[(chIdx + sIdx + 1) % allLevels.length]]
      });
    });

    return {
      id: chId,
      number: chIdx + 1,
      title: cd.title,
      summary: cd.paragraphs[0]?.slice(0, 160) || 'Core principles and applications.',
      keyConcepts: sortedWords,
      chunks
    };
  });

  return {
    id: `custom-kb-${Date.now()}`,
    title: bookTitle || 'Uploaded Textbook Knowledge Base',
    authorOrEdition: 'Faculty Upload / Extracted Knowledge Base',
    subject: 'Academic Assessment Corpus',
    description: `Auto-extracted knowledge corpus containing ${chapters.length} chapters and ${chapters.reduce((acc, c) => acc + c.chunks.length, 0)} indexed RAG chunks.`,
    totalChapters: chapters.length,
    totalChunks: chapters.reduce((acc, c) => acc + c.chunks.length, 0),
    chapters
  };
}
