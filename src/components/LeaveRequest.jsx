import { useState, useEffect } from 'react';
import { LEAVE_REQUESTS, STAFF } from '../data/mockData';
import { GOOGLE_SCRIPT_URL } from '../data/config';
import { AlertCircle, Trash2, Users, User, Clock, Calendar, Share2 } from 'lucide-react';

const T = {
  en: {
    title: 'Leave History', sub: 'Submit a leave request or view your history',
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
    clear: 'Clear', submit: 'Submit Request', cancel: 'Cancel', locked: 'Request Locked — Pending Approval',
    history: 'My Leave History', noHistory: 'No previous leave requests found.',
    statusApproved: 'Approved', statusRejected: 'Rejected', statusPending: 'Pending',
    thirdPartyNote: 'You are submitting this leave on behalf of another staff member.',
    leaveTypes: { Casual: 'Casual', Medical: 'Medical', Emergency: 'Emergency', Annual: 'Annual', Other: 'Other' },
  },
  ar: {
    title: 'سجل الإجازات', sub: 'قدّم طلب إجازة أو راجع سجل طلباتك',
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
    clear: 'مسح', submit: 'إرسال الطلب', cancel: 'إلغاء', locked: 'الطلب مقفل — في انتظار الموافقة',
    history: 'سجل إجازاتي', noHistory: 'لا توجد طلبات إجازة سابقة.',
    statusApproved: 'موافق', statusRejected: 'مرفوض', statusPending: 'معلق',
    thirdPartyNote: 'أنت تقدم هذا الطلب نيابةً عن موظف آخر.',
    leaveTypes: { Casual: 'عادية', Medical: 'طبية', Emergency: 'طارئة', Annual: 'سنوية', Other: 'أخرى' },
  },
  ur: {
    title: 'چھٹیوں کی تاریخ', sub: 'چھٹی کی درخواست جمع کریں یا اپنی تاریخ دیکھیں',
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
    clear: 'صاف کریں', submit: 'درخواست جمع کریں', cancel: 'منسوخ کریں', locked: 'درخواست بند — منظوری کا انتظار',
    history: 'میری چھٹیوں کی تاریخ', noHistory: 'کوئی سابقہ چھٹی کی درخواست نہیں ملی۔',
    statusApproved: 'منظور', statusRejected: 'مسترد', statusPending: 'زیر التواء',
    thirdPartyNote: 'آپ یہ درخواست کسی اور عملے کی طرف سے جمع کر رہے ہیں۔',
    leaveTypes: { Casual: 'غیر رسمی', Medical: 'طبی', Emergency: 'ہنگامی', Annual: 'سالانہ', Other: 'دیگر' },
  },
  es: {
    title: 'Historial de Licencias', sub: 'Envía una solicitud o consulta tu historial de licencias',
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
    clear: 'Limpiar', submit: 'Enviar Solicitud', cancel: 'Cancelar', locked: 'Solicitud Bloqueada',
    history: 'Mi Historial de Licencias', noHistory: 'No se encontraron solicitudes anteriores.',
    statusApproved: 'Aprobada', statusRejected: 'Rechazada', statusPending: 'Pendiente',
    thirdPartyNote: 'Estás enviando esta solicitud en nombre de otro miembro del personal.',
    leaveTypes: { Casual: 'Casual', Medical: 'Médica', Emergency: 'Emergencia', Annual: 'Anual', Other: 'Otro' },
  },
  pt: {
    title: 'Histórico de Licenças', sub: 'Envie uma solicitação ou consulte seu histórico de licenças',
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
    clear: 'Limpar', submit: 'Enviar Solicitação', cancel: 'Cancelar', locked: 'Solicitação Bloqueada',
    history: 'Meu Histórico de Licenças', noHistory: 'Nenhuma solicitação anterior encontrada.',
    statusApproved: 'Aprovada', statusRejected: 'Rejeitada', statusPending: 'Pendente',
    thirdPartyNote: 'Está a enviar esta solicitação em nome de outro membro da equipe.',
    leaveTypes: { Casual: 'Casual', Medical: 'Médica', Emergency: 'Emergência', Annual: 'Anual', Other: 'Outro' },
  },
};

