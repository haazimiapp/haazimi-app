import { useState } from 'react';
import { PEOPLE_TO_VISIT as INITIAL } from '../data/mockData';
import { MapPin, CheckCircle } from 'lucide-react';

const T = {
  en: {
    title: 'People to Visit', sub: 'Track outreach visits and follow-ups',
    viewLabel: 'View:', table: 'Table', grouped: 'Grouped',
    groupBy: 'Group by:', statusGroup: 'Status', areaGroup: 'Area', relationGroup: 'Relation',
    colName: 'Name', colRelation: 'Relation', colStudent: 'Student/Contact',
    colArea: 'Area', colDue: 'Due Date', colLast: 'Last Visit',
    colStatus: 'Status', colAction: 'Action', logVisit: 'Log Visit',
    overdue: 'OVERDUE', due: 'DUE SOON', upcoming: 'UPCOMING',
    none: 'None', due2: 'Due:',
  },
  ar: {
    title: 'أشخاص للزيارة', sub: 'تتبع الزيارات الميدانية والمتابعة',
    viewLabel: 'عرض:', table: 'جدول', grouped: 'مجمّع',
    groupBy: 'تجميع حسب:', statusGroup: 'الحالة', areaGroup: 'المنطقة', relationGroup: 'العلاقة',
    colName: 'الاسم', colRelation: 'العلاقة', colStudent: 'الطالب/جهة الاتصال',
    colArea: 'المنطقة', colDue: 'تاريخ الاستحقاق', colLast: 'آخر زيارة',
    colStatus: 'الحالة', colAction: 'إجراء', logVisit: 'تسجيل الزيارة',
    overdue: 'متأخر', due: 'قريباً', upcoming: 'قادم',
    none: 'لا شيء', due2: 'الموعد:',
  },
  ur: {
    title: 'ملاقات کے لیے افراد', sub: 'میدانی دورے اور فالو اپ ٹریک کریں',
    viewLabel: 'دیکھیں:', table: 'جدول', grouped: 'گروپ شدہ',
    groupBy: 'گروپ بنائیں:', statusGroup: 'حالت', areaGroup: 'علاقہ', relationGroup: 'تعلق',
    colName: 'نام', colRelation: 'تعلق', colStudent: 'طالب علم/رابطہ',
    colArea: 'علاقہ', colDue: 'تاریخ واجب الادا', colLast: 'آخری ملاقات',
    colStatus: 'حالت', colAction: 'عمل', logVisit: 'ملاقات ریکارڈ کریں',
    overdue: 'دیر شدہ', due: 'جلد واجب الادا', upcoming: 'آنے والا',
    none: 'کوئی نہیں', due2: 'تاریخ:',
  },
  es: {
    title: 'Personas a Visitar', sub: 'Rastrea visitas de campo y seguimientos',
    viewLabel: 'Ver:', table: 'Tabla', grouped: 'Agrupado',
    groupBy: 'Agrupar por:', statusGroup: 'Estado', areaGroup: 'Área', relationGroup: 'Relación',
    colName: 'Nombre', colRelation: 'Relación', colStudent: 'Estudiante/Contacto',
    colArea: 'Área', colDue: 'Fecha Límite', colLast: 'Última Visita',
    colStatus: 'Estado', colAction: 'Acción', logVisit: 'Registrar Visita',
    overdue: 'ATRASADO', due: 'PRÓXIMAMENTE', upcoming: 'PRÓXIMO',
    none: 'Ninguno', due2: 'Fecha:',
  },
  pt: {
    title: 'Pessoas a Visitar', sub: 'Acompanhe visitas de campo e acompanhamentos',
    viewLabel: 'Ver:', table: 'Tabela', grouped: 'Agrupado',
    groupBy: 'Agrupar por:', statusGroup: 'Estado', areaGroup: 'Área', relationGroup: 'Relação',
    colName: 'Nome', colRelation: 'Relação', colStudent: 'Estudante/Contato',
    colArea: 'Área', colDue: 'Data Limite', colLast: 'Última Visita',
    colStatus: 'Estado', colAction: 'Ação', logVisit: 'Registar Visita',
    overdue: 'ATRASADO', due: 'EM BREVE', upcoming: 'PRÓXIMO',
    none: 'Nenhum', due2: 'Data:',
  },
};

