import { Link } from 'react-router-dom';
import type { SubjectMeta } from '../types';
import ProgressBar from './ProgressBar';
import { useProgress } from '../hooks/useProgress';

export default function SubjectCard({ subject }: { subject: SubjectMeta }) {
  const { getSubjectStats } = useProgress();
  const stats = getSubjectStats(subject.id);
  const progressRatio = stats.total > 0 ? stats.answered / stats.total : 0;

  return (
    <Link
      to={`/practice/${subject.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span className={`grid h-9 w-9 place-items-center rounded-lg text-sm font-bold text-white ${subject.color}`}>
          {subject.shortName}
        </span>
        <span className="text-xs text-slate-500">
          {stats.answered}/{stats.total} 問
        </span>
      </div>
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-blue-700">{subject.name}</h3>
        <p className="mt-1 text-xs text-slate-500">
          {stats.answered > 0 ? `正答率 ${Math.round(stats.rate * 100)}%` : '未着手'}
        </p>
      </div>
      <ProgressBar value={progressRatio} colorClassName={subject.color} />
    </Link>
  );
}
