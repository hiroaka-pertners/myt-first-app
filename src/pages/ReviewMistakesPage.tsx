import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { useCustomQuestions } from '../hooks/useCustomQuestions';
import QuestionPanel from '../components/QuestionPanel';

export default function ReviewMistakesPage() {
  const { getWrongQuestionIds, clearAnswer } = useProgress();
  const { getMergedQuestionById } = useCustomQuestions();
  const [ids, setIds] = useState<string[]>(() => getWrongQuestionIds());

  const questions = ids
    .map((id) => getMergedQuestionById(id))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-slate-900">苦手復習</h1>
          <p className="mt-1 text-sm text-slate-500">
            これまでに間違えた問題だけを集めて復習できます。「もう一度解く」で再挑戦しましょう。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIds(getWrongQuestionIds())}
          className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
        >
          最新の状態に更新
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          間違えた問題はまだありません。このまま演習を続けましょう。
          <div className="mt-3">
            <Link to="/" className="text-blue-700 underline">
              演習を始める
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-slate-500">{questions.length} 問</p>
          {questions.map((q) => (
            <div key={q.id}>
              <div className="mb-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => clearAnswer(q.id)}
                  className="rounded-md border border-blue-300 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  もう一度解く
                </button>
              </div>
              <QuestionPanel question={q} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
