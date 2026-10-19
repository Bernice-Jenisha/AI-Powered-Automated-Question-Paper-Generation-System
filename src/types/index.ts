export type BloomsLevel = 
  | 'Remember' 
  | 'Understand' 
  | 'Apply' 
  | 'Analyze' 
  | 'Evaluate' 
  | 'Create';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface TextbookChunk {
  id: string;
  chapterId: string;
  chapterTitle: string;
  sectionTitle: string;
  content: string;
  keyConcepts: string[];
  cognitiveAffinity: BloomsLevel[];
}

export interface TextbookChapter {
  id: string;
  number: number;
  title: string;
  summary: string;
  keyConcepts: string[];
  chunks: TextbookChunk[];
}

export interface TextbookKnowledgeBase {
  id: string;
  title: string;
  authorOrEdition: string;
  subject: string;
  description: string;
  totalChapters: number;
  totalChunks: number;
  chapters: TextbookChapter[];
}

export interface SectionConfig {
  id: string;
  name: string; // e.g., "Section A"
  description: string; // e.g., "Short Answer / Conceptual"
  marksPerQuestion: number; // e.g., 2
  questionCount: number; // e.g., 5
  hasInternalChoice?: boolean; // "Either/Or" option
  allowedBloomLevels?: BloomsLevel[];
}

export interface ExamBlueprint {
  institutionName: string;
  departmentName: string;
  courseName: string;
  courseCode: string;
  examType: string; // "End Semester Examination", "Midterm Assessment", etc.
  semester: string;
  academicYear: string;
  durationMinutes: number; // e.g., 180 (3 Hours)
  totalMarks: number; // e.g., 100
  instructions: string[];
  sections: SectionConfig[];
  bloomsDistribution: Record<BloomsLevel, number>; // percentages summing to 100
  difficultyDistribution: Record<DifficultyLevel, number>; // percentages summing to 100
  chapterWeightages: Record<string, number>; // chapterId -> percentage
}

export interface QuestionSlot {
  slotId: string;
  sectionId: string;
  questionNumber: number;
  subNumber?: string; // 'a', 'b', 'OR'
  marks: number;
  bloomsLevel: BloomsLevel;
  actionVerb: string;
  difficulty: DifficultyLevel;
  targetChapterId: string;
}

export interface MarkingCriterion {
  step: string;
  marks: number;
}

export interface GeneratedQuestion {
  id: string;
  slotId: string;
  sectionId: string;
  questionNumber: number;
  subNumber?: string;
  isAlternativeChoice?: boolean; // For "Either / Or" questions
  marks: number;
  bloomsLevel: BloomsLevel;
  actionVerb: string;
  difficulty: DifficultyLevel;
  chapterId: string;
  chapterTitle: string;
  questionText: string;
  sourceChunkCitation: string;
  sourceChunkSnippet: string;
  modelAnswer: string;
  markingRubric: MarkingCriterion[];
  duplicateSimilarityScore?: number;
  hasVerbWarning?: boolean;
}

export interface DuplicatePair {
  q1Index: number;
  q2Index: number;
  q1Text: string;
  q2Text: string;
  similarity: number;
}

export interface QAValidationReport {
  isTotalMarksValid: boolean;
  actualTotalMarks: number;
  targetTotalMarks: number;
  bloomsComplianceScore: number; // 0-100%
  actualBloomsDistribution: Record<BloomsLevel, number>;
  actualDifficultyDistribution: Record<DifficultyLevel, number>;
  duplicatePairs: DuplicatePair[];
  allTopicsCovered: boolean;
  uncoveredChapterIds: string[];
  verbIntegrityValid: boolean;
  warnings: string[];
}

export interface QuestionPaper {
  id: string;
  blueprint: ExamBlueprint;
  createdAt: string;
  textbookTitle: string;
  questions: GeneratedQuestion[];
  qaReport: QAValidationReport;
  engineUsed?: string;
}

