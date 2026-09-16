import { useNavigate } from 'react-router-dom';
import { ALL_QUESTIONS } from '../data/questions';
import { SUBJECTS } from '../data/subjects';

const EXAM_MINUTES = 60;

export default function MockExamStartPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-lg font-bold text-slate-900">模擬試験モード</h1>
      <p className="mb-6 text-sm text-slate-600">
        全7科目・計{ALL_QUESTIONS.length}問を本番形式で通しで解答します。制限時間は{EXAM_MINUTES}
        分で、時間になると自動的に採点されます。
      </p>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-bold text-slate-700">合格基準</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
          <li>総得点が満点の60%以上であること</li>
          <li>科目ごとの得点が満点の40%未満(いわゆる「足切り」)の科目が1つもないこと</li>
        </ul>
      </div>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-2 text-sm font-bold text-slate-700">出題科目</h2>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((s) => (
            <span key={s.id} className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${s.color}`}>
              {s.name}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => navigate('/mock-exam/session')}
        className="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow hover:bg-blue-800"
      >
        模擬試験を開始する
      </button>
    </div>
  );
}
