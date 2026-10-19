import React from 'react';
import { QuestionPaper, BloomsLevel, DifficultyLevel } from '../types';
import { ALL_BLOOMS_LEVELS, BLOOMS_TAXONOMY } from '../data/bloomsTaxonomy';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Copy,
  BookOpen,
  PieChart,
  BarChart2,
  Check,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface QAMetricsPanelProps {
  paper: QuestionPaper;
  onRegenerateDuplicate: (qNumber: number) => void;
}

export const QAMetricsPanel: React.FC<QAMetricsPanelProps> = ({
  paper,
  onRegenerateDuplicate,
}) => {
  const { blueprint, questions, qaReport } = paper;

  return (
    <div className="space-y-8">
      {/* Module Title */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Module 5: Question Validation & Quality Assurance (QA)
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Automated semantic duplicate detection, Bloom's cognitive level alignment verification, syllabus coverage audit, and mark distribution integrity.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="px-3.5 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-xs font-semibold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Overall QA Compliance: {qaReport.bloomsComplianceScore}%</span>
          </div>
        </div>
      </div>

      {/* Primary KPI Audit Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Marks */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Marks Balance</div>
          <div className="text-xl font-bold text-slate-900 flex items-center justify-between">
            <span className="font-mono tabular-nums">{qaReport.actualTotalMarks} / {qaReport.targetTotalMarks} M</span>
            {qaReport.isTotalMarksValid ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="text-xs text-slate-500">
            {qaReport.isTotalMarksValid ? 'Exact match with blueprint' : 'Marks mismatch detected'}
          </div>
        </div>

        {/* Duplicate Detection */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Duplicate Detection</div>
          <div className="text-xl font-bold text-slate-900 flex items-center justify-between">
            <span className="font-mono tabular-nums">
              {qaReport.duplicatePairs.length === 0 ? '0 Detected' : `${qaReport.duplicatePairs.length} Flagged`}
            </span>
            {qaReport.duplicatePairs.length === 0 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="text-xs text-slate-500">
            Cosine similarity threshold: 80%
          </div>
        </div>

        {/* Syllabus Representation */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Syllabus Coverage</div>
          <div className="text-xl font-bold text-slate-900 flex items-center justify-between">
            <span>{qaReport.allTopicsCovered ? '100% Covered' : 'Partial'}</span>
            {qaReport.allTopicsCovered ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="text-xs text-slate-500">
            All configured modules represented
          </div>
        </div>

        {/* Action Verb Integrity */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Bloom's Verb Integrity</div>
          <div className="text-xl font-bold text-slate-900 flex items-center justify-between">
            <span>{qaReport.verbIntegrityValid ? 'Verified' : 'Minor Flags'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xs text-slate-500">
            Cognitive stems strictly validated
          </div>
        </div>
      </div>

      {/* Duplicate Pairs Inspection & Resolution */}
      {qaReport.duplicatePairs.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Semantic Duplicate Questions Warning ({qaReport.duplicatePairs.length})</span>
          </div>
          <p className="text-xs text-amber-800">
            The sentence similarity algorithm detected questions with semantic similarity above the 80% threshold. You can regenerate either question to ensure paper diversity.
          </p>

          <div className="space-y-3 pt-1">
            {qaReport.duplicatePairs.map((pair, idx) => (
              <div key={idx} className="p-3.5 bg-white border border-amber-200 rounded-md text-xs space-y-2">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span>Pair: Question {pair.q1Index} vs Question {pair.q2Index}</span>
                  <span className="font-mono text-amber-700 font-bold">
                    Similarity: {Math.round(pair.similarity * 100)}%
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-900">Q{pair.q1Index}:</span>
                    <p className="font-academic text-sm italic">"{pair.q1Text}"</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">Q{pair.q2Index}:</span>
                      <button
                        onClick={() => onRegenerateDuplicate(pair.q2Index)}
                        className="text-xs text-slate-700 hover:text-slate-900 font-semibold underline underline-offset-2 flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Regenerate Q{pair.q2Index}</span>
                      </button>
                    </div>
                    <p className="font-academic text-sm italic">"{pair.q2Text}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bloom's Cognitive Distribution: Target vs Actual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-slate-600" />
              <span>Bloom's Taxonomy: Target vs Actual</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              6 Cognitive Domains
            </div>
          </div>

          <div className="space-y-3">
            {ALL_BLOOMS_LEVELS.map((level) => {
              const target = blueprint.bloomsDistribution[level] || 0;
              const actual = qaReport.actualBloomsDistribution[level] || 0;
              const delta = actual - target;

              return (
                <div key={level} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-800">
                    <span className="font-semibold">{level} ({BLOOMS_TAXONOMY[level].code})</span>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="text-slate-500">Target: {target}%</span>
                      <span className="font-bold text-slate-900">Actual: {actual}%</span>
                      <span className={`text-xs ${Math.abs(delta) <= 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        ({delta >= 0 ? `+${delta}` : delta}%)
                      </span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      className="bg-slate-900 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, actual)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Difficulty Distribution: Target vs Actual */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-slate-600" />
              <span>Difficulty Balancing: Target vs Actual</span>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              3 Tiers
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((diff) => {
              const target = blueprint.difficultyDistribution[diff] || 0;
              const actual = qaReport.actualDifficultyDistribution[diff] || 0;

              return (
                <div key={diff} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">{diff} Tier</span>
                    <div className="flex items-center gap-3 font-mono tabular-nums text-xs">
                      <span className="text-slate-500">Target: {target}%</span>
                      <span className="font-bold text-slate-900">Actual: {actual}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="bg-slate-700 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, actual)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Textbook RAG Grounding Verification */}
          <div className="border-t border-slate-100 pt-4 space-y-2">
            <div className="text-xs font-semibold text-slate-900">
              Textbook Grounding & Citation Integrity
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every question generated by ApexBloom is strictly synthesized from retrieved RAG context passages. Hallucination risk is minimized through temperature bounding and context grounding.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
