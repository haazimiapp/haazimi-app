import { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus, Minus, CalendarCheck, PlusCircle, X, Bell, Pencil, Trash2 } from 'lucide-react';
import { EVENTS } from '../data/mockData';

const MONTHS_BY_LANG = {
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'],
  ur: ['جنوری','فروری','مارچ','اپریل','مئی','جون','جولائی','اگست','ستمبر','اکتوبر','نومبر','دسمبر'],
  es: ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
  pt: ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'],
};

const DAYS_BY_LANG = {
  en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  ar: ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
  ur: ['اتوار','پیر','منگل','بدھ','جمعرات','جمعہ','ہفتہ'],
  es: ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'],
  pt: ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'],
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
function getFirstDayOfMonth(year, month) { return new Date(year, month, 1).getDay(); }

const EVENT_TYPES = ['holiday', 'event', 'exam', 'monthly-muzaakarah', 'jalsah', 'other'];

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  const date = new Date(Number(y), Number(m) - 1, Number(d));
  return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Calendar({ user, language }) {
  const t = T[language] || T.en;
  const MONTHS = MONTHS_BY_LANG[language] || MONTHS_BY_LANG.en;
  const DAYS = DAYS_BY_LANG[language] || DAYS_BY_LANG.en;
  const HIJRI_MONTHS = HIJRI_MONTHS_BY_LANG[language] || HIJRI_MONTHS_BY_LANG.en;
  const isRTL = language === 'ar' || language === 'ur';

  const EVENT_LABELS = {
    holiday: t.holiday, event: t.event, exam: t.exam,
    'monthly-muzaakarah': t.muzaakarah, jalsah: t.jalsah, other: t.other,
  };

  const isManager = ['Centre Manager', 'Country Admin', 'Super Admin'].includes(user?.role);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [filter, setFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [showSat, setShowSat] = useState(false);
  const [hijriOffset, setHijriOffset] = useState(0);
  const [customEvents, setCustomEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem('haazimi_calendar_events') || '[]'); } catch { return []; }
  });

  // Selected day panel
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayAddForm, setShowDayAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ date: '', name: '', type: 'event', desc: '', notify: false });
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});

  const allEvents = [...EVENTS, ...customEvents];

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
    return allEvents.filter(e => e.date === key && (filter === 'all' || e.type === filter));
  };

  const eventsOnSelected = selectedDate
    ? allEvents.filter(e => e.date === selectedDate && (filter === 'all' || e.type === filter))
    : [];

  const upcomingEvents = allEvents
    .filter(e => e.date >= today.toISOString().split('T')[0])
    .filter(e => filter === 'all' || e.type === filter)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 6);

  const eventCounts = {};
  allEvents.forEach(e => { eventCounts[e.type] = (eventCounts[e.type] || 0) + 1; });

  const handleDayClick = (cell) => {
    if (!cell.current) return;
    const key = `${cell.gYear}-${String(cell.gMonth).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
    if (selectedDate === key) {
      setSelectedDate(null);
      setShowDayAddForm(false);
      setEditingEvent(null);
    } else {
      setSelectedDate(key);
      setShowDayAddForm(false);
      setEditingEvent(null);
      setNewEvent({ date: key, name: '', type: 'event', desc: '', notify: false });
    }
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.date || !newEvent.name) return;
    const ev = { ...newEvent, id: Date.now(), addedBy: user?.name || 'Admin', addedAt: new Date().toLocaleDateString(), custom: true };
    const updated = [...customEvents, ev];
    setCustomEvents(updated);
    localStorage.setItem('haazimi_calendar_events', JSON.stringify(updated));
    if (ev.notify) {
      const notifs = JSON.parse(localStorage.getItem('haazimi_notifications') || '[]');
      notifs.push({ id: Date.now(), text: `New event: ${ev.name} on ${ev.date}`, date: new Date().toISOString(), read: false });
      localStorage.setItem('haazimi_notifications', JSON.stringify(notifs));
    }
    setNewEvent({ date: selectedDate || '', name: '', type: 'event', desc: '', notify: false });
    setShowDayAddForm(false);
  };

  const handleDeleteEvent = (id) => {
    const updated = customEvents.filter(e => e.id !== id);
    setCustomEvents(updated);
    localStorage.setItem('haazimi_calendar_events', JSON.stringify(updated));
  };

  const startEdit = (ev) => {
    setEditingEvent(ev.id);
    setEditForm({ date: ev.date, name: ev.name, type: ev.type, desc: ev.desc || '' });
    setShowDayAddForm(false);
  };

  const saveEdit = () => {
    if (!editForm.date || !editForm.name) return;
    const updated = customEvents.map(ev =>
      ev.id === editingEvent ? { ...ev, ...editForm, editedAt: new Date().toLocaleDateString() } : ev
    );
    setCustomEvents(updated);
    localStorage.setItem('haazimi_calendar_events', JSON.stringify(updated));
    setEditingEvent(null);
    setEditForm({});
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

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <button className="button-primary icon-button" onClick={() => setFilterOpen(o => !o)}>
              <Filter size={16} /> {t.filter}
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

          {/* Day Detail Panel — appears below the grid on mobile & desktop */}
          {selectedDate && (
            <div style={{
              marginTop: 16, border: '1px solid var(--border-color)', borderRadius: 12,
              background: 'var(--card-bg)', boxShadow: '0 4px 16px var(--shadow-color)', overflow: 'hidden',
            }}>
              {/* Panel header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', borderBottom: '1px solid var(--border-color)',
                background: 'var(--hover-bg)',
              }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {formatDateLabel(selectedDate)}
                </span>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {isManager && !showDayAddForm && !editingEvent && (
                    <button
                      onClick={() => { setShowDayAddForm(true); setNewEvent({ date: selectedDate, name: '', type: 'event', desc: '', notify: false }); }}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.8rem', padding: '5px 12px', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}
                      className="pl-[10px] pr-[10px] bg-[#3498db] text-left text-[12px]">
                      <Plus size={14} /> {t.addEvent}
                    </button>
                  )}
                  <button onClick={() => { setSelectedDate(null); setShowDayAddForm(false); setEditingEvent(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4 }}>
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Add form */}
              {isManager && showDayAddForm && (
                <form onSubmit={handleAddEvent} style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                    <label htmlFor="notifyChk" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: 'var(--text-secondary)' }}><Bell size={13} /> {t.notify}</label>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit" style={{ fontSize: '0.82rem', padding: '7px 18px', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>{t.addEvent}</button>
                    <button type="button" onClick={() => setShowDayAddForm(false)} style={{ fontSize: '0.82rem', padding: '7px 14px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, cursor: 'pointer' }}>{t.cancel}</button>
                  </div>
                </form>
              )}

              {/* Edit form */}
              {isManager && editingEvent && (
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: 10 }}>
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
                    <button onClick={() => setEditingEvent(null)} style={{ fontSize: '0.82rem', padding: '7px 14px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, cursor: 'pointer' }}>{t.cancel}</button>
                  </div>
                </div>
              )}

              {/* Events list for selected day */}
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {eventsOnSelected.length === 0 ? (
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{t.noEventsDay}</p>
                ) : eventsOnSelected.map((ev, idx) => (
                  <div key={ev.id || idx} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '10px 12px', borderRadius: 8,
                    background: 'var(--hover-bg)', border: `1px solid ${TYPE_COLORS[ev.type] || '#ccc'}22`,
                    borderLeft: `4px solid ${TYPE_COLORS[ev.type] || '#ccc'}`,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                          background: `${TYPE_COLORS[ev.type]}22`, color: TYPE_COLORS[ev.type],
                          textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0,
                        }}>
                          {EVENT_LABELS[ev.type] || ev.type}
                        </span>
                        {ev.custom && <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>by {ev.addedBy}</span>}
                      </div>
                      <p style={{ margin: '4px 0 0', fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{ev.name}</p>
                      {ev.desc && <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ev.desc}</p>}
                    </div>
                    {isManager && ev.custom && editingEvent !== ev.id && (
                      <div style={{ display: 'flex', gap: 6, flexShrink: 0, marginTop: 2 }}>
                        <button onClick={() => startEdit(ev)} title={t.editEvent} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 6, cursor: 'pointer', padding: '5px 8px', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => { if (window.confirm(`Delete "${ev.name}"?`)) handleDeleteEvent(ev.id); }} title={t.deleteEvent} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer', padding: '5px 8px', display: 'flex', alignItems: 'center', color: '#dc2626' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
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
            {isManager && (
              <div className="saturday-toggle">
                <span>{t.satClass}</span>
                <input type="checkbox" checked={showSat} onChange={e => setShowSat(e.target.checked)} style={{ accentColor: 'var(--accent-color)' }} />
              </div>
            )}
            {isManager && (
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
              {upcomingEvents.length ? upcomingEvents.map((ev, i) => (
                <li key={i} className={ev.type} style={{ cursor: 'pointer' }} onClick={() => {
                  setSelectedDate(ev.date);
                  setShowDayAddForm(false);
                  setEditingEvent(null);
                  setNewEvent({ date: ev.date, name: '', type: 'event', desc: '', notify: false });
                }}>
                  <span className="event-date">{parseInt(ev.date.split('-')[2])}</span>
                  <div className="event-details">
                    <strong>{ev.name}</strong>
                    <p>{ev.desc}</p>
                  </div>
                </li>
              )) : (
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
    </div>
  );
}
