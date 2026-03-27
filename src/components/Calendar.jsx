import { useState } from 'react';
import { ChevronLeft, ChevronRight, Filter, Plus, Minus, CalendarCheck } from 'lucide-react';
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
  },
  ar: {
    title: 'التقويم', sub: 'الجدول الأكاديمي والأحداث',
    filter: 'تصفية', allEvents: 'جميع الأحداث',
    thisMonth: 'هذا الشهر', upcomingEvents: 'الأحداث القادمة',
    noEvents: 'لا توجد أحداث قادمة', backToday: 'العودة إلى اليوم',
    satClass: 'السبت كأيام دراسية', syncHijri: 'مزامنة التقويم الهجري',
    holiday: 'إجازة', event: 'حدث', exam: 'امتحان',
    muzaakarah: 'مذاكرة', jalsah: 'جلسة', other: 'أخرى',
  },
  ur: {
    title: 'کیلنڈر', sub: 'تعلیمی شیڈول اور تقریبات',
    filter: 'فلٹر', allEvents: 'تمام تقریبات',
    thisMonth: 'اس مہینے', upcomingEvents: 'آنے والی تقریبات',
    noEvents: 'کوئی آنے والی تقریبات نہیں', backToday: 'آج پر واپس جائیں',
    satClass: 'ہفتہ کو کلاس دن کے طور پر', syncHijri: 'ہجری کیلنڈر ہم آہنگ کریں',
    holiday: 'چھٹی', event: 'تقریب', exam: 'امتحان',
    muzaakarah: 'مذاکرہ', jalsah: 'جلسہ', other: 'دیگر',
  },
  es: {
    title: 'Calendario', sub: 'Horario académico y eventos',
    filter: 'Filtrar', allEvents: 'Todos los Eventos',
    thisMonth: 'Este Mes', upcomingEvents: 'Próximos Eventos',
    noEvents: 'No hay eventos próximos', backToday: 'Volver a Hoy',
    satClass: 'Sábados como Días de Clase', syncHijri: 'Sincronizar Calendario Hijri',
    holiday: 'Feriado', event: 'Evento', exam: 'Examen',
    muzaakarah: 'Muzaakarah', jalsah: 'Jalsah', other: 'Otro',
  },
  pt: {
    title: 'Calendário', sub: 'Calendário acadêmico e eventos',
    filter: 'Filtrar', allEvents: 'Todos os Eventos',
    thisMonth: 'Este Mês', upcomingEvents: 'Próximos Eventos',
    noEvents: 'Nenhum evento próximo', backToday: 'Voltar para Hoje',
    satClass: 'Sábados como Dias de Aula', syncHijri: 'Sincronizar Calendário Hijri',
    holiday: 'Feriado', event: 'Evento', exam: 'Exame',
    muzaakarah: 'Muzaakarah', jalsah: 'Jalsah', other: 'Outro',
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

  const isAdmin = user?.role === 'manager';
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [filter, setFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [showSat, setShowSat] = useState(false);
  const [hijriOffset, setHijriOffset] = useState(0);

  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();
  const goToToday = () => { setMonth(today.getMonth()); setYear(today.getFullYear()); };
  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const prevDays = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);

  const getEventForDate = (d) => {
    const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const ev = EVENTS.find(e => e.date === key);
    if (!ev) return null;
    if (filter !== 'all' && ev.type !== filter) return null;
    return ev;
  };

  const upcomingEvents = EVENTS
    .filter(e => e.date >= today.toISOString().split('T')[0])
    .filter(e => filter === 'all' || e.type === filter)
    .slice(0, 6);

  const eventCounts = {};
  EVENTS.forEach(e => { eventCounts[e.type] = (eventCounts[e.type] || 0) + 1; });

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: prevDays - i, current: false, gMonth: month === 0 ? 12 : month, gYear: month === 0 ? year - 1 : year });
  for (let d = 1; d <= daysInMonth; d++)
    cells.push({ day: d, current: true, gMonth: month + 1, gYear: year });
  let nextD = 1;
  while (cells.length % 7 !== 0)
    cells.push({ day: nextD++, current: false, gMonth: month === 11 ? 1 : month + 2, gYear: month === 11 ? year + 1 : year });

  const hijriHeader = getHijriHeader(year, month, hijriOffset, HIJRI_MONTHS);

  const handleDayEnter = (ev, e) => {
    if (!ev) return;
    const x = Math.min(e.clientX + 14, window.innerWidth - 230);
    const y = Math.min(e.clientY + 14, window.innerHeight - 70);
    setTooltip({ text: ev.name + (ev.desc ? ` — ${ev.desc}` : ''), x, y });
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
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
              const ev = cell.current ? getEventForDate(cell.day) : null;
              const isSat = i % 7 === 6;
              const isToday = cell.current && cell.day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              const hDate = gregorianToHijri(cell.gYear, cell.gMonth, cell.day, hijriOffset);
              const satClass = (showSat && isSat && cell.current) ? 'class-day' : '';
              return (
                <div
                  key={i}
                  className={`day-cell ${!cell.current ? 'other-month' : ''} ${isToday ? 'today' : ''} ${ev ? ev.type : ''} ${satClass}`}
                  onMouseEnter={ev ? (e) => handleDayEnter(ev, e) : undefined}
                  onMouseLeave={() => setTooltip(null)}
                >
                  <span className="day-greg">{cell.day}</span>
                  {ev && <span className="event-dot" />}
                  <span className="day-hijri">{hDate.day}</span>
                </div>
              );
            })}
          </div>
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
            {isAdmin && (
              <div className="saturday-toggle">
                <span>{t.satClass}</span>
                <input type="checkbox" checked={showSat} onChange={e => setShowSat(e.target.checked)} style={{ accentColor: 'var(--accent-color)' }} />
              </div>
            )}
            {isAdmin && (
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
                <li key={i} className={ev.type}>
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
