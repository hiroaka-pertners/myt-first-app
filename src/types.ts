export type SubjectId =
  | 'economics'
  | 'finance'
  | 'management'
  | 'operations'
  | 'legal'
  | 'it'
  | 'smePolicy';

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  shortName: string;
  color: string;
  accent: string;
}

export interface Question {
  id: string;
  subject: SubjectId;
  number: number;
  text: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  answeredAt: number;
}

export interface MockExamAnswer {
  questionId: string;
  selectedIndex: number | null;
}

export interface MockExamResult {
  startedAt: number;
  finishedAt: number;
  answers: MockExamAnswer[];
  subjectScores: Record<SubjectId, { correct: number; total: number }>;
  totalCorrect: number;
  totalQuestions: number;
  passed: boolean;
  cutoffSubjects: SubjectId[];
}

export interface AiExplainResponse {
  explanation: string;
}

export interface AiGeneratedQuestion {
  text: string;
  choices: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}
