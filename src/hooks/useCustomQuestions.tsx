import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AiGeneratedQuestion, Question, SubjectId } from '../types';
import { SUBJECTS } from '../data/subjects';
import { getQuestionsBySubject, getQuestionById } from '../data/questions';
import { adoptQuestion, deleteCustomQuestion, fetchCustomQuestions } from '../api/client';

function emptyStore(): Record<SubjectId, Question[]> {
  return SUBJECTS.reduce(
    (acc, s) => {
      acc[s.id] = [];
      return acc;
    },
    {} as Record<SubjectId, Question[]>,
  );
}

interface CustomQuestionsContextValue {
  customQuestionsBySubject: Record<SubjectId, Question[]>;
  loading: boolean;
  adopt: (subject: SubjectId, question: AiGeneratedQuestion) => Promise<Question>;
  removeCustom: (id: string) => Promise<void>;
  getMergedQuestions: (subject: SubjectId) => Question[];
  getMergedQuestionById: (id: string) => Question | undefined;
}

const CustomQuestionsContext = createContext<CustomQuestionsContextValue | null>(null);

export function CustomQuestionsProvider({ children }: { children: ReactNode }) {
  const [customQuestionsBySubject, setCustomQuestionsBySubject] = useState<Record<SubjectId, Question[]>>(
    emptyStore,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchCustomQuestions()
      .then((res) => {
        if (!cancelled) setCustomQuestionsBySubject({ ...emptyStore(), ...res.questions });
      })
      .catch(() => {
        // バックエンド未起動時などは静かに諦め、既存の演習問題のみで動作させる
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const adopt = async (subject: SubjectId, question: AiGeneratedQuestion) => {
    const res = await adoptQuestion(subject, question);
    setCustomQuestionsBySubject((prev) => ({
      ...prev,
      [subject]: [...(prev[subject] ?? []), res.question],
    }));
    return res.question;
  };

  const removeCustom = async (id: string) => {
    await deleteCustomQuestion(id);
    setCustomQuestionsBySubject((prev) => {
      const next = { ...prev };
      for (const subjectId of Object.keys(next) as SubjectId[]) {
        next[subjectId] = next[subjectId].filter((q) => q.id !== id);
      }
      return next;
    });
  };

  const getMergedQuestions = (subject: SubjectId) => [
    ...getQuestionsBySubject(subject),
    ...(customQuestionsBySubject[subject] ?? []),
  ];

  const getMergedQuestionById = (id: string) => {
    const custom = Object.values(customQuestionsBySubject)
      .flat()
      .find((q) => q.id === id);
    return custom ?? getQuestionById(id);
  };

  const value: CustomQuestionsContextValue = {
    customQuestionsBySubject,
    loading,
    adopt,
    removeCustom,
    getMergedQuestions,
    getMergedQuestionById,
  };

  return <CustomQuestionsContext.Provider value={value}>{children}</CustomQuestionsContext.Provider>;
}

export function useCustomQuestions(): CustomQuestionsContextValue {
  const ctx = useContext(CustomQuestionsContext);
  if (!ctx) throw new Error('useCustomQuestions must be used within a CustomQuestionsProvider');
  return ctx;
}
