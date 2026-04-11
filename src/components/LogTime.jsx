import { useState, useEffect } from 'react';
import { TIME_LOGS as INITIAL_LOGS } from '../data/mockData';
import { GOOGLE_SCRIPT_URL } from '../data/config';
import { MapPin, Pencil, Trash2, X, Share2, Mail } from 'lucide-react';
import useStudents from '../hooks/useStudents';

const T = {
  en: {
    title: 'Log Time', sub: 'Record your daily attendance and work hours',
    shareWeek: 'Share This Week', shareViaWhatsApp: 'WhatsApp', shareViaEmail: 'Email',
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
    studentsAbsent: 'Students Absent', count: 'Count', names: 'Names (comma-separated)',
    absent: 'absent', absentList: 'Absent:', updateEntry: 'Update Entry', cancelEdit: 'Cancel',
    activities: { 'Morning Class': 'Morning Class', 'Afternoon Class': 'Afternoon Class', 'Mudhaakarah': 'Mudhaakarah', 'Mashurah': 'Mashurah', 'Admin': 'Admin', 'Other': 'Other' },
  },
  ar: {
    title: 'تسجيل الوقت', sub: 'سجّل حضورك اليومي وساعات عملك',
    shareWeek: 'شارك هذا الأسبوع', shareViaWhatsApp: 'واتساب', shareViaEmail: 'بريد',
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
    studentsAbsent: 'الطلاب الغائبون', count: 'العدد', names: 'الأسماء (مفصولة بفاصلة)',
    absent: 'غائب', absentList: 'غائبون:', updateEntry: 'تحديث الإدخال', cancelEdit: 'إلغاء',
    activities: { 'Morning Class': 'Morning Class', 'Afternoon Class': 'Afternoon Class', 'Mudhaakarah': 'مذاكرة', 'Mashurah': 'مشورة', 'Admin': 'Admin', 'Other': 'أخرى' },
  },
  ur: {
    title: 'وقت ریکارڈ', sub: 'اپنی روزانہ حاضری اور کام کے اوقات ریکارڈ کریں',
    shareWeek: 'اس ہفتے شیئر کریں', shareViaWhatsApp: 'واٹس ایپ', shareViaEmail: 'ای میل',
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
    studentsAbsent: 'غیر حاضر طلبہ', count: 'تعداد', names: 'نام (کوما سے الگ کریں)',
    absent: 'غیر حاضر', absentList: 'غیر حاضر:', updateEntry: 'اندراج تازہ کریں', cancelEdit: 'منسوخ',
    activities: { 'Morning Class': 'Morning Class', 'Afternoon Class': 'Afternoon Class', 'Mudhaakarah': 'مذاكرة', 'Mashurah': 'مشورة', 'Admin': 'Admin', 'Other': 'دیگر' },
  },
  es: {
    title: 'Registrar Tiempo', sub: 'Registra tu asistencia diaria y horas de trabajo',
    shareWeek: 'Compartir Esta Semana', shareViaWhatsApp: 'WhatsApp', shareViaEmail: 'Correo',
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
    studentsAbsent: 'Estudiantes Ausentes', count: 'Cantidad', names: 'Nombres (separados por coma)',
    absent: 'ausentes', absentList: 'Ausentes:', updateEntry: 'Actualizar Entrada', cancelEdit: 'Cancelar',
    activities: { 'Morning Class': 'Morning Class', 'Afternoon Class': 'Afternoon Class', 'Mudhaakarah': 'Mudhaakarah', 'Mashurah': 'Mashurah', 'Admin': 'Admin', 'Other': 'Otro' },
  },
  pt: {
    title: 'Registrar Tempo', sub: 'Registe sua frequência diária e horas de trabalho',
    shareWeek: 'Partilhar Esta Semana', shareViaWhatsApp: 'WhatsApp', shareViaEmail: 'E-mail',
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
    studentsAbsent: 'Estudantes Ausentes', count: 'Quantidade', names: 'Nomes (separados por vírgula)',
    absent: 'ausentes', absentList: 'Ausentes:', updateEntry: 'Atualizar Entrada', cancelEdit: 'Cancelar',
    activities: { 'Morning Class': 'Morning Class', 'Afternoon Class': 'Afternoon Class', 'Mudhaakarah': 'Mudhaakarah', 'Mashurah': 'Mashurah', 'Admin': 'Admin', 'Other': 'Outro' },
  },
};

