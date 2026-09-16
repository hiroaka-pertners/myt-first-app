import { useState } from 'react';
import type { Question } from '../types';
import { explainQuestion } from '../api/client';

export default function AiExplainPanel({
  question,
  selectedIndex,
}: {
  question: Question;
  selectedIndex: number | null;
}) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [explanation, setExplanation] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleClick = async () => {
    setState('loading');
    setErrorMessage('');
    try {
      const res = await explainQuestion(question, selectedIndex);
      setExplanation(res.explanation);
      setState('done');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'AI解説の取得に失敗しました。');
      setState('error');
    }
  };

  if (state === 'idle') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 rounded-lg border border-violet-300 bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
      >
        ✨ AIにもっと深掘りしてもらう
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-semibold text-violet-700">✨ AI深掘り解説</span>
        {state === 'error' && (
          <button type="button" onClick={handleClick} className="text-xs font-medium text-violet-700 underline">
            再試行
          </button>
        )}
      </div>
      {state === 'loading' && <p className="text-violet-600">Gemini が解説を生成しています…</p>}
      {state === 'error' && <p className="text-rose-600">{errorMessage}</p>}
      {state === 'done' && <p className="whitespace-pre-wrap leading-relaxed text-slate-800">{explanation}</p>}
    </div>
  );
}
