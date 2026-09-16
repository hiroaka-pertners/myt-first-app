import { Link } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import { getQuestionById } from '../data/questions';
import QuestionPanel from '../components/QuestionPanel';

export default function BookmarksPage() {
  const { bookmarks } = useProgress();
  const questions = bookmarks.map((id) => getQuestionById(id)).filter((q): q is NonNullable<typeof q> => Boolean(q));

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-lg font-bold text-slate-900">ブックマーク</h1>
      <p className="mb-4 text-sm text-slate-500">あとで見返したい問題をまとめてチェックできます。</p>

      {questions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          まだブックマークした問題はありません。問題画面の ☆ をタップして追加しましょう。
          <div className="mt-3">
            <Link to="/" className="text-blue-700 underline">
              演習を始める
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <QuestionPanel key={q.id} question={q} />
          ))}
        </div>
      )}
    </div>
  );
}
