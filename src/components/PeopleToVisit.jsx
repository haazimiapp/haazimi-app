import { useState } from 'react';
import { PEOPLE_TO_VISIT as INITIAL } from '../data/mockData';
import { MapPin, CheckCircle, Plus, X, Search, Phone } from 'lucide-react';
import useStudents from '../hooks/useStudents';

const T = {
  en: {
    title: 'Mulaaqaats', sub: 'Track outreach visits and follow-ups',
    viewLabel: 'View:', table: 'Table', grouped: 'Grouped',
    groupBy: 'Group by:', statusGroup: 'Status', areaGroup: 'Area', relationGroup: 'Relation',
    colName: 'Name', colRelation: 'Relation', colStudent: 'Student/Contact',
    colArea: 'Area', colDue: 'Due Date', colLast: 'Last Visit',
    colStatus: 'Status', colAction: 'Action', logVisit: 'Log Visit',
    overdue: 'OVERDUE', due: 'DUE SOON', upcoming: 'UPCOMING',
    none: 'None', due2: 'Due:', addNew: 'Add Mulaaqaat', cancel: 'Cancel', save: 'Add',
  },
  ar: {
    title: 'الزيارات', sub: 'تتبع الزيارات الميدانية والمتابعة',
    viewLabel: 'عرض:', table: 'جدول', grouped: 'مجمّع',
    groupBy: 'تجميع حسب:', statusGroup: 'الحالة', areaGroup: 'المنطقة', relationGroup: 'العلاقة',
    colName: 'الاسم', colRelation: 'العلاقة', colStudent: 'الطالب/جهة الاتصال',
    colArea: 'المنطقة', colDue: 'تاريخ الاستحقاق', colLast: 'آخر زيارة',
    colStatus: 'الحالة', colAction: 'إجراء', logVisit: 'تسجيل الزيارة',
    overdue: 'متأخر', due: 'قريباً', upcoming: 'قادم',
    none: 'لا شيء', due2: 'الموعد:', addNew: 'إضافة ملاقاة', cancel: 'إلغاء', save: 'إضافة',
  },
  ur: {
    title: 'ملاقاتیں', sub: 'میدانی دورے اور فالو اپ ٹریک کریں',
    viewLabel: 'دیکھیں:', table: 'جدول', grouped: 'گروپ شدہ',
    groupBy: 'گروپ بنائیں:', statusGroup: 'حالت', areaGroup: 'علاقہ', relationGroup: 'تعلق',
    colName: 'نام', colRelation: 'تعلق', colStudent: 'طالب علم/رابطہ',
    colArea: 'علاقہ', colDue: 'تاریخ واجب الادا', colLast: 'آخری ملاقات',
    colStatus: 'حالت', colAction: 'عمل', logVisit: 'ملاقات ریکارڈ کریں',
    overdue: 'دیر شدہ', due: 'جلد واجب الادا', upcoming: 'آنے والا',
    none: 'کوئی نہیں', due2: 'تاریخ:', addNew: 'ملاقات شامل کریں', cancel: 'منسوخ', save: 'شامل کریں',
  },
  es: {
    title: 'Personas a Visitar', sub: 'Rastrea visitas de campo y seguimientos',
    viewLabel: 'Ver:', table: 'Tabla', grouped: 'Agrupado',
    groupBy: 'Agrupar por:', statusGroup: 'Estado', areaGroup: 'Área', relationGroup: 'Relación',
    colName: 'Nombre', colRelation: 'Relación', colStudent: 'Estudiante/Contacto',
    colArea: 'Área', colDue: 'Fecha Límite', colLast: 'Última Visita',
    colStatus: 'Estado', colAction: 'Acción', logVisit: 'Registrar Visita',
    overdue: 'ATRASADO', due: 'PRÓXIMAMENTE', upcoming: 'PRÓXIMO',
    none: 'Ninguno', due2: 'Fecha:', addNew: 'Agregar Mulaaqaat', cancel: 'Cancelar', save: 'Agregar',
  },
  pt: {
    title: 'Pessoas a Visitar', sub: 'Acompanhe visitas de campo e acompanhamentos',
    viewLabel: 'Ver:', table: 'Tabela', grouped: 'Agrupado',
    groupBy: 'Agrupar por:', statusGroup: 'Estado', areaGroup: 'Área', relationGroup: 'Relação',
    colName: 'Nome', colRelation: 'Relação', colStudent: 'Estudante/Contato',
    colArea: 'Área', colDue: 'Data Limite', colLast: 'Última Visita',
    colStatus: 'Estado', colAction: 'Ação', logVisit: 'Registar Visita',
    overdue: 'ATRASADO', due: 'EM BREVE', upcoming: 'PRÓXIMO',
    none: 'Nenhum', due2: 'Data:', addNew: 'Adicionar Mulaaqaat', cancel: 'Cancelar', save: 'Adicionar',
  },
};