export default function PeopleToVisit({ language }) {
  const t = T[language] || T.en;

  const [people, setPeople] = useState(INITIAL);
  const [view, setView] = useState('table');
  const [sort, setSort] = useState({ key: 'dueDate', dir: 'asc' });
  const [groupBy, setGroupBy] = useState('none');

  const handleSort = (key) => setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));

  const sorted = [...people].sort((a, b) => {
    const va = a[sort.key] || '';
    const vb = b[sort.key] || '';
    return sort.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const logVisit = (id) => setPeople(ps => ps.map(p => p.id === id ? { ...p, status: 'upcoming', lastVisit: new Date().toISOString().split('T')[0] } : p));

  const SortArrow = ({ k }) => {
    if (sort.key !== k) return <span className="sort-arrow" />;
    return <span className={`sort-arrow ${sort.dir}`} />;
  };

  const statusLabel = { overdue: t.overdue, due: t.due, upcoming: t.upcoming };
  const statusClass = { overdue: 'status-incomplete', due: 'status-in-progress', upcoming: 'status-completed' };

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
      </div>

      <div className="view-controls">
        <div className="toggle-buttons">
          <span>{t.viewLabel}</span>
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>{t.table}</button>
          <button className={view === 'group' ? 'active' : ''} onClick={() => setView('group')}>{t.grouped}</button>
        </div>
        {view === 'group' && (
          <div className="group-by-selector">
            <label>{t.groupBy}</label>
            <select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
              <option value="none">{t.statusGroup}</option>
              <option value="area">{t.areaGroup}</option>
              <option value="relation">{t.relationGroup}</option>
            </select>
          </div>
        )}
      </div>

      {view === 'table' ? (
        <div className="table-container">
          <table className="staff-table">
            <thead>
              <tr>
                <th className="sortable-header" onClick={() => handleSort('name')}>{t.colName} <SortArrow k="name" /></th>
                <th>{t.colRelation}</th>
                <th>{t.colStudent}</th>
                <th>{t.colArea}</th>
                <th className="sortable-header" onClick={() => handleSort('dueDate')}>{t.colDue} <SortArrow k="dueDate" /></th>
                <th>{t.colLast}</th>
                <th>{t.colStatus}</th>
                <th>{t.colAction}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(p => (
                <tr key={p.id} className={p.status === 'overdue' ? 'overdue' : ''}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.relation}</td>
                  <td>{p.student || '—'}</td>
                  <td><MapPin size={13} style={{ marginRight: 4 }} />{p.area}</td>
                  <td>{p.dueDate}</td>
                  <td>{p.lastVisit}</td>
                  <td><span className={`status-badge ${statusClass[p.status]}`}>{statusLabel[p.status]}</span></td>
                  <td>
                    <button className="button-log-visit" onClick={() => logVisit(p.id)}>
                      <CheckCircle size={13} style={{ marginRight: 4 }} />{t.logVisit}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grouped-view-container">
          {['overdue', 'due', 'upcoming'].map(status => {
            const items = people.filter(p => p.status === status);
            return (
              <div key={status} className="group-column">
                <div className="group-header" style={{ color: status === 'overdue' ? 'var(--danger-color)' : status === 'due' ? 'var(--warning-color)' : 'var(--success-color)' }}>
                  {statusLabel[status]} ({items.length})
                </div>
                <div className="group-items">
                  {items.map(p => (
                    <div key={p.id} className={`group-item-card ${p.status === 'overdue' ? 'overdue' : ''}`}>
                      <div className="card-row">
                        <strong className="card-row-value">{p.name}</strong>
                      </div>
                      <div className="card-row" style={{ marginTop: 6 }}>
                        <span className="card-row-label">{p.relation}</span>
                        <span className="card-row-label">{p.area}</span>
                      </div>
                      <div className="card-row" style={{ marginTop: 6 }}>
                        <span className="card-row-label">{t.due2} {p.dueDate}</span>
                        <button className="button-log-visit" onClick={() => logVisit(p.id)}>{t.logVisit}</button>
                      </div>
                      {p.notes && <div style={{ marginTop: 8, fontSize: '0.82rem', color: 'var(--subtle-text-color)', fontStyle: 'italic' }}>{p.notes}</div>}
                    </div>
                  ))}
                  {items.length === 0 && <div style={{ color: 'var(--subtle-text-color)', fontSize: '0.9rem', padding: 8 }}>{t.none}</div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
