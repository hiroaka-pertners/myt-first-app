import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ALL_QUESTIONS } from '../data/questions';
import { SUBJECT_MAP } from '../data/subjects';
import type { MockExamAnswer } from '../types';
import AnswerChoices from '../components/AnswerChoices';
import Timer from '../components/Timer';
import { calculateMockResult } from '../utils/scoring';
import { loadJSON, saveJSON } from '../utils/storage';

const EXAM_SECONDS = 60 * 60;
const SESSION_KEY = 'shindanshi:mockSession:v1';
const RESULT_KEY = 'shindanshi:mockResult:v1';

interface SessionState {
  startedAt: number;
  answers: MockExamAnswer[];
}

function buildInitialAnswers(): MockExamAnswer[] {
  return ALL_QUESTIONS.map((q) => ({ questionId: q.id, selectedIndex: null }));
}

export default function MockExamSessionPage() {
  const navigate = useNavigate();
  const questions = ALL_QUESTIONS;

  const [session, setSession] = useState<SessionState>(() =>
    loadJSON(SESSION_KEY, { startedAt: Date.now(), answers: buildInitialAnswers() }),
  );
  const [index, setIndex] = useState(0);
  const sessionRef = useRef(session);
  sessionRef.current = session;

  const remainingSeconds = useMemo(() => {
    const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
    return Math.max(0, EXAM_SECONDS - elapsed);
  }, [session.startedAt]);

  const [displaySeconds, setDisplaySeconds] = useState(remainingSeconds);

  const handleSubmit = useCallback(() => {
    const finishedAt = Date.now();
    const result = calculateMockResult(sessionRef.current.answers, questions, sessionRef.current.startedAt, finishedAt);
    saveJSON(RESULT_KEY, result);
    saveJSON(SESSION_KEY, null);
    navigate('/mock-exam/result');
  }, [navigate, questions]);

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionRef.current.startedAt) / 1000);
      const remaining = Math.max(0, EXAM_SECONDS - elapsed);
      setDisplaySeconds(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        handleSubmit();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [handleSubmit]);

  useEffect(() => {
    saveJSON(SESSION_KEY, session);
  }, [session]);

  const question = questions[index];
  const subjectMeta = SUBJECT_MAP[question.subject];
  const currentAnswer = session.answers[index];
  const answeredCount = session.answers.filter((a) => a.selectedIndex !== null).length;

  const handleSelect = (choiceIndex: number) => {
    setSession((prev) => {
      const nextAnswers = prev.answers.map((a, i) => (i === index ? { ...a, selectedIndex: choiceIndex } : a));
      return { ...prev, answers: nextAnswers };
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <span className={`rounded-md px-2 py-0.5 text-xs font-semibold text-white ${subjectMeta.color}`}>
            {subjectMeta.name}
          </span>
          <p className="mt-1 text-sm font-semibold text-slate-700">
            問題 {index + 1} / {questions.length}(解答済み {answeredCount})
          </p>
        </div>
        <Timer remainingSeconds={displaySeconds} />
      </div>

      <div className="mb-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="mb-4 whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-slate-900">
          {question.text}
        </p>
        <AnswerChoices
          choices={question.choices}
          selectedIndex={currentAnswer.selectedIndex}
          onSelect={handleSelect}
        />
      </div>

      <div className="mb-5 grid grid-cols-9 gap-1.5 sm:grid-cols-[repeat(13,minmax(0,1fr))]">
        {questions.map((q, i) => {
          const answered = session.answers[i].selectedIndex !== null;
          const isCurrent = i === index;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`aspect-square rounded text-[11px] font-bold ${
                isCurrent
                  ? 'bg-blue-700 text-white'
                  : answered
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-slate-100 text-slate-500'
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
        >
          前へ
        </button>
        {index < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            次へ
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (confirm('解答を提出して採点します。よろしいですか?')) handleSubmit();
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700"
          >
            提出して採点する
          </button>
        )}
      </div>
    </div>
  );
}
