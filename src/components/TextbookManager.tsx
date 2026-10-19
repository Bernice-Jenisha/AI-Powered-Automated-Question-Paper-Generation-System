import React, { useState, useRef } from 'react';
import { TextbookKnowledgeBase, TextbookChunk } from '../types';
import { SAMPLE_TEXTBOOKS } from '../data/sampleTextbooks';
import { chunkUploadedText, retrieveRelevantChunks } from '../utils/ragEngine';
import { BookOpen, Upload, Search, FileText, Check, ChevronRight, Layers, Database, ArrowRight, Tag } from 'lucide-react';

interface TextbookManagerProps {
  currentKb: TextbookKnowledgeBase;
  onSelectKb: (kb: TextbookKnowledgeBase) => void;
  onProceedToBlueprint: () => void;
}

export const TextbookManager: React.FC<TextbookManagerProps> = ({
  currentKb,
  onSelectKb,
  onProceedToBlueprint,
}) => {
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    currentKb.chapters[0]?.id || ''
  );
  const [isUploadingCustom, setIsUploadingCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customText, setCustomText] = useState('');
  const [ragQuery, setRagQuery] = useState('');
  const [ragSearchResults, setRagSearchResults] = useState<TextbookChunk[]>([]);
  const [hasQueried, setHasQueried] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync selected chapter when currentKb changes
  React.useEffect(() => {
    if (currentKb.chapters.length > 0 && !currentKb.chapters.some((c) => c.id === selectedChapterId)) {
      setSelectedChapterId(currentKb.chapters[0].id);
    }
  }, [currentKb, selectedChapterId]);

  const activeChapter = currentKb.chapters.find((c) => c.id === selectedChapterId) || currentKb.chapters[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const title = file.name.replace(/\.[^/.]+$/, '');
        setCustomTitle(title);
        setCustomText(text);
        setIsUploadingCustom(true);
      }
    };
    reader.readAsText(file);
  };

  const handleProcessCustomText = () => {
    if (!customText.trim()) return;
    const newKb = chunkUploadedText(customText, customTitle || 'Uploaded Textbook Corpus');
    onSelectKb(newKb);
    setIsUploadingCustom(false);
    setSelectedChapterId(newKb.chapters[0]?.id || '');
  };

  const handleRunRagSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) {
      setRagSearchResults([]);
      setHasQueried(false);
      return;
    }
    const terms = ragQuery.split(/\s+/).filter(Boolean);
    const results = retrieveRelevantChunks(currentKb, undefined, undefined, terms, 3);
    setRagSearchResults(results);
    setHasQueried(true);
  };

  return (
    <div className="space-y-8">
      {/* Module Kicker & Overview */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Module 1: Content Analysis & RAG Knowledge Extraction
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Select an authoritative curriculum textbook or upload custom course material. The pipeline automatically chunks text, extracts key entities, and indexes them into the RAG vector store for grounded question synthesis.
            </p>
          </div>
          <button
            onClick={onProceedToBlueprint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap self-start md:self-auto shrink-0 shadow-sm"
          >
            <span>Configure Exam Blueprint</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset Textbook Selector Tabs */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Curated Textbook Corpora
          </label>
          <button
            onClick={() => setIsUploadingCustom(!isUploadingCustom)}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploadingCustom ? 'View Current Corpus' : 'Upload Custom Textbook/Notes'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SAMPLE_TEXTBOOKS.map((tb) => {
            const isSelected = currentKb.id === tb.id;
            return (
              <button
                key={tb.id}
                onClick={() => {
                  onSelectKb(tb);
                  setIsUploadingCustom(false);
                  setSelectedChapterId(tb.chapters[0]?.id || '');
                }}
                className={`p-4 text-left rounded-lg border transition-all ${
                  isSelected
                    ? 'border-slate-900 bg-white shadow-sm ring-1 ring-slate-900'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <BookOpen className={`w-4 h-4 mt-0.5 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />
                  {isSelected && <Check className="w-4 h-4 text-slate-900" />}
                </div>
                <h2 className="mt-2 text-sm font-semibold text-slate-900 line-clamp-1">
                  {tb.title}
                </h2>
                <div className="mt-1 text-xs text-slate-500 line-clamp-1">
                  {tb.authorOrEdition}
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <span>{tb.totalChapters} Chapters</span>
                  <span aria-hidden="true">·</span>
                  <span>{tb.totalChunks} RAG Chunks</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Custom Modal / Section */}
      {isUploadingCustom && (
        <div className="p-6 bg-white border border-slate-300 rounded-lg shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900">
              Upload Custom Course Material or Past Notes
            </h2>
            <button
              onClick={() => setIsUploadingCustom(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-slate-600">
            Upload a text / markdown file or paste textbook chapters. The system will run semantic paragraph segmentation, extract technical concepts, and build a localized RAG vector index.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Textbook / Course Title
              </label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g., Advanced Database Systems (Elmasri & Navathe)"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Attach File (.txt, .md, .pdf text)
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.md,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 text-xs font-medium text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Choose File</span>
                </button>
                <span className="text-xs text-slate-500 truncate">
                  {customTitle || 'No file selected'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Textbook Content / Chapters Text
            </label>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={8}
              placeholder="Paste raw textbook text, syllabus chapters, or lecture notes here. Use 'Chapter 1: ...' headings to organize into distinct syllabus modules."
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono-code bg-slate-50/50"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsUploadingCustom(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              onClick={handleProcessCustomText}
              disabled={!customText.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-sm"
            >
              Extract & Build RAG Index
            </button>
          </div>
        </div>
      )}

      {/* Active Textbook Details and RAG Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Syllabus Chapters List */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                Syllabus Architecture
              </div>
              <h2 className="text-sm font-bold text-slate-900 mt-0.5">
                {currentKb.title}
              </h2>
            </div>
            <div className="text-xs text-slate-500 font-mono tabular-nums">
              {currentKb.totalChapters} Modules
            </div>
          </div>

          <div className="space-y-2">
            {currentKb.chapters.map((ch) => {
              const isSelected = ch.id === selectedChapterId;
              return (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapterId(ch.id)}
                  className={`w-full p-3 text-left rounded-md transition-colors border ${
                    isSelected
                      ? 'border-slate-900 bg-slate-50/80 font-medium'
                      : 'border-transparent hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 line-clamp-1">
                      {ch.number}. {ch.title}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {ch.keyConcepts.slice(0, 3).map((concept, idx) => (
                      <span key={idx} className="text-xs text-slate-500">
                        {concept}{idx < 2 ? ' ·' : ''}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* RAG Quick Semantic Prober */}
          <div className="border-t border-slate-100 pt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5" />
              <span>Test RAG Semantic Retrieval</span>
            </label>
            <form onSubmit={handleRunRagSearch} className="flex gap-2">
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                placeholder="e.g., Coffman conditions, TLB access time..."
                className="flex-1 text-xs px-3 py-1.5 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 bg-slate-50/50"
              />
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-md hover:bg-slate-800 transition-colors shrink-0"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        {/* Right: Chapter Detail & Indexed Chunks */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-5">
          {hasQueried ? (
            <div>
              <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                <div className="text-xs font-semibold text-slate-900">
                  RAG Retrieval Results for "{ragQuery}"
                </div>
                <button
                  onClick={() => {
                    setHasQueried(false);
                    setRagQuery('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Clear Results
                </button>
              </div>

              {ragSearchResults.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No direct vector matches. Try searching for key terms like "deadlock", "paging", "scheduling".
                </div>
              ) : (
                <div className="space-y-3">
                  {ragSearchResults.map((chunk, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs space-y-2">
                      <div className="flex items-center justify-between text-slate-600 font-medium">
                        <span>{chunk.chapterTitle} / {chunk.sectionTitle}</span>
                        <span className="font-mono text-slate-500">Rank #{idx + 1}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">
                        {chunk.content}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1 text-slate-500">
                        {chunk.keyConcepts.map((kc, kidx) => (
                          <span key={kidx} className="text-xs">
                            #{kc}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeChapter ? (
            <div>
              <div className="border-b border-slate-100 pb-3">
                <div className="text-xs text-slate-500">Module {activeChapter.number}</div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {activeChapter.title}
                </h3>
                <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                  {activeChapter.summary}
                </p>
              </div>

              {/* Key Concept Terms */}
              <div className="mt-4">
                <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Extracted Technical Entities ({activeChapter.keyConcepts.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeChapter.keyConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-xs text-slate-700 bg-slate-100 rounded border border-slate-200 font-mono"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>

              {/* Indexed RAG Chunks */}
              <div className="mt-6 space-y-3">
                <div className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    <span>Indexed Knowledge Chunks ({activeChapter.chunks.length})</span>
                  </span>
                  <span className="text-slate-400 font-normal">Vector Embeddings Ready</span>
                </div>

                <div className="space-y-3">
                  {activeChapter.chunks.map((chunk, idx) => (
                    <div
                      key={chunk.id}
                      className="p-3.5 bg-slate-50/80 rounded-md border border-slate-200 text-xs space-y-2 hover:bg-white hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">
                          {chunk.sectionTitle}
                        </span>
                        <div className="flex items-center gap-1.5 text-slate-500">
                          {chunk.cognitiveAffinity.map((aff, aidx) => (
                            <span key={aidx} className="text-xs text-slate-600 font-medium">
                              {aff}{aidx < chunk.cognitiveAffinity.length - 1 ? ' ·' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-academic text-sm">
                        "{chunk.content}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
