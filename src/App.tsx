import { useEffect, useState } from 'react';
import { lessons, allLessons, type Exercise } from './data';
import { m1Lessons } from './m1';
import { m3Lessons } from './m3';
import { bumpStreak, isAdminRole, modulePct, overallPct, type Progress, type StaffRole } from './store';
import { firebaseConfigured } from './firebase';
import { useCloud, login, logout, register, authErrorEs, loadTeam, updateUserRole, type UserDoc, type TeamRow } from './cloud';

type View = { s: 'home' } | { s: 'path' } | { s: 'path1' } | { s: 'path3' } | { s: 'lesson'; id: number };
const pathFor = (id: number) => id >= 200 ? 'path3' as const : id > 100 ? 'path1' as const : 'path' as const;
const asset = (f: string) => `${import.meta.env.BASE_URL}${f}`;
const roleEs: Record<StaffRole, string> = { colaborador: 'colaborador', supervisor: 'supervisor', gerente: 'gerente' };

const md = (t: string) => t.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((x, i) =>
  x.startsWith('**') ? <strong key={i}>{x.slice(2, -2)}</strong> : x.startsWith('*') ? <em key={i}>{x.slice(1, -1)}</em> : x);

export default function App() {
  if (!firebaseConfigured) {
    return (
      <div className="app"><main className="card-stack center">
        <h1>Falta configurar Firebase</h1>
        <p className="muted">Esta versión guarda las cuentas y el avance en la nube. Copia <b>.env.example</b> a <b>.env</b>, llena los datos de tu proyecto Firebase y vuelve a compilar. Revisa <b>SETUP.md</b>.</p>
      </main></div>
    );
  }
  return <CloudApp />;
}

function CloudApp() {
  const { authReady, authUser, me, progress: p, setProgress: setP, error, setError } = useCloud();
  const [view, setView] = useState<View>({ s: 'home' });
  const [adminOk, setAdminOk] = useState(false);
  const current = allLessons.find(l => !p.completed.includes(l.id)) ?? allLessons[allLessons.length - 1];

  if (!authReady) return <div className="app"><main className="card-stack center"><p className="muted">Cargando…</p></main></div>;
  if (!authUser) return <div className="app"><AuthScreen /></div>;
  if (!me) return <div className="app"><main className="card-stack center"><p className="muted">{error || 'Cargando tu perfil…'}</p>
    <button className="btn ghost" onClick={() => logout()}>Salir</button></main></div>;

  const showAdmin = adminOk && isAdminRole(me.role);

  return (
    <div className="app">
      {view.s !== 'lesson' && (
        <Header p={p} onHome={() => setView({ s: 'home' })} me={me} adminOk={adminOk}
          onAdmin={() => setAdminOk(true)} onExitAdmin={() => setAdminOk(false)}
          onLogout={() => { setAdminOk(false); setView({ s: 'home' }); logout(); }} />
      )}
      {error && <p className="feedback bad" onClick={() => setError('')}>{error}</p>}
      {showAdmin ? (
        <Admin me={me} />
      ) : (
        <>
          {view.s === 'home' && <Home p={p} current={current.id} go={setView} />}
          {view.s === 'path' && <Path p={p} go={setView} />}
          {view.s === 'path1' && <Path1 p={p} go={setView} />}
          {view.s === 'path3' && <Path3 p={p} go={setView} />}
          {view.s === 'lesson' && <Player id={view.id} exit={() => setView({ s: pathFor(view.id) })}
            finish={(xp, passed) => setP(o => bumpStreak({ ...o, xp: o.xp + xp, completed: passed && !o.completed.includes(view.id) ? [...o.completed, view.id] : o.completed, completedModules: passed && view.id === 9 && !o.completedModules.includes(0) ? [...o.completedModules, 0] : passed && view.id === 125 && !o.completedModules.includes(1) ? [...o.completedModules, 1] : passed && view.id === 209 && !o.completedModules.includes(2) ? [...o.completedModules, 2] : o.completedModules }))}
            next={() => setView({ s: pathFor(view.id) })} />}
        </>
      )}
    </div>
  );
}

