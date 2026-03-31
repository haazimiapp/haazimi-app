import { useState, useEffect } from 'react';
import { TIME_LOGS as INITIAL_LOGS } from '../data/mockData';
import { GOOGLE_SCRIPT_URL } from '../data/config';
import { MapPin, Pencil, Trash2, X } from 'lucide-react';

const T = {
  en: {
    title: 'Log Time', sub: 'Record your daily attendance and work hours',
    verifying: 'Verifying location...', atCentre: '✓ At Centre',
    newEntry: 'New Time Entry', savedLocally: 'Data saved locally and synced to cloud when online.',
    syncing: '⟳ Syncing...', offline: '⚠ Offline — queued',
    logged: 'Time entry logged successfully!',
    date: 'Date', activity: 'Activity', numStudents: 'Number of Students',
    specify: 'Please specify', checkIn: 'Check In Time', checkOut: 'Check Out Time',
    duration: 'Duration', hours: 'hours', notes: 'Notes (optional)',
    logBtn: 'Log Hours', daysLogged: 'Days Logged', totalHours: 'Total Hours',
    dailyAvg: 'Daily Average', recentLog: 'Recent Session Log',
    dateCol: 'Date', inOut: 'In/Out', hoursCol: 'Hours', actCol: 'Activity', notesCol: 'Notes',
    synced: '✓ Synced', lastSynced: '✓ Last synced',
  },
  ar: {
    title: 'تسجيل الوقت', sub: 'سجّل حضورك اليومي وساعات عملك',
    verifying: 'جاري التحقق من الموقع...', atCentre: '✓ في المركز',
    newEntry: 'إدخال وقت جديد', savedLocally: 'البيانات محفوظة محلياً وتتزامن مع السحابة عند الاتصال.',
    syncing: '⟳ جاري المزامنة...', offline: '⚠ غير متصل — في الطابور',
    logged: 'تم تسجيل الدخول بنجاح!',
    date: 'التاريخ', activity: 'النشاط', numStudents: 'عدد الطلاب',
    specify: 'يرجى التحديد', checkIn: 'وقت الدخول', checkOut: 'وقت الخروج',
    duration: 'المدة', hours: 'ساعات', notes: 'ملاحظات (اختياري)',
    logBtn: 'سجّل الساعات', daysLogged: 'أيام مسجلة', totalHours: 'إجمالي الساعات',
    dailyAvg: 'المتوسط اليومي', recentLog: 'سجل الجلسات الأخيرة',
    dateCol: 'التاريخ', inOut: 'دخول/خروج', hoursCol: 'الساعات', actCol: 'النشاط', notesCol: 'ملاحظات',
    synced: '✓ تمت المزامنة', lastSynced: '✓ آخر مزامنة',
  },
  ur: {
    title: 'وقت ریکارڈ', sub: 'اپنی روزانہ حاضری اور کام کے اوقات ریکارڈ کریں',
    verifying: 'مقام کی تصدیق ہو رہی ہے...', atCentre: '✓ مرکز میں',
    newEntry: 'نیا وقت اندراج', savedLocally: 'ڈیٹا مقامی طور پر محفوظ ہے اور آن لائن ہونے پر کلاؤڈ سے ہم آہنگ ہو جائے گا۔',
    syncing: '⟳ ہم آہنگ ہو رہا ہے...', offline: '⚠ آف لائن — قطار میں',
    logged: 'وقت کا اندراج کامیابی سے ہو گیا!',
    date: 'تاریخ', activity: 'سرگرمی', numStudents: 'طلبہ کی تعداد',
    specify: 'براہ کرم بتائیں', checkIn: 'آمد کا وقت', checkOut: 'رخصت کا وقت',
    duration: 'مدت', hours: 'گھنٹے', notes: 'نوٹس (اختیاری)',
    logBtn: 'اوقات ریکارڈ کریں', daysLogged: 'ریکارڈ شدہ ایام', totalHours: 'کل اوقات',
    dailyAvg: 'روزانہ اوسط', recentLog: 'حالیہ سیشن لاگ',
    dateCol: 'تاریخ', inOut: 'آمد/رخصت', hoursCol: 'گھنٹے', actCol: 'سرگرمی', notesCol: 'نوٹس',
    synced: '✓ ہم آہنگ', lastSynced: '✓ آخری ہم آہنگی',
  },
  es: {
    title: 'Registrar Tiempo', sub: 'Registra tu asistencia diaria y horas de trabajo',
    verifying: 'Verificando ubicación...', atCentre: '✓ En el Centro',
    newEntry: 'Nueva Entrada de Tiempo', savedLocally: 'Datos guardados localmente y sincronizados en la nube cuando hay conexión.',
    syncing: '⟳ Sincronizando...', offline: '⚠ Sin conexión — en cola',
    logged: '¡Entrada de tiempo registrada con éxito!',
    date: 'Fecha', activity: 'Actividad', numStudents: 'Número de Estudiantes',
    specify: 'Por favor especifique', checkIn: 'Hora de Entrada', checkOut: 'Hora de Salida',
    duration: 'Duración', hours: 'horas', notes: 'Notas (opcional)',
    logBtn: 'Registrar Horas', daysLogged: 'Días Registrados', totalHours: 'Horas Totales',
    dailyAvg: 'Promedio Diario', recentLog: 'Registro de Sesiones Recientes',
    dateCol: 'Fecha', inOut: 'Entrada/Salida', hoursCol: 'Horas', actCol: 'Actividad', notesCol: 'Notas',
    synced: '✓ Sincronizado', lastSynced: '✓ Última sincronización',
  },
  pt: {
    title: 'Registrar Tempo', sub: 'Registe sua frequência diária e horas de trabalho',
    verifying: 'Verificando localização...', atCentre: '✓ No Centro',
    newEntry: 'Nova Entrada de Tempo', savedLocally: 'Dados salvos localmente e sincronizados na nuvem quando online.',
    syncing: '⟳ Sincronizando...', offline: '⚠ Offline — na fila',
    logged: 'Entrada de tempo registada com sucesso!',
    date: 'Data', activity: 'Atividade', numStudents: 'Número de Estudantes',
    specify: 'Por favor especifique', checkIn: 'Hora de Entrada', checkOut: 'Hora de Saída',
    duration: 'Duração', hours: 'horas', notes: 'Notas (opcional)',
    logBtn: 'Registrar Horas', daysLogged: 'Dias Registados', totalHours: 'Total de Horas',
    dailyAvg: 'Média Diária', recentLog: 'Registo de Sessões Recentes',
    dateCol: 'Data', inOut: 'Entrada/Saída', hoursCol: 'Horas', actCol: 'Atividade', notesCol: 'Notas',
    synced: '✓ Sincronizado', lastSynced: '✓ Última sincronização',
  },
};