const TEACHING_ACTIVITIES = ['Morning Class', 'Afternoon Class'];

function activityLabel(log, t) {
  const acts = (t && t.activities) || {};
  const label = acts[log.activity] || log.activity;
  if (log.activity === 'Other' && log.otherActivity) return `${acts['Other'] || 'Other'}: ${log.otherActivity}`;
  if (TEACHING_ACTIVITIES.includes(log.activity) && log.studentCount) return `${label} (${log.studentCount})`;
  return label;
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
  const { myStudents } = useStudents(user);
  const [selectedAbsent, setSelectedAbsent] = useState(new Set());

  const [logs, setLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('haazimi_display_logs');
      return saved ? JSON.parse(saved) : INITIAL_LOGS;
    } catch { return INITIAL_LOGS; }
  });

  const blankForm = {
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:00',
    checkOut: '14:00',
    activity: 'Morning Class',
    studentCount: '',
    otherActivity: '',
    notes: '',
    absentCount: '',
    absentNames: ''
  };

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
    const activeUser = (() => {
      try { return JSON.parse(localStorage.getItem('haazimi_user') || '{}'); }
      catch { return {}; }
    })();

    for (let i = 0; i < newQueue.length; i++) {
      try {
        const item = newQueue[i];
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'attendance',
            requestId: item.id || Date.now(),
            workDate: item.date,
            checkIn: item.checkIn,
            checkOut: item.checkOut,
            activity: item.activity,
            hours: item.hours,
            notes: item.notes || '',
            teacherName: activeUser.name || item.teacherName || 'Unknown',
            email: activeUser.email || item.teacherEmail || '',
            status: item.status || 'Pending',
            studentCount: item.studentCount || '',
            otherActivity: item.otherActivity || '',
            absentCount: item.absentCount || '',
            absentNames: item.absentNames || '',
            students: item.absentNames || '',
          }),
        });
        newQueue.splice(i, 1);
        i--;
      } catch {
        setSyncStatus('offline');
        break;
      }
    }

    localStorage.setItem('haazimi_offline_logs', JSON.stringify(newQueue));
    if (newQueue.length === 0) {
      const ts = new Date().toLocaleTimeString();
      setSyncStatus('synced');
      setLastSynced(ts);
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
      setLogs(prev => {
        const updated = [newLog, ...prev];
        localStorage.setItem('haazimi_display_logs', JSON.stringify(updated));
        return updated;
      });
      const queue = JSON.parse(localStorage.getItem('haazimi_offline_logs') || '[]');
      queue.push(newLog);
      localStorage.setItem('haazimi_offline_logs', JSON.stringify(queue));
      attemptSync();
    }

    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm(blankForm);
    setSelectedAbsent(new Set());
  };

  const handleEdit = (log) => {
    setEditingId(log.id);
    setForm({
      date: log.date,
      checkIn: log.checkIn || '08:00',
      checkOut: log.checkOut || '14:00',
      activity: log.activity || 'Morning Class',
      studentCount: log.studentCount || '',
      otherActivity: log.otherActivity || '',
      notes: log.notes || '',
      absentCount: log.absentCount || '',
      absentNames: log.absentNames || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this time log entry?')) return;
    setLogs(prev => {
      const updated = prev.filter(l => l.id !== id);
      localStorage.setItem('haazimi_display_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(blankForm);
    setSelectedAbsent(new Set());
  };

  const handleActivityChange = (e) => {
    set('activity', e.target.value);
    set('studentCount', '');
    set('otherActivity', '');
    set('absentCount', '');
    set('absentNames', '');
    setSelectedAbsent(new Set());
  };

  const toggleAbsent = (id) => {
    setSelectedAbsent(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      const names = [...next].map(sid => myStudents.find(s => s.id === sid)?.name).filter(Boolean);
      set('absentCount', String(next.size));
      set('absentNames', names.join(', '));
      return next;
    });
  };

  const totalHours = logs.reduce((s, l) => s + (parseFloat(l.hours) || 0), 0);

  const getThisWeekLogs = () => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return logs.filter(l => {
      const d = new Date(l.date);
      return d >= startOfWeek && d <= endOfWeek;
    });
  };

  const buildTimesheetText = () => {
    const weekLogs = getThisWeekLogs();
    const weekTotal = weekLogs.reduce((s, l) => s + (parseFloat(l.hours) || 0), 0);
    const lines = [
      `*Weekly Timesheet — ${user?.name || 'Staff'}*`,
      `Centre: ${user?.centre || user?.center || '—'}`,
      `Week: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}`,
      '',
      ...weekLogs.map(l => `• ${l.date}  ${l.checkIn}-${l.checkOut} (${l.hours}h) — ${activityLabel(l)}${l.notes ? ` | ${l.notes}` : ''}`),
      '',
      `Total: ${weekTotal.toFixed(1)} hours`,
    ];
    return lines.join('\n');
  };

  const handleShareWhatsApp = () => {
    const text = buildTimesheetText();
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareEmail = () => {
    const text = buildTimesheetText();
    const subject = encodeURIComponent(`Weekly Timesheet — ${user?.name || 'Staff'}`);
    const body = encodeURIComponent(text);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>{t.date}</label>
                    <input type="date" value={form.date} onChange={e => set('date', e.target.value)} required />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>{t.activity}</label>
                    <select value={form.activity} onChange={handleActivityChange}>
                      {Object.keys(t.activities || { 'Morning Class': 1, 'Afternoon Class': 1, 'Mudhaakarah': 1, 'Mashurah': 1, 'Admin': 1, 'Other': 1 }).map(key => (
                        <option key={key} value={key}>{(t.activities && t.activities[key]) || key}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {isOther && (
                  <div className="form-group" style={{ margin: 0 }}>
                    <label>{t.specify} <span style={{ color: '#e74c3c' }}>*</span></label>
                    <input type="text" value={form.otherActivity} onChange={e => set('otherActivity', e.target.value)} required />
                  </div>
                )}

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

                {isTeaching && (
                  <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#dc2626' }}>{t.studentsAbsent}</span>
                      {selectedAbsent.size > 0 && (
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', background: '#fee2e2', borderRadius: 10, padding: '2px 10px' }}>
                          {selectedAbsent.size} {t.absent}
                        </span>
                      )}
                    </div>
                    {myStudents.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {myStudents.map(s => {
                          const absent = selectedAbsent.has(s.id);
                          return (
                            <button key={s.id} type="button" onClick={() => toggleAbsent(s.id)}
                              style={{
                                padding: '5px 12px', borderRadius: 20, fontSize: '0.8rem', cursor: 'pointer',
                                fontWeight: absent ? 700 : 400, transition: 'all 0.15s',
                                background: absent ? '#fee2e2' : 'var(--hover-bg)',
                                border: absent ? '1px solid #fca5a5' : '1px solid var(--border-color)',
                                color: absent ? '#dc2626' : 'var(--text-secondary)',
                              }}>
                              {s.name}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.78rem' }}>{t.count}</label>
                          <input type="number" min="0" value={form.absentCount} onChange={e => set('absentCount', e.target.value)} placeholder="0" />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.78rem' }}>{t.names}</label>
                          <input type="text" value={form.absentNames} onChange={e => set('absentNames', e.target.value)} placeholder="e.g. Ahmad, Fatima" />
                        </div>
                      </div>
                    )}
                    {myStudents.length > 0 && form.absentNames && (
                      <div style={{ marginTop: 8, fontSize: '0.75rem', color: '#dc2626' }}>{t.absentList} {form.absentNames}</div>
                    )}
                  </div>
                )}

                <div className="form-group" style={{ margin: 0 }}>
                  <label>{t.notes}</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="button-primary">{editingId ? t.updateEntry : t.logBtn}</button>
                {editingId && <button type="button" className="button-secondary" onClick={handleCancelEdit}>{t.cancelEdit}</button>}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ margin: 0 }}>{t.recentLog}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleShareWhatsApp} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#dcfce7', color: '#16a34a', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                <Share2 size={14} /> {t.shareViaWhatsApp}
              </button>
              <button onClick={handleShareEmail} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: 'none', background: '#dbeafe', color: '#1d4ed8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                <Mail size={14} /> {t.shareViaEmail}
              </button>
            </div>
          </div>

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
                      {activityLabel(log, t)}
                      {TEACHING_ACTIVITIES.includes(log.activity) && log.absentCount !== '' && log.absentCount !== undefined && (
                        <div style={{ fontSize: '0.72rem', color: '#dc2626', marginTop: 2 }}>
                          {t.absentList} {log.absentCount}{log.absentNames ? ` (${log.absentNames})` : ''}
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