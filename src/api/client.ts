import type { AiGeneratedQuestion, Question } from '../types';

async function postJSON<TResponse>(url: string, body: unknown): Promise<TResponse> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.error ?? `リクエストに失敗しました (${res.status})`);
  }
  return res.json() as Promise<TResponse>;
}

export function explainQuestion(question: Question, selectedIndex: number | null): Promise<{ explanation: string }> {
  return postJSON('/api/explain', {
    question: question.text,
    choices: question.choices,
    correctIndex: question.correctIndex,
    selectedIndex,
    baseExplanation: question.explanation,
  });
}

export function generateQuestions(
  subjectName: string,
  count: number,
): Promise<{ questions: AiGeneratedQuestion[] }> {
  return postJSON('/api/generate-questions', { subjectName, count });
}
