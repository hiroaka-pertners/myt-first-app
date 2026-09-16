import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AnswerRecord, SubjectId } from '../types';
import { loadJSON, saveJSON } from '../utils/storage';
import { getQuestionsBySubject } from '../data/questions';

const ANSWERS_KEY = 'shindanshi:answers:v1';
const BOOKMARKS_KEY = 'shindanshi:bookmarks:v1';

interface ProgressContextValue {
  answers: Record<string, AnswerRecord>;
  bookmarks: string[];
  recordAnswer: (questionId: string, selectedIndex: number, correctIndex: number) => void;
  toggleBookmark: (questionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
  getSubjectStats: (subject: SubjectId) => { answered: number; correct: number; total: number; rate: number };
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>(() =>
    loadJSON(ANSWERS_KEY, {} as Record<string, AnswerRecord>),
  );
  const [bookmarks, setBookmarks] = useState<string[]>(() => loadJSON(BOOKMARKS_KEY, [] as string[]));

  const recordAnswer = (questionId: string, selectedIndex: number, correctIndex: number) => {
    setAnswers((prev) => {
      const next = {
        ...prev,
        [questionId]: {
          questionId,
          selectedIndex,
          isCorrect: selectedIndex === correctIndex,
          answeredAt: Date.now(),
        },
      };
      saveJSON(ANSWERS_KEY, next);
      return next;
    });
  };

  const toggleBookmark = (questionId: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId];
      saveJSON(BOOKMARKS_KEY, next);
      return next;
    });
  };

  const isBookmarked = (questionId: string) => bookmarks.includes(questionId);

  const getSubjectStats = (subject: SubjectId) => {
    const questions = getQuestionsBySubject(subject);
    let answered = 0;
    let correct = 0;
    for (const q of questions) {
      const record = answers[q.id];
      if (record) {
        answered += 1;
        if (record.isCorrect) correct += 1;
      }
    }
    return {
      answered,
      correct,
      total: questions.length,
      rate: answered > 0 ? correct / answered : 0,
    };
  };

  const resetProgress = () => {
    setAnswers({});
    setBookmarks([]);
    saveJSON(ANSWERS_KEY, {});
    saveJSON(BOOKMARKS_KEY, []);
  };

  const value: ProgressContextValue = {
    answers,
    bookmarks,
    recordAnswer,
    toggleBookmark,
    isBookmarked,
    getSubjectStats,
    resetProgress,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider');
  return ctx;
}
