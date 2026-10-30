import { useEffect, useRef, useState } from 'react';
import {
  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, type User,
} from 'firebase/auth';
import { collection, doc, getDoc, getDocs, onSnapshot, runTransaction, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { initProgress, type Progress, type StaffRole } from './store';

export interface UserDoc { uid: string; email: string; name: string; role: StaffRole; region: string | null; sucursal: string | null }
export interface TeamRow { user: UserDoc; progress: Progress }

const cacheKey = (uid: string) => `farma-cloud-progress-${uid}`;

export function authErrorEs(e: unknown): string {
  const code = (e as { code?: string })?.code ?? '';
  const map: Record<string, string> = {
    'auth/invalid-email': 'Correo no válido.',
    'auth/missing-password': 'Escribe tu contraseña.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/email-already-in-use': 'Ese correo ya tiene cuenta. Inicia sesión.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/wrong-password': 'Correo o contraseña incorrectos.',
    'auth/user-not-found': 'Correo o contraseña incorrectos.',
    'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
    'auth/network-request-failed': 'Sin conexión. Revisa tu internet.',
  };
  return map[code] ?? 'Ocurrió un error. Intenta de nuevo.';
}

export const login = (email: string, pass: string) => signInWithEmailAndPassword(auth!, email.trim(), pass);
export const logout = () => signOut(auth!);

/** Register + create users/{uid}. First user ever (no meta/bootstrap doc) becomes admin. */
export async function register(name: string, email: string, pass: string) {
  const cred = await createUserWithEmailAndPassword(auth!, email.trim(), pass);
  await updateProfile(cred.user, { displayName: name.trim() });
  await createUserDoc(cred.user, name.trim());
}

async function createUserDoc(u: User, name: string) {
  const d = db!;
  const userRef = doc(d, 'users', u.uid);
  const bootRef = doc(d, 'meta', 'bootstrap');
  await runTransaction(d, async tx => {
    const existing = await tx.get(userRef);
    if (existing.exists()) return;
    const boot = await tx.get(bootRef);
    const first = !boot.exists();
    if (first) tx.set(bootRef, { uid: u.uid, createdAt: serverTimestamp() });
    tx.set(userRef, {
      email: u.email ?? '', name: name || u.displayName || u.email || 'Colaborador',
      role: first ? 'admin' : 'colaborador', region: null, sucursal: null, createdAt: serverTimestamp(),
    });
  });
}

function toProgress(data: Record<string, unknown> | undefined, name: string): Progress {
  return {
    ...initProgress, name, nameSet: true,
    xp: Number(data?.xp ?? 0),
    completed: (data?.completed as number[]) ?? [],
    streak: Number(data?.streak ?? 0),
    lastDay: String(data?.lastDay ?? ''),
    completedModules: (data?.completedModules as number[]) ?? [],
  };
}

export function useCloud() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [me, setMe] = useState<UserDoc | null>(null);
  const [progress, setProgressState] = useState<Progress>(initProgress);
  const [error, setError] = useState('');
  const progRef = useRef(progress);

  useEffect(() => onAuthStateChanged(auth!, u => { setAuthUser(u); setAuthReady(true); if (!u) { setMe(null); setProgressState(initProgress); } }), []);

  useEffect(() => {
    if (!authUser) return;
    const uid = authUser.uid;
    let alive = true;
    const unsub = onSnapshot(doc(db!, 'users', uid), async snap => {
      if (!snap.exists()) {
        // e.g. account created but doc write failed — create it now
        try { await createUserDoc(authUser, authUser.displayName ?? ''); } catch { setError('No se pudo crear tu perfil.'); }
        return;
      }
      const d = snap.data();
      setMe({ uid, email: d.email, name: d.name, role: d.role, region: d.region ?? null, sucursal: d.sucursal ?? null });
    }, () => setError('No se pudo leer tu perfil. Revisa las reglas de Firestore.'));
    (async () => {
      try {
        const cached = localStorage.getItem(cacheKey(uid));
        if (cached) { const c = JSON.parse(cached) as Progress; progRef.current = c; setProgressState(c); }
        const ps = await getDoc(doc(db!, 'progress', uid));
        if (!alive) return;
        const p = toProgress(ps.exists() ? ps.data() : undefined, authUser.displayName ?? '');
        progRef.current = p; setProgressState(p);
      } catch { setError('No se pudo cargar tu avance desde la nube.'); }
    })();
    return () => { alive = false; unsub(); };
  }, [authUser]);

  const setProgress = (fn: (o: Progress) => Progress) => {
    if (!authUser) return;
    const next = fn(progRef.current);
    progRef.current = next; setProgressState(next);
    localStorage.setItem(cacheKey(authUser.uid), JSON.stringify(next));
    setDoc(doc(db!, 'progress', authUser.uid), {
      xp: next.xp, completed: next.completed, streak: next.streak, lastDay: next.lastDay,
      completedModules: next.completedModules, updatedAt: serverTimestamp(),
    }).catch(() => setError('No se pudo guardar el avance en la nube. Se reintentará en tu próxima lección.'));
  };

  return { authReady, authUser, me, progress, setProgress, error, setError } as const;
}

/** Loads team visible to a supervisor (own region) or gerente (all). */
export async function loadTeam(me: UserDoc): Promise<TeamRow[]> {
  const [us, ps] = await Promise.all([getDocs(collection(db!, 'users')), getDocs(collection(db!, 'progress'))]);
  const prog = new Map(ps.docs.map(d => [d.id, d.data()]));
  return us.docs
    .map(d => ({ uid: d.id, email: d.data().email, name: d.data().name, role: d.data().role, region: d.data().region ?? null, sucursal: d.data().sucursal ?? null } as UserDoc))
    .filter(u => me.role === 'admin' || me.role === 'gerente' || u.uid === me.uid
      || (me.role === 'supervisor' && !!me.region && u.region === me.region)
      || (me.role === 'encargado' && !!me.sucursal && u.sucursal === me.sucursal))
    .map(u => ({ user: u, progress: toProgress(prog.get(u.uid), u.name) }));
}

const clean = (v: string | null) => v && v.trim() ? v.trim() : null;
export const updateUserRole = (uid: string, role: StaffRole, region: string | null, sucursal: string | null) =>
  updateDoc(doc(db!, 'users', uid), { role, region: clean(region), sucursal: clean(sucursal) });