function Header({ p, onHome, me, adminOk, onAdmin, onExitAdmin, onLogout }: {
  p: Progress; onHome: () => void; me: UserDoc; adminOk: boolean; onAdmin: () => void; onExitAdmin: () => void; onLogout: () => void;
}) {
  return (
    <header className="top">
      <button className="brand" onClick={() => { onExitAdmin(); onHome(); }}>
        <img className="logo-mascot" src={asset("mascot.jpg")} alt="" />
        <img className="logo-main" src={asset("logo-farmatodo-v2.jpg")} alt="Farmatodo" />
      </button>
      <div className="stats"><span title="Racha">🔥 {p.streak}</span><span title="XP">⭐ {p.xp} XP</span></div>
      <div className="profile">
        <span>👤 {me.name} · {roleEs[me.role]}{me.region ? ` · ${me.region}` : ''}</span>
        {isAdminRole(me.role) && (adminOk
          ? <button className="btn small ghost" onClick={onExitAdmin}>Vista colaborador</button>
          : <button className="btn small" onClick={onAdmin}>Panel admin</button>)}
        <button className="btn small ghost" onClick={onLogout}>Salir</button>
      </div>
    </header>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    if (mode === 'register' && !name.trim()) { setErr('Escribe tu nombre.'); return; }
    setBusy(true);
    try { mode === 'login' ? await login(email, pass) : await register(name, email, pass); }
    catch (x) { setErr(authErrorEs(x)); }
    finally { setBusy(false); }
  };
  return (
    <main className="card-stack">
      <div className="gate-logos">
        <img className="logo-mascot" src={asset("mascot.jpg")} alt="" />
        <img className="logo-main" src={asset("logo-farmatodo-v2.jpg")} alt="Farmatodo Farmacias" />
      </div>
      <h1>Capacitación Farmatodo</h1>
      <p className="muted">{mode === 'login' ? 'Inicia sesión para continuar con tu avance.' : 'Crea tu cuenta. Tu avance se guarda en la nube.'}</p>
      <div className="card">
        <h2>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h2>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {mode === 'register' && <input placeholder="Nombre completo" value={name} onChange={e => setName(e.target.value)} autoComplete="name" />}
          <input type="email" placeholder="Correo" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
          <input type="password" placeholder="Contraseña (mín. 6 caracteres)" value={pass} onChange={e => setPass(e.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          {err && <p className="feedback bad">{err}</p>}
          <button className="btn" disabled={busy}>{busy ? 'Espera…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
        </form>
        <button className="btn ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => { setErr(''); setMode(mode === 'login' ? 'register' : 'login'); }}>
          {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </main>
  );
}

function Admin({ me }: { me: UserDoc }) {
  const [team, setTeam] = useState<TeamRow[] | null>(null);
  const [err, setErr] = useState('');
  const [tick, setTick] = useState(0);
  useEffect(() => { loadTeam(me).then(setTeam).catch(() => setErr('No se pudo cargar el equipo. Revisa las reglas de Firestore.')); }, [me, tick]);
  if (err) return <main className="card-stack"><p className="feedback bad">{err}</p></main>;
  if (!team) return <main className="card-stack center"><p className="muted">Cargando equipo…</p></main>;
  const rows = team.map(({ user: s, progress: pr }) => ({
    s, pr, o: overallPct(pr.completed), m1: modulePct(pr.completed, 1), m2: modulePct(pr.completed, 2), m3: modulePct(pr.completed, 3),
  })).sort((a, b) => b.o - a.o || b.pr.xp - a.pr.xp);
  const cols = rows.filter(r => r.s.role === 'colaborador');
  const avg = cols.length ? Math.round(cols.reduce((a, r) => a + r.o, 0) / cols.length) : 0;
  const badges = {
    f: rows.filter(r => r.pr.completedModules.includes(0)).length,
    fam: rows.filter(r => r.pr.completedModules.includes(1)).length,
    c: rows.filter(r => r.pr.completedModules.includes(2)).length,
  };
  return (
    <main className="card-stack admin">
      <h1>Panel administrador</h1>
      <p className="muted">{me.role === 'gerente' ? 'Vista de toda la cadena.' : me.region ? `Vista de tu región: ${me.region}.` : 'Aún no tienes región asignada; pide al gerente que te asigne una.'}</p>
      <div className="grid2">
        <div className="stat"><b>{cols.length}</b><span>colaboradores</span></div>
        <div className="stat"><b>{avg}%</b><span>avance promedio</span></div>
      </div>
      <div className="grid2">
        <div className="stat"><b>{badges.f}</b><span>insignia Fundamentos</span></div>
        <div className="stat"><b>{badges.fam}</b><span>insignia Familias</span></div>
      </div>
      <div className="stat"><b>{badges.c}</b><span>insignia Casos</span></div>
      <button className="btn small ghost" onClick={() => setTick(t => t + 1)}>Actualizar</button>
      <div className="card">
        <h2>Ranking del equipo</h2>
        <div className="table">
          <div className="tr head"><span>Persona</span><span>Total</span><span>M1</span><span>M2</span><span>M3</span><span>XP</span></div>
          {rows.map(({ s, pr, o, m1, m2, m3 }) => (
            <div className="tr" key={s.uid}>
              <span><b>{s.name}</b><br /><span className="muted">{roleEs[s.role]}{s.region ? ` · ${s.region}` : ''} · 🔥 {pr.streak}</span></span>
              <span>{o}%</span><span>{m1}%</span><span>{m2}%</span><span>{m3}%</span><span>{pr.xp}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <h2>Detalle por persona</h2>
        {rows.map(({ s, pr, o, m1, m2, m3 }) => (
          <div key={s.uid} className="person">
            <b>{s.name}</b> <span className="muted">{s.email}</span>
            <div className="bar" title="Total"><i style={{ width: `${o}%` }} /></div>
            <p className="muted">M1 Fundamentos {m1}% · M2 Familias {m2}% · M3 Casos {m3}% · Lecciones {pr.completed.length}</p>
            {me.role === 'gerente' && s.uid !== me.uid && <RoleForm u={s} onSaved={() => setTick(t => t + 1)} />}
          </div>
        ))}
      </div>
    </main>
  );
}

function RoleForm({ u, onSaved }: { u: UserDoc; onSaved: () => void }) {
  const [role, setRole] = useState<StaffRole>(u.role);
  const [region, setRegion] = useState(u.region ?? '');
  const [msg, setMsg] = useState('');
  return (
    <form style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }} onSubmit={async e => {
      e.preventDefault(); setMsg('');
      try { await updateUserRole(u.uid, role, region); setMsg('Guardado ✓'); onSaved(); }
      catch { setMsg('No se pudo guardar.'); }
    }}>
      <select value={role} onChange={e => setRole(e.target.value as StaffRole)}>
        <option value="colaborador">Colaborador</option>
        <option value="supervisor">Supervisor</option>
        <option value="gerente">Gerente</option>
      </select>
      <input placeholder="Región (ej. Coatepeque)" value={region} onChange={e => setRegion(e.target.value)} />
      <button className="btn small">Guardar</button>
      {msg && <span className="muted">{msg}</span>}
    </form>
  );
}

function Home({ p, current, go }: { p: Progress; current: number; go: (v: View) => void }) {
  const lesson = allLessons.find(l => l.id === current)!;
  const done = p.completed.filter(i => i <= 8).length;
  const badge = p.completedModules.includes(0);
  const families = m1Lessons.filter(l => l.id < 125);
  const m2Done = families.filter(l => p.completed.includes(l.id)).length;
  const m2Badge = p.completedModules.includes(1) || p.completed.includes(125);
  const m2Next = families.find((l, i) => !p.completed.includes(l.id) && (i === 0 || p.completed.includes(families[i - 1].id)));
  const m2AllFam = m2Done === families.length;
  const m2Cp = m1Lessons.find(l => l.id === 125)!;
  const m3Core = m3Lessons.filter(l => l.id < 209);
  const m3Done = m3Core.filter(l => p.completed.includes(l.id)).length;
  const m3Badge = p.completedModules.includes(2) || p.completed.includes(209);
  const m3Next = m3Core.find((l, i) => !p.completed.includes(l.id) && (i === 0 || p.completed.includes(m3Core[i - 1].id)));
  const m3All = m3Done === m3Core.length;
  return (
    <main className="card-stack">
      <div className="home-hero">
        <img src={asset("mascot.jpg")} alt="Mascota Farmatodo" />
        <div className="bubble">
          <h1 style={{margin:0}}>¡Hola{p.name ? `, ${p.name}` : ''}! 👋</h1>
          <p className="muted" style={{margin:'6px 0 0'}}>Unos minutos al día y vas a asesorar con más seguridad en mostrador.</p>
        </div>
      </div>
      <div className="grid2">
        <div className="stat"><b>⭐ {p.xp}</b><span>XP total</span></div>
        <div className="stat"><b>🔥 {p.streak}</b><span>días de racha</span></div>
      </div>
      <div className="card">
        <span className="muted">Módulo 1 · Fundamentos · {done}/8 {badge && '· 🏅 Insignia Fundamentos'}</span>
        <div className="bar"><i style={{ width: `${done / 8 * 100}%` }} /></div>
        <h2>{badge ? '🏅 ¡Módulo 1 completado! Sigue con Familias' : lesson.id === 9 ? lesson.title : `Lección ${lesson.id}: ${lesson.title}`}</h2>
        {badge
          ? <button className="btn ghost" onClick={() => go({ s: 'path' })}>Repasar ruta M1</button>
          : <button className="btn" disabled={!lesson.exercises} onClick={() => go({ s: 'lesson', id: lesson.id })}>Continuar</button>}
      </div>
      <div className="card">
        <span className="muted">Módulo 2 · Familias · {m2Done}/{families.length} {m2Badge && '· 🏅 Insignia Familias'}</span>
        <div className="bar"><i style={{ width: `${(m2Badge ? families.length : m2Done) / families.length * 100}%` }} /></div>
        <h2>{m2Badge ? '🏅 ¡Módulo 2 completado! Sigue con Casos' : m2AllFam ? m2Cp.title : m2Next ? `Familia ${families.indexOf(m2Next) + 1}: ${m2Next.title}` : `Familia 1: ${families[0].title}`}</h2>
        {m2Badge
          ? <button className="btn ghost" onClick={() => go({ s: 'path1' })}>Ver ruta M2</button>
          : m2AllFam
            ? <button className="btn" onClick={() => go({ s: 'lesson', id: 125 })}>Ir al checkpoint</button>
            : <button className="btn" onClick={() => go({ s: 'lesson', id: (m2Next ?? families[0]).id })}>Continuar M2</button>}
      </div>
      <div className="card">
        <span className="muted">Módulo 3 · Casos · {m3Done}/{m3Core.length} {m3Badge && '· 🏅 Insignia Casos'}</span>
        <div className="bar"><i style={{ width: `${(m3Badge ? m3Core.length : m3Done) / m3Core.length * 100}%` }} /></div>
        <h2>{m3Badge ? '🏅 ¡Módulo 3 completado!' : m3All ? 'Checkpoint Módulo 3' : m3Next ? `Lección ${m3Core.indexOf(m3Next) + 1}: ${m3Next.title}` : `Lección 1: ${m3Core[0].title}`}</h2>
        {m3Badge
          ? <button className="btn ghost" onClick={() => go({ s: 'path3' })}>Ver ruta M3</button>
          : m3All
            ? <button className="btn" onClick={() => go({ s: 'lesson', id: 209 })}>Ir al checkpoint</button>
            : <button className="btn" onClick={() => go({ s: 'lesson', id: (m3Next ?? m3Core[0]).id })}>Continuar M3</button>}
      </div>
      <button className="btn ghost" onClick={() => go({ s: 'path' })}>Ver ruta del Módulo 1 →</button>
      <button className="btn ghost" onClick={() => go({ s: 'path1' })}>Ver ruta del Módulo 2 →</button>
      <button className="btn ghost" onClick={() => go({ s: 'path3' })}>Ver ruta del Módulo 3 →</button>
    </main>
  );
}

const icons = ['💊', '💉', '🧪', '🫙', '🏷️', '💧', '📋', '🔬', '🏅'];
const offsets = [0, 1, 0, -1];
const STEP = 150, DX = 80;

function Path({ p, go }: { p: Progress; go: (v: View) => void }) {
  const allDone = lessons.every(l => p.completed.includes(l.id));
  const nodes = [...lessons.map((l, i) => ({ l, done: p.completed.includes(l.id), open: i === 0 || p.completed.includes(lessons[i - 1].id) })),
    { l: { id: 9, title: 'Checkpoint Módulo 1' }, done: p.completedModules.includes(0), open: allDone }];
  const currentId = nodes.find(n => n.open && !n.done)?.l.id;
  return (
    <main className="card-stack">
      <h1>Módulo 1 · Fundamentos</h1>
      <p className="muted">Sigue el camino: cada lección desbloquea la siguiente.</p>
      <div className="map" style={{ height: nodes.length * STEP }}>
        <svg className="trail" width={2 * DX + 40} height={nodes.length * STEP} viewBox={`${-DX - 20} 0 ${2 * DX + 40} ${nodes.length * STEP}`} aria-hidden="true">
          <path d={nodes.slice(1).reduce((d, _, j) => {
            const x0 = offsets[j % 4] * DX, y0 = j * STEP + 48, x1 = offsets[(j + 1) % 4] * DX, y1 = (j + 1) * STEP + 48;
            return `${d} C ${x0} ${y0 + STEP / 2}, ${x1} ${y1 - STEP / 2}, ${x1} ${y1}`;
          }, `M ${offsets[0] * DX} 48`)} />
        </svg>
        {nodes.map(({ l, done, open }, i) => {
          const state = done ? 'done' : l.id === currentId ? 'current' : open ? 'open' : 'locked';
          return (
            <div key={l.id} className="stop" style={{ top: i * STEP, transform: `translateX(${offsets[i % 4] * DX}px)` }}>
              <button className={`mnode ${state} ${l.id === 9 ? 'cp' : ''}`} disabled={!open} onClick={() => go({ s: 'lesson', id: l.id })}
                aria-label={`${l.id === 9 ? 'Checkpoint' : 'Lección ' + l.id}: ${l.title}`}>
                <span className="emoji">{icons[i]}</span>
                {state === 'locked' && <span className="lock">🔒</span>}
                {done && <span className="check">✓</span>}
              </button>
              <div className="mlabel">
                {state === 'current' && <span className="tag">Empezar</span>}
                <b>{l.id === 9 ? 'Checkpoint' : `Lección ${l.id}`}</b>
                <span>{l.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

const m1Icons = ['🤒', '🦵', '🤧', '😷', '🤒', '🔥', '🤢', '🌀', '🦠', '🍄', '🧴', '🩹', '👁️', '🍊', '🩸', '❤️', '💧', '🥑', '🩸', '🫁', '🧠', '📅', '🪱', '🌿'];

function Path1({ p, go }: { p: Progress; go: (v: View) => void }) {
  const families = m1Lessons.filter(l => l.id < 125);
  const allFam = families.every(l => p.completed.includes(l.id));
  const nodes = [
    ...families.map((l, i) => ({
      l, done: p.completed.includes(l.id), open: i === 0 || p.completed.includes(families[i - 1].id), cp: false as boolean,
    })),
    { l: m1Lessons.find(l => l.id === 125)!, done: p.completedModules.includes(1) || p.completed.includes(125), open: allFam, cp: true },
  ];
  const currentId = nodes.find(n => n.open && !n.done)?.l.id;
  return (
    <main className="card-stack">
      <h1>Módulo 2 · Familias de medicamentos</h1>
      <p className="muted">{p.completedModules.includes(0) ? 'Desbloqueado por completar el Módulo 1.' : 'Abierto en modo demo (normalmente se desbloquea al aprobar el checkpoint del Módulo 1).'}</p>
      <div className="map" style={{ height: nodes.length * STEP }}>
        <svg className="trail" width={2 * DX + 40} height={nodes.length * STEP} viewBox={`${-DX - 20} 0 ${2 * DX + 40} ${nodes.length * STEP}`} aria-hidden="true">
          <path d={nodes.slice(1).reduce((d, _, j) => {
            const x0 = offsets[j % 4] * DX, y0 = j * STEP + 48, x1 = offsets[(j + 1) % 4] * DX, y1 = (j + 1) * STEP + 48;
            return `${d} C ${x0} ${y0 + STEP / 2}, ${x1} ${y1 - STEP / 2}, ${x1} ${y1}`;
          }, `M ${offsets[0] * DX} 48`)} />
        </svg>
        {nodes.map(({ l, done, open, cp }, i) => {
          const state = done ? 'done' : l.id === currentId ? 'current' : open ? 'open' : 'locked';
          return (
            <div key={l.id} className="stop" style={{ top: i * STEP, transform: `translateX(${offsets[i % 4] * DX}px)` }}>
              <button className={`mnode ${state} ${cp ? 'cp' : ''}`} disabled={!open}
                onClick={() => go({ s: 'lesson', id: l.id })}
                aria-label={cp ? `Checkpoint: ${l.title}` : `Familia ${i + 1}: ${l.title}`}>
                <span className="emoji">{cp ? '🏅' : m1Icons[i] ?? '💊'}</span>
                {state === 'locked' && <span className="lock">🔒</span>}
                {done && <span className="check">✓</span>}
              </button>
              <div className="mlabel">
                {state === 'current' && <span className="tag">Empezar</span>}
                <b>{cp ? 'Checkpoint' : `Familia ${i + 1}`}</b>
                <span>{l.title.replace(/^Checkpoint Módulo 2$/, 'Insignia Familias')}</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

const m3Icons = ['👂', '🛒', '🤝', '🎁', '🟢', '🚨', '🤒', '❤️', '🏅'];

function Path3({ p, go }: { p: Progress; go: (v: View) => void }) {
  const core = m3Lessons.filter(l => l.id < 209);
  const allCore = core.every(l => p.completed.includes(l.id));
  const nodes = [
    ...core.map((l, i) => ({
      l, done: p.completed.includes(l.id), open: i === 0 || p.completed.includes(core[i - 1].id), cp: false as boolean,
    })),
    { l: m3Lessons.find(l => l.id === 209)!, done: p.completedModules.includes(2) || p.completed.includes(209), open: allCore, cp: true },
  ];
  const currentId = nodes.find(n => n.open && !n.done)?.l.id;
  return (
    <main className="card-stack">
      <h1>Módulo 3 · Casos de mostrador</h1>
      <p className="muted">{p.completedModules.includes(1) ? 'Desbloqueado por completar el Módulo 2.' : 'Abierto en modo demo (normalmente se desbloquea al aprobar el checkpoint del Módulo 2).'}</p>
      <div className="map" style={{ height: nodes.length * STEP }}>
        <svg className="trail" width={2 * DX + 40} height={nodes.length * STEP} viewBox={`${-DX - 20} 0 ${2 * DX + 40} ${nodes.length * STEP}`} aria-hidden="true">
          <path d={nodes.slice(1).reduce((d, _, j) => {
            const x0 = offsets[j % 4] * DX, y0 = j * STEP + 48, x1 = offsets[(j + 1) % 4] * DX, y1 = (j + 1) * STEP + 48;
            return `${d} C ${x0} ${y0 + STEP / 2}, ${x1} ${y1 - STEP / 2}, ${x1} ${y1}`;
          }, `M ${offsets[0] * DX} 48`)} />
        </svg>
        {nodes.map(({ l, done, open, cp }, i) => {
          const state = done ? 'done' : l.id === currentId ? 'current' : open ? 'open' : 'locked';
          return (
            <div key={l.id} className="stop" style={{ top: i * STEP, transform: `translateX(${offsets[i % 4] * DX}px)` }}>
              <button className={`mnode ${state} ${cp ? 'cp' : ''}`} disabled={!open}
                onClick={() => go({ s: 'lesson', id: l.id })}
                aria-label={cp ? `Checkpoint: ${l.title}` : `Lección ${i + 1}: ${l.title}`}>
                <span className="emoji">{cp ? '🏅' : m3Icons[i] ?? '💊'}</span>
                {state === 'locked' && <span className="lock">🔒</span>}
                {done && <span className="check">✓</span>}
              </button>
              <div className="mlabel">
                {state === 'current' && <span className="tag">Empezar</span>}
                <b>{cp ? 'Checkpoint' : `Lección ${i + 1}`}</b>
                <span>{cp ? 'Insignia Casos' : l.title}</span>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

function Player({ id, exit, finish, next }: { id: number; exit: () => void; finish: (xp: number, passed: boolean) => void; next: () => void }) {
  const lesson = [...allLessons, ...m1Lessons, ...m3Lessons].find(l => l.id === id)!;
  const all = lesson.exercises!;
  const [phase, setPhase] = useState<'tip' | 'play' | 'nohearts' | 'end'>('tip');
  const [queue, setQueue] = useState<Exercise[]>(all);
  const [idx, setIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [combo, setCombo] = useState(0);
  const [correctIds, setCorrectIds] = useState<Set<string>>(new Set());
  const [, setFailed] = useState<Exercise[]>([]);
  const [result, setResult] = useState<null | boolean>(null);
  const [toast, setToast] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [final, setFinal] = useState<{ pct: number; passed: boolean; bonus: number } | null>(null);

  const ex = queue[idx];
  const answer = (ok: boolean) => {
    setResult(ok);
    if (ok) {
      const c = combo + 1; setCombo(c);
      const gain = c >= 3 ? 15 : 10; setXp(x => x + gain);
      setToast(`+${gain} XP${c >= 3 ? ' 🔥 racha' : ''}`); setTimeout(() => setToast(''), 1200);
      setCorrectIds(s => new Set(s).add(ex.id));
    } else {
      setCombo(0); setHearts(h => h - 1); setMistakes(m => m + 1);
      setFailed(f => f.some(x => x.id === ex.id) ? f : [...f, ex]);
    }
  };
  const cont = () => {
    setResult(null);
    if (hearts <= 0) { setPhase('nohearts'); return; }
    if (idx + 1 < queue.length) { setIdx(idx + 1); return; }
    const pct = Math.round(correctIds.size / all.length * 100);
    const passed = pct >= 80;
    const bonus = passed && mistakes === 0 ? 25 : 0;
    setFinal({ pct, passed, bonus }); finish(xp + bonus, passed); setPhase('end');
  };
  const retryFailed = () => {
    const rest = all.filter(e => !correctIds.has(e.id));
    setQueue(rest); setFailed([]); setIdx(0); setHearts(5); setCombo(0); setXp(0); setPhase('play');
  };

  const progress = phase === 'tip' ? 0 : phase === 'end' ? 100 : (idx + (result !== null ? 1 : 0)) / queue.length * 100;
  return (
    <main className="player">
      <div className="pbar">
        <button className="x" onClick={exit} aria-label="Salir">✕</button>
        <div className="bar grow"><i style={{ width: `${progress}%` }} /></div>
        <span className="hearts">❤️ {hearts}</span>
      </div>
      {toast && <div className="toast">{toast}</div>}

      {phase === 'tip' && (
        <div className="card-stack">
          <span className="muted">{lesson.id === 9 || lesson.id === 125 || lesson.id === 209 ? 'Checkpoint' : lesson.id >= 200 ? `Módulo 3 · Lección ${lesson.id - 200}` : lesson.id > 100 ? `Módulo 2 · Familia ${lesson.id - 100}` : `Lección ${lesson.id}`} · Tip</span>
          <h1>{lesson.tip!.title}</h1>
          {lesson.tip!.body.map((b, i) => <p key={i} className="tip">{md(b)}</p>)}
          <button className="btn" onClick={() => setPhase('play')}>Empezar práctica →</button>
        </div>
      )}

      {phase === 'play' && ex && (
        <div className="card-stack">
          <span className="muted">{ex.label}</span>
          <h2>{ex.prompt}</h2>
          <ExerciseView key={ex.id + idx} ex={ex} locked={result !== null} onAnswer={answer} />
          {result !== null && (
            <div className={`feedback ${result ? 'ok' : 'bad'}`}>
              <b>{result ? '¡Correcto!' : 'No exactamente'}</b>
              <p>{ex.feedback}</p>
              <button className="btn" onClick={cont}>Continuar</button>
            </div>
          )}
        </div>
      )}

      {phase === 'nohearts' && (
        <div className="card-stack center">
          <h1>💔 Te quedaste sin vidas</h1>
          <p className="muted">Tranquilo: haz un repaso corto solo de lo que fallaste y recuperas tus 5 vidas.</p>
          <button className="btn" onClick={retryFailed}>Repaso corto</button>
        </div>
      )}

      {phase === 'end' && final && (
        <div className="card-stack center">
          <>{final.passed && <img className="end-mascot" src={asset("mascot.jpg")} alt="" />}<h1>{final.passed ? '🎉 ¡Lección superada!' : '📚 Casi lo logras'}</h1></>
          <div className="grid2">
            <div className="stat"><b>{final.pct}%</b><span>aciertos</span></div>
            <div className="stat"><b>+{xp + final.bonus}</b><span>XP ganado</span></div>
          </div>
          {final.bonus > 0 && <p>✨ Lección perfecta: +25 XP de bono</p>}
          {final.passed
            ? <><p className="muted">{lesson.id === 209 ? '🏅 ¡Ganaste el insignia Casos! La app ya cubre los 3 módulos.' : lesson.id === 125 ? '🏅 ¡Ganaste el insignia Familias! Sigue con el Módulo 3 · Casos.' : lesson.id >= 200 ? (lesson.id === 208 ? 'Desbloqueaste el Checkpoint Módulo 3' : (m3Lessons.some(l => l.id === lesson.id + 1) ? `Desbloqueaste: ${m3Lessons.find(l => l.id === lesson.id + 1)!.title}` : '¡Lección superada!')) : lesson.id > 100 ? (lesson.id === 124 ? 'Desbloqueaste el Checkpoint Módulo 2' : (m1Lessons.some(l => l.id === lesson.id + 1) ? `Desbloqueaste: ${m1Lessons.find(l => l.id === lesson.id + 1)!.title}` : '¡Familia superada!')) : lesson.id < 8 ? `Desbloqueaste la Lección ${lesson.id + 1}: ${lessons[lesson.id].title}` : lesson.id === 8 ? 'Desbloqueaste el Checkpoint Módulo 1' : '🏅 ¡Ganaste el insignia Fundamentos! Sigue con el Módulo 2'}</p>
              <button className="btn" onClick={next}>Siguiente</button></>
            : <><p className="muted">Necesitas 80% para pasar. Repite solo las que fallaste.</p>
              <button className="btn" onClick={retryFailed}>Repetir fallados</button></>}
        </div>
      )}
    </main>
  );
}

function ExerciseView({ ex, locked, onAnswer }: { ex: Exercise; locked: boolean; onAnswer: (ok: boolean) => void }) {
  const [pick, setPick] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [made, setMade] = useState<Record<number, number>>({});
  const [rights] = useState(() => ex.kind === 'match' ? ex.pairs.map((_, i) => i).sort(() => Math.random() - 0.5) : []);

  if (ex.kind === 'tf') {
    return <div className="opts two">{[true, false].map(v => (
      <button key={String(v)} disabled={locked} className={`opt ${locked && v === ex.answer ? 'right' : ''} ${locked && pick === +v && v !== ex.answer ? 'wrong' : ''}`}
        onClick={() => { setPick(+v); onAnswer(v === ex.answer); }}>{v ? 'Verdadero' : 'Falso'}</button>))}</div>;
  }
  if (ex.kind === 'match') {
    const choose = (r: number) => {
      if (left === null || locked) return;
      const m = { ...made, [left]: r }; setMade(m); setLeft(null);
      if (Object.keys(m).length === ex.pairs.length) onAnswer(Object.entries(m).every(([l, rr]) => +l === rr));
    };
    return (
      <div className="match">
        <div>{ex.pairs.map(([l], i) => (
          <button key={i} disabled={locked || i in made} className={`opt ${left === i ? 'sel' : ''} ${i in made ? 'paired' : ''}`} onClick={() => setLeft(i)}>{l}</button>))}</div>
        <div>{rights.map(r => {
          const used = Object.values(made).includes(r);
          return <button key={r} disabled={locked || used} className={`opt ${used ? 'paired' : ''}`} onClick={() => choose(r)}>{ex.pairs[r][1]}</button>;
        })}</div>
        {!locked && <p className="muted hint">Toca una rama y luego su descripción.</p>}
      </div>
    );
  }
  return <div className="opts">{ex.options.map((o, i) => (
    <button key={i} disabled={locked} className={`opt ${locked && i === ex.answer ? 'right' : ''} ${locked && pick === i && i !== ex.answer ? 'wrong' : ''}`}
      onClick={() => { setPick(i); onAnswer(i === ex.answer); }}>{o}</button>))}</div>;
}
