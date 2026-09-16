import type { MockExamAnswer, MockExamResult, Question, SubjectId } from '../types';
import { SUBJECTS } from '../data/subjects';

const PASS_TOTAL_RATIO = 0.6; // 総得点60%以上
const CUTOFF_SUBJECT_RATIO = 0.4; // 科目ごとの足切りライン(40%未満)

export function calculateMockResult(
  answers: MockExamAnswer[],
  questions: Question[],
  startedAt: number,
  finishedAt: number,
): MockExamResult {
  const questionById = new Map(questions.map((q) => [q.id, q]));

  const subjectScores = SUBJECTS.reduce(
    (acc, s) => {
      acc[s.id] = { correct: 0, total: 0 };
      return acc;
    },
    {} as Record<SubjectId, { correct: number; total: number }>,
  );

  let totalCorrect = 0;

  for (const answer of answers) {
    const question = questionById.get(answer.questionId);
    if (!question) continue;
    subjectScores[question.subject].total += 1;
    if (answer.selectedIndex !== null && answer.selectedIndex === question.correctIndex) {
      subjectScores[question.subject].correct += 1;
      totalCorrect += 1;
    }
  }

  const totalQuestions = questions.length;
  const cutoffSubjects: SubjectId[] = SUBJECTS.filter((s) => {
    const score = subjectScores[s.id];
    return score.total > 0 && score.correct / score.total < CUTOFF_SUBJECT_RATIO;
  }).map((s) => s.id);

  const totalRatio = totalQuestions > 0 ? totalCorrect / totalQuestions : 0;
  const passed = cutoffSubjects.length === 0 && totalRatio >= PASS_TOTAL_RATIO;

  return {
    startedAt,
    finishedAt,
    answers,
    subjectScores,
    totalCorrect,
    totalQuestions,
    passed,
    cutoffSubjects,
  };
}
