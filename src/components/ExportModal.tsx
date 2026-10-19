import React from 'react';
import { QuestionPaper } from '../types';
import { exportToDocx, exportToPdfDirectly, triggerPrintDialog } from '../utils/exporter';
import { FileDown, Printer, FileText, X, Check, Code, Share2 } from 'lucide-react';

interface ExportModalProps {
  paper: QuestionPaper;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  paper,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(paper, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileDown className="w-4 h-4 text-slate-800" />
            <h3 className="text-sm font-bold text-slate-900">
              Export Examination Question Paper
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Select an academic export format. All exports include the university header, instructions, candidate roll number grid, questions tagged with Bloom's levels, and the instructor marking rubric annexure.
        </p>

        <div className="space-y-3">
          {/* PDF Direct */}
          <button
            onClick={() => {
              exportToPdfDirectly(paper);
              onClose();
            }}
            className="w-full p-3 text-left rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-800" />
                <span>Portable Document Format (.pdf)</span>
              </div>
              <div className="text-xs text-slate-500">
                Print-ready official examination paper formatted for A4 standard.
              </div>
            </div>
            <FileDown className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </button>

          {/* Microsoft Word DOCX */}
          <button
            onClick={() => {
              exportToDocx(paper);
              onClose();
            }}
            className="w-full p-3 text-left rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-800" />
                <span>Microsoft Word (.docx)</span>
              </div>
              <div className="text-xs text-slate-500">
                Fully editable Word document with styled tables and headers.
              </div>
            </div>
            <FileDown className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </button>

          {/* Official Print Layout */}
          <button
            onClick={() => {
              onClose();
              setTimeout(() => triggerPrintDialog(), 200);
            }}
            className="w-full p-3 text-left rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Printer className="w-4 h-4 text-slate-800" />
                <span>Browser System Print Preview</span>
              </div>
              <div className="text-xs text-slate-500">
                Direct print dialog utilizing custom academic typography stylesheet.
              </div>
            </div>
            <Printer className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
          </button>

          {/* JSON Copy */}
          <button
            onClick={handleCopyJson}
            className="w-full p-3 text-left rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between group"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-slate-800" />
                <span>Copy Machine-Readable JSON</span>
              </div>
              <div className="text-xs text-slate-500">
                Complete data schema with blueprint, slots, chunks, and rubric.
              </div>
            </div>
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Share2 className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
            )}
          </button>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
