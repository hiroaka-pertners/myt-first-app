import { useState } from 'react';
import type { AiGeneratedQuestion } from '../types';
import { SUBJECTS } from '../data/subjects';
import { generateQuestions } from '../api/client';
import { useCustomQuestions } from '../hooks/useCustomQuestions';
import AnswerChoices from '../components/AnswerChoices';

export default function AiGeneratePage() {
  const [subjectId, setSubjectId] = useState(SUBJECTS[0].id);
  const [count, setCount] = useState(3);
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [generated, setGenerated] = useState<AiGeneratedQuestion[]>([]);
  const [adoptedIndexes, setAdoptedIndexes] = useState<Set<number>>(new Set());
  const [adoptingIndex, setAdoptingIndex] = useState<number | null>(null);

  const { adopt } = useCustomQuestions();

  const subjectName = SUBJECTS.find((s) => s.id === subjectId)?.name ?? '';

  const handleGenerate = async () => {
    setState('loading');
    setErrorMessage('');
    setAdoptedIndexes(new Set());
    try {
      const res = await generateQuestions(subjectName, count);
      setGenerated(res.questions);
      setState('done');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'AI問題生成に失敗しました。');
      setState('error');
    }
  };

  const handleAdopt = async (index: number) => {
    setAdoptingIndex(index);
    try {
      await adopt(subjectId, generated[index]);
      setAdoptedIndexes((prev) => new Set(prev).add(index));
    } catch (err) {
      alert(err instanceof Error ? err.message : '採用に失敗しました。');
    } finally {
      setAdoptingIndex(null);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="mb-1 text-lg font-bold text-slate-900">✨ AI問題生成</h1>
      <p className="mb-6 text-sm text-slate-500">
        Gemini 2.5 Flash が指定した科目・問題数に応じて、追加の演習問題をその場で生成します。気に入った問題は
        「この科目に採用する」で保存すると、以後はその科目の演習に追加され、正答率などの記録対象にもなります。
      </p>

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="mb-1 block text-xs font-semibold text-slate-600">科目</label>
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value as typeof subjectId)}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        >
          {SUBJECTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        <label className="mb-1 block text-xs font-semibold text-slate-600">生成する問題数</label>
        <input
          type="number"
          min={1}
          max={10}
          value={count}
          onChange={(e) => setCount(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />

        <button
          type="button"
          onClick={handleGenerate}
          disabled={state === 'loading'}
          className="w-full rounded-lg bg-violet-700 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-violet-800 disabled:opacity-60"
        >
          {state === 'loading' ? '生成中…' : 'AIに問題を生成してもらう'}
        </button>
        {state === 'error' && <p className="mt-2 text-sm text-rose-600">{errorMessage}</p>}
      </div>

      {state === 'done' && (
        <div className="space-y-4">
          {generated.map((q, i) => {
            const adopted = adoptedIndexes.has(i);
            return (
              <div key={i} className="rounded-xl border border-violet-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-block rounded-md bg-violet-600 px-2 py-0.5 text-xs font-semibold text-white">
                    AI生成問題 {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAdopt(i)}
                    disabled={adopted || adoptingIndex === i}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition ${
                      adopted
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-violet-100 text-violet-700 hover:bg-violet-200 disabled:opacity-60'
                    }`}
                  >
                    {adopted ? '採用済み ✓' : adoptingIndex === i ? '保存中…' : `${subjectName}に採用する`}
                  </button>
                </div>
                <p className="mb-3 whitespace-pre-wrap text-[15px] font-medium leading-relaxed text-slate-900">
                  {q.text}
                </p>
                <AnswerChoices
                  choices={q.choices}
                  selectedIndex={null}
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
      )}
    </div>
  );
}
