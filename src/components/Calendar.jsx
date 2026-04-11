import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus, Minus, CalendarCheck, X, Bell, Pencil, Trash2, RefreshCw, Globe, Flag, Building2, User, Loader2, Layers } from 'lucide-react';
import { EVENTS } from '../data/mockData';
import { GOOGLE_SCRIPT_URL } from '../data/config';

const MONTHS_BY_LANG = {
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
  ur: ['جنوری','فروری','مارچ','اپریل','مئی','جون','جولائی','اگست','ستمبر','اکتوبر','نومبر','دسمبر'],
  es: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  pt: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
};

const DAYS_BY_LANG = {
  en: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  ar: ['الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت','الأحد'],
  ur: ['پیر','منگل','بدھ','جمعرات','جمعہ','ہفتہ','اتوار'],
  es: ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'],
  pt: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
};

const T = {
  en: {
    title: 'Calendar', sub: 'Academic schedule and events',
    filter: 'Filter', allEvents: 'All Events',
    thisMonth: 'This Month', upcomingEvents: 'Upcoming Events',
    noEvents: 'No upcoming events', backToday: 'Back to Today',
    satClass: 'Saturdays as Class Days', syncHijri: 'Sync Hijri Calendar',
    holiday: 'Holiday', event: 'Event', exam: 'Exam',
    muzaakarah: 'Muzaakarah', jalsah: 'Jalsah', other: 'Other',
    addEvent: 'Add Event', addForDay: 'Add event for this day',
    noEventsDay: 'No events on this day.',
    editEvent: 'Edit Event', deleteEvent: 'Delete',
    save: 'Save', cancel: 'Cancel', close: 'Close',
    eventName: 'Event Name', description: 'Description', type: 'Type',
    notify: 'Send Notification', date: 'Date',
    syncing: 'Syncing...', syncDone: 'Synced', syncFail: 'Sync failed',
    globalEvent: 'Global', nationalEvent: 'National', centreEvent: 'Centre', personalEvent: 'Personal',
    scopeLabel: 'Scope', addingTo: 'Adding event to',
    myPersonalEvents: 'My Personal Events (private)',
    bulkAdd: 'Bulk Add', bulkAddTitle: 'Bulk Add Events', bulkAddSub: 'Add the same event across a date range',
    bulkFrom: 'Start Date', bulkTo: 'End Date', bulkSubmit: 'Add Events', bulkDone: 'Events added!',
  },
  ar: {
    title: 'التقويم', sub: 'الجدول الأكاديمي والأحداث',
    filter: 'تصفية', allEvents: 'جميع الأحداث',
    thisMonth: 'هذا الشهر', upcomingEvents: 'الأحداث القادمة',
    noEvents: 'لا توجد أحداث قادمة', backToday: 'العودة إلى اليوم',
    satClass: 'السبت كأيام دراسية', syncHijri: 'مزامنة التقويم الهجري',
    holiday: 'إجازة', event: 'حدث', exam: 'امتحان',
    muzaakarah: 'مذاكرة', jalsah: 'جلسة', other: 'أخرى',
    addEvent: 'إضافة حدث', addForDay: 'أضف حدثاً لهذا اليوم',
    noEventsDay: 'لا توجد أحداث في هذا اليوم.',
    editEvent: 'تعديل الحدث', deleteEvent: 'حذف',
    save: 'حفظ', cancel: 'إلغاء', close: 'إغلاق',
    eventName: 'اسم الحدث', description: 'الوصف', type: 'النوع',
    notify: 'إرسال إشعار', date: 'التاريخ',
    syncing: 'مزامنة...', syncDone: 'تمت المزامنة', syncFail: 'فشل المزامنة',
    globalEvent: 'عالمي', nationalEvent: 'وطني', centreEvent: 'مركز', personalEvent: 'شخصي',
    scopeLabel: 'النطاق', addingTo: 'إضافة حدث إلى',
    myPersonalEvents: 'أحداثي الشخصية (خاصة)',
    bulkAdd: 'إضافة مجمّعة', bulkAddTitle: 'إضافة أحداث متعددة', bulkAddSub: 'أضف نفس الحدث على نطاق تواريخ',
    bulkFrom: 'تاريخ البداية', bulkTo: 'تاريخ النهاية', bulkSubmit: 'إضافة الأحداث', bulkDone: 'تمت إضافة الأحداث!',
  },
  ur: {
    title: 'کیلنڈر', sub: 'تعلیمی شیڈول اور تقریبات',
    filter: 'فلٹر', allEvents: 'تمام تقریبات',
    thisMonth: 'اس مہینے', upcomingEvents: 'آنے والی تقریبات',
    noEvents: 'کوئی آنے والی تقریبات نہیں', backToday: 'آج پر واپس جائیں',
    satClass: 'ہفتہ کو کلاس دن کے طور پر', syncHijri: 'ہجری کیلنڈر ہم آہنگ کریں',
    holiday: 'چھٹی', event: 'تقریب', exam: 'امتحان',
    muzaakarah: 'مذاکرہ', jalsah: 'جلسہ', other: 'دیگر',
    addEvent: 'تقریب شامل کریں', addForDay: 'اس دن کے لیے تقریب شامل کریں',
    noEventsDay: 'اس دن کوئی تقریب نہیں۔',
    editEvent: 'ترمیم', deleteEvent: 'حذف',
    save: 'محفوظ', cancel: 'منسوخ', close: 'بند',
    eventName: 'تقریب کا نام', description: 'تفصیل', type: 'قسم',
    notify: 'اطلاع بھیجیں', date: 'تاریخ',
    syncing: 'ہم آہنگ ہو رہا ہے...', syncDone: 'ہم آہنگ', syncFail: 'ہم آہنگی ناکام',
    globalEvent: 'عالمی', nationalEvent: 'قومی', centreEvent: 'مرکز', personalEvent: 'ذاتی',
    scopeLabel: 'دائرہ کار', addingTo: 'تقریب شامل کریں',
    myPersonalEvents: 'میری ذاتی تقریبات (نجی)',
    bulkAdd: 'بلک اضافہ', bulkAddTitle: 'متعدد تقریبات شامل کریں', bulkAddSub: 'تاریخ کی حد پر ایک ہی تقریب شامل کریں',
    bulkFrom: 'شروع کی تاریخ', bulkTo: 'اختتامی تاریخ', bulkSubmit: 'تقریبات شامل کریں', bulkDone: 'تقریبات شامل کر دی گئیں!',
  },
  es: {
    title: 'Calendario', sub: 'Horario académico y eventos',
    filter: 'Filtrar', allEvents: 'Todos los Eventos',
    thisMonth: 'Este Mes', upcomingEvents: 'Próximos Eventos',
    noEvents: 'No hay eventos próximos', backToday: 'Volver a Hoy',
    satClass: 'Sábados como Días de Clase', syncHijri: 'Sincronizar Calendario Hijri',
    holiday: 'Feriado', event: 'Evento', exam: 'Examen',
    muzaakarah: 'Muzaakarah', jalsah: 'Jalsah', other: 'Otro',
    addEvent: 'Agregar Evento', addForDay: 'Agregar evento para este día',
    noEventsDay: 'No hay eventos este día.',
    editEvent: 'Editar', deleteEvent: 'Eliminar',
    save: 'Guardar', cancel: 'Cancelar', close: 'Cerrar',
    eventName: 'Nombre del Evento', description: 'Descripción', type: 'Tipo',
    notify: 'Enviar Notificación', date: 'Fecha',
    syncing: 'Sincronizando...', syncDone: 'Sincronizado', syncFail: 'Error de sincronización',
    globalEvent: 'Global', nationalEvent: 'Nacional', centreEvent: 'Centro', personalEvent: 'Personal',
    scopeLabel: 'Alcance', addingTo: 'Agregando evento a',
    myPersonalEvents: 'Mis eventos personales (privados)',
    bulkAdd: 'Agregar en bloque', bulkAddTitle: 'Agregar eventos en bloque', bulkAddSub: 'Agrega el mismo evento en un rango de fechas',
    bulkFrom: 'Fecha de inicio', bulkTo: 'Fecha de fin', bulkSubmit: 'Agregar eventos', bulkDone: '¡Eventos agregados!',
  },
  pt: {
    title: 'Calendário', sub: 'Calendário acadêmico e eventos',
    filter: 'Filtrar', allEvents: 'Todos os Eventos',
    thisMonth: 'Este Mês', upcomingEvents: 'Próximos Eventos',
    noEvents: 'Nenhum evento próximo', backToday: 'Voltar para Hoje',
    satClass: 'Sábados como Dias de Aula', syncHijri: 'Sincronizar Calendário Hijri',
    holiday: 'Feriado', event: 'Evento', exam: 'Exame',
    muzaakarah: 'Muzaakarah', jalsah: 'Jalsah', other: 'Outro',
    addEvent: 'Adicionar Evento', addForDay: 'Adicionar evento para este dia',
    noEventsDay: 'Nenhum evento neste dia.',
    editEvent: 'Editar', deleteEvent: 'Excluir',
    save: 'Salvar', cancel: 'Cancelar', close: 'Fechar',
    eventName: 'Nome do Evento', description: 'Descrição', type: 'Tipo',
    notify: 'Enviar Notificação', date: 'Data',
    syncing: 'Sincronizando...', syncDone: 'Sincronizado', syncFail: 'Falha na sincronização',
    globalEvent: 'Global', nationalEvent: 'Nacional', centreEvent: 'Centro', personalEvent: 'Pessoal',
    scopeLabel: 'Escopo', addingTo: 'Adicionando evento a',
    myPersonalEvents: 'Meus eventos pessoais (privados)',
    bulkAdd: 'Adicionar em bloco', bulkAddTitle: 'Adicionar eventos em bloco', bulkAddSub: 'Adicione o mesmo evento num intervalo de datas',
    bulkFrom: 'Data de início', bulkTo: 'Data de fim', bulkSubmit: 'Adicionar eventos', bulkDone: 'Eventos adicionados!',
  },
};