const DISCLAIMER = {
  en: {
    heading: 'I have read and understand that:',
    body: "Absenting myself from the madrasah causes detriment to my students' ta'leem. I am humbly requesting this period of leave as it is a matter of extreme necessity; I fully understand that this is merely a request and I will not take time off until explicit permission is granted. I have exhausted all other alternatives before considering this absence, but this remains my only option. I ask Allah to forgive me for causing nuqsaan to the ta'leem of my students.",
    accept: 'I have read and agree to the above',
  },
  ar: {
    heading: 'لقد قرأت وفهمت ما يلي:',
    body: 'إن غيابي عن المدرسة يضر تعليم طلابي ضرر عظيم. وأنا أطلب هذه الإجازة بتواضع شديد لأنها ضرورة قصوى، وأعلم يقينا أن هذا طلب فقط وليس اجازة، ولن أترك مكاني حتى يأتي الإذن الصريح من جانب المشورة. وقد بحثت عن كل سبيل قبل هذا ولكن لم أجد غير هذا. أسأل الله أن يغفر لي تسببي في نقصان تعليم طلابي.',
    accept: 'لقد قرأت وأوافق على ما سبق',
  },
  ur: {
    heading: 'میں نے پڑھا اور سمجھا کہ:',
    body: 'مدرسے سے میری غیر حاضری میرے طلبہ کے تعلیم کو نقصان پہنچاتی ہے۔ میں انتہائی عاجزی کے ساتھ اس مدت کی چھٹی کی درخواست کر رہا ہوں کیونکہ یہ انتہائی ضروری ہے؛ میں پوری طرح سمجھتا ہوں کہ یہ صرف ایک درخواست ہے اور میں اس وقت تک چھٹی نہیں لوں گا جب تک واضح اجازت نہ مل جائے۔ میں نے اس غیر حاضری پر غور کرنے سے پہلے تمام دیگر متبادلات کو آزمایا ہے، لیکن یہی میرا واحد آپشن باقی ہے۔ میں اللہ سے دعا کرتا ہوں کہ وہ مجھے میرے طلبہ کے تعلیم کو نقصان پہنچانے کے لیے معاف فرمائے۔',
    accept: 'میں نے پڑھا اور مذکورہ بالا سے متفق ہوں',
  },
  es: {
    heading: 'He leído y entiendo que:',
    body: "Ausentarme de la Madrasah perjudica el ta'leem de mis estudiantes. Solicito humildemente este periodo de licencia ya que es una necesidad extrema; entiendo plenamente que esto es solo una petición y no tomaré el tiempo libre hasta que se me otorgue el permiso explícito. He agotado todas las demás alternativas antes de considerar esta ausencia, pero esta sigue siendo mi única opción. Pido a Allah que me perdone por causar Nuqsaan al ta'leem de mis alumnos.",
    accept: 'He leído y acepto lo anterior',
  },
  pt: {
    heading: 'Li e entendo que:',
    body: "Ausentar-me da Madrasah causa prejuízo ao ta'leem dos meus alunos. Peço humildemente este período de licença pois é uma necessidade extrema; entendo plenamente que isto é apenas um pedido e não me ausentarei até que a permissão explícita seja concedida. Esgotei todas as outras alternativas antes de considerar esta ausência, mas esta continua a ser a minha única opção. Peço a Allah que me perdoe por causar nuqsaan ao ta'leem dos meus alunos.",
    accept: 'Li e concordo com o acima',
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
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false);
  const [myLeaves, setMyLeaves] = useState(() => loadLocal());
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const allStaff = (() => {
    try {
      const accounts = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
      const userCentre = (user?.centre || user?.center || '').toLowerCase().trim();
      const userCountry = (user?.country || user?.Country || '').toLowerCase().trim();
      const active = accounts.filter(a => {
        if (a.status !== 'Approved' || a.email === user.email) return false;
        if (user.role === 'Centre Manager') {
          const staffCentre = (a.centre || a.center || '').toLowerCase().trim();
          return userCentre && staffCentre === userCentre;
        }
        if (user.role === 'Country Admin') {
          const staffCountry = (a.country || a.Country || '').toLowerCase().trim();
          return userCountry && staffCountry === userCountry;
        }
        if (user.role === 'Super Admin') return true;
        const staffCentre = (a.centre || a.center || '').toLowerCase().trim();
        return userCentre && staffCentre === userCentre;
      });
      if (active.length > 0) return active.map(a => ({ name: a.name, email: a.email }));
      if (user.role === 'Super Admin') {
        return STAFF.filter(s => s.name !== user.name).map(s => ({ name: s.name, email: `${s.name.toLowerCase().replace(/\s+/g,'.')}@staff.local` }));
      }
      return [];
    } catch {}
    return [];
  })();

  const filteredStaff = allStaff.filter(s => s.name.toLowerCase().includes(staffSearch.toLowerCase()));

  const calcDays = () => {
    if (form.partial) {
      if (!form.from || !form.fromTime || !form.toTime) return 0;
      const [fh, fm] = form.fromTime.split(':').map(Number);
      const [th, tm] = form.toTime.split(':').map(Number);
      return Math.max(0, parseFloat(((th * 60 + tm - fh * 60 - fm) / 60).toFixed(1)));
    }
    if (!form.from) return 0;
    const toDate = form.to || form.from;
    return Math.max(0, (new Date(toDate) - new Date(form.from)) / (1000 * 60 * 60 * 24) + 1);
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
    if (mode === 'self') {
      setDisclaimerAccepted(false);
      setShowDisclaimerModal(true);
      return;
    }
    await doSubmit();
  };

  const doSubmit = async () => {

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
      setDisclaimerAccepted(false);
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

              {mode === 'staff' && (
                <div className="form-group" style={{ marginBottom: 16, position: 'relative' }}>
                  <label>{t.selectStaff}</label>
                  <input
                    type="text"
                    placeholder={t.searchStaff}
                    value={staffSearch}
                    onChange={e => { setStaffSearch(e.target.value); setStaffDropOpen(true); setSelectedStaff(null); }}
                    onFocus={() => setStaffDropOpen(true)}
                    autoComplete="off"
                    style={{ height: '44px', width: '100%' }}
                  />
                  {staffDropOpen && filteredStaff.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 8, zIndex: 200, maxHeight: 200, overflowY: 'auto', boxShadow: '0 4px 16px var(--shadow-color)' }}>
                      {filteredStaff.map(s => (
                        <button
                          key={s.email}
                          type="button"
                          onMouseDown={() => { setSelectedStaff(s); setStaffSearch(s.name); setStaffDropOpen(false); }}
                          style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 14px', background: 'none', border: 'none', borderBottom: '1px solid var(--border-color)', cursor: 'pointer', color: 'var(--text-primary)', fontSize: '0.88rem' }}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedStaff && (
                    <p style={{ marginTop: 6, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      ✓ {selectedStaff.name} &lt;{selectedStaff.email}&gt;
                    </p>
                  )}
                  {!selectedStaff && !staffSearch && (
                    <p style={{ marginTop: 6, fontSize: '0.82rem', color: '#e67e22' }}>Please select a staff member to continue.</p>
                  )}
                </div>
              )}

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
                    {['Casual', 'Medical', 'Emergency', 'Annual', 'Other'].map(type => (
                      <option key={type} value={type}>{(t.leaveTypes && t.leaveTypes[type]) || type}</option>
                    ))}
                  </select>
                </div>

                {!form.partial ? (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>{t.fromDate}</label>
                      <input type="date" value={form.from} onChange={e => { set('from', e.target.value); if (!form.to || form.to < e.target.value) set('to', e.target.value); }} required style={{ height: '44px', width: '100%' }} />
                    </div>
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>{t.toDate}</label>
                      <input type="date" value={form.to} min={form.from} onChange={e => set('to', e.target.value)} style={{ height: '44px', width: '100%' }} />
                    </div>
                  </div>
                ) : (
                  <div className="form-group">
                    <label>{t.fromDate}</label>
                    <input type="date" value={form.from} onChange={e => set('from', e.target.value)} required style={{ height: '44px', width: '100%' }} />
                  </div>
                )}

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
                  <div className="duration-display" style={{ padding: '12px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', textAlign: 'center', fontWeight: 'bold', color: 'var(--text-primary)' }}>
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
                <button type="button" className="button-secondary" onClick={() => { setForm({ type: 'Casual', from: '', to: '', fromTime: '08:00', toTime: '17:00', partial: false, reason: '', emergency: false }); setDisclaimerAccepted(false); }} style={{ height: '44px' }}>
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
                    <strong>{(t.leaveTypes && t.leaveTypes[req.type]) || req.type}</strong>
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
      {showDisclaimerModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div style={{
            background: 'var(--card-bg)', borderRadius: 14, padding: '24px 20px',
            maxWidth: 480, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
            maxHeight: '90vh', overflowY: 'auto',
          }}>
            <p style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 12, color: 'var(--text-dark)' }}>
              {(DISCLAIMER[language] || DISCLAIMER.en).heading}
            </p>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.9, color: 'var(--text-secondary)', marginBottom: 18 }}>
              {(DISCLAIMER[language] || DISCLAIMER.en).body}
            </p>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
              <input
                type="checkbox"
                checked={disclaimerAccepted}
                onChange={e => setDisclaimerAccepted(e.target.checked)}
                style={{ marginTop: 3, accentColor: 'var(--accent-color)', width: 18, height: 18, flexShrink: 0 }}
              />
              <span style={{ fontSize: '0.88rem', color: 'var(--text-dark)', fontWeight: 500, lineHeight: 1.5 }}>
                {(DISCLAIMER[language] || DISCLAIMER.en).accept}
              </span>
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="button-primary"
                disabled={!disclaimerAccepted}
                style={{ flex: 1, height: 46, fontSize: '0.95rem' }}
                onClick={() => { setShowDisclaimerModal(false); doSubmit(); }}
              >
                {t.submit}
              </button>
              <button
                className="button-secondary"
                style={{ flex: 1, height: 46 }}
                onClick={() => { setShowDisclaimerModal(false); setDisclaimerAccepted(false); }}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}