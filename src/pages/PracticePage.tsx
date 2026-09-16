import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { SUBJECT_MAP, SUBJECTS } from '../data/subjects';
import type { SubjectId } from '../types';
import QuestionPanel from '../components/QuestionPanel';
import { useCustomQuestions } from '../hooks/useCustomQuestions';

export default function PracticePage() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const { getMergedQuestions } = useCustomQuestions();

  const isValidSubject = subjectId && SUBJECTS.some((s) => s.id === subjectId);
  const questions = isValidSubject ? getMergedQuestions(subjectId as SubjectId) : [];

  useEffect(() => {
    setIndex(0);
  }, [subjectId]);

  if (!isValidSubject) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-slate-600">科目が見つかりませんでした。</p>
        <Link to="/" className="mt-3 inline-block text-blue-700 underline">
          ホームに戻る
        </Link>
      </div>
    );
  }

  const subjectMeta = SUBJECT_MAP[subjectId as SubjectId];
  const question = questions[index];

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <Link to="/" className="text-xs text-slate-500 hover:underline">
            ← ホーム
          </Link>
          <h1 className="text-lg font-bold text-slate-900">{subjectMeta.name}</h1>
        </div>
        <span className="text-sm font-semibold text-slate-500">
          {index + 1} / {questions.length}
        </span>
      </div>

      <QuestionPanel question={question} />

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
        >
          前の問題
        </button>
        {index < questions.length - 1 ? (
          <button
            type="button"
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            次の問題
          </button>
        ) : (
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            この科目を完了
          </button>
        )}
      </div>
    </div>
  );
}
