import { useState, useEffect } from 'react';
import { LEAVE_REQUESTS, STAFF } from '../data/mockData';
import { GOOGLE_SCRIPT_URL } from '../data/config';
import { AlertCircle, Trash2, Users, User, Clock, Calendar, Share2 } from 'lucide-react';

const T = {
  en: {
    title: 'Request Leave', sub: 'Submit a leave application for approval',
    myLeave: 'My Leave', forStaff: 'Request for Staff',
    selectStaff: 'Select Staff Member', searchStaff: 'Search staff...',
    pendingTitle: 'Leave Request Pending',
    pendingDesc: 'You have a', pendingDesc2: 'leave awaiting approval. You cannot submit a new request until it is resolved.',
    cancelBtn: 'Cancel Request', cancelling: 'Cancelling…',
    confirmPrompt: 'Are you sure?', confirmYes: 'Yes, Cancel', confirmNo: 'Keep',
    formTitle: 'Leave Application Form', formSub: 'Fill in the details below. Your manager will be notified.',
    successMsg: 'Your leave request has been submitted successfully!',
    leaveType: 'Leave Type', applicant: 'Applicant', requestor: 'Requested By',
    fromDate: 'Work Date', toDate: 'To Date',
    startTime: 'Start Time', endTime: 'End Time',
    fullDay: 'Full Day(s)', partialDay: 'Partial Day (hours)',
    durationLabel: 'Duration',
    duration: 'Duration', day: 'day', days: 'days', hour: 'hr', hours: 'hrs',
    emergency: 'Mark as Emergency',
    reason: 'Reason / Details', reasonPlaceholder: 'Please provide a clear reason for your leave request...',
    approved: 'Approved', pending: 'Pending', rejected: 'Rejected',
    clear: 'Clear', submit: 'Submit Request', locked: 'Request Locked — Pending Approval',
    history: 'My Leave History', noHistory: 'No previous leave requests found.',
    statusApproved: 'Approved', statusRejected: 'Rejected', statusPending: 'Pending',
    thirdPartyNote: 'You are submitting this leave on behalf of another staff member.',
  },
  ar: {
    title: 'طلب إجازة', sub: 'قدّم طلب إجازة للموافقة',
    myLeave: 'إجازتي', forStaff: 'طلب لموظف آخر',
    selectStaff: 'اختر موظفاً', searchStaff: 'ابحث عن موظف...',
    pendingTitle: 'طلب الإجازة معلق',
    pendingDesc: 'لديك طلب', pendingDesc2: 'في انتظار الموافقة. لا يمكنك تقديم طلب جديد حتى يتم حله.',
    cancelBtn: 'إلغاء الطلب', cancelling: 'جارٍ الإلغاء...',
    confirmPrompt: 'هل أنت متأكد؟', confirmYes: 'نعم، إلغاء', confirmNo: 'الإبقاء',
    formTitle: 'نموذج طلب إجازة', formSub: 'أدخل التفاصيل أدناه. سيتم إخطار مديرك.',
    successMsg: 'تم إرسال طلب إجازتك بنجاح!',
    leaveType: 'نوع الإجازة', applicant: 'المتقدم', requestor: 'طلب بواسطة',
    fromDate: 'التاريخ', toDate: 'إلى تاريخ',
    startTime: 'وقت البدء', endTime: 'وقت الانتهاء',
    fullDay: 'يوم كامل', partialDay: 'جزء من اليوم (ساعات)',
    durationLabel: 'المدة',
    duration: 'المدة', day: 'يوم', days: 'أيام', hour: 'س', hours: 'ساعات',
    emergency: 'تحديد كطارئ',
    reason: 'السبب / التفاصيل', reasonPlaceholder: 'يرجى تقديم سبب واضح...',
    approved: 'موافق عليه', pending: 'معلق', rejected: 'مرفوض',
    clear: 'مسح', submit: 'إرسال الطلب', locked: 'الطلب مقفل — في انتظار الموافقة',
    history: 'سجل إجازاتي', noHistory: 'لا توجد طلبات إجازة سابقة.',
    statusApproved: 'موافق', statusRejected: 'مرفوض', statusPending: 'معلق',
    thirdPartyNote: 'أنت تقدم هذا الطلب نيابةً عن موظف آخر.',
  },
  ur: {
    title: 'چھٹی کی درخواست', sub: 'منظوری کے لیے چھٹی کی درخواست جمع کریں',
    myLeave: 'میری چھٹی', forStaff: 'عملے کے لیے درخواست',
    selectStaff: 'عملے کا انتخاب کریں', searchStaff: 'عملہ تلاش کریں...',
    pendingTitle: 'چھٹی کی درخواست زیر التواء',
    pendingDesc: 'آپ کی', pendingDesc2: 'چھٹی کی درخواست منظوری کے انتظار میں ہے۔',
    cancelBtn: 'درخواست منسوخ کریں', cancelling: 'منسوخ ہو رہا ہے...',
    confirmPrompt: 'کیا آپ یقین سے چاہتے ہیں؟', confirmYes: 'ہاں، منسوخ کریں', confirmNo: 'رکھیں',
    formTitle: 'چھٹی درخواست فارم', formSub: 'نیچے تفصیلات بھریں۔ آپ کے مینیجر کو مطلع کیا جائے گا۔',
    successMsg: 'آپ کی چھٹی کی درخواست کامیابی سے جمع کر دی گئی!',
    leaveType: 'چھٹی کی قسم', applicant: 'درخواست دہندہ', requestor: 'کی طرف سے درخواست',
    fromDate: 'تاریخ', toDate: 'تاریخ تک',
    startTime: 'شروع کا وقت', endTime: 'ختم کا وقت',
    fullDay: 'پورا دن', partialDay: 'چند گھنٹے',
    durationLabel: 'مدت',
    duration: 'مدت', day: 'دن', days: 'دن', hour: 'گھنٹہ', hours: 'گھنٹے',
    emergency: 'ہنگامی کے طور پر نشان لگائیں',
    reason: 'وجہ / تفصیلات', reasonPlaceholder: 'براہ کرم واضح وجہ بتائیں...',
    approved: 'منظور', pending: 'زیر التواء', rejected: 'مسترد',
    clear: 'صاف کریں', submit: 'درخواست جمع کریں', locked: 'درخواست بند — منظوری کا انتظار',
    history: 'میری چھٹیوں کی تاریخ', noHistory: 'کوئی سابقہ چھٹی کی درخواست نہیں ملی۔',
    statusApproved: 'منظور', statusRejected: 'مسترد', statusPending: 'زیر التواء',
    thirdPartyNote: 'آپ یہ درخواست کسی اور عملے کی طرف سے جمع کر رہے ہیں۔',
  },
  es: {
    title: 'Solicitar Licencia', sub: 'Envía una solicitud de licencia para aprobación',
    myLeave: 'Mi Licencia', forStaff: 'Solicitar para Personal',
    selectStaff: 'Seleccionar Personal', searchStaff: 'Buscar personal...',
    pendingTitle: 'Solicitud de Licencia Pendiente',
    pendingDesc: 'Tienes una licencia', pendingDesc2: 'esperando aprobación.',
    cancelBtn: 'Cancelar Solicitud', cancelling: 'Cancelando…',
    confirmPrompt: '¿Estás seguro?', confirmYes: 'Sí, Cancelar', confirmNo: 'Mantener',
    formTitle: 'Formulario de Solicitud', formSub: 'Complete los detalles. Su manager será notificado.',
    successMsg: '¡Solicitud de licencia enviada con éxito!',
    leaveType: 'Tipo de Licencia', applicant: 'Solicitante', requestor: 'Solicitado por',
    fromDate: 'Fecha', toDate: 'Hasta',
    startTime: 'Hora de inicio', endTime: 'Hora de fin',
    fullDay: 'Día(s) completo(s)', partialDay: 'Horas del día',
    durationLabel: 'Duración',
    duration: 'Duración', day: 'día', days: 'días', hour: 'h', hours: 'hrs',
    emergency: 'Marcar como Emergencia',
    reason: 'Motivo / Detalles', reasonPlaceholder: 'Por favor proporcione un motivo claro...',
    approved: 'Aprobadas', pending: 'Pendientes', rejected: 'Rechazadas',
    clear: 'Limpiar', submit: 'Enviar Solicitud', locked: 'Solicitud Bloqueada',
    history: 'Mi Historial de Licencias', noHistory: 'No se encontraron solicitudes anteriores.',
    statusApproved: 'Aprobada', statusRejected: 'Rechazada', statusPending: 'Pendiente',
    thirdPartyNote: 'Estás enviando esta solicitud en nombre de otro miembro del personal.',
  },
  pt: {
    title: 'Solicitar Licença', sub: 'Envie uma solicitação de licença para aprovação',
    myLeave: 'Minha Licença', forStaff: 'Solicitar para Funcionário',
    selectStaff: 'Selecionar Funcionário', searchStaff: 'Procurar funcionário...',
    pendingTitle: 'Solicitação de Licença Pendente',
    pendingDesc: 'Tem uma licença', pendingDesc2: 'aguardando aprovação.',
    cancelBtn: 'Cancelar Solicitação', cancelling: 'Cancelando…',
    confirmPrompt: 'Tem certeza?', confirmYes: 'Sim, Cancelar', confirmNo: 'Manter',
    formTitle: 'Formulário de Solicitação', formSub: 'Preencha os detalhes abaixo. Seu gerente será notificado.',
    successMsg: 'Solicitação de licença enviada com sucesso!',
    leaveType: 'Tipo de Licença', applicant: 'Solicitante', requestor: 'Solicitado por',
    fromDate: 'Data', toDate: 'Até',
    startTime: 'Hora de início', endTime: 'Hora de fin',
    fullDay: 'Dia(s) inteiro(s)', partialDay: 'Horas do dia',
    durationLabel: 'Duração',
    duration: 'Duración', day: 'dia', days: 'dias', hour: 'h', hours: 'hrs',
    emergency: 'Marcar como Emergencia',
    reason: 'Motivo / Detalhes', reasonPlaceholder: 'Por favor forneça um motivo claro...',
    approved: 'Aprovadas', pending: 'Pendientes', rejected: 'Rejeitadas',
    clear: 'Limpar', submit: 'Enviar Solicitação', locked: 'Solicitação Bloqueada',
    history: 'Meu Histórico de Licenças', noHistory: 'Nenhuma solicitação anterior encontrada.',
    statusApproved: 'Aprovada', statusRejected: 'Rejeitada', statusPending: 'Pendente',
    thirdPartyNote: 'Está a enviar esta solicitação em nome de outro membro da equipe.',
  },
};