const HIJRI_MONTHS_BY_LANG = {
  en: ['Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    "Jumada al-Awwal", "Jumada al-Thani", 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhu al-Qi'dah", 'Dhu al-Hijjah'],
  ar: ['مُحَرَّم', 'صَفَر', 'رَبِيع الأوَّل', 'رَبِيع الثَّاني',
    'جُمَادَى الأُولَى', 'جُمَادَى الآخِرَة', 'رَجَب', 'شَعْبَان',
    'رَمَضَان', 'شَوَّال', 'ذُو القَعْدَة', 'ذُو الحِجَّة'],
  ur: ['محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی',
    'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذوالقعدہ', 'ذوالحجہ'],
};

const TYPE_COLORS = {
  holiday: '#f39c12',
  event: '#9b59b6',
  exam: '#e74c3c',
  'monthly-muzaakarah': '#00bcd4',
  jalsah: '#673ab7',
  other: '#7f8c8d',
};

const SCOPE_META = {
  global:   { icon: Globe,     color: '#2196f3' },
  national: { icon: Flag,      color: '#4caf50' },
  centre:   { icon: Building2, color: '#ff9800' },
  personal: { icon: User,      color: '#9c27b0' },
};

function gregorianToHijri(gy, gm, gd, offset = 0) {
  const a = Math.floor((14 - gm) / 12);
  const y = gy + 4800 - a;
  const m = gm + 12 * a - 3;
  const jdn = gd + Math.floor((153 * m + 2) / 5) + 365 * y +
    Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045 + offset;
  const l = jdn - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j = (Math.floor((10985 - l2) / 5316)) * (Math.floor((50 * l2) / 17719)) +
            (Math.floor(l2 / 5670)) * (Math.floor((43 * l2) / 15238));
  const l3 = l2 - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) -
             (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;
  const hm = Math.floor((24 * l3) / 709);
  const hd = l3 - Math.floor((709 * hm) / 24);
  const hy = 30 * n + j - 30;
  return { year: hy, month: hm, day: hd };
}

function getHijriHeader(gy, gm, offset, hijriMonths) {
  const firstDay = new Date(gy, gm, 1);
  const lastDay = new Date(gy, gm + 1, 0);
  const h1 = gregorianToHijri(firstDay.getFullYear(), firstDay.getMonth() + 1, firstDay.getDate(), offset);
  const h2 = gregorianToHijri(lastDay.getFullYear(), lastDay.getMonth() + 1, lastDay.getDate(), offset);
  if (h1.month === h2.month) return `${hijriMonths[h1.month - 1]} ${h1.year} AH`;
  return `${hijriMonths[h1.month - 1]} – ${hijriMonths[h2.month - 1]} ${h2.year} AH`;
}

function getDaysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year, month) { return (new Date(year, month, 1).getDay() + 6) % 7; }

