export interface Progress {
  name: string;
  nameSet: boolean;
  xp: number;
  completed: number[];
  streak: number;
  lastDay: string;
  completedModules: number[];
}

export type StaffRole = 'colaborador' | 'supervisor' | 'gerente';

export const today = () => new Date().toLocaleDateString('en-CA');

/** Lesson ids that count toward each module (for admin %). */
export const MODULE_LESSONS = {
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  2: [...Array.from({ length: 24 }, (_, i) => 101 + i), 125],
  3: [201, 202, 203, 204, 205, 206, 207, 208, 209],
} as const;

export function modulePct(completed: number[], mod: 1 | 2 | 3): number {
  const ids = MODULE_LESSONS[mod];
  const n = ids.filter(id => completed.includes(id)).length;
  return Math.round((n / ids.length) * 100);
}

export function overallPct(completed: number[]): number {
  const all = [...MODULE_LESSONS[1], ...MODULE_LESSONS[2], ...MODULE_LESSONS[3]];
  return Math.round((all.filter(id => completed.includes(id)).length / all.length) * 100);
}

export function bumpStreak(p: Progress): Progress {
  const t = today();
  if (p.lastDay === t) return p;
  const y = new Date(); y.setDate(y.getDate() - 1);
  return { ...p, streak: p.lastDay === y.toLocaleDateString('en-CA') ? p.streak + 1 : 1, lastDay: t };
}

export function isAdminRole(role?: StaffRole) {
  return role === 'gerente' || role === 'supervisor';
}

export const initProgress: Progress = {
  name: '', nameSet: false, xp: 0, completed: [], streak: 0, lastDay: '', completedModules: [],
};
