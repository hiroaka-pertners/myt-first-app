import { Link } from 'react-router-dom';
import { SUBJECTS } from '../data/subjects';
import { ALL_QUESTIONS } from '../data/questions';
import SubjectCard from '../components/SubjectCard';
import ProgressBar from '../components/ProgressBar';
import { useProgress } from '../hooks/useProgress';

export default function HomePage() {
  const { answers, bookmarks } = useProgress();
  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((a) => a.isCorrect).length;
  const total = ALL_QUESTIONS.length;
  const rate = answeredCount > 0 ? correctCount / answeredCount : 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <section className="mb-8 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 p-6 text-white shadow-md">
        <h1 className="text-xl font-bold sm:text-2xl">中小企業診断士 第1次試験 過去問道場</h1>
        <p className="mt-1 text-sm text-blue-100">
          全7科目・{total}問の演習問題でタップ即採点。模擬試験モードで本番形式の実力チェックもできます。
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center sm:max-w-md">
          <div className="rounded-lg bg-white/10 px-2 py-3">
            <p className="text-lg font-bold">{answeredCount}</p>
            <p className="text-xs text-blue-100">回答済み</p>
          </div>
          <div className="rounded-lg bg-white/10 px-2 py-3">
            <p className="text-lg font-bold">{Math.round(rate * 100)}%</p>
            <p className="text-xs text-blue-100">正答率</p>
          </div>
          <div className="rounded-lg bg-white/10 px-2 py-3">
            <p className="text-lg font-bold">{bookmarks.length}</p>
            <p className="text-xs text-blue-100">ブックマーク</p>
          </div>
        </div>
        <div className="mt-4">
          <ProgressBar value={total > 0 ? answeredCount / total : 0} colorClassName="bg-white" />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/mock-exam"
            className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-blue-800 shadow hover:bg-blue-50"
          >
            模擬試験を受ける
          </Link>
          <Link
            to="/stats"
            className="rounded-lg border border-white/40 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            成績を見る
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-slate-700">科目別 演習</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SUBJECTS.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>
    </div>
  );
}