const EVENT_TYPES = ['holiday', 'event', 'exam', 'monthly-muzaakarah', 'jalsah', 'other'];

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

function getUserMeta(user) {
  const role = user?.role || 'Staff';
  const country = user?.country || user?.Country || '';
  const centre = user?.centre || user?.Centre || user?.center || '';
  const email = user?.email || user?.Email || '';
  const name = user?.name || user?.Name || '';
  const isSuperAdmin = role === 'Super Admin';
  const isCountryAdmin = role === 'Country Admin';
  const isCentreManager = role === 'Centre Manager';
  const isStaff = role === 'Staff';
  const canWriteSheet = isSuperAdmin || isCountryAdmin || isCentreManager;
  return { role, country, centre, email, name, isSuperAdmin, isCountryAdmin, isCentreManager, isStaff, canWriteSheet };
}

function getDefaultScope(meta) {
  if (meta.isSuperAdmin) return 'global';
  if (meta.isCountryAdmin) return 'national';
  if (meta.isCentreManager) return 'centre';
  return 'personal';
}

function canUserEditEvent(ev, meta) {
  if (ev.source === 'local') {
    return ev.addedByEmail === meta.email;
  }
  if (meta.isSuperAdmin) return true;
  if (meta.isCountryAdmin) {
    return (ev.scope === 'national' && ev.country === meta.country) ||
           (ev.scope === 'centre' && ev.country === meta.country);
  }
  if (meta.isCentreManager) {
    return ev.scope === 'centre' && ev.centre === meta.centre;
  }
  return false;
}

function isEventVisibleToUser(ev, meta) {
  if (ev.source === 'local') return ev.addedByEmail === meta.email;
  if (ev.scope === 'global') return true;
  if (ev.scope === 'national') {
    if (meta.isSuperAdmin) return true;
    return ev.country === meta.country;
  }
  if (ev.scope === 'centre') {
    if (meta.isSuperAdmin) return true;
    if (meta.isCountryAdmin) return ev.country === meta.country;
    return ev.centre === meta.centre;
  }
  return false;
}

function normalizeSheetEvent(raw) {
  return {
    id: String(raw.id || raw.ID || ''),
    date: raw.date || raw.Date || '',
    name: raw.name || raw.Name || '',
    type: raw.type || raw.Type || 'event',
    desc: raw.desc || raw.Desc || raw.description || raw.Description || '',
    scope: (raw.scope || raw.Scope || 'global').toLowerCase(),
    country: raw.country || raw.Country || '',
    centre: raw.centre || raw.Centre || raw.center || raw.Center || '',
    addedBy: raw.addedBy || raw.AddedBy || '',
    addedByEmail: raw.addedByEmail || raw.AddedByEmail || '',
    addedAt: raw.addedAt || raw.AddedAt || '',
    source: 'sheet',
  };
}

function getLocalStorageKey(meta) {
  return `haazimi_personal_events_${meta.email || 'guest'}`;
}

