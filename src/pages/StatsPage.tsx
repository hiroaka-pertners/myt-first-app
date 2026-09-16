import { SUBJECTS } from '../data/subjects';
import { useProgress } from '../hooks/useProgress';
import { useCustomQuestions } from '../hooks/useCustomQuestions';
import ProgressBar from '../components/ProgressBar';

export default function StatsPage() {
  const { getStatsForQuestions, resetProgress } = useProgress();
  const { getMergedQuestions } = useCustomQuestions();

  const allQuestions = SUBJECTS.flatMap((s) => getMergedQuestions(s.id));
  const overall = getStatsForQuestions(allQuestions);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-lg font-bold text-slate-900">成績</h1>
      <p className="mb-4 text-sm text-slate-500">科目ごとの回答状況と正答率を確認できます。</p>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-2 flex items-baseline justify-between">
          <span className="text-sm font-semibold text-slate-700">全体の進捗</span>
          <span className="text-sm text-slate-500">
            {overall.answered} / {overall.total} 問
          </span>
        </div>
        <ProgressBar value={overall.total > 0 ? overall.answered / overall.total : 0} />
        <p className="mt-2 text-sm text-slate-600">
          正答率: <span className="font-bold text-blue-700">{Math.round(overall.rate * 100)}%</span>
          <span className="ml-1 text-xs text-slate-400">
            ({overall.correct}/{overall.answered} 問正解)
          </span>
        </p>
      </div>

      <div className="space-y-3">
        {SUBJECTS.map((subject) => {
          const stats = getStatsForQuestions(getMergedQuestions(subject.id));
          return (
            <div key={subject.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className={`h-2.5 w-2.5 rounded-full ${subject.color}`} />
                  {subject.name}
                </span>
                <span className="text-xs text-slate-500">
                  {stats.answered}/{stats.total} 問
                </span>
              </div>
              <ProgressBar value={stats.total > 0 ? stats.answered / stats.total : 0} colorClassName={subject.color} />
              <p className="mt-2 text-xs text-slate-500">
                正答率: {stats.answered > 0 ? `${Math.round(stats.rate * 100)}%` : '—'}
              </p>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => {
          if (confirm('回答履歴とブックマークをすべてリセットします。よろしいですか?')) {
            resetProgress();
          }
        }}
        className="mt-6 text-xs text-slate-400 underline hover:text-rose-600"
      >
        学習データをリセットする
      </button>
    </div>
  );
}
