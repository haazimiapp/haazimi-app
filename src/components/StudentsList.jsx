import { useState } from 'react';
import { Phone, MapPin, Plus, Pencil, Trash2, X, Save, RefreshCw, Users, Search } from 'lucide-react';
import useStudents from '../hooks/useStudents';

const T = {
  en: {
    title: 'Students', sub: 'Contact directory — tap phone numbers to call, addresses to open maps',
    addStudent: 'Add Student', newStudent: 'New Student',
    searchPlaceholder: 'Search students…', allClasses: 'All Classes',
    noStudents: 'No students found. Add your first student above.',
    studentName: 'Student Name *', classLabel: 'Class', studentPhone: 'Student Phone',
    parentGuardian: 'Parent / Guardian', parentGuardianName: 'Parent / Guardian Name',
    parentPhone: 'Parent Phone', homeAddress: 'Home Address',
    cancel: 'Cancel', save: 'Save', studentCount: (n) => `${n} student${n !== 1 ? 's' : ''}`,
    syncing: '⟳ Syncing…', synced: '✓ Synced', syncFailed: '⚠ Sync failed',
    refresh: 'Refresh from Google Sheets',
    statusLabels: { 'On Track': 'On Track', 'Needs Attention': 'Needs Attention', 'At Risk': 'At Risk', 'Excellent': 'Excellent' },
  },
  ar: {
    title: 'الطلاب', sub: 'دليل الاتصال — اضغط على الأرقام للاتصال',
    addStudent: 'إضافة طالب', newStudent: 'طالب جديد',
    searchPlaceholder: 'بحث عن طالب…', allClasses: 'جميع الفصول',
    noStudents: 'لا يوجد طلاب. أضف أول طالب أعلاه.',
    studentName: 'اسم الطالب *', classLabel: 'الفصل', studentPhone: 'هاتف الطالب',
    parentGuardian: 'ولي الأمر', parentGuardianName: 'اسم ولي الأمر',
    parentPhone: 'هاتف ولي الأمر', homeAddress: 'العنوان',
    cancel: 'إلغاء', save: 'حفظ', studentCount: (n) => `${n} طالب`,
    syncing: '⟳ مزامنة…', synced: '✓ تمت المزامنة', syncFailed: '⚠ فشل',
    refresh: 'تحديث',
    statusLabels: { 'On Track': 'على المسار', 'Needs Attention': 'يحتاج اهتمام', 'At Risk': 'في خطر', 'Excellent': 'ممتاز' },
  },
  ur: {
    title: 'طلبہ', sub: 'رابطہ ڈائریکٹری — فون نمبر پر کلک کریں',
    addStudent: 'طالب شامل کریں', newStudent: 'نیا طالب',
    searchPlaceholder: 'طلبہ تلاش کریں…', allClasses: 'تمام کلاسیں',
    noStudents: 'کوئی طالب نہیں ملا۔ اوپر پہلا طالب شامل کریں۔',
    studentName: 'طالب کا نام *', classLabel: 'کلاس', studentPhone: 'طالب کا فون',
    parentGuardian: 'والدین / سرپرست', parentGuardianName: 'والدین کا نام',
    parentPhone: 'والدین کا فون', homeAddress: 'گھر کا پتہ',
    cancel: 'منسوخ', save: 'محفوظ کریں', studentCount: (n) => `${n} طالب`,
    syncing: '⟳ ہم آہنگی…', synced: '✓ ہم آہنگ', syncFailed: '⚠ ناکام',
    refresh: 'تازہ کاری',
    statusLabels: { 'On Track': 'ٹھیک ہے', 'Needs Attention': 'توجہ درکار', 'At Risk': 'خطرے میں', 'Excellent': 'بہترین' },
  },
  es: {
    title: 'Estudiantes', sub: 'Directorio de contactos — toca números para llamar',
    addStudent: 'Agregar Estudiante', newStudent: 'Nuevo Estudiante',
    searchPlaceholder: 'Buscar estudiantes…', allClasses: 'Todas las Clases',
    noStudents: 'No se encontraron estudiantes. Agrega el primero arriba.',
    studentName: 'Nombre del Estudiante *', classLabel: 'Clase', studentPhone: 'Teléfono del Estudiante',
    parentGuardian: 'Padre / Tutor', parentGuardianName: 'Nombre del Padre / Tutor',
    parentPhone: 'Teléfono del Padre', homeAddress: 'Dirección de Casa',
    cancel: 'Cancelar', save: 'Guardar', studentCount: (n) => `${n} estudiante${n !== 1 ? 's' : ''}`,
    syncing: '⟳ Sincronizando…', synced: '✓ Sincronizado', syncFailed: '⚠ Fallo',
    refresh: 'Actualizar',
    statusLabels: { 'On Track': 'En Curso', 'Needs Attention': 'Necesita Atención', 'At Risk': 'En Riesgo', 'Excellent': 'Excelente' },
  },
  pt: {
    title: 'Alunos', sub: 'Diretório de contatos — toque nos números para ligar',
    addStudent: 'Adicionar Aluno', newStudent: 'Novo Aluno',
    searchPlaceholder: 'Pesquisar alunos…', allClasses: 'Todas as Turmas',
    noStudents: 'Nenhum aluno encontrado. Adicione o primeiro acima.',
    studentName: 'Nome do Aluno *', classLabel: 'Turma', studentPhone: 'Telefone do Aluno',
    parentGuardian: 'Pai / Responsável', parentGuardianName: 'Nome do Pai / Responsável',
    parentPhone: 'Telefone do Pai', homeAddress: 'Endereço Residencial',
    cancel: 'Cancelar', save: 'Salvar', studentCount: (n) => `${n} aluno${n !== 1 ? 's' : ''}`,
    syncing: '⟳ Sincronizando…', synced: '✓ Sincronizado', syncFailed: '⚠ Falhou',
    refresh: 'Atualizar',
    statusLabels: { 'On Track': 'Em Curso', 'Needs Attention': 'Precisa de Atenção', 'At Risk': 'Em Risco', 'Excellent': 'Excelente' },
  },
};

