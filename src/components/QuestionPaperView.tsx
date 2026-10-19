import React, { useState } from 'react';
import { QuestionPaper, GeneratedQuestion } from '../types';
import { exportToDocx, exportToPdfDirectly, triggerPrintDialog } from '../utils/exporter';
import {
  FileDown,
  Printer,
  Sparkles,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Share2
} from 'lucide-react';

interface QuestionPaperViewProps {
  paper: QuestionPaper;
  onRegenerateQuestion: (question: GeneratedQuestion) => Promise<void>;
  onUpdateQuestion: (updatedQuestion: GeneratedQuestion) => void;
  onOpenRagModal: (question: GeneratedQuestion) => void;
  onOpenQaTab: () => void;
}

export const QuestionPaperView: React.FC<QuestionPaperViewProps> = ({
  paper,
  onRegenerateQuestion,
  onUpdateQuestion,
  onOpenRagModal,
  onOpenQaTab,
}) => {
  const { blueprint, questions, qaReport } = paper;
  const [showSolutions, setShowSolutions] = useState(false);
  const [regeneratingId, setRegeneratingId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<GeneratedQuestion | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Group questions by section
  const sectionsMap = new Map<string, GeneratedQuestion[]>();
  questions.forEach((q) => {
    const list = sectionsMap.get(q.sectionId) || [];
    list.push(q);
    sectionsMap.set(q.sectionId, list);
  });

  const handleRegenerate = async (q: GeneratedQuestion) => {
    setRegeneratingId(q.id);
    try {
      await onRegenerateQuestion(q);
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleSaveEdit = () => {
    if (editingQuestion) {
      onUpdateQuestion(editingQuestion);
      setEditingQuestion(null);
    }
  };

  const handleCopyPaperText = () => {
    let text = `${blueprint.institutionName}\n${blueprint.departmentName} - ${blueprint.examType}\n`;
    text += `Course: ${blueprint.courseName} (${blueprint.courseCode}) | Marks: ${blueprint.totalMarks} | Time: ${blueprint.durationMinutes} mins\n\n`;
    text += `INSTRUCTIONS:\n${blueprint.instructions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}\n\n`;

    blueprint.sections.forEach((sec) => {
      text += `--- ${sec.name.toUpperCase()} (${sec.marksPerQuestion} Marks Each) ---\n`;
      const secQs = sectionsMap.get(sec.id) || [];
      secQs.forEach((q) => {
        text += `Q${q.questionNumber}. ${q.questionText} [${q.bloomsLevel}] [${q.marks}M]\n`;
      });
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="no-print bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => exportToPdfDirectly(paper)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            <FileDown className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
          <button
            onClick={() => exportToDocx(paper)}
            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <FileDown className="w-4 h-4" />
            <span>Export DOCX</span>
          </button>
          <button
            onClick={triggerPrintDialog}
            className="p-2 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Print Official Paper"
          >
            <Printer className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyPaperText}
            className="p-2 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Copy Plain Text"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {copiedLink && <span className="text-xs text-emerald-700 font-medium">Copied!</span>}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowSolutions(!showSolutions)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>{showSolutions ? 'Hide Instructor Rubric' : 'Show Instructor Rubric'}</span>
          </button>

          <button
            onClick={onOpenQaTab}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            {qaReport.warnings.length === 0 ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>QA Passed (100% Valid)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700">
                <AlertTriangle className="w-4 h-4" />
                <span>{qaReport.warnings.length} QA Notice(s)</span>
              </span>
            )}
          </button>

          {paper.engineUsed && (
            <span className="text-xs text-slate-500 font-mono hidden lg:inline">
              · {paper.engineUsed}
            </span>
          )}
        </div>
      </div>

      {/* Official University Paper Presentation Layout */}
      <div className="printable-paper bg-white border border-slate-300 rounded-lg shadow-sm p-8 sm:p-12 max-w-4xl mx-auto space-y-6">
        {/* University Header */}
        <div className="text-center space-y-1.5 border-b-2 border-slate-900 pb-5">
          <div className="text-xl sm:text-2xl font-bold font-academic tracking-wide uppercase text-slate-900">
            {blueprint.institutionName}
          </div>
          <div className="text-sm sm:text-base font-semibold font-academic text-slate-800">
            {blueprint.departmentName} · {blueprint.examType}
          </div>
          <div className="text-xs sm:text-sm italic font-academic text-slate-600">
            Course: {blueprint.courseName} ({blueprint.courseCode}) · Semester: {blueprint.semester} · Academic Year: {blueprint.academicYear}
          </div>
        </div>

        {/* Paper Time, Marks & Roll No Grid */}
        <div className="grid grid-cols-2 text-xs sm:text-sm font-academic py-2 border-b border-slate-300 gap-2">
          <div>
            <span className="font-bold">Time Allowed:</span> {blueprint.durationMinutes / 60} Hours ({blueprint.durationMinutes} Minutes)
          </div>
          <div className="text-right">
            <span className="font-bold">Maximum Marks:</span> {blueprint.totalMarks} Marks
          </div>
          <div className="col-span-2 pt-2">
            <div className="flex items-center gap-3">
              <span className="font-bold whitespace-nowrap">Candidate Roll / Reg No:</span>
              <div className="flex-1 flex gap-1 font-mono">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="w-6 h-6 border border-slate-400 rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-xs font-academic text-slate-700 space-y-1 bg-slate-50 p-3 rounded border border-slate-200">
          <div className="font-bold text-slate-900 uppercase">Instructions to Candidates:</div>
          <ol className="list-decimal list-inside space-y-0.5">
            {blueprint.instructions.map((inst, idx) => (
              <li key={idx}>{inst}</li>
            ))}
          </ol>
        </div>

        {/* Sections and Questions */}
        <div className="space-y-8 pt-4">
          {blueprint.sections.map((sec) => {
            const secQuestions = sectionsMap.get(sec.id) || [];
            return (
              <div key={sec.id} className="space-y-4">
                <div className="text-center border-b border-slate-300 pb-2">
                  <h2 className="text-sm sm:text-base font-bold font-academic uppercase text-slate-900 tracking-wider">
                    {sec.name} ({sec.marksPerQuestion} Marks Each)
                  </h2>
                  <div className="text-xs italic font-academic text-slate-600">
                    {sec.description} · Answer all questions in this section [Subtotal: {sec.marksPerQuestion * secQuestions.length} Marks]
                  </div>
                </div>

                <div className="space-y-5">
                  {secQuestions.map((q) => {
                    const isRegen = regeneratingId === q.id;
                    return (
                      <div
                        key={q.id}
                        className="group relative p-3 sm:p-4 rounded-lg hover:bg-slate-50/60 transition-colors border border-transparent hover:border-slate-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-baseline gap-2">
                              <span className="font-bold text-sm sm:text-base font-academic text-slate-900 shrink-0">
                                Q{q.questionNumber}.
                              </span>
                              <p className="text-sm sm:text-base font-academic text-slate-900 leading-relaxed">
                                {q.questionText}
                              </p>
                            </div>

                            {/* Metadata Line */}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-sans pt-1">
                              <span className="font-semibold text-slate-700">[{q.marks} Marks]</span>
                              <span aria-hidden="true">·</span>
                              <span className="font-medium text-slate-800">Bloom: {q.bloomsLevel}</span>
                              <span aria-hidden="true">·</span>
                              <span>Verb: <strong className="text-slate-800">{q.actionVerb}</strong></span>
                              <span aria-hidden="true">·</span>
                              <span>Difficulty: {q.difficulty}</span>
                              <span aria-hidden="true">·</span>
                              <button
                                onClick={() => onOpenRagModal(q)}
                                className="text-slate-600 hover:text-slate-900 underline underline-offset-2 flex items-center gap-1"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>RAG Source</span>
                              </button>
                            </div>

                            {/* Collapsible Model Answer & Marking Rubric */}
                            {showSolutions && (
                              <div className="mt-3 p-3.5 bg-slate-100/80 rounded-md border border-slate-200 text-xs font-sans space-y-2">
                                <div className="font-semibold text-slate-900 flex items-center justify-between">
                                  <span>Model Answer & Instructor Evaluation Guide:</span>
                                  <span className="text-slate-500 font-normal">Max Marks: {q.marks}M</span>
                                </div>
                                <p className="text-slate-700 italic font-academic text-sm leading-relaxed">
                                  "{q.modelAnswer}"
                                </p>
                                {q.markingRubric && q.markingRubric.length > 0 && (
                                  <div className="pt-2 border-t border-slate-200/60">
                                    <div className="font-medium text-slate-800 mb-1">Marking Scheme Breakdown:</div>
                                    <div className="space-y-1">
                                      {q.markingRubric.map((crit, cidx) => (
                                        <div key={cidx} className="flex justify-between text-slate-600">
                                          <span>• {crit.step}</span>
                                          <span className="font-mono font-medium text-slate-800">
                                            {crit.marks} Mark{crit.marks > 1 ? 's' : ''}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Hover / Quick Action Controls */}
                          <div className="no-print flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleRegenerate(q)}
                              disabled={isRegen}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded border border-slate-200 transition-colors"
                              title="Regenerate question via AI with alternate cognitive verb"
                            >
                              <Sparkles className={`w-3.5 h-3.5 ${isRegen ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                              onClick={() => setEditingQuestion(q)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-white rounded border border-slate-200 transition-colors"
                              title="Edit question text manually"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Paper End Mark */}
        <div className="text-center text-xs font-academic font-bold text-slate-500 pt-8 border-t border-slate-200">
          *** END OF QUESTION PAPER ***
        </div>
      </div>

      {/* Manual Edit Question Modal */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Edit Question {editingQuestion.questionNumber}
              </h3>
              <button
                onClick={() => setEditingQuestion(null)}
                className="text-xs text-slate-400 hover:text-slate-700"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Question Text
                </label>
                <textarea
                  value={editingQuestion.questionText}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, questionText: e.target.value })
                  }
                  rows={4}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-academic text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Action Verb
                  </label>
                  <input
                    type="text"
                    value={editingQuestion.actionVerb}
                    onChange={(e) =>
                      setEditingQuestion({ ...editingQuestion, actionVerb: e.target.value })
                    }
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Marks
                  </label>
                  <input
                    type="number"
                    value={editingQuestion.marks}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        marks: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full px-2 py-1.5 border border-slate-200 rounded-md tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Model Instructor Solution
                </label>
                <textarea
                  value={editingQuestion.modelAnswer}
                  onChange={(e) =>
                    setEditingQuestion({ ...editingQuestion, modelAnswer: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md font-academic text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setEditingQuestion(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
