import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { MockExamResult } from '../types';
import { SUBJECT_MAP, SUBJECTS } from '../data/subjects';
import { getQuestionById } from '../data/questions';
import { loadJSON } from '../utils/storage';
import AnswerChoices from '../components/AnswerChoices';
import ProgressBar from '../components/ProgressBar';

const RESULT_KEY = 'shindanshi:mockResult:v1';

export default function MockExamResultPage() {
  const navigate = useNavigate();
  const [result, setResult] = useState<MockExamResult | null | undefined>(undefined);

  useEffect(() => {
    setResult(loadJSON<MockExamResult | null>(RESULT_KEY, null));
  }, []);

  if (result === undefined) return null;

  if (!result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10 text-center">
        <p className="text-slate-600">模擬試験の結果が見つかりませんでした。</p>
        <button type="button" onClick={() => navigate('/mock-exam')} className="mt-3 text-blue-700 underline">
          模擬試験を受ける
        </button>
      </div>
    );
  }

  const wrongAnswers = result.answers.filter((a) => {
    const q = getQuestionById(a.questionId);
    return q && a.selectedIndex !== q.correctIndex;
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <div
        className={`mb-6 rounded-2xl p-6 text-center text-white shadow-md ${
          result.passed ? 'bg-gradient-to-br from-emerald-600 to-emerald-800' : 'bg-gradient-to-br from-rose-600 to-rose-800'
        }`}
      >
        <p className="text-sm font-semibold opacity-90">判定</p>
        <p className="text-3xl font-extrabold">{result.passed ? '合格ライン到達' : '不合格ライン'}</p>
        <p className="mt-2 text-sm opacity-90">
          総合得点 {result.totalCorrect} / {result.totalQuestions} 問(
          {Math.round((result.totalCorrect / result.totalQuestions) * 100)}%)
        </p>
        {result.cutoffSubjects.length > 0 && (
          <p className="mt-1 text-xs opacity-90">
            足切り科目: {result.cutoffSubjects.map((id) => SUBJECT_MAP[id].name).join('、')}
          </p>
        )}
      </div>

      <div className="mb-6 space-y-3">
        {SUBJECTS.map((subject) => {
          const score = result.subjectScores[subject.id];
          const ratio = score.total > 0 ? score.correct / score.total : 0;
          const isCutoff = result.cutoffSubjects.includes(subject.id);
          return (
            <div
              key={subject.id}
              className={`rounded-xl border bg-white p-4 shadow-sm ${isCutoff ? 'border-rose-300' : 'border-slate-200'}`}
            >
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-semibold text-slate-800">
                  <span className={`h-2.5 w-2.5 rounded-full ${subject.color}`} />
                  {subject.name}
                  {isCutoff && <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-700">足切り</span>}
                </span>
                <span className="text-slate-500">
                  {score.correct}/{score.total}
                </span>
              </div>
              <ProgressBar value={ratio} colorClassName={isCutoff ? 'bg-rose-500' : subject.color} />
            </div>
          );
        })}
      </div>

      <div className="mb-6 flex gap-2">
        <Link
          to="/mock-exam"
          className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          もう一度挑戦する
        </Link>
        <Link
          to="/"
          className="flex-1 rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-800"
        >
          ホームへ
        </Link>
      </div>

      {wrongAnswers.length > 0 && (
        <div>
          <h2 className="mb-3 text-sm font-bold text-slate-700">間違えた問題({wrongAnswers.length}問)</h2>
          <div className="space-y-4">
            {wrongAnswers.map((a) => {
              const q = getQuestionById(a.questionId);
              if (!q) return null;
              const subjectMeta = SUBJECT_MAP[q.subject];
              return (
                <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <span className={`mb-3 inline-block rounded-md px-2 py-0.5 text-xs font-semibold text-white ${subjectMeta.color}`}>
                    {subjectMeta.name}
                  </span>
                  <p className="mb-3 whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-slate-900">
                    {q.text}
                  </p>
                  <AnswerChoices
                    choices={q.choices}
                    selectedIndex={a.selectedIndex}
                    correctIndex={q.correctIndex}
                    revealed
                    disabled
                    onSelect={() => {}}
                  />
                  <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                    <p className="mb-1 font-semibold text-slate-900">解説</p>
                    <p className="whitespace-pre-wrap">{q.explanation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
