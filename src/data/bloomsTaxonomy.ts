import { BloomsLevel } from '../types';

export interface BloomsDefinition {
  level: BloomsLevel;
  code: string;
  order: number;
  description: string;
  actionVerbs: string[];
  questionStems: string[];
  cognitiveDomain: string;
}

export const BLOOMS_TAXONOMY: Record<BloomsLevel, BloomsDefinition> = {
  Remember: {
    level: 'Remember',
    code: 'L1',
    order: 1,
    cognitiveDomain: 'Knowledge Retrieval',
    description: 'Retrieve relevant knowledge from long-term memory. Recognizing and recalling facts, terms, basic concepts, and answers.',
    actionVerbs: ['Define', 'List', 'Recall', 'State', 'Identify', 'Name', 'Enumerate', 'Mention', 'Match'],
    questionStems: [
      'Define the term {concept}.',
      'State the principle of {concept}.',
      'List the primary components of {concept}.',
      'Identify the characteristics of {concept}.',
      'Recall the formula or rule for {concept}.'
    ]
  },
  Understand: {
    level: 'Understand',
    code: 'L2',
    order: 2,
    cognitiveDomain: 'Comprehension & Meaning',
    description: 'Construct meaning from instructional messages, including oral, written, and graphic communication. Interpreting, exemplifying, classifying, summarizing, inferring, comparing, explaining.',
    actionVerbs: ['Explain', 'Describe', 'Summarize', 'Interpret', 'Illustrate', 'Paraphrase', 'Discuss', 'Clarify'],
    questionStems: [
      'Explain how {concept} functions under standard conditions.',
      'Describe the workflow or sequence involved in {concept}.',
      'Summarize the essential trade-offs associated with {concept}.',
      'Interpret the significance of {concept} in modern architectures.',
      'Illustrate with a clear diagram or example the operation of {concept}.'
    ]
  },
  Apply: {
    level: 'Apply',
    code: 'L3',
    order: 3,
    cognitiveDomain: 'Procedural Implementation',
    description: 'Carry out or use a procedure in a given situation. Executing or implementing rules, formulas, algorithms, or theories to solve practical problems.',
    actionVerbs: ['Apply', 'Solve', 'Use', 'Demonstrate', 'Calculate', 'Implement', 'Compute', 'Execute'],
    questionStems: [
      'Apply {concept} to resolve the following scenario.',
      'Calculate the performance metric or result using {concept}.',
      'Demonstrate how {concept} is implemented for a real-world case.',
      'Solve the given problem instance using the {concept} algorithm.',
      'Show how to configure or use {concept} to satisfy constraints.'
    ]
  },
  Analyze: {
    level: 'Analyze',
    code: 'L4',
    order: 4,
    cognitiveDomain: 'Deconstruction & Relations',
    description: 'Break material into constituent parts, determining how the parts relate to one another and to an overall structure or purpose. Differentiating, organizing, and attributing.',
    actionVerbs: ['Compare', 'Differentiate', 'Examine', 'Distinguish', 'Break down', 'Contrast', 'Investigate', 'Deconstruct'],
    questionStems: [
      'Differentiate between {concept_A} and {concept_B} across key performance metrics.',
      'Compare the efficiency and complexity of {concept_A} versus {concept_B}.',
      'Examine the internal failure modes or bottleneck causes of {concept}.',
      'Break down the architecture of {concept} into its functional layers.',
      'Distinguish the edge cases where {concept} fails to maintain consistency.'
    ]
  },
  Evaluate: {
    level: 'Evaluate',
    code: 'L5',
    order: 5,
    cognitiveDomain: 'Judgment & Appraisal',
    description: 'Make judgments based on criteria and standards. Checking and critiquing solutions, decisions, hypotheses, or system architectures.',
    actionVerbs: ['Justify', 'Assess', 'Critique', 'Judge', 'Evaluate', 'Defend', 'Appraise', 'Recommend'],
    questionStems: [
      'Evaluate whether {concept_A} is superior to {concept_B} for high-throughput environments.',
      'Justify the selection of {concept} in mission-critical applications.',
      'Critique the architectural limitations of {concept} and propose mitigations.',
      'Assess the impact of {concept} on fault tolerance and scalability.',
      'Judge the effectiveness of {concept} in mitigating security risks.'
    ]
  },
  Create: {
    level: 'Create',
    code: 'L6',
    order: 6,
    cognitiveDomain: 'Synthesis & Generation',
    description: 'Put elements together to form a coherent or functional whole; reorganize elements into a new pattern or structure. Generating, planning, or producing.',
    actionVerbs: ['Design', 'Construct', 'Formulate', 'Propose', 'Synthesize', 'Architect', 'Devise', 'Formulate'],
    questionStems: [
      'Design a fault-tolerant system architecture utilizing {concept}.',
      'Formulate a comprehensive strategy to integrate {concept} into existing legacy pipelines.',
      'Propose a novel algorithm or hybrid mechanism combining {concept_A} and {concept_B}.',
      'Architect a distributed model that leverages {concept} to satisfy 99.99% uptime.',
      'Synthesize an end-to-end specification combining {concept} with safety invariants.'
    ]
  }
};

export const ALL_BLOOMS_LEVELS: BloomsLevel[] = [
  'Remember',
  'Understand',
  'Apply',
  'Analyze',
  'Evaluate',
  'Create'
];