const TEACHING_ACTIVITIES = ['Teaching', 'Teaching + Admin'];

function activityLabel(log) {
  if (log.activity === 'Other' && log.otherActivity) return `Other: ${log.otherActivity}`;
  if (TEACHING_ACTIVITIES.includes(log.activity) && log.studentCount) return `${log.activity} (${log.studentCount} students)`;
  return log.activity;
}

function useMockLocation() {
  const [locationStatus, setLocationStatus] = useState('checking');
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocationStatus('verified');
      const ts = new Date().toLocaleTimeString();
      localStorage.setItem('haazimi_last_synced', ts);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  return locationStatus;
}

export default function LogTime({ user, language }) {
  const t = T[language] || T.en;

  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('haazimi_display_logs');
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch { return INITIAL_LOGS; }
  });

  const blankForm = { date: new Date().toISOString().split('T')[0], checkIn: '08:00', checkOut: '14:00', activity: 'Teaching', studentCount: '', otherActivity: '', notes: '', absentCount: '', absentNames: '' };
  const [form, setForm] = useState(blankForm);
  const [editingId, setEditingId] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSynced, setLastSynced] = useState(() => localStorage.getItem('haazimi_last_synced') || null);
  const locationStatus = useMockLocation();

  useEffect(() => {
    attemptSync();
    window.addEventListener('online', attemptSync);
    return () => window.removeEventListener('online', attemptSync);
  }, []);

  const attemptSync = async () => {
    const queue = JSON.parse(localStorage.getItem('haazimi_offline_logs') || '[]');
    if (queue.length === 0) return;
    setSyncStatus('syncing');
    const newQueue = [...queue];
    const activeUser = (() => { try { return JSON.parse(localStorage.getItem('haazimi_user') || '{}'); } catch { return {}; } })();
    for (let i = 0; i < newQueue.length; i++) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...newQueue[i], teacherName: activeUser.name || 'Unknown' }),
        });
        newQueue.splice(i, 1); i--;
      } catch { setSyncStatus('offline'); break; }
    }
    localStorage.setItem('haazimi_offline_logs', JSON.stringify(newQueue));
    if (newQueue.length === 0) {
      const ts = new Date().toLocaleTimeString();
      setSyncStatus('synced'); setLastSynced(ts);
      localStorage.setItem('haazimi_last_synced', ts);
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isTeaching = TEACHING_ACTIVITIES.includes(form.activity);
  const isOther = form.activity === 'Other';

  const calcHours = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const [ih, im] = form.checkIn.split(':').map(Number);
    const [oh, om] = form.checkOut.split(':').map(Number);
    return Math.max(0, (oh * 60 + om - ih * 60 - im) / 60).toFixed(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hours = parseFloat(calcHours());
    if (editingId) {
      setLogs(prev => {
        const updated = prev.map(l => l.id === editingId ? { ...l, ...form, hours, absentCount: form.absentCount, absentNames: form.absentNames } : l);
        localStorage.setItem('haazimi_display_logs', JSON.stringify(updated));
        return updated;
      });
      setEditingId(null);
    } else {
      const newLog = { id: Date.now(), ...form, hours, status: 'pending' };
      setLogs(prev => { const updated = [newLog, ...prev]; localStorage.setItem('haazimi_display_logs', JSON.stringify(updated)); return updated; });
      const queue = JSON.parse(localStorage.getItem('haazimi_offline_logs') || '[]');
      queue.push(newLog);
      localStorage.setItem('haazimi_offline_logs', JSON.stringify(queue));
      attemptSync();
    }
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm(blankForm);
  };

  const handleEdit = (log) => {
    setEditingId(log.id);
    setForm({ date: log.date, checkIn: log.checkIn || '08:00', checkOut: log.checkOut || '14:00', activity: log.activity || 'Teaching', studentCount: log.studentCount || '', otherActivity: log.otherActivity || '', notes: log.notes || '', absentCount: log.absentCount || '', absentNames: log.absentNames || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this time log entry?')) return;
    setLogs(prev => { const updated = prev.filter(l => l.id !== id); localStorage.setItem('haazimi_display_logs', JSON.stringify(updated)); return updated; });
  };

  const handleCancelEdit = () => { setEditingId(null); setForm(blankForm); };

  const handleActivityChange = (e) => { set('activity', e.target.value); set('studentCount', ''); set('otherActivity', ''); set('absentCount', ''); set('absentNames', ''); };
  const totalHours = logs.reduce((s, l) => s + (parseFloat(l.hours) || 0), 0);

  const syncLabel = syncStatus === 'syncing' ? t.syncing
    : syncStatus === 'synced' ? `${t.synced} ${lastSynced}`
    : syncStatus === 'offline' ? t.offline
    : lastSynced ? `${t.lastSynced} ${lastSynced}` : '';

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 20, background: locationStatus === 'verified' ? 'rgba(34,197,94,0.12)' : 'rgba(156,163,175,0.15)', border: `1px solid ${locationStatus === 'verified' ? '#22c55e' : '#9ca3af'}`, fontSize: '0.82rem', fontWeight: 600, color: locationStatus === 'verified' ? '#16a34a' : '#6b7280' }}>
          <MapPin size={14} />
          {locationStatus === 'checking' ? t.verifying : t.atCentre}
        </div>
      </div>

      <div className="log-time-layout">
        <div>
          <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 32, boxShadow: '0 4px 12px var(--shadow-color)' }}>
            <div className="form-header">
              <h2>{editingId ? '✏ Edit Entry' : t.newEntry}</h2>
              {editingId ? (
                <button type="button" onClick={handleCancelEdit} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid #e5e7eb', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <X size={14} /> Cancel Edit
                </button>
              ) : (
                <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem', color: syncStatus === 'offline' ? '#f59e0b' : 'var(--text-secondary)' }}>
                  {syncLabel || t.savedLocally}
                </p>
              )}
            </div>

            {submitted && <div className="forgot-password-success" style={{ marginBottom: 20 }}>{t.logged}</div>}

            <form className="generic-form" onSubmit={handleSubmit}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

                {/* Row 1: Date | Activity */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>{t.date}</label>
                    <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>{t.activity}</label>
                    <select value={form.activity} onChange={handleActivityChange}>
                      <option>Teaching</option>
                      <option>Admin</option>
                      <option>Teaching + Admin</option>
                      <option>Exam Supervision</option>
                      <option>Meeting</option>
                      <option>Planning</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Other: specify field (full width) */}
                {isOther && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>{t.specify} <span style={{ color: '#e74c3c' }}>*</span></label>
                    <input type="text" value={form.otherActivity} onChange={e => set('otherActivity', e.target.value)} required />
                  </div>
                )}

                {/* Row 2: Check In | Check Out */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>{t.checkIn}</label>
                    <input type="time" value={form.checkIn} onChange={e => set('checkIn', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>{t.checkOut}</label>
                    <input type="time" value={form.checkOut} onChange={e => set('checkOut', e.target.value)} required />
                  </div>
                </div>

                {/* Row 3: Number of Students | Duration (or Duration alone) */}
                <div style={{ display: 'grid', gridTemplateColumns: isTeaching ? '1fr 1fr' : '1fr', gap: 12 }}>
                  {isTeaching && (
                    <div className="form-group" style={{ margin: 0 }}>
                      <label>{t.numStudents} <span style={{ color: '#e74c3c' }}>*</span></label>
                      <input type="number" min="0" max="999" placeholder="e.g. 12" value={form.studentCount} onChange={e => set('studentCount', e.target.value)} required />
                    </div>
                  )}
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>{t.duration}</label>
                    <div className="duration-display">{calcHours()} {t.hours}</div>
                  </div>
                </div>

                {/* Students Absent (Teaching only) */}
                {isTeaching && (
                  <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '12px' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#dc2626', marginBottom: 10 }}>Students Absent <span style={{ color: '#dc2626' }}>*</span></div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.78rem' }}>Count</label>
                        <input type="number" min="0" value={form.absentCount} onChange={e => set('absentCount', e.target.value)} required placeholder="0" />
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.78rem' }}>Names (comma-separated)</label>
                        <input type="text" value={form.absentNames} onChange={e => set('absentNames', e.target.value)} placeholder="e.g. Ahmad, Fatima" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Row 4: Notes (full width) */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.notes}</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
                </div>

              </div>
              <div className="form-actions">
                <button type="submit" className="button-primary">{editingId ? 'Update Entry' : t.logBtn}</button>
                {editingId && <button type="button" className="button-secondary" onClick={handleCancelEdit}>Cancel</button>}
              </div>
            </form>
          </div>

          <div className="calculations-display" style={{ marginTop: 20 }}>
            <div className="calc-item"><span>{logs.length}</span>{t.daysLogged}</div>
            <div className="calc-item"><span>{totalHours.toFixed(0)}h</span>{t.totalHours}</div>
            <div className="calc-item"><span>{(totalHours / Math.max(1, logs.length)).toFixed(1)}h</span>{t.dailyAvg}</div>
          </div>
        </div>

        <div className="previous-logs-container" style={{ marginTop: 0 }}>
          <h3>{t.recentLog}</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="staff-table" style={{ minWidth: 480 }}>
              <thead>
                <tr>
                  <th>{t.dateCol}</th>
                  <th>{t.inOut}</th>
                  <th>{t.hoursCol}</th>
                  <th>{t.actCol}</th>
                  <th>{t.notesCol}</th>
                  <th style={{ width: 72 }}></th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} style={{ background: editingId === log.id ? 'rgba(99,102,241,0.06)' : undefined }}>
                    <td>{log.date}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{log.checkIn} - {log.checkOut}</td>
                    <td><strong>{log.hours}h</strong></td>
                    <td>
                      {activityLabel(log)}
                      {TEACHING_ACTIVITIES.includes(log.activity) && log.absentCount !== '' && log.absentCount !== undefined && (
                        <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: 2 }}>
                          Absent: {log.absentCount}{log.absentNames ? ` (${log.absentNames})` : ''}
                        </div>
                      )}
                    </td>
                    <td className="notes-cell">{log.notes || '—'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button onClick={() => handleEdit(log)} title="Edit" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6366f1', padding: '2px 4px' }}><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(log.id)} title="Delete" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '2px 4px' }}><Trash2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
