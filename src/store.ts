import { useEffect, useState } from 'react';

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

export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
}

export interface TeamState {
  adminPin: string;
  staff: Staff[];
  /** progress by staff id */
  byStaff: Record<string, Progress>;
  /** who is logged in on this device */
  activeStaffId: string | null;
}

const KEY = 'farma-progress-v1';
const TEAM_KEY = 'farma-team-v2';

export const initProgress: Progress = {
  name: '', nameSet: false, xp: 0, completed: [], streak: 0, lastDay: '', completedModules: [],
};

const demoStaff: Staff[] = [
  { id: 's1', name: 'María López', role: 'colaborador' },
  { id: 's2', name: 'Carlos Méndez', role: 'colaborador' },
  { id: 's3', name: 'José Pérez', role: 'colaborador' },
  { id: 'sup1', name: 'Supervisor', role: 'supervisor' },
  { id: 'ger1', name: 'Gerente', role: 'gerente' },
];

function demoProgress(name: string, xp: number, completed: number[], modules: number[], streak: number): Progress {
  return { name, nameSet: true, xp, completed, streak, lastDay: today(), completedModules: modules };
}

export function defaultTeam(): TeamState {
  return {
    adminPin: '2468',
    staff: demoStaff,
    activeStaffId: null,
    byStaff: {
      s1: demoProgress('María López', 420, [1, 2, 3, 4, 5, 6, 7, 8, 9, 101, 102, 103, 104, 105], [0], 4),
      s2: demoProgress('Carlos Méndez', 180, [1, 2, 3, 4, 5], [], 2),
      s3: demoProgress('José Pérez', 780, [
        1, 2, 3, 4, 5, 6, 7, 8, 9,
        ...Array.from({ length: 24 }, (_, i) => 101 + i), 125,
        201, 202, 203,
      ], [0, 1], 7),
      sup1: { ...initProgress, name: 'Supervisor', nameSet: true },
      ger1: { ...initProgress, name: 'Gerente', nameSet: true },
    },
  };
}

export const today = () => new Date().toLocaleDateString('en-CA');

export function loadTeam(): TeamState {
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    if (!raw) {
      // migrate single-user progress into team if present
      const t = defaultTeam();
      try {
        const old = JSON.parse(localStorage.getItem(KEY) || '{}') as Partial<Progress>;
        if (old.nameSet && old.name) {
          const id = 'local-' + old.name.toLowerCase().replace(/\s+/g, '-');
          t.staff = [{ id, name: old.name, role: 'colaborador' }, ...t.staff];
          t.byStaff[id] = { ...initProgress, ...old };
          t.activeStaffId = id;
        }
      } catch { /* ignore */ }
      return t;
    }
    return { ...defaultTeam(), ...JSON.parse(raw) };
  } catch {
    return defaultTeam();
  }
}

export function saveTeam(t: TeamState) {
  localStorage.setItem(TEAM_KEY, JSON.stringify(t));
}

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

export function useTeam() {
  const [team, setTeam] = useState<TeamState>(() => loadTeam());
  useEffect(() => { saveTeam(team); }, [team]);

  const active = team.activeStaffId ? team.staff.find(s => s.id === team.activeStaffId) : null;
  const progress: Progress = team.activeStaffId
    ? (team.byStaff[team.activeStaffId] ?? { ...initProgress, name: active?.name ?? '', nameSet: !!active })
    : initProgress;

  const setProgress = (fn: (o: Progress) => Progress) => {
    setTeam(t => {
      if (!t.activeStaffId) return t;
      const prev = t.byStaff[t.activeStaffId] ?? { ...initProgress, name: active?.name ?? '', nameSet: true };
      return { ...t, byStaff: { ...t.byStaff, [t.activeStaffId]: fn(prev) } };
    });
  };

  return { team, setTeam, active, progress, setProgress } as const;
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
