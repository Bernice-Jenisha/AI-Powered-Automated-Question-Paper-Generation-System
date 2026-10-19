import React from 'react';
import { GeneratedQuestion } from '../types';
import { BookOpen, X, CheckCircle, Tag, FileText } from 'lucide-react';

interface RagInspectorModalProps {
  question: GeneratedQuestion | null;
  onClose: () => void;
}

export const RagInspectorModal: React.FC<RagInspectorModalProps> = ({
  question,
  onClose,
}) => {
  if (!question) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-2xl w-full p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-slate-800" />
            <h3 className="text-sm font-bold text-slate-900">
              RAG Vector Retrieval Grounding · Q{question.questionNumber}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Header */}
        <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs space-y-1">
          <div className="font-semibold text-slate-900">Generated Examination Question:</div>
          <p className="font-academic text-sm text-slate-800 italic">
            "{question.questionText}"
          </p>
          <div className="flex items-center gap-2 text-slate-500 pt-1">
            <span>Cognitive Level: <strong>{question.bloomsLevel}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Mandatory Verb: <strong>{question.actionVerb}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Allocated Marks: <strong>{question.marks}M</strong></span>
          </div>
        </div>

        {/* Source Citation */}
        <div className="space-y-1 text-xs">
          <div className="font-semibold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Retrieved Curriculum Citation:</span>
          </div>
          <div className="text-slate-800 font-mono text-xs bg-slate-100/70 p-2 rounded border border-slate-200">
            {question.sourceChunkCitation}
          </div>
        </div>

        {/* Context Snippet */}
        <div className="space-y-1 text-xs">
          <div className="font-semibold text-slate-700">
            Grounded Textbook Passage (Vector Chunk):
          </div>
          <div className="p-4 bg-slate-50 rounded-md border border-slate-200 font-academic text-sm text-slate-700 leading-relaxed max-h-48 overflow-y-auto">
            {question.sourceChunkSnippet || 'Referenced directly from core chapter syllabus.'}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