const STATUS_COLOR = {
  'On Track': '#22c55e',
  'Excellent': '#6366f1',
  'Needs Attention': '#f59e0b',
  'At Risk': '#ef4444',
};

const inp = {
  width: '100%', padding: '8px 12px', borderRadius: 8,
  border: '1px solid var(--border-color)', background: 'var(--input-bg)',
  color: 'var(--text-primary)', fontSize: '0.85rem', boxSizing: 'border-box',
};

function AddFields({ vals, onSet, classOptions, idSuffix = '', t }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
        <label style={{ fontSize: '0.78rem' }}>{t.studentName}</label>
        <input style={inp} value={vals.name || ''} onChange={e => onSet('name', e.target.value)} placeholder="Full name" />
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontSize: '0.78rem' }}>{t.classLabel}</label>
        <input style={inp} value={vals.className || ''} onChange={e => onSet('className', e.target.value)} placeholder="e.g. Hifz Class A" list={`class-opts${idSuffix}`} />
        <datalist id={`class-opts${idSuffix}`}>{classOptions.map(c => <option key={c} value={c} />)}</datalist>
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontSize: '0.78rem' }}>{t.studentPhone}</label>
        <input style={inp} type="tel" value={vals.phone || ''} onChange={e => onSet('phone', e.target.value)} placeholder="+27 82 000 0000" />
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontSize: '0.78rem' }}>{t.parentGuardianName}</label>
        <input style={inp} value={vals.parentName || ''} onChange={e => onSet('parentName', e.target.value)} placeholder="Parent full name" />
      </div>
      <div className="form-group" style={{ margin: 0 }}>
        <label style={{ fontSize: '0.78rem' }}>{t.parentPhone}</label>
        <input style={inp} type="tel" value={vals.parentPhone || ''} onChange={e => onSet('parentPhone', e.target.value)} placeholder="+27 83 000 0000" />
      </div>
      <div className="form-group" style={{ margin: 0, gridColumn: '1 / -1' }}>
        <label style={{ fontSize: '0.78rem' }}>{t.homeAddress}</label>
        <input style={inp} value={vals.address || ''} onChange={e => onSet('address', e.target.value)} placeholder="Street, suburb, city" />
      </div>
    </div>
  );
}

const BLANK = { name: '', phone: '', parentName: '', parentPhone: '', address: '', className: '' };