function loadPersonalEvents(meta) {
  try {
    return JSON.parse(localStorage.getItem(getLocalStorageKey(meta)) || '[]');
  } catch { return []; }
}

function savePersonalEvents(meta, events) {
  localStorage.setItem(getLocalStorageKey(meta), JSON.stringify(events));
}

export default function Calendar({ user, language }) {
  const t = T[language] || T.en;
  const MONTHS = MONTHS_BY_LANG[language] || MONTHS_BY_LANG.en;
  const DAYS = DAYS_BY_LANG[language] || DAYS_BY_LANG.en;
  const HIJRI_MONTHS = HIJRI_MONTHS_BY_LANG[language] || HIJRI_MONTHS_BY_LANG.en;
  const isRTL = language === 'ar' || language === 'ur';

  const meta = getUserMeta(user);

  const EVENT_LABELS = {
    holiday: t.holiday, event: t.event, exam: t.exam,
    'monthly-muzaakarah': t.muzaakarah, jalsah: t.jalsah, other: t.other,
  };

  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [filter, setFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [showSat, setShowSat] = useState(false);
  const [hijriOffset, setHijriOffset] = useState(0);

  const calCacheKey = `haazimi_cal_events_${meta.centre || meta.country || 'global'}`;

  const mockBaseEvents = EVENTS.map((ev, i) => ({
    ...ev,
    id: `mock-${i}`,
    scope: 'global',
    country: '',
    centre: '',
    addedBy: 'System',
    addedByEmail: '',
    addedAt: '',
    source: 'sheet',
  }));

  const [sheetEvents, setSheetEvents] = useState(() => {
    try {
      const cached = localStorage.getItem(calCacheKey);
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });
  const [personalEvents, setPersonalEvents] = useState(() => loadPersonalEvents(meta));
  const [syncStatus, setSyncStatus] = useState(() => {
    try { return localStorage.getItem(calCacheKey) ? 'syncing' : 'idle'; } catch { return 'idle'; }
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayAddForm, setShowDayAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: '', name: '', type: 'event', desc: '', notify: false });
  const [editingEventId, setEditingEventId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkForm, setBulkForm] = useState({ name: '', type: 'holiday', fromDate: '', toDate: '' });
  const [bulkStatus, setBulkStatus] = useState('idle');

  const defaultScope = getDefaultScope(meta);

  useEffect(() => {
    const loadSatSetting = async () => {
      try {
        const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getSettings&t=${Date.now()}`, { mode: 'cors' });
        const allSettings = await res.json();
        const centreKey = meta.centre || '';
        const centreSettings = allSettings[centreKey] || {};
        setShowSat(Boolean(centreSettings.showSat));
      } catch {
        try {
          const centreKey = meta.centre || 'default';
          const saved = localStorage.getItem(`haazimi_show_sat_${centreKey}`);
          setShowSat(saved === 'true');
        } catch {}
      }
    };

    loadSatSetting();
  }, [meta.centre]);

  const fetchSheetEvents = useCallback(async () => {
    setSyncStatus('syncing');
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getCalendarEvents&t=${Date.now()}`, { mode: 'cors' });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = data.map(normalizeSheetEvent);
        setSheetEvents(normalized);
        try { localStorage.setItem(calCacheKey, JSON.stringify(normalized)); } catch {}
        setSyncStatus('done');
      } else {
        setSheetEvents(prev => prev.length > 0 ? prev : mockBaseEvents);
        setSyncStatus('done');
      }
    } catch {
      setSheetEvents(prev => prev.length > 0 ? prev : mockBaseEvents);
      setSyncStatus('fail');
    }
  }, [calCacheKey]);

  useEffect(() => {
    fetchSheetEvents();
  }, [fetchSheetEvents]);

  const allVisibleEvents = [
    ...sheetEvents.filter(ev => isEventVisibleToUser(ev, meta)),
    ...personalEvents.map(ev => ({ ...ev, source: 'local' })),
  ];

  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
  const goToToday = () => { setMonth(today.getMonth()); setYear(today.getFullYear()); };
  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevDays = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);

  const dateKey = (d) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const getEventsForDate = (d) => {
    const key = dateKey(d);
    return allVisibleEvents.filter(e => e.date === key && (filter === 'all' || e.type === filter));
  };

  const eventsOnSelected = selectedDate
    ? allVisibleEvents.filter(e => e.date === selectedDate && (filter === 'all' || e.type === filter))
    : [];

  const upcomingEvents = allVisibleEvents
    .filter(e => e.date >= today.toISOString().split('T')[0])
    .filter(e => filter === 'all' || e.type === filter)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  const eventCounts = {};
  allVisibleEvents.forEach(e => { eventCounts[e.type] = (eventCounts[e.type] || 0) + 1; });

  const handleDayClick = (cell) => {
    if (!cell.current) return;
    const key = `${cell.gYear}-${String(cell.gMonth).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
    if (selectedDate === key) {
      setSelectedDate(null);
      setShowDayAddForm(false);
      setEditingEventId(null);
    } else {
      setSelectedDate(key);
      setShowDayAddForm(false);
      setEditingEventId(null);
      setNewEvent({ date: key, name: '', type: 'event', desc: '', notify: false });
    }
  };

  const handleAddEvent = async (e) => {
    if (e) e.preventDefault();
    if (!newEvent.date || !newEvent.name) return;

    const scope = getDefaultScope(meta);
    const id = `ID-${Date.now()}`;
    const ev = {
      id,
      date: newEvent.date,
      name: newEvent.name,
      type: newEvent.type,
      desc: newEvent.desc || '',
      scope,
      country: meta.country || '',
      centre: meta.centre || '',
      addedBy: meta.name || '',
      addedByEmail: meta.email || '',
      addedAt: new Date().toISOString(),
    };

    setSyncStatus('syncing');

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'addCalendarEvent',
          ...ev,
        }),
      });

      setSheetEvents(prev => [...prev, { ...ev, source: 'sheet' }]);
      setSyncStatus('done');
      setShowDayAddForm(false);
      if (typeof setAddingEvent === 'function') setAddingEvent(null);
      setNewEvent({ date: selectedDate || '', name: '', type: 'event', desc: '', notify: false });
    } catch (err) {
      console.error("Network Error:", err);
      setSyncStatus('fail');
    }
  };

  const startEdit = (ev) => {
    setEditingEventId(ev.id);
    setEditForm({ date: ev.date, name: ev.name, type: ev.type, desc: ev.desc || '', source: ev.source });
    setShowDayAddForm(false);
  };

  const saveEdit = async () => {
    if (!editForm.date || !editForm.name) return;
    const targetEvent = allVisibleEvents.find(e => e.id === editingEventId);
    if (!targetEvent) return;

    if (targetEvent.source === 'local') {
      const updated = personalEvents.map(ev =>
        ev.id === editingEventId ? { ...ev, ...editForm, editedAt: new Date().toISOString() } : ev
      );
      setPersonalEvents(updated);
      savePersonalEvents(meta, updated);
    } else {
      setSyncStatus('syncing');
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            action: 'updateCalendarEvent',
            id: editingEventId,
            ...editForm
          }),
        });

        setSheetEvents(prev => prev.map(ev =>
          ev.id === editingEventId ? { ...ev, ...editForm } : ev
        ));

        setSyncStatus('done');
      } catch (err) {
        console.error("Edit failed:", err);
        setSyncStatus('fail');
      }
    }

    setEditingEventId(null);
    setEditForm({});
  };

  const handleBulkAdd = async (e) => {
    e.preventDefault();
    if (!bulkForm.name || !bulkForm.fromDate || !bulkForm.toDate) return;
    setBulkStatus('loading');
    const from = new Date(bulkForm.fromDate);
    const to = new Date(bulkForm.toDate);
    if (to < from) { setBulkStatus('idle'); return; }

    const dates = [];
    for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().slice(0, 10));
    }

    const newEvents = [];
    for (const dateStr of dates) {
      const id = `bulk-${dateStr}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const ev = {
        id,
        date: dateStr,
        name: bulkForm.name,
        type: bulkForm.type,
        desc: '',
        scope: defaultScope,
        country: meta.country || '',
        centre: meta.centre || '',
        addedBy: user?.name || '',
        addedByEmail: meta.email || '',
        addedAt: new Date().toISOString(),
      };
      newEvents.push(ev);
      if (meta.canWriteSheet && GOOGLE_SCRIPT_URL) {
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'addCalendarEvent',
              ...ev,
            }),
          });
        } catch {}
      }
    }

    setSheetEvents(prev => [...prev, ...newEvents]);
    setBulkStatus('done');
    setTimeout(() => {
      setBulkOpen(false);
      setBulkForm({ name: '', type: 'holiday', fromDate: '', toDate: '' });
      setBulkStatus('idle');
    }, 1500);
  };

  const handleDeleteEvent = async (ev) => {
    if (!window.confirm(`Delete "${ev.name}"?`)) return;

    if (ev.source === 'local') {
      const updated = personalEvents.filter(e => e.id !== ev.id);
      setPersonalEvents(updated);
      savePersonalEvents(meta, updated);
      return;
    }

    setSyncStatus('syncing');
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ type: 'deleteCalendarEvent', id: ev.id }),
      });
      setSheetEvents(prev => prev.filter(e => e.id !== ev.id));
      setSyncStatus('done');
    } catch {
      setSyncStatus('fail');
    }
  };

  const handleSatToggle = async (checked) => {
    setShowSat(checked);
    try {
      localStorage.setItem(`haazimi_show_sat_${meta.centre || 'default'}`, String(checked));
    } catch {}

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          action: 'updateSetting',
          centre: meta.centre || '',
          feature: 'showSat',
          enabled: checked,
        }),
      });
    } catch {}
  };

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, current: false, gMonth: month === 0 ? 12 : month, gYear: month === 0 ? year - 1 : year });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, current: true, gMonth: month + 1, gYear: year });
  let nextD = 1;
  while (cells.length % 7 !== 0)
    cells.push({ day: nextD++, current: false, gMonth: month === 11 ? 1 : month + 2, gYear: month === 11 ? year + 1 : year });

  const hijriHeader = getHijriHeader(year, month, hijriOffset, HIJRI_MONTHS);

  const inputStyle = {
    fontSize: '0.82rem', padding: '6px 10px', border: '1px solid var(--border-color)',
    borderRadius: 6, background: 'var(--input-bg)', color: 'var(--text-primary)', width: '100%', boxSizing: 'border-box',
  };

  const scopeLabel = (scope, t) => {
    const map = { global: t.globalEvent, national: t.nationalEvent, centre: t.centreEvent, personal: t.personalEvent };
    return map[scope] || scope;
  };

  const ScopeIcon = ({ scope, size = 11 }) => {
    const sm = SCOPE_META[scope] || SCOPE_META.personal;
    const Icon = sm.icon;
    return <Icon size={size} color={sm.color} style={{ flexShrink: 0 }} />;
  };

  const SyncIndicator = () => {
    if (syncStatus === 'syncing') return (
      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
        <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> {t.syncing}
      </span>
    );
    if (syncStatus === 'fail') return (
      <span style={{ fontSize: '0.72rem', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: 4 }}>
        ✕ {t.syncFail}
      </span>
    );
    return null;
  };

  return (
    <div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
          <SyncIndicator />
          <button
            onClick={fetchSheetEvents}
            title="Refresh events"
            style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5, height: 36 }}
          >
            <RefreshCw size={15} />
          </button>
          {(meta.isSuperAdmin || meta.isCountryAdmin || meta.isCentreManager) && (
            <button
              onClick={() => { setBulkOpen(true); setBulkForm({ name: '', type: 'holiday', fromDate: '', toDate: '' }); setBulkStatus('idle'); }}
              style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5, height: 36, fontSize: '1rem', fontWeight: 600 }}
            >
              <Plus size={15} />
            </button>
          )}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setFilterOpen(o => !o)}
              style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, height: 36, fontSize: '0.85rem', fontWeight: 500 }}
            >
              <Filter size={15} /> {t.filter}
            </button>
            {filterOpen && (
              <div className="filters-list">
                <button className={`filter-button ${filter === 'all' ? 'active' : ''}`} onClick={() => { setFilter('all'); setFilterOpen(false); }}>{t.allEvents}</button>
                {EVENT_TYPES.map(tp => (
                  <button key={tp} className={`filter-button ${filter === tp ? 'active' : ''}`} onClick={() => { setFilter(tp); setFilterOpen(false); }}>
                    {EVENT_LABELS[tp]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="calendar-layout">
        <div className="calendar-main">
          <div className="calendar-controls">
            <button className="calendar-nav-btn" onClick={prevMonth} aria-label="Previous month">
              {isRTL ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <div className="calendar-title-block">
              <h3 className="calendar-title">{MONTHS[month]} {year}</h3>
              <div className="calendar-hijri-subtitle">{hijriHeader}</div>
            </div>
            <button className="calendar-nav-btn" onClick={nextMonth} aria-label="Next month">
              {isRTL ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>

          {!isCurrentMonth && (
            <div className="today-btn-wrap">
              <button className="today-btn" onClick={goToToday}>
                <CalendarCheck size={15} /> {t.backToday}
              </button>
            </div>
          )}

          <div className="calendar-grid">
            {DAYS.map(d => <div key={d} className="day-header">{d}</div>)}
            {cells.map((cell, i) => {
              const evs = cell.current ? getEventsForDate(cell.day) : [];
              const primaryEv = evs[0] || null;
              const isSat = i % 7 === 6;
              const isToday = cell.current && cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const hDate = gregorianToHijri(cell.gYear, cell.gMonth, cell.day, hijriOffset);
              const satClass = (showSat && isSat && cell.current) ? 'class-day' : '';
              const cellKey = cell.current
                ? `${cell.gYear}-${String(cell.gMonth).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`
                : null;
              const isSelected = cellKey && selectedDate === cellKey;
              return (
                <div
                  key={i}
                  className={`day-cell ${!cell.current ? 'other-month' : ''} ${isToday ? 'today' : ''} ${primaryEv ? primaryEv.type : ''} ${satClass} ${isSelected ? 'day-selected' : ''}`}
                  onClick={() => handleDayClick(cell)}
                  style={{ cursor: cell.current ? 'pointer' : 'default' }}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <span className="day-greg">{cell.day}</span>
                  {evs.length > 0 && (
                    <div style={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', marginTop: 1 }}>
                      {evs.slice(0, 3).map((ev, idx) => (
                        <span key={idx} style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: TYPE_COLORS[ev.type] || '#888',
                          display: 'inline-block', flexShrink: 0,
                        }} />
                      ))}
                      {evs.length > 3 && (
                        <span style={{ fontSize: '0.5rem', color: 'var(--text-secondary)', lineHeight: '6px' }}>+{evs.length - 3}</span>
                      )}
                    </div>
                  )}
                  <span className="day-hijri">{hDate.day}</span>
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <div style={{
              marginTop: 16, border: '1px solid var(--border-color)', borderRadius: 12,
              background: 'var(--card-bg)', boxShadow: '0 4px 16px var(--shadow-color)', overflow: 'hidden',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderBottom: '1px solid var(--border-color)',
                background: 'var(--hover-bg)',
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {formatDateLabel(selectedDate)}
                </span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {!showDayAddForm && !editingEventId && (
                    <button
                      onClick={() => {
                        setShowDayAddForm(true);
                        setNewEvent({ date: selectedDate, name: '', type: 'event', desc: '', notify: false });
                      }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem',
                        padding: '5px 12px', background: 'var(--accent-color)', color: '#fff',
                        border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500,
                      }}>
                      <Plus size={14} /> {t.addEvent}
                    </button>
                  )}
                  <button
                    onClick={() => { setSelectedDate(null); setShowDayAddForm(false); setEditingEventId(null); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4 }}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              {showDayAddForm && (
                <form onSubmit={handleAddEvent} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {meta.canWriteSheet && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)', padding: '4px 0' }}>
                      <ScopeIcon scope={defaultScope} size={13} />
                      <span>
                        {t.addingTo}: <strong style={{ color: SCOPE_META[defaultScope]?.color }}>
                          {scopeLabel(defaultScope, t)}
                          {defaultScope === 'national' && meta.country ? ` (${meta.country})` : ''}
                          {defaultScope === 'centre' && meta.centre ? ` (${meta.centre})` : ''}
                        </strong>
                        {' '}— {t.syncing.replace('...', '')} Google Sheets
                      </span>
                    </div>
                  )}
                  {!meta.canWriteSheet && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#9c27b0', padding: '4px 0' }}>
                      <User size={13} /> {t.myPersonalEvents}
                    </div>
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t.eventName} *</label>
                      <input style={inputStyle} type="text" required placeholder="e.g. Parents Meeting" value={newEvent.name} onChange={e => setNewEvent(n => ({ ...n, name: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t.type}</label>
                      <select style={inputStyle} value={newEvent.type} onChange={e => setNewEvent(n => ({ ...n, type: e.target.value }))}>
                        {EVENT_TYPES.map(tp => <option key={tp} value={tp}>{EVENT_LABELS[tp] || tp}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t.description}</label>
                    <input style={inputStyle} type="text" placeholder="Optional details" value={newEvent.desc} onChange={e => setNewEvent(n => ({ ...n, desc: e.target.value }))} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" id="notifyChk" checked={newEvent.notify} onChange={e => setNewEvent(n => ({ ...n, notify: e.target.checked }))} style={{ width: 15, height: 15, cursor: 'pointer' }} />
                    <label htmlFor="notifyChk" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'var(--text-secondary)' }}>
                      <Bell size={13} /> {t.notify}
                    </label>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit" style={{ fontSize: '0.82rem', padding: '7px 18px', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>{t.addEvent}</button>
                    <button type="button" onClick={() => setShowDayAddForm(false)} style={{ fontSize: '0.82rem', padding: '7px 14px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, cursor: 'pointer' }}>{t.cancel}</button>
                  </div>
                </form>
              )}

              {editingEventId && (
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 2 }}>{t.editEvent}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t.date}</label>
                      <input style={inputStyle} type="date" required value={editForm.date} onChange={e => setEditForm(f => ({ ...f, date: e.target.value }))} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t.type}</label>
                      <select style={inputStyle} value={editForm.type} onChange={e => setEditForm(f => ({ ...f, type: e.target.value }))}>
                        {EVENT_TYPES.map(tp => <option key={tp} value={tp}>{EVENT_LABELS[tp] || tp}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t.eventName} *</label>
                    <input style={inputStyle} type="text" required value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>{t.description}</label>
                    <input style={inputStyle} type="text" value={editForm.desc} onChange={e => setEditForm(f => ({ ...f, desc: e.target.value }))} placeholder="Optional" />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={saveEdit} style={{ fontSize: '0.82rem', padding: '7px 18px', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>{t.save}</button>
                    <button onClick={() => { setEditingEventId(null); setEditForm({}); }} style={{ fontSize: '0.82rem', padding: '7px 14px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, cursor: 'pointer' }}>{t.cancel}</button>
                  </div>
                </div>
              )}

              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {eventsOnSelected.length === 0 ? (
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.noEventsDay}</p>
                ) : eventsOnSelected.map((ev, idx) => {
                  const canEdit = canUserEditEvent(ev, meta);
                  const sm = SCOPE_META[ev.scope] || SCOPE_META.personal;
                  const SIcon = sm.icon;
                  return (
                    <div key={ev.id || idx} style={{
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                      padding: '10px 12px', borderRadius: 8,
                      background: 'var(--hover-bg)', border: `1px solid ${TYPE_COLORS[ev.type] || '#ccc'}22`,
                      borderLeft: `4px solid ${TYPE_COLORS[ev.type] || '#ccc'}`,
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                            background: `${TYPE_COLORS[ev.type]}22`, color: TYPE_COLORS[ev.type],
                            textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0,
                          }}>
                            {EVENT_LABELS[ev.type] || ev.type}
                          </span>
                          <span title={scopeLabel(ev.scope, t)} style={{
                            display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.65rem',
                            color: sm.color, background: `${sm.color}15`, padding: '2px 6px', borderRadius: 10,
                          }}>
                            <SIcon size={9} /> {scopeLabel(ev.scope, t)}
                          </span>
                          {ev.addedBy && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>by {ev.addedBy}</span>
                          )}
                        </div>
                        <p style={{ margin: '4px 0 0', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{ev.name}</p>
                        {ev.desc && <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ev.desc}</p>}
                      </div>
                      {canEdit && editingEventId !== ev.id && (
                        <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginTop: 2 }}>
                          <button
                            onClick={() => startEdit(ev)}
                            title={t.editEvent}
                            style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 6, cursor: 'pointer', padding: '5px 8px', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(ev)}
                            title={t.deleteEvent}
                            style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer', padding: '5px 8px', display: 'flex', alignItems: 'center', color: '#dc2626' }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="calendar-top-info">
          <div className="calendar-summary">
            <h3>{t.thisMonth}</h3>
            {Object.entries(eventCounts).map(([type, count]) => (
              <div className={`summary-item summary-item--${type}`} key={type}>
                <span className="summary-dot" />
                <p>{EVENT_LABELS[type] || type}</p>
                <span>{count}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 600 }}>
                {t.scopeLabel}
              </div>
              {Object.entries(SCOPE_META).map(([scope, sm]) => {
                const Icon = sm.icon;
                const count = allVisibleEvents.filter(e => (e.scope || 'personal') === scope).length;
                if (count === 0) return null;
                return (
                  <div key={scope} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', padding: '2px 0', color: 'var(--text-secondary)' }}>
                    <Icon size={11} color={sm.color} />
                    <span style={{ flex: 1 }}>{scopeLabel(scope, t)}</span>
                    <span>{count}</span>
                  </div>
                );
              })}
            </div>
            {(meta.isSuperAdmin || meta.isCountryAdmin || meta.isCentreManager) && (
              <div className="saturday-toggle">
                <span>{t.satClass}</span>
                <input
                  type="checkbox"
                  checked={showSat}
                  onChange={(e) => handleSatToggle(e.target.checked)}
                  style={{ accentColor: 'var(--accent-color)' }}
                />
              </div>
            )}
            {(meta.isSuperAdmin || meta.isCountryAdmin || meta.isCentreManager) && (
              <div className="hijri-sync-control">
                <span>{t.syncHijri}</span>
                <div className="hijri-sync-buttons">
                  <button onClick={() => setHijriOffset(o => o - 1)} title="Subtract a day"><Minus size={13} /></button>
                  <span className="hijri-offset-value">{hijriOffset > 0 ? `+${hijriOffset}` : hijriOffset}</span>
                  <button onClick={() => setHijriOffset(o => o + 1)} title="Add a day"><Plus size={13} /></button>
                </div>
              </div>
            )}
          </div>

          <div className="upcoming-events">
            <h3>{t.upcomingEvents}</h3>
            <ul>
              {upcomingEvents.length ? upcomingEvents.map((ev, i) => {
                const sm = SCOPE_META[ev.scope] || SCOPE_META.personal;
                const SIcon = sm.icon;
                return (
                  <li key={i} className={ev.type} style={{ cursor: 'pointer' }} onClick={() => {
                    setSelectedDate(ev.date);
                    setShowDayAddForm(false);
                    setEditingEventId(null);
                    setNewEvent({ date: ev.date, name: '', type: 'event', desc: '', notify: false });
                  }}>
                    <span className="event-date">{parseInt(ev.date.split('-')[2])}</span>
                    <div className="event-details">
                      <strong style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        {ev.name}
                        <SIcon size={10} color={sm.color} />
                      </strong>
                      <p>{ev.desc}</p>
                    </div>
                  </li>
                );
              }) : (
                <li className="no-events">{t.noEvents}</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {tooltip && (
        <div className="event-tooltip" style={{ left: tooltip.x, top: tooltip.y }}>
          {tooltip.text}
        </div>
      )}

      {bulkOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div style={{
            background: 'var(--card-bg)', borderRadius: 14, padding: '24px 20px',
            maxWidth: 420, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.22)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>{t.bulkAddTitle}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{t.bulkAddSub}</p>
              </div>
              <button onClick={() => setBulkOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4 }}>
                <X size={18} />
              </button>
            </div>
            {bulkStatus === 'done' ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#16a34a', fontWeight: 600, fontSize: '1rem' }}>
                ✓ {t.bulkDone}
              </div>
            ) : (
              <form onSubmit={handleBulkAdd} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>{t.eventName} *</label>
                  <input
                    style={inputStyle}
                    type="text"
                    required
                    placeholder="e.g. School Holiday"
                    value={bulkForm.name}
                    onChange={e => setBulkForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>{t.type}</label>
                  <select
                    style={inputStyle}
                    value={bulkForm.type}
                    onChange={e => setBulkForm(f => ({ ...f, type: e.target.value }))}
                  >
                    {EVENT_TYPES.map(tp => <option key={tp} value={tp}>{EVENT_LABELS[tp] || tp}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>{t.bulkFrom} *</label>
                    <input
                      style={inputStyle}
                      type="date"
                      required
                      value={bulkForm.fromDate}
                      onChange={e => setBulkForm(f => ({ ...f, fromDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>{t.bulkTo} *</label>
                    <input
                      style={inputStyle}
                      type="date"
                      required
                      value={bulkForm.toDate}
                      onChange={e => setBulkForm(f => ({ ...f, toDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button
                    type="submit"
                    className="button-primary"
                    disabled={bulkStatus === 'loading'}
                    style={{ flex: 1, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    {bulkStatus === 'loading' ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> {t.syncing}</> : <>{t.bulkSubmit}</>}
                  </button>
                  <button type="button" className="button-secondary" onClick={() => setBulkOpen(false)} style={{ flex: 1, height: 44 }}>
                    {t.cancel}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}