const BLANK_FORM = { name: '', relation: 'Wali (Guardian)', area: '', dueDate: '', notes: '', studentId: '' };
const RELATIONS = ['Wali (Guardian)', 'Donor', 'Community Leader', 'Ex-Student', 'Prospective Student', 'Other'];

export default function PeopleToVisit({ user, language }) {
  const t = T[language] || T.en;
  const { myStudents } = useStudents(user);

  const [people, setPeople] = useState(INITIAL);
  const [view, setView] = useState('group');
  const [sort, setSort] = useState({ key: 'dueDate', dir: 'asc' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(BLANK_FORM);
  const [studentSearch, setStudentSearch] = useState('');
  const [showStudentPicker, setShowStudentPicker] = useState(false);

  const handleSort = (key) => setSort(s => ({ key, dir: s.key === key && s.dir === 'asc' ? 'desc' : 'asc' }));

  const sorted = [...people].sort((a, b) => {
    const va = a[sort.key] || '';
    const vb = b[sort.key] || '';
    return sort.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const logVisit = (id) => setPeople(ps => ps.map(p => p.id === id ? { ...p, status: 'upcoming', lastVisit: new Date().toISOString().split('T')[0] } : p));

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  const filteredStudents = myStudents.filter(s => {
    const q = studentSearch.toLowerCase();
    return !q || s.name?.toLowerCase().includes(q) || s.className?.toLowerCase().includes(q);
  });

  const selectStudent = (s) => {
    f('name', s.name);
    f('studentId', s.id);
    f('relation', 'Wali (Guardian)');
    setShowStudentPicker(false);
    setStudentSearch('');
  };

  const clearStudent = () => { f('studentId', ''); f('name', ''); };

  const handleAdd = () => {
    if (!form.name.trim()) return;
    const linked = myStudents.find(s => s.id === form.studentId);
    const newPerson = {
      id: Date.now(), name: form.name.trim(), relation: form.relation,
      student: linked?.name || null, area: form.area.trim(),
      dueDate: form.dueDate || new Date().toISOString().split('T')[0],
      lastVisit: '—', status: 'upcoming', notes: form.notes.trim(),
      studentId: form.studentId || null,
      studentPhone: linked?.phone || null,
      parentPhone: linked?.parentPhone || null,
    };
    setPeople(prev => [...prev, newPerson]);
    setForm(BLANK_FORM);
    setShowAddForm(false);
  };

  const SortArrow = ({ k }) => {
    if (sort.key !== k) return <span className="sort-arrow" />;
    return <span className={`sort-arrow ${sort.dir}`} />;
  };

  const statusLabel = { overdue: t.overdue, due: t.due, upcoming: t.upcoming };
  const statusClass = { overdue: 'status-incomplete', due: 'status-in-progress', upcoming: 'status-completed' };

  const inp = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.85rem', boxSizing: 'border-box' };

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
        <button className="button-primary icon-button" onClick={() => setShowAddForm(s => !s)}>
          <Plus size={16} /> {t.addNew}
        </button>
      </div>

      {showAddForm && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 16px' }}>New Mulaaqaat Entry</h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '0.78rem' }}>Person Name *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input style={inp} value={form.name} onChange={e => { f('name', e.target.value); if (form.studentId) clearStudent(); }} placeholder="Full name" />
                </div>
                {myStudents.length > 0 && (
                  <button type="button" onClick={() => setShowStudentPicker(s => !s)}
                    style={{ flexShrink: 0, padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border-color)', background: 'var(--hover-bg)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    <Search size={14} /> Pick Student
                  </button>
                )}
              </div>
              {form.studentId && (
                <div style={{ marginTop: 4, fontSize: '0.75rem', color: '#6366f1', display: 'flex', alignItems: 'center', gap: 6 }}>
                  ✓ Linked to student: {form.name}
                  <button type="button" onClick={clearStudent} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: 0 }}><X size={12} /></button>
                </div>
              )}
            </div>

            {showStudentPicker && myStudents.length > 0 && (
              <div style={{ gridColumn: '1 / -1', background: 'var(--hover-bg)', border: '1px solid var(--border-color)', borderRadius: 10, padding: 12 }}>
                <div style={{ position: 'relative', marginBottom: 8 }}>
                  <Search size={13} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                  <input style={{ ...inp, paddingLeft: 28, background: 'var(--card-bg)' }}
                    placeholder="Search students…" value={studentSearch} onChange={e => setStudentSearch(e.target.value)} autoFocus />
                </div>
                <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {filteredStudents.slice(0, 20).map(s => (
                    <button key={s.id} type="button" onClick={() => selectStudent(s)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', borderRadius: 8, border: 'none', background: 'var(--card-bg)', cursor: 'pointer', textAlign: 'left', gap: 8 }}>
                      <span>
                        <strong style={{ fontSize: '0.85rem' }}>{s.name}</strong>
                        {s.className && <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: 8 }}>{s.className}</span>}
                      </span>
                      {s.parentPhone && (
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 3 }}>
                          <Phone size={11} /> {s.parentPhone}
                        </span>
                      )}
                    </button>
                  ))}
                  {filteredStudents.length === 0 && <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', padding: 8 }}>No students found.</p>}
                </div>
              </div>
            )}

            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.78rem' }}>Relation</label>
              <select style={inp} value={form.relation} onChange={e => f('relation', e.target.value)}>
                {RELATIONS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.78rem' }}>Area / Location</label>
              <input style={inp} value={form.area} onChange={e => f('area', e.target.value)} placeholder="e.g. Gulshan, DHA" />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.78rem' }}>Due Date</label>
              <input style={inp} type="date" value={form.dueDate} onChange={e => f('dueDate', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.78rem' }}>Notes</label>
              <input style={inp} value={form.notes} onChange={e => f('notes', e.target.value)} placeholder="Optional notes" />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
            <button className="button-secondary" onClick={() => { setShowAddForm(false); setForm(BLANK_FORM); }}><X size={14} /> {t.cancel}</button>
            <button className="button-primary" onClick={handleAdd} disabled={!form.name.trim()}><Plus size={14} /> {t.save}</button>
          </div>
        </div>
      )}

      <div className="view-controls">
        <div className="toggle-buttons">
          <span>{t.viewLabel}</span>
          <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>{t.table}</button>
          <button className={view === 'group' ? 'active' : ''} onClick={() => setView('group')}>{t.grouped}</button>
        </div>
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
                  <td>
                    <strong>{p.name}</strong>
                    {p.parentPhone && (
                      <div>
                        <a href={`tel:${p.parentPhone}`} style={{ fontSize: '0.72rem', color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, marginTop: 2 }}>
                          <Phone size={11} /> {p.parentPhone}
                        </a>
                      </div>
                    )}
                  </td>
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
        <div className="grouped-view-container" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {['overdue', 'due', 'upcoming'].map(status => {
            const items = people.filter(p => p.status === status);
            return (
              <div key={status} className="group-column" style={{ width: '100%' }}>
                <div className="group-header" style={{ color: status === 'overdue' ? 'var(--danger-color)' : status === 'due' ? 'var(--warning-color)' : 'var(--success-color)' }}>
                  {statusLabel[status]} ({items.length})
                </div>
                <div className="group-items" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
                  {items.map(p => (
                    <div key={p.id} className={`group-item-card ${p.status === 'overdue' ? 'overdue' : ''}`}>
                      <div className="card-row">
                        <strong className="card-row-value">{p.name}</strong>
                      </div>
                      {p.student && <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>Student: {p.student}</div>}
                      {p.parentPhone && (
                        <a href={`tel:${p.parentPhone}`} style={{ fontSize: '0.78rem', color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                          <Phone size={12} /> {p.parentPhone}
                        </a>
                      )}
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