const STATUS_CLASS = {
  approved: 'status-completed', 
  rejected: 'status-incomplete', 
  pending: 'status-in-progress',
  Pending: 'status-in-progress', 
  Approved: 'status-completed', 
  Rejected: 'status-incomplete'
};

export default function LeaveRequest({ user, language = 'en' }) {
  const t = T[language] || T.en;
  const isManager = ['Centre Manager', 'Country Admin', 'Super Admin'].includes(user?.role);

  const [mode, setMode] = useState('self'); 
  const [staffSearch, setStaffSearch] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffDropOpen, setStaffDropOpen] = useState(false);
  const [form, setForm] = useState({ type: 'Casual', from: '', to: '', fromTime: '08:00', toTime: '17:00', partial: false, reason: '', emergency: false });
  const LS_KEY = 'haazimi_leaves';

  const loadLocal = () => {
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      return all.filter(l => l.staffEmail === user?.email || l.staffName === user?.name);
    } catch { return []; }
  };

  const saveLocal = (leaves) => {
    try {
      const all = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      const others = all.filter(l => l.staffEmail !== user?.email && l.staffName !== user?.name);
      // Preserve any manager decision fields that may have been written after this component loaded
      const storedById = {};
      all.forEach(l => { storedById[String(l.id)] = l; });
      const merged = leaves.map(l => {
        const stored = storedById[String(l.id)];
        if (!stored) return l;
        return { ...l, status: stored.status || l.status, decidedBy: stored.decidedBy || '', decidedAt: stored.decidedAt || '', decisionReason: stored.decisionReason || '' };
      });
      localStorage.setItem(LS_KEY, JSON.stringify([...others, ...merged]));
    } catch {}
  };

  const [submitted, setSubmitted] = useState(false);
  const [myLeaves, setMyLeaves] = useState(() => loadLocal());
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const allStaff = (() => {
    try {
      const accounts = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
      const active = accounts.filter(a => a.status === 'Approved' && a.email !== user.email);
      if (active.length > 0) return active.map(a => ({ name: a.name, email: a.email }));
    } catch {}
    return STAFF.filter(s => s.name !== user.name).map(s => ({ name: s.name, email: `${s.name.toLowerCase().replace(/\s+/g,'.')}@staff.local` }));
  })();

  const filteredStaff = allStaff.filter(s => s.name.toLowerCase().includes(staffSearch.toLowerCase()));

  const calcDays = () => {
    if (form.partial) {
      if (!form.from || !form.fromTime || !form.toTime) return 0;
      const [fh, fm] = form.fromTime.split(':').map(Number);
      const [th, tm] = form.toTime.split(':').map(Number);
      return Math.max(0, parseFloat(((th * 60 + tm - fh * 60 - fm) / 60).toFixed(1)));
    }
    if (!form.from || !form.to) return 0;
    return Math.max(0, (new Date(form.to) - new Date(form.from)) / (1000 * 60 * 60 * 24) + 1);
  };

  const durationDisplay = () => {
    const n = calcDays();
    if (form.partial) return `${n} ${n === 1 ? t.hour : t.hours}`;
    return `${n} ${n === 1 ? t.day : t.days}`;
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getLeaves&email=${encodeURIComponent(user.email || '')}&t=${Date.now()}`, { mode: 'cors' });
      const data = await res.json();
      const raw = Array.isArray(data) ? data : (data.leaves || []);

      const remote = raw.map(l => ({
        id: String(l.id || l.ID || l['sync time'] || (Date.now() + Math.random())),
        type: l.type || l.Type || l['activity'] || 'Casual',
        from: l.from || l.From || l['work date'] || '',
        to: l.to || l.To || l.from || l.From || '',
        days: l.days || l.Days || l['hours'] || 1,
        reason: l.reason || l.Reason || l['notes'] || '',
        status: String(l.status || l.Status || 'Pending').trim(), // Safety Fix: Normalize status
        partial: !!(l.partial || (l['check in'] && l['check in'] !== '08:00')),
        fromTime: l.fromTime || l['check in'] || null,
        toTime: l.toTime || l['check out'] || null,
        auditNote: l.auditNote || null,
        staffEmail: user.email,
        staffName: user.name,
      }));

      // Merge: keep local-only entries that haven't synced to Sheets yet
      const local = loadLocal();
      const remoteIds = new Set(remote.map(r => String(r.id)));
      const localOnly = local.filter(l => !remoteIds.has(String(l.id)));
      const merged = [...remote, ...localOnly];
      setMyLeaves(merged);
      saveLocal(merged);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user.name]);

  // Safety Fix: Bulletproof pending check ignores case/spaces
  const isReqPending = (status) => String(status || '').trim().toLowerCase() === 'pending';
  const pendingRequest = myLeaves.find(l => isReqPending(l.status));
  const hasPending = mode === 'self' && !!pendingRequest;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'staff' && !selectedStaff) return;

    const duration = calcDays();
    const targetName = mode === 'staff' ? selectedStaff.name : user.name;
    const tempId = String(Date.now());

    const newLeave = {
      id: tempId,
      staffEmail: user.email,
      staffName: user.name,
      type: form.type,
      from: form.from,
      to: form.partial ? form.from : (form.to || form.from),
      days: duration,
      reason: form.reason + (form.emergency ? ' [EMERGENCY]' : ''),
      status: 'Pending',
      partial: form.partial,
      fromTime: form.partial ? form.fromTime : null,
      toTime: form.partial ? form.toTime : null,
    };

    if (mode === 'self') {
      setMyLeaves(l => {
        const updated = [newLeave, ...l];
        saveLocal(updated);
        return updated;
      });
    }

    const payload = {
      type: 'submitLeave',
      staffName: targetName,
      email: mode === 'staff' ? (selectedStaff?.email || '') : user.email,
      leaveType: form.type,
      from: form.from,
      to: form.partial ? form.from : (form.to || form.from),
      days: duration,
      reason: form.reason,
      emergency: form.emergency,
      partial: form.partial,
      fromTime: form.partial ? form.fromTime : null,
      toTime: form.partial ? form.toTime : null,
      status: 'Pending',
      workDate: form.from,
      activity: form.type,
      hours: duration,
      checkIn: form.partial ? form.fromTime : '08:00',
      checkOut: form.partial ? form.toTime : '17:00',
      notes: form.reason + (form.emergency ? ' [EMERGENCY]' : ''),
      students: 0,
      teacherName: targetName,
    };

    setSubmitted(true);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {}

    setTimeout(() => {
      setSubmitted(false);
      setForm({ type: 'Casual', from: '', to: '', fromTime: '08:00', toTime: '17:00', partial: false, reason: '', emergency: false });
      setSelectedStaff(null); setStaffSearch('');
      fetchHistory(); // Refresh to get real ID
    }, 4000);
  };

  const handleCancel = async (reqId) => {
    setConfirmingId(null);
    setCancelling(reqId);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'cancelRequest', requestType: 'leave', email: user.email, requestId: reqId }),
      });
    } catch {}

    // Optimistically update UI
    setMyLeaves(prev => {
      const updated = prev.filter(l => String(l.id) !== String(reqId));
      saveLocal(updated);
      return updated;
    });
    setCancelling(null);
  };

  return (
    <div style={{ padding: '10px' }}>
      <div className="view-header">
        <div>
          <h2 style={{ fontSize: '1.5rem' }}>{t.title}</h2>
          <p style={{ fontSize: '0.9rem' }}>{t.sub}</p>
        </div>
      </div>

      {isManager && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: '5px' }}>
          <button className={mode === 'self' ? 'button-primary' : 'button-secondary'} onClick={() => setMode('self')} style={{ whiteSpace: 'nowrap' }}>
            <User size={15} /> {t.myLeave}
          </button>
          <button className={mode === 'staff' ? 'button-primary' : 'button-secondary'} onClick={() => setMode('staff')} style={{ whiteSpace: 'nowrap' }}>
            <Users size={15} /> {t.forStaff}
          </button>
        </div>
      )}

      {hasPending && (
        <div className="status-alert warning" style={{ display: 'flex', flexDirection: 'column', gap: 15, padding: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={24} color="#f59e0b" />
            <div>
              <strong style={{ fontSize: '1rem' }}>{t.pendingTitle}</strong>
              <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{t.pendingDesc} <strong>{pendingRequest.type}</strong> ({pendingRequest.from}) {t.pendingDesc2}</p>
            </div>
          </div>
          <button className="button-secondary danger-text" onClick={() => setConfirmingId(pendingRequest.id)} style={{ width: '100%', justifyContent: 'center', height: '44px' }}>
            <Trash2 size={15} /> {t.cancelBtn}
          </button>
        </div>
      )}

      <div className="leave-page-layout" style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div className="form-container" style={{ flex: '1 1 320px', width: '100%' }}>
          <div className="form-header">
            <h3>{t.formTitle}</h3>
            <p style={{ fontSize: '0.85rem' }}>{mode === 'staff' ? t.thirdPartyNote : t.formSub}</p>
          </div>

          {submitted && <div className="forgot-password-success" style={{ marginBottom: 24 }}>{t.successMsg}</div>}

          <form className="generic-form" onSubmit={handleSubmit}>
            <fieldset disabled={hasPending || submitted} style={{ border: 'none', padding: 0 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  className={!form.partial ? 'button-primary' : 'button-secondary'} 
                  style={{ flex: '1 1 140px', minHeight: '44px' }} 
                  onClick={() => set('partial', false)}
                >
                  {t.fullDay}
                </button>
                <button 
                  type="button" 
                  className={form.partial ? 'button-primary' : 'button-secondary'} 
                  style={{ flex: '1 1 140px', minHeight: '44px' }} 
                  onClick={() => set('partial', true)}
                >
                  {t.partialDay}
                </button>
              </div>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                <div className="form-group">
                  <label>{t.leaveType}</label>
                  <select value={form.type} onChange={e => set('type', e.target.value)} style={{ height: '44px', width: '100%' }}>
                    <option>Casual</option><option>Medical</option><option>Emergency</option><option>Annual</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t.fromDate}</label>
                  <input type="date" value={form.from} onChange={e => set('from', e.target.value)} required style={{ height: '44px', width: '100%' }} />
                </div>

                {form.partial && (
                  <div style={{ display: 'flex', gap: 10, width: '100%' }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>{t.startTime}</label>
                      <input type="time" value={form.fromTime} onChange={e => set('fromTime', e.target.value)} style={{ height: '44px', width: '100%' }} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>{t.endTime}</label>
                      <input type="time" value={form.toTime} onChange={e => set('toTime', e.target.value)} style={{ height: '44px', width: '100%' }} />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label>{t.durationLabel}</label>
                  <div className="duration-display" style={{ padding: '12px', background: '#f8f9fa', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                    {durationDisplay()}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '15px' }}>
                <label>{t.reason}</label>
                <textarea value={form.reason} onChange={e => set('reason', e.target.value)} rows={3} required placeholder={t.reasonPlaceholder} style={{ width: '100%', padding: '10px' }} />
              </div>

              <div className="form-actions" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: '20px' }}>
                <button type="submit" className="button-primary" disabled={hasPending} style={{ height: '48px', fontSize: '1rem' }}>
                  {hasPending ? t.locked : t.submit}
                </button>
                <button type="button" className="button-secondary" onClick={() => setForm({ type: 'Casual', from: '', to: '', fromTime: '08:00', toTime: '17:00', partial: false, reason: '', emergency: false })} style={{ height: '44px' }}>
                  {t.clear}
                </button>
              </div>
            </fieldset>
          </form>
        </div>

        <div className="leave-history-panel" style={{ flex: '1 1 320px', width: '100%' }}>
          <h3 style={{ marginBottom: '15px' }}>{t.history}</h3>
          {loadingHistory && myLeaves.length === 0 ? <div className="spinner-center" /> : (
            <div className="leave-history-list" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {myLeaves.length === 0 ? <p style={{opacity:0.6}}>{t.noHistory}</p> : myLeaves.map(req => (
                <div key={req.id} className={`leave-history-card card-${String(req.status).toLowerCase()}`} style={{ padding: '15px', border: '1px solid #eee', borderRadius: '12px', background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <strong>{req.type}</strong>
                    <span className={`status-badge ${STATUS_CLASS[req.status] || 'status-in-progress'}`} style={{ fontSize: '0.75rem' }}>{req.status}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: 10, display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={14} /> {req.from}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} /> {req.days} {req.partial ? (req.days === 1 ? t.hour : t.hours) : (req.days === 1 ? t.day : t.days)}
                    </div>
                  </div>
                  {req.reason && <p style={{ fontSize: '0.9rem', color: '#444', marginBottom: 8, lineHeight: '1.4' }}>{req.reason}</p>}

                  {req.decidedBy && (
                    <div style={{ fontSize: '0.78rem', padding: '6px 8px', borderRadius: 6, marginBottom: 10,
                      background: String(req.status).toLowerCase() === 'approved' ? 'rgba(22,163,74,0.08)' : 'rgba(220,38,38,0.08)',
                      color: String(req.status).toLowerCase() === 'approved' ? '#15803d' : '#b91c1c',
                    }}>
                      {String(req.status).toLowerCase() === 'approved' ? '✓ Approved' : '✗ Rejected'} by <strong>{req.decidedBy}</strong>{req.decidedAt ? ` · ${req.decidedAt}` : ''}
                      {req.decisionReason ? <div style={{ marginTop: 2, fontStyle: 'italic' }}>"{req.decisionReason}"</div> : null}
                    </div>
                  )}

                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8, marginTop: 4 }}>
                    <button
                      onClick={() => {
                        const lines = [
                          '*Leave Request*',
                          `Name: ${req.staffName || user?.name}`,
                          `Type: ${req.type}`,
                          `From: ${req.from}${req.to && req.to !== req.from ? ` → ${req.to}` : ''}`,
                          `Duration: ${req.days} ${req.partial ? 'hr(s)' : 'day(s)'}`,
                          req.reason ? `Reason: ${req.reason}` : null,
                          `Status: ${req.status}`,
                          req.decidedBy ? `Decided by: ${req.decidedBy}` : null,
                          req.decisionReason ? `Note: "${req.decisionReason}"` : null,
                        ].filter(Boolean).join('\n');
                        window.open(`https://wa.me/?text=${encodeURIComponent(lines)}`, '_blank');
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#25d366', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, padding: '4px 0' }}
                    >
                      <Share2 size={14} /> Share via WhatsApp
                    </button>
                  </div>

                  {isReqPending(req.status) && mode === 'self' && (
                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                      {confirmingId === req.id ? (
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button className="button-danger small" onClick={() => handleCancel(req.id)} style={{ flex: 1, height: '40px', justifyContent: 'center' }}>
                            {cancelling === req.id ? t.cancelling : t.confirmYes}
                          </button>
                          <button className="button-secondary small" onClick={() => setConfirmingId(null)} style={{ flex: 1, height: '40px', justifyContent: 'center' }}>
                            {t.confirmNo}
                          </button>
                        </div>
                      ) : (
                        <button className="cancel-link" onClick={() => setConfirmingId(req.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#e74c3c', background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer', fontSize: '0.9rem', width: '100%' }}>
                          <Trash2 size={16} /> {t.cancelBtn}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}