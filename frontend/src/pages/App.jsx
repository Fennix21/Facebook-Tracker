import React, { useMemo, useState } from 'react';
import api from '../services/api';

const initialCheckin = { expected_action: '', done: true, reason: '' };

export default function App() {
  const [mode, setMode] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkin, setCheckin] = useState(initialCheckin);
  const [checkedToday, setCheckedToday] = useState(false);
  const [dashboard, setDashboard] = useState(null);
  const [feedback, setFeedback] = useState('');

  const canViewDashboard = useMemo(() => token && checkedToday, [token, checkedToday]);

  const login = async () => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setFeedback('Sesión iniciada. Ejecuta tu check-in.');
  };

  const register = async () => {
    await api.post('/auth/register', { name, email, password });
    setMode('login');
    setFeedback('Cuenta creada. Ahora inicia sesión.');
  };

  const recover = async () => {
    const { data } = await api.post('/auth/recover', { email });
    setFeedback(data.message);
  };

  const submitCheckin = async () => {
    const { data } = await api.post('/checkin', checkin);
    setCheckedToday(true);
    setFeedback(data.message);
  };

  const loadDashboard = async () => {
    const { data } = await api.get('/dashboard');
    setDashboard(data);
  };

  if (!token) {
    return (
      <main className="shell">
        <h1>Accountability Partner</h1>
        {mode === 'register' && <input placeholder="name" onChange={(e) => setName(e.target.value)} />}
        <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        {mode !== 'recover' && <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />}
        {mode === 'login' && <button onClick={login}>Entrar</button>}
        {mode === 'register' && <button onClick={register}>Crear cuenta</button>}
        {mode === 'recover' && <button onClick={recover}>Recuperar contraseña</button>}
        <div>
          <button onClick={() => setMode('login')}>Login</button>
          <button onClick={() => setMode('register')}>Registro</button>
          <button onClick={() => setMode('recover')}>Recuperación</button>
        </div>
        <p>{feedback}</p>
      </main>
    );
  }

  if (!checkedToday) {
    return <main className="shell"><h2>Check-in obligatorio</h2><label>1. ¿Qué debías hacer hoy?</label><input onChange={(e)=>setCheckin({...checkin, expected_action:e.target.value})} /><label>2. ¿Lo hiciste?</label><select onChange={(e)=>setCheckin({...checkin, done:e.target.value==='true'})}><option value="true">Sí</option><option value="false">No</option></select><label>3. ¿Por qué?</label><textarea onChange={(e)=>setCheckin({...checkin, reason:e.target.value})} /><button onClick={submitCheckin}>Registrar comportamiento</button><p>{feedback}</p></main>;
  }

  return <main className="shell"><h2>Dashboard de realidad</h2><button onClick={loadDashboard}>Cargar datos reales</button>{canViewDashboard && dashboard && <section><p>Puntos: {dashboard.profile.points}</p><p>Racha: {dashboard.profile.streak}</p><p>Nivel: {dashboard.profile.level}</p><h3>Objetivos</h3><ul>{dashboard.objectives.map(o=><li key={o.id}>{o.title} - {o.status}</li>)}</ul><h3>Historial reciente</h3><ul>{dashboard.history.map(h=><li key={h.id}>{h.expected_action} / {h.done ? 'Cumplido' : 'Falló'}</li>)}</ul></section>}</main>;
}
