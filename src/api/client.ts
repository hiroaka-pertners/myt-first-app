import type { AiGeneratedQuestion, Question, SubjectId } from '../types';

async function request<TResponse>(url: string, init?: RequestInit): Promise<TResponse> {
  const res = await fetch(url, init);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.error ?? `リクエストに失敗しました (${res.status})`);
  }
  return res.json() as Promise<TResponse>;
}

function postJSON<TResponse>(url: string, body: unknown): Promise<TResponse> {
  return request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
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

export function fetchCustomQuestions(): Promise<{ questions: Record<SubjectId, Question[]> }> {
  return request('/api/custom-questions');
}

export function adoptQuestion(subject: SubjectId, question: AiGeneratedQuestion): Promise<{ question: Question }> {
  return postJSON('/api/custom-questions', { subject, question });
}

export function deleteCustomQuestion(id: string): Promise<{ ok: true }> {
  return request(`/api/custom-questions/${id}`, { method: 'DELETE' });
}
