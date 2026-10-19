import React, { useState } from 'react';
import { ExamBlueprint, SectionConfig, BloomsLevel, DifficultyLevel, TextbookKnowledgeBase } from '../types';
import { BLOOMS_TAXONOMY, ALL_BLOOMS_LEVELS } from '../data/bloomsTaxonomy';
import { Settings2, Plus, Trash2, Sparkles, BookOpen, Sliders, CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface BlueprintConfigProps {
  blueprint: ExamBlueprint;
  knowledgeBase: TextbookKnowledgeBase;
  onChangeBlueprint: (bp: ExamBlueprint) => void;
  onGeneratePaper: () => void;
  isGenerating: boolean;
}

export const BlueprintConfig: React.FC<BlueprintConfigProps> = ({
  blueprint,
  knowledgeBase,
  onChangeBlueprint,
  onGeneratePaper,
  isGenerating,
}) => {
  const [activeVerbInfoLevel, setActiveVerbInfoLevel] = useState<BloomsLevel | null>(null);

  // Calculate total marks from sections
  const calculatedTotalMarks = blueprint.sections.reduce(
    (sum, sec) => sum + sec.marksPerQuestion * sec.questionCount,
    0
  );

  // Bloom distribution sum
  const bloomsSum = (Object.values(blueprint.bloomsDistribution) as number[]).reduce(
    (sum: number, val: number) => sum + val,
    0
  );

  // Difficulty distribution sum
  const diffSum = (Object.values(blueprint.difficultyDistribution) as number[]).reduce(
    (sum: number, val: number) => sum + val,
    0
  );

  // Chapter weightage sum
  const chapterWeightageSum = (Object.values(blueprint.chapterWeightages) as number[]).reduce(
    (sum: number, val: number) => sum + val,
    0
  );

  const handleUpdateField = <K extends keyof ExamBlueprint>(key: K, value: ExamBlueprint[K]) => {
    onChangeBlueprint({
      ...blueprint,
      [key]: value,
    });
  };

  const handleUpdateSection = (idx: number, updated: Partial<SectionConfig>) => {
    const newSections = [...blueprint.sections];
    newSections[idx] = { ...newSections[idx], ...updated };
    const newTotal = newSections.reduce((acc, s) => acc + s.marksPerQuestion * s.questionCount, 0);
    onChangeBlueprint({
      ...blueprint,
      sections: newSections,
      totalMarks: newTotal,
    });
  };

  const handleAddSection = () => {
    const nextChar = String.fromCharCode(65 + blueprint.sections.length); // A, B, C, D...
    const newSec: SectionConfig = {
      id: `sec-${Date.now()}`,
      name: `Section ${nextChar}`,
      description: 'Comprehensive / Problem Solving',
      marksPerQuestion: 10,
      questionCount: 2,
    };
    const newSections = [...blueprint.sections, newSec];
    const newTotal = newSections.reduce((acc, s) => acc + s.marksPerQuestion * s.questionCount, 0);
    onChangeBlueprint({
      ...blueprint,
      sections: newSections,
      totalMarks: newTotal,
    });
  };

  const handleRemoveSection = (idx: number) => {
    if (blueprint.sections.length <= 1) return;
    const newSections = blueprint.sections.filter((_, i) => i !== idx);
    const newTotal = newSections.reduce((acc, s) => acc + s.marksPerQuestion * s.questionCount, 0);
    onChangeBlueprint({
      ...blueprint,
      sections: newSections,
      totalMarks: newTotal,
    });
  };

  const handleBloomsChange = (level: BloomsLevel, val: number) => {
    onChangeBlueprint({
      ...blueprint,
      bloomsDistribution: {
        ...blueprint.bloomsDistribution,
        [level]: val,
      },
    });
  };

  const handleDifficultyChange = (diff: DifficultyLevel, val: number) => {
    onChangeBlueprint({
      ...blueprint,
      difficultyDistribution: {
        ...blueprint.difficultyDistribution,
        [diff]: val,
      },
    });
  };

  const handleChapterWeightChange = (chapterId: string, val: number) => {
    onChangeBlueprint({
      ...blueprint,
      chapterWeightages: {
        ...blueprint.chapterWeightages,
        [chapterId]: val,
      },
    });
  };

  // Preset Blueprint configurations
  const applyPreset = (presetName: string) => {
    if (presetName === 'university-100') {
      const defaultWeight = Math.round(100 / Math.max(1, knowledgeBase.chapters.length));
      const weights: Record<string, number> = {};
      knowledgeBase.chapters.forEach((c) => {
        weights[c.id] = defaultWeight;
      });

      onChangeBlueprint({
        ...blueprint,
        durationMinutes: 180,
        totalMarks: 100,
        sections: [
          { id: 'sec-a', name: 'Section A', description: 'Short Conceptual Answers', marksPerQuestion: 2, questionCount: 10 },
          { id: 'sec-b', name: 'Section B', description: 'Analytical & Application Problems', marksPerQuestion: 5, questionCount: 6 },
          { id: 'sec-c', name: 'Section C', description: 'Comprehensive Design & Evaluation', marksPerQuestion: 10, questionCount: 5 },
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
      });
    } else if (presetName === 'hots-60') {
      const defaultWeight = Math.round(100 / Math.max(1, knowledgeBase.chapters.length));
      const weights: Record<string, number> = {};
      knowledgeBase.chapters.forEach((c) => {
        weights[c.id] = defaultWeight;
      });

      onChangeBlueprint({
        ...blueprint,
        durationMinutes: 120,
        totalMarks: 60,
        sections: [
          { id: 'sec-a', name: 'Section A', description: 'Higher-Order Application Problems', marksPerQuestion: 6, questionCount: 5 },
          { id: 'sec-b', name: 'Section B', description: 'System Design & Architectural Synthesis', marksPerQuestion: 15, questionCount: 2 },
        ],
        bloomsDistribution: {
          Remember: 5,
          Understand: 15,
          Apply: 35,
          Analyze: 25,
          Evaluate: 10,
          Create: 10,
        },
        difficultyDistribution: {
          Easy: 15,
          Medium: 55,
          Hard: 30,
        },
        chapterWeightages: weights,
      });
    } else if (presetName === 'midterm-50') {
      const defaultWeight = Math.round(100 / Math.max(1, knowledgeBase.chapters.length));
      const weights: Record<string, number> = {};
      knowledgeBase.chapters.forEach((c) => {
        weights[c.id] = defaultWeight;
      });

      onChangeBlueprint({
        ...blueprint,
        durationMinutes: 90,
        totalMarks: 50,
        sections: [
          { id: 'sec-a', name: 'Section A', description: 'Definition & Core Recall', marksPerQuestion: 2, questionCount: 5 },
          { id: 'sec-b', name: 'Section B', description: 'Core Procedural & Case Problems', marksPerQuestion: 8, questionCount: 5 },
        ],
        bloomsDistribution: {
          Remember: 30,
          Understand: 35,
          Apply: 25,
          Analyze: 10,
          Evaluate: 0,
          Create: 0,
        },
        difficultyDistribution: {
          Easy: 40,
          Medium: 45,
          Hard: 15,
        },
        chapterWeightages: weights,
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Quick Action */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Module 2 & 3: Examination Blueprint Configuration
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Configure university examination parameters, section marks, cognitive distribution according to Bloom's Revised Taxonomy, and chapter syllabus weightage.
          </p>
        </div>
        <button
          onClick={onGeneratePaper}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap self-start md:self-auto shrink-0 shadow-sm disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isGenerating ? 'Synthesizing with Gemini...' : 'Generate Balanced Question Paper'}</span>
        </button>
      </div>

      {/* Blueprint Presets */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Sliders className="w-4 h-4 text-slate-600" />
            <span>Standard Blueprint Presets:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset('university-100')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Standard University (100 Marks · 3 Hours)
            </button>
            <button
              onClick={() => applyPreset('midterm-50')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              Midterm Assessment (50 Marks · 1.5 Hours)
            </button>
            <button
              onClick={() => applyPreset('hots-60')}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
            >
              HOTS - Higher Order Thinking (60 Marks)
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Grid: Metadata & Section Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: University / Course Metadata */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            Institutional & Course Details
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                University / Institution Name
              </label>
              <input
                type="text"
                value={blueprint.institutionName}
                onChange={(e) => handleUpdateField('institutionName', e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Department
                </label>
                <input
                  type="text"
                  value={blueprint.departmentName}
                  onChange={(e) => handleUpdateField('departmentName', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Exam Type
                </label>
                <input
                  type="text"
                  value={blueprint.examType}
                  onChange={(e) => handleUpdateField('examType', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={blueprint.courseName}
                  onChange={(e) => handleUpdateField('courseName', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Course Code
                </label>
                <input
                  type="text"
                  value={blueprint.courseCode}
                  onChange={(e) => handleUpdateField('courseCode', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono bg-slate-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Semester
                </label>
                <input
                  type="text"
                  value={blueprint.semester}
                  onChange={(e) => handleUpdateField('semester', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Duration (mins)
                </label>
                <input
                  type="number"
                  value={blueprint.durationMinutes}
                  onChange={(e) => handleUpdateField('durationMinutes', parseInt(e.target.value, 10) || 180)}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 tabular-nums bg-slate-50/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Total Marks
                </label>
                <div className="text-xs px-3 py-2 border border-slate-200 rounded-md font-bold text-slate-900 bg-slate-100 tabular-nums">
                  {calculatedTotalMarks} M
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Section Architecture & Marks Distribution */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Section Mark Distribution
            </div>
            <button
              onClick={handleAddSection}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Section</span>
            </button>
          </div>

          <div className="space-y-3">
            {blueprint.sections.map((sec, idx) => (
              <div
                key={sec.id}
                className="p-3 bg-slate-50/70 border border-slate-200 rounded-md text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{sec.name}</span>
                    <span className="text-slate-400">·</span>
                    <input
                      type="text"
                      value={sec.description}
                      onChange={(e) => handleUpdateSection(idx, { description: e.target.value })}
                      placeholder="Section brief"
                      className="px-2 py-0.5 border border-slate-200 rounded bg-white text-slate-700"
                    />
                  </div>
                  {blueprint.sections.length > 1 && (
                    <button
                      onClick={() => handleRemoveSection(idx)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-500 mb-1">Questions</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={sec.questionCount}
                      onChange={(e) =>
                        handleUpdateSection(idx, { questionCount: parseInt(e.target.value, 10) || 1 })
                      }
                      className="w-full px-2 py-1 border border-slate-200 rounded bg-white tabular-nums font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Marks Each</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={sec.marksPerQuestion}
                      onChange={(e) =>
                        handleUpdateSection(idx, { marksPerQuestion: parseInt(e.target.value, 10) || 1 })
                      }
                      className="w-full px-2 py-1 border border-slate-200 rounded bg-white tabular-nums font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 mb-1">Section Subtotal</label>
                    <div className="px-2 py-1 bg-white border border-slate-200 rounded font-semibold text-slate-900 tabular-nums">
                      {sec.questionCount * sec.marksPerQuestion} Marks
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-slate-900">
            <span>Aggregated Question Paper Total:</span>
            <span className="font-mono tabular-nums text-sm bg-slate-100 px-2.5 py-1 rounded">
              {calculatedTotalMarks} Marks ({blueprint.sections.reduce((a, s) => a + s.questionCount, 0)} Questions)
            </span>
          </div>
        </div>
      </div>

      {/* Bloom's Revised Taxonomy Cognitive Distribution */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Module 3: Bloom's Taxonomy Cognitive Level Allocation
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify the exact percentage breakdown across Bloom's 6 cognitive levels. Prompts will strictly utilize mapped action verbs to enforce cognitive depth.
            </p>
          </div>
          <div className={`text-xs font-bold px-2.5 py-1 rounded self-start sm:self-auto tabular-nums ${bloomsSum === 100 ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'}`}>
            Total: {bloomsSum}% {bloomsSum === 100 ? '(Balanced)' : '(Sum must equal 100%)'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_BLOOMS_LEVELS.map((level) => {
            const def = BLOOMS_TAXONOMY[level];
            const currentVal = blueprint.bloomsDistribution[level] || 0;
            return (
              <div key={level} className="p-3.5 bg-slate-50/80 border border-slate-200 rounded-md text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <span className="font-mono text-slate-500">{def.code}</span>
                    <span>{level}</span>
                  </div>
                  <button
                    onClick={() => setActiveVerbInfoLevel(activeVerbInfoLevel === level ? null : level)}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                    title="View Action Verbs"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={currentVal}
                    onChange={(e) => handleBloomsChange(level, parseInt(e.target.value, 10))}
                    className="flex-1 accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <span className="font-mono font-semibold text-slate-900 w-10 text-right tabular-nums">
                    {currentVal}%
                  </span>
                </div>

                <div className="text-slate-500 text-xs line-clamp-1">
                  Verbs: {def.actionVerbs.slice(0, 4).join(', ')}...
                </div>

                {activeVerbInfoLevel === level && (
                  <div className="p-2 bg-white border border-slate-200 rounded text-xs space-y-1 mt-2">
                    <div className="font-semibold text-slate-800">{def.cognitiveDomain}</div>
                    <p className="text-slate-600">{def.description}</p>
                    <div className="pt-1 text-slate-700 font-mono">
                      Action Verbs: {def.actionVerbs.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Difficulty & Chapter Weightage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Difficulty Distribution */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Difficulty Balancing
            </div>
            <div className={`text-xs font-bold px-2 py-0.5 rounded tabular-nums ${diffSum === 100 ? 'text-emerald-700' : 'text-amber-700'}`}>
              Sum: {diffSum}%
            </div>
          </div>

          {(['Easy', 'Medium', 'Hard'] as DifficultyLevel[]).map((diff) => {
            const val = blueprint.difficultyDistribution[diff] || 0;
            return (
              <div key={diff} className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-medium text-slate-700">
                  <span>{diff} Questions</span>
                  <span className="font-mono tabular-nums">{val}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={val}
                  onChange={(e) => handleDifficultyChange(diff, parseInt(e.target.value, 10))}
                  className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>
            );
          })}
        </div>

        {/* Chapter Syllabus Weightages */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider">
              Syllabus Module Weightage
            </div>
            <div className="text-xs text-slate-500 font-mono tabular-nums">
              Total Weight: {chapterWeightageSum}%
            </div>
          </div>

          <div className="space-y-3">
            {knowledgeBase.chapters.map((ch) => {
              const weight = blueprint.chapterWeightages[ch.id] ?? Math.round(100 / knowledgeBase.chapters.length);
              return (
                <div key={ch.id} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between text-slate-800">
                    <span className="font-semibold line-clamp-1">{ch.number}. {ch.title}</span>
                    <span className="font-mono tabular-nums">{weight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={weight}
                    onChange={(e) => handleChapterWeightChange(ch.id, parseInt(e.target.value, 10))}
                    className="w-full accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
