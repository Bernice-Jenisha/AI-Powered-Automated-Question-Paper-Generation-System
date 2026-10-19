import React, { useState, useEffect } from 'react';
import {
  BloomsLevel,
  DifficultyLevel,
  ExamBlueprint,
  GeneratedQuestion,
  QuestionPaper,
  TextbookKnowledgeBase,
} from './types';
import { SAMPLE_TEXTBOOKS } from './data/sampleTextbooks';
import { computeQAReport } from './utils/ragEngine';
import { Navbar } from './components/Navbar';
import { TextbookManager } from './components/TextbookManager';
import { BlueprintConfig } from './components/BlueprintConfig';
import { QuestionPaperView } from './components/QuestionPaperView';
import { QAMetricsPanel } from './components/QAMetricsPanel';
import { RagInspectorModal } from './components/RagInspectorModal';
import { ExportModal } from './components/ExportModal';
import { Sparkles, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentKb, setCurrentKb] = useState<TextbookKnowledgeBase>(SAMPLE_TEXTBOOKS[0]);
  const [currentTab, setCurrentTab] = useState<'textbook' | 'blueprint' | 'paper' | 'qa'>('textbook');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [selectedRagQuestion, setSelectedRagQuestion] = useState<GeneratedQuestion | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Initialize Blueprint with default parameters
  const [blueprint, setBlueprint] = useState<ExamBlueprint>(() => {
    const weights: Record<string, number> = {};
    const defaultWeight = Math.round(100 / SAMPLE_TEXTBOOKS[0].chapters.length);
    SAMPLE_TEXTBOOKS[0].chapters.forEach((c) => {
      weights[c.id] = defaultWeight;
    });

    return {
      institutionName: 'Department of Computer Science & Engineering',
      departmentName: 'School of Information Technology',
      courseName: 'Operating System Principles & Systems Architecture',
      courseCode: 'CS-301',
      examType: 'End Semester Examination',
      semester: 'Autumn Semester 2026',
      academicYear: '2026-2027',
      durationMinutes: 180,
      totalMarks: 100,
      instructions: [
        'Answer all questions strictly in the designated sequence.',
        'Assumptions made must be clearly stated along with architectural diagrams where appropriate.',
        'Programmable calculators and mobile telecommunication devices are strictly prohibited.',
        'Marks for each question and cognitive taxonomy levels are indicated in brackets alongside the question.',
      ],
      sections: [
        {
          id: 'sec-a',
          name: 'Section A',
          description: 'Short Conceptual Answers',
          marksPerQuestion: 2,
          questionCount: 10,
        },
        {
          id: 'sec-b',
          name: 'Section B',
          description: 'Analytical & Algorithmic Applications',
          marksPerQuestion: 10,
          questionCount: 5,
        },
        {
          id: 'sec-c',
          name: 'Section C',
          description: 'System Evaluation & Design Synthesis',
          marksPerQuestion: 15,
          questionCount: 2,
        },
      ],
      bloomsDistribution: {
        Remember: 20,
        Understand: 25,
        Apply: 30,
        Analyze: 15,
        Evaluate: 5,
        Create: 5,
      },
      difficultyDistribution: {
        Easy: 30,
        Medium: 50,
        Hard: 20,
      },
      chapterWeightages: weights,
    };
  });

  // When textbook changes, sync course details and chapter weightages
  const handleSelectKb = (kb: TextbookKnowledgeBase) => {
    setCurrentKb(kb);
    const weights: Record<string, number> = {};
    const defaultWeight = Math.round(100 / Math.max(1, kb.chapters.length));
    kb.chapters.forEach((c) => {
      weights[c.id] = defaultWeight;
    });

    setBlueprint((prev) => ({
      ...prev,
      courseName: kb.title,
      courseCode: kb.id.startsWith('cn') ? 'CS-302' : kb.id.startsWith('ml') ? 'CS-405' : 'CS-301',
      chapterWeightages: weights,
    }));
  };

  // Generate Entire Question Paper
  const handleGeneratePaper = async () => {
    setIsGenerating(true);
    setGenerationStep('Deconstructing Exam Blueprint into Question Slots...');

    try {
      setGenerationStep('Retrieving Grounded Context Chunks from RAG Index...');
      await new Promise((resolve) => setTimeout(resolve, 400));

      setGenerationStep('Synthesizing Cognitive Questions with Bloom Verbs...');

      const response = await fetch('/api/generate-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blueprint,
          knowledgeBase: currentKb,
        }),
      });

      if (!response.ok) {
        throw new Error(`Generation failed with HTTP ${response.status}`);
      }

      setGenerationStep('Executing Semantic Duplicate Detection & QA Audit...');
      const data = await response.json();
      const generatedQs: GeneratedQuestion[] = data.questions || [];

      // Compute QA validation report
      const allChapterIds = currentKb.chapters.map((c) => c.id);
      const qaReport = computeQAReport(
        generatedQs,
        blueprint.totalMarks,
        blueprint.bloomsDistribution,
        blueprint.difficultyDistribution,
        allChapterIds
      );

      const newPaper: QuestionPaper = {
        id: `paper-${Date.now()}`,
        blueprint,
        createdAt: new Date().toISOString(),
        textbookTitle: currentKb.title,
        questions: generatedQs,
        qaReport,
        engineUsed: data.usedAi ? 'Gemini 3.8 Flash' : 'Local RAG Knowledge Engine (Active)',
      };

      setPaper(newPaper);
      setCurrentTab('paper');
    } catch (err: any) {
      console.error('Paper generation failed:', err);
      alert(`Generation failed: ${err.message || 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  // Regenerate a single question
  const handleRegenerateQuestion = async (q: GeneratedQuestion) => {
    if (!paper) return;

    try {
      // Find chunk
      const ch = currentKb.chapters.find((c) => c.id === q.chapterId) || currentKb.chapters[0];
      const chunk =
        ch?.chunks.find((ck) => ck.cognitiveAffinity.includes(q.bloomsLevel)) ||
        ch?.chunks[0];

      const response = await fetch('/api/regenerate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot: q,
          chunk,
          courseName: blueprint.courseName,
        }),
      });

      if (!response.ok) throw new Error('Regeneration call failed');

      const data = await response.json();
      const updatedQ: GeneratedQuestion = {
        ...q,
        actionVerb: data.question.actionVerb || q.actionVerb,
        questionText: data.question.questionText,
        modelAnswer: data.question.modelAnswer,
        markingRubric: data.question.markingRubric || q.markingRubric,
      };

      const updatedQuestions = paper.questions.map((oldQ) =>
        oldQ.id === q.id ? updatedQ : oldQ
      );

      const allChapterIds = currentKb.chapters.map((c) => c.id);
      const newQaReport = computeQAReport(
        updatedQuestions,
        blueprint.totalMarks,
        blueprint.bloomsDistribution,
        blueprint.difficultyDistribution,
        allChapterIds
      );

      setPaper({
        ...paper,
        questions: updatedQuestions,
        qaReport: newQaReport,
      });
    } catch (err) {
      console.error('Failed to regenerate single question:', err);
    }
  };

  // Handle manual question updates
  const handleUpdateQuestion = (updatedQ: GeneratedQuestion) => {
    if (!paper) return;
    const updatedQuestions = paper.questions.map((q) =>
      q.id === updatedQ.id ? updatedQ : q
    );
    const allChapterIds = currentKb.chapters.map((c) => c.id);
    const newQaReport = computeQAReport(
      updatedQuestions,
      blueprint.totalMarks,
      blueprint.bloomsDistribution,
      blueprint.difficultyDistribution,
      allChapterIds
    );

    setPaper({
      ...paper,
      questions: updatedQuestions,
      qaReport: newQaReport,
    });
  };

  // Handle duplicate regeneration from QA panel
  const handleRegenerateDuplicate = async (qNumber: number) => {
    if (!paper) return;
    const targetQ = paper.questions.find((q) => q.questionNumber === qNumber);
    if (targetQ) {
      await handleRegenerateQuestion(targetQ);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Strict Top Bar Contract Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onGenerateClick={handleGeneratePaper}
        onExportClick={() => setIsExportModalOpen(true)}
        hasGeneratedPaper={!!paper}
        isGenerating={isGenerating}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Step Indicator Header (Editorial / Clean) */}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <span>Corpus: <strong className="text-slate-800">{currentKb.title}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Target: <strong className="text-slate-800">{blueprint.totalMarks} Marks ({blueprint.durationMinutes / 60}h)</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <span className={currentTab === 'textbook' ? 'font-bold text-slate-900' : 'text-slate-500'}>
              1. Content
            </span>
            <span aria-hidden="true">→</span>
            <span className={currentTab === 'blueprint' ? 'font-bold text-slate-900' : 'text-slate-500'}>
              2. Blueprint
            </span>
            <span aria-hidden="true">→</span>
            <span className={currentTab === 'paper' ? 'font-bold text-slate-900' : 'text-slate-500'}>
              3. Generation
            </span>
            <span aria-hidden="true">→</span>
            <span className={currentTab === 'qa' ? 'font-bold text-slate-900' : 'text-slate-500'}>
              4. QA Audit
            </span>
          </div>
        </div>

        {/* Tab 1: Textbook & RAG Corpus */}
        {currentTab === 'textbook' && (
          <TextbookManager
            currentKb={currentKb}
            onSelectKb={handleSelectKb}
            onProceedToBlueprint={() => setCurrentTab('blueprint')}
          />
        )}

        {/* Tab 2: Blueprint Configuration */}
        {currentTab === 'blueprint' && (
          <BlueprintConfig
            blueprint={blueprint}
            knowledgeBase={currentKb}
            onChangeBlueprint={setBlueprint}
            onGeneratePaper={handleGeneratePaper}
            isGenerating={isGenerating}
          />
        )}

        {/* Tab 3: Generated Question Paper View */}
        {currentTab === 'paper' && paper && (
          <QuestionPaperView
            paper={paper}
            onRegenerateQuestion={handleRegenerateQuestion}
            onUpdateQuestion={handleUpdateQuestion}
            onOpenRagModal={(q) => setSelectedRagQuestion(q)}
            onOpenQaTab={() => setCurrentTab('qa')}
          />
        )}

        {/* Tab 4: QA Validation & Metrics Panel */}
        {currentTab === 'qa' && paper && (
          <QAMetricsPanel
            paper={paper}
            onRegenerateDuplicate={handleRegenerateDuplicate}
          />
        )}

        {/* Empty state if user clicks paper before generation */}
        {(currentTab === 'paper' || currentTab === 'qa') && !paper && (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-700">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              No Question Paper Generated Yet
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Review your syllabus corpus and blueprint configuration, then trigger the AI generation engine to synthesize questions grounded in Bloom's Taxonomy.
            </p>
            <button
              onClick={handleGeneratePaper}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Balanced Question Paper'}</span>
            </button>
          </div>
        )}
      </main>

      {/* RAG Context Inspector Modal */}
      <RagInspectorModal
        question={selectedRagQuestion}
        onClose={() => setSelectedRagQuestion(null)}
      />

      {/* Export Options Modal */}
      {paper && (
        <ExportModal
          paper={paper}
          isOpen={isExportModalOpen}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xl p-6 max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Synthesizing Question Paper
              </h3>
              <p className="mt-1 text-xs text-slate-600 font-mono">
                {generationStep || 'Processing...'}
              </p>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-slate-900 h-full w-2/3 animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            ApexBloom · AI-Powered Automated Question Paper Generation System
          </div>
          <div className="flex items-center gap-3">
            <span>Bloom's Revised Taxonomy</span>
            <span aria-hidden="true">·</span>
            <span>RAG Grounding</span>
            <span aria-hidden="true">·</span>
            <span>Semantic Duplicate Detection</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