export default function StudentsList({ user, language }) {
  const t = T[language] || T.en;
  const { myStudents, loading, syncStatus, fetchStudents, addStudent, updateStudent, deleteStudent } = useStudents(user);

  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(BLANK);
  const [editDraft, setEditDraft] = useState({});

  const classOptions = [...new Set(myStudents.map(s => s.className).filter(Boolean))];
  const classes = ['all', ...classOptions];

  const filtered = myStudents.filter(s => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name?.toLowerCase().includes(q) || s.parentName?.toLowerCase().includes(q) || s.address?.toLowerCase().includes(q);
    const matchClass = filterClass === 'all' || s.className === filterClass;
    return matchSearch && matchClass;
  });

  const handleAdd = async () => {
    if (!draft.name.trim()) return;
    await addStudent({ ...draft, attendance: 90, status: 'On Track', intentions: 0, quranJuz: '', surahs: '', duas: '', muzaakarahs: '', other: '', notes: '' });
    setDraft(BLANK);
    setShowAddForm(false);
  };

  const startEdit = (s) => { setEditingId(s.id); setEditDraft({ ...s }); };
  const cancelEdit = () => { setEditingId(null); setEditDraft({}); };
  const saveEdit = async () => { await updateStudent(editingId, editDraft); cancelEdit(); };
  const handleDelete = async (id, name) => {
    if (window.confirm(`Remove ${name} from the student list?`)) await deleteStudent(id);
  };

  const d = (k, v) => setDraft(f => ({ ...f, [k]: v }));
  const ed = (k, v) => setEditDraft(f => ({ ...f, [k]: v }));
  const mapsUrl = (addr) => `https://maps.google.com/?q=${encodeURIComponent(addr)}`;

  const syncLabel = syncStatus === 'syncing' ? t.syncing
    : syncStatus === 'done' ? t.synced
    : syncStatus === 'fail' ? t.syncFailed : '';

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {syncLabel && <span style={{ fontSize: '0.78rem', color: syncStatus === 'fail' ? '#ef4444' : 'var(--text-secondary)' }}>{syncLabel}</span>}
          <button onClick={fetchStudents} title={t.refresh}
            style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-secondary)' }}>
            <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
          </button>
          <button className="button-primary icon-button" onClick={() => { setShowAddForm(s => !s); setEditingId(null); }}>
            <Plus size={16} /> {t.addStudent}
          </button>
        </div>
      </div>

      {showAddForm && (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
          <h4 style={{ margin: '0 0 16px', color: 'var(--text-primary)' }}>{t.newStudent}</h4>
          <AddFields vals={draft} onSet={d} classOptions={classOptions} idSuffix="-add" t={t} />
          <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end' }}>
            <button className="button-secondary" onClick={() => { setShowAddForm(false); setDraft(BLANK); }}><X size={14} /> {t.cancel}</button>
            <button className="button-primary" onClick={handleAdd} disabled={!draft.name.trim()}><Plus size={14} /> {t.addStudent}</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 280 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input style={{ ...inp, paddingLeft: 30 }} placeholder={t.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select style={{ ...inp, flex: '0 0 auto', maxWidth: 200 }} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
          {classes.map(c => <option key={c} value={c}>{c === 'all' ? t.allClasses : c}</option>)}
        </select>
        <span style={{ alignSelf: 'center', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t.studentCount(filtered.length)}</span>
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <Users size={48} style={{ opacity: 0.25, marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
          <p style={{ margin: 0 }}>{t.noStudents}</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filtered.map(s => (
            <div key={s.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 12, padding: 16 }}>
              {editingId === s.id ? (
                <div>
                  <AddFields vals={editDraft} onSet={ed} classOptions={classOptions} idSuffix={`-edit-${s.id}`} t={t} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' }}>
                    <button className="button-secondary" onClick={cancelEdit}><X size={13} /> {t.cancel}</button>
                    <button className="button-primary" onClick={saveEdit}><Save size={13} /> {t.save}</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{s.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                        {s.className && <span style={{ fontSize: '0.72rem', background: 'var(--hover-bg)', padding: '2px 8px', borderRadius: 10, color: 'var(--text-secondary)' }}>{s.className}</span>}
                        {s.status && <span style={{ fontSize: '0.72rem', fontWeight: 600, color: STATUS_COLOR[s.status] || '#6b7280' }}>{(t.statusLabels && t.statusLabels[s.status]) || s.status}</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                      <button onClick={() => startEdit(s)} style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: 'var(--text-secondary)' }}><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(s.id, s.name)} style={{ background: '#fee2e2', border: '1px solid #fecaca', borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#dc2626' }}><Trash2 size={13} /></button>
                    </div>
                  </div>

                  {s.phone && (
                    <a href={`tel:${s.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.83rem', color: '#6366f1', textDecoration: 'none', marginBottom: 6, fontWeight: 500 }}>
                      <Phone size={13} /> {s.phone}
                    </a>
                  )}

                  {(s.parentName || s.parentPhone) && (
                    <div style={{ paddingTop: 8, marginTop: 4, borderTop: '1px solid var(--border-color)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{t.parentGuardian}</div>
                      {s.parentName && <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 3 }}>{s.parentName}</div>}
                      {s.parentPhone && (
                        <a href={`tel:${s.parentPhone}`} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.83rem', color: '#6366f1', textDecoration: 'none', fontWeight: 500 }}>
                          <Phone size={13} /> {s.parentPhone}
                        </a>
                      )}
                    </div>
                  )}

                  {s.address && (
                    <a href={mapsUrl(s.address)} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'flex-start', gap: 6, fontSize: '0.79rem', color: '#059669', textDecoration: 'none', marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--border-color)', lineHeight: 1.4 }}>
                      <MapPin size={13} style={{ marginTop: 2, flexShrink: 0 }} />{s.address}
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
