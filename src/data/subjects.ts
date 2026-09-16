import type { SubjectMeta, SubjectId } from '../types';

export const SUBJECTS: SubjectMeta[] = [
  {
    id: 'economics',
    name: '経済学・経済政策',
    shortName: '経済',
    color: 'bg-blue-600',
    accent: 'text-blue-600',
  },
  {
    id: 'finance',
    name: '財務・会計',
    shortName: '財務',
    color: 'bg-emerald-600',
    accent: 'text-emerald-600',
  },
  {
    id: 'management',
    name: '企業経営理論',
    shortName: '企経',
    color: 'bg-violet-600',
    accent: 'text-violet-600',
  },
  {
    id: 'operations',
    name: '運営管理',
    shortName: '運営',
    color: 'bg-amber-600',
    accent: 'text-amber-600',
  },
  {
    id: 'legal',
    name: '経営法務',
    shortName: '法務',
    color: 'bg-rose-600',
    accent: 'text-rose-600',
  },
  {
    id: 'it',
    name: '経営情報システム',
    shortName: 'IT',
    color: 'bg-cyan-600',
    accent: 'text-cyan-600',
  },
  {
    id: 'smePolicy',
    name: '中小企業経営・中小企業政策',
    shortName: '中小',
    color: 'bg-orange-600',
    accent: 'text-orange-600',
  },
];

export const SUBJECT_MAP: Record<SubjectId, SubjectMeta> = SUBJECTS.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<SubjectId, SubjectMeta>,
);
