import { useEffect, useState } from 'react';
import type { Question } from '../types';
import { SUBJECT_MAP } from '../data/subjects';
import AnswerChoices from './AnswerChoices';
import AiExplainPanel from './AiExplainPanel';
import { useProgress } from '../hooks/useProgress';

export default function QuestionPanel({
  question,
  indexLabel,
}: {
  question: Question;
  indexLabel?: string;
}) {
  const { answers, recordAnswer, toggleBookmark, isBookmarked } = useProgress();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const existing = answers[question.id];
    setSelectedIndex(existing ? existing.selectedIndex : null);
    setRevealed(Boolean(existing));
  }, [question.id, answers]);

  const handleSelect = (index: number) => {
    if (revealed) return;
    setSelectedIndex(index);
    setRevealed(true);
    recordAnswer(question.id, index, question.correctIndex);
  };

  const subjectMeta = SUBJECT_MAP[question.subject];
  const bookmarked = isBookmarked(question.id);
  const isCorrect = revealed && selectedIndex === question.correctIndex;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs">
          <span className={`rounded-md px-2 py-0.5 font-semibold text-white ${subjectMeta.color}`}>
            {subjectMeta.name}
          </span>
          {indexLabel && <span className="text-slate-500">{indexLabel}</span>}
        </div>
        <button
          type="button"
          onClick={() => toggleBookmark(question.id)}
          aria-pressed={bookmarked}
          className={`rounded-md px-2 py-1 text-lg leading-none transition ${
            bookmarked ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'
          }`}
          title="ブックマーク"
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>

      <p className="mb-4 whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-slate-900">
        {question.text}
      </p>

      <AnswerChoices
        choices={question.choices}
        selectedIndex={selectedIndex}
        correctIndex={question.correctIndex}
        revealed={revealed}
        disabled={revealed}
        onSelect={handleSelect}
      />

      {revealed && (
        <div className="mt-4 space-y-3">
          <div
            className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
              isCorrect ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-rose-300 bg-rose-50 text-rose-700'
            }`}
          >
            {isCorrect ? '正解です！' : '不正解です'}
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
            <p className="mb-1 font-semibold text-slate-900">解説</p>
            <p className="whitespace-pre-wrap">{question.explanation}</p>
          </div>
          <AiExplainPanel question={question} selectedIndex={selectedIndex} />
        </div>
      )}
    </div>
  );
}
