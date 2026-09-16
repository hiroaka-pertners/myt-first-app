import type { Question, SubjectId } from '../../types';
import { economicsQuestions } from './economics';
import { financeQuestions } from './finance';
import { managementQuestions } from './management';
import { operationsQuestions } from './operations';
import { legalQuestions } from './legal';
import { itQuestions } from './it';
import { smePolicyQuestions } from './smePolicy';

export const QUESTIONS_BY_SUBJECT: Record<SubjectId, Question[]> = {
  economics: economicsQuestions,
  finance: financeQuestions,
  management: managementQuestions,
  operations: operationsQuestions,
  legal: legalQuestions,
  it: itQuestions,
  smePolicy: smePolicyQuestions,
};

export const ALL_QUESTIONS: Question[] = Object.values(QUESTIONS_BY_SUBJECT).flat();

export function getQuestionsBySubject(subject: SubjectId): Question[] {
  return QUESTIONS_BY_SUBJECT[subject];
}

export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}
