import { useState, useRef, useEffect } from 'react';
import { Edit2, Save, X, Plus, Trash2, ChevronDown, ChevronUp, MoreHorizontal } from 'lucide-react';
import useStudents from '../hooks/useStudents';

const T = {
  en: {
    title: 'My Classes', sub: 'Select a class, then tap a student to view or edit their progress',
    loadingStudents: 'Loading students…', noStudents: 'No students yet.',
    noStudentsHint: 'Add students via the Students page first, then they will appear here grouped by class.',
    selectClass: 'Select a class from the list.',
    addStudent: 'Add Student', addTo: (cls) => `Add to ${cls}`,
    studentNameLabel: 'Student Name *', phoneLabelOpt: 'Phone (optional)', ageLabelOpt: 'Age (optional)',
    parentLabel: 'Parent Name (optional)',
    noStudentsInClass: 'No students in this class yet.',
    cancel: 'Cancel', save: 'Save', add: 'Add',
    studentCount: (n) => `${n} student${n !== 1 ? 's' : ''}`,
    syncing: '⟳ Syncing…', synced: '✓ Synced',
    intentions: 'Imaani A\'maal', complete: '✓ Complete',
    attendance: 'Att.', status: 'Status', notes: 'Notes',
    eightIntentions: '8 Daily A\'maal', tapToggle: '— tap each to toggle',
    confirmRemove: 'Remove this student from the class?',
    editStudent: 'Edit', deleteStudent: 'Delete',
    father: 'Father', parent: 'Parent', age: 'Age', grade: 'Class', attPct: 'Att.',
    quran: "Qur'aan", surahs: 'Surahs', duas: "Du'aas", imaaniAmaal: "Imaani A'maal", other: 'Other',
    statusLabels: { 'On Track': 'On Track', 'Needs Attention': 'Needs Attention', 'At Risk': 'At Risk', 'Excellent': 'Excellent' },
  },
  ar: {
    title: 'فصولي', sub: 'اختر فصلاً ثم اضغط على طالب لعرض تقدمه',
    loadingStudents: 'جارٍ تحميل الطلاب…', noStudents: 'لا يوجد طلاب بعد.',
    noStudentsHint: 'أضف الطلاب أولاً من صفحة الطلاب.',
    selectClass: 'اختر فصلاً من القائمة.',
    addStudent: 'إضافة طالب', addTo: (cls) => `إضافة إلى ${cls}`,
    studentNameLabel: 'اسم الطالب *', phoneLabelOpt: 'الهاتف (اختياري)', ageLabelOpt: 'العمر (اختياري)',
    parentLabel: 'اسم الوالد (اختياري)',
    noStudentsInClass: 'لا يوجد طلاب في هذا الفصل.',
    cancel: 'إلغاء', save: 'حفظ', add: 'إضافة',
    studentCount: (n) => `${n} طالب`,
    syncing: '⟳ مزامنة…', synced: '✓ تمت',
    intentions: 'الأعمال الإيمانية', complete: '✓ مكتمل',
    attendance: 'حضور', status: 'الحالة', notes: 'ملاحظات',
    eightIntentions: '8 أعمال يومية', tapToggle: '— اضغط للتبديل',
    confirmRemove: 'هل تريد حذف هذا الطالب من الفصل؟',
    editStudent: 'تعديل', deleteStudent: 'حذف',
    father: 'الأب', parent: 'الوالد', age: 'العمر', grade: 'الفصل', attPct: 'الحضور',
    quran: "القرآن", surahs: 'السور', duas: "الأدعية", imaaniAmaal: 'الأعمال الإيمانية', other: 'أخرى',
    statusLabels: { 'On Track': 'على المسار', 'Needs Attention': 'يحتاج اهتمام', 'At Risk': 'في خطر', 'Excellent': 'ممتاز' },
  },
  ur: {
    title: 'میری کلاسیں', sub: 'کلاس منتخب کریں، پھر طالب کی پیشرفت دیکھیں',
    loadingStudents: 'طلبہ لوڈ ہو رہے ہیں…', noStudents: 'ابھی کوئی طالب نہیں۔',
    noStudentsHint: 'پہلے طلبہ کے صفحے سے طلبہ شامل کریں۔',
    selectClass: 'فہرست سے کلاس منتخب کریں۔',
    addStudent: 'طالب شامل کریں', addTo: (cls) => `${cls} میں شامل کریں`,
    studentNameLabel: 'طالب کا نام *', phoneLabelOpt: 'فون (اختیاری)', ageLabelOpt: 'عمر (اختیاری)',
    parentLabel: 'والد کا نام (اختیاری)',
    noStudentsInClass: 'اس کلاس میں ابھی کوئی طالب نہیں۔',
    cancel: 'منسوخ', save: 'محفوظ کریں', add: 'شامل کریں',
    studentCount: (n) => `${n} طالب`,
    syncing: '⟳ ہم آہنگی…', synced: '✓ ہم آہنگ',
    intentions: 'ایمانی اعمال', complete: '✓ مکمل',
    attendance: 'حاضری', status: 'حالت', notes: 'نوٹس',
    eightIntentions: '8 روزانہ اعمال', tapToggle: '— ٹوگل کریں',
    confirmRemove: 'کیا آپ اس طالب کو کلاس سے ہٹانا چاہتے ہیں؟',
    editStudent: 'ترمیم', deleteStudent: 'حذف کریں',
    father: 'والد', parent: 'والد/والدہ', age: 'عمر', grade: 'کلاس', attPct: 'حاضری',
    quran: "قرآن", surahs: 'سورتیں', duas: "دعائیں", imaaniAmaal: 'ایمانی اعمال', other: 'دیگر',
    statusLabels: { 'On Track': 'ٹھیک ہے', 'Needs Attention': 'توجہ درکار', 'At Risk': 'خطرے میں', 'Excellent': 'بہترین' },
  },
  es: {
    title: 'Mis Clases', sub: 'Selecciona una clase y toca un estudiante para ver su progreso',
    loadingStudents: 'Cargando estudiantes…', noStudents: 'Aún no hay estudiantes.',
    noStudentsHint: 'Agrega estudiantes primero desde la página de Estudiantes.',
    selectClass: 'Selecciona una clase de la lista.',
    addStudent: 'Agregar Estudiante', addTo: (cls) => `Agregar a ${cls}`,
    studentNameLabel: 'Nombre del Estudiante *', phoneLabelOpt: 'Teléfono (opcional)', ageLabelOpt: 'Edad (opcional)',
    parentLabel: 'Nombre del Padre (opcional)',
    noStudentsInClass: 'No hay estudiantes en esta clase aún.',
    cancel: 'Cancelar', save: 'Guardar', add: 'Agregar',
    studentCount: (n) => `${n} estudiante${n !== 1 ? 's' : ''}`,
    syncing: '⟳ Sincronizando…', synced: '✓ Sincronizado',
    intentions: "A'maal Imáni", complete: '✓ Completo',
    attendance: 'Asist.', status: 'Estado', notes: 'Notas',
    eightIntentions: "8 A'maal Diarios", tapToggle: '— toca para alternar',
    confirmRemove: '¿Eliminar este estudiante de la clase?',
    editStudent: 'Editar', deleteStudent: 'Eliminar',
    father: 'Padre', parent: 'Padre/Madre', age: 'Edad', grade: 'Clase', attPct: 'Asist.',
    quran: "Qur'aan", surahs: 'Suras', duas: "Du'aas", imaaniAmaal: "A'maal Imáni", other: 'Otro',
    statusLabels: { 'On Track': 'En Curso', 'Needs Attention': 'Necesita Atención', 'At Risk': 'En Riesgo', 'Excellent': 'Excelente' },
  },
  pt: {
    title: 'Minhas Turmas', sub: 'Selecione uma turma e toque em um aluno para ver o progresso',
    loadingStudents: 'Carregando alunos…', noStudents: 'Ainda não há alunos.',
    noStudentsHint: 'Adicione alunos primeiro na página de Alunos.',
    selectClass: 'Selecione uma turma da lista.',
    addStudent: 'Adicionar Aluno', addTo: (cls) => `Adicionar a ${cls}`,
    studentNameLabel: 'Nome do Aluno *', phoneLabelOpt: 'Telefone (opcional)', ageLabelOpt: 'Idade (opcional)',
    parentLabel: 'Nome do Pai (opcional)',
    noStudentsInClass: 'Nenhum aluno nesta turma ainda.',
    cancel: 'Cancelar', save: 'Salvar', add: 'Adicionar',
    studentCount: (n) => `${n} aluno${n !== 1 ? 's' : ''}`,
    syncing: '⟳ Sincronizando…', synced: '✓ Sincronizado',
    intentions: "A'maal Imani", complete: '✓ Completo',
    attendance: 'Freq.', status: 'Estado', notes: 'Notas',
    eightIntentions: "8 A'maal Diários", tapToggle: '— toque para alternar',
    confirmRemove: 'Remover este aluno da turma?',
    editStudent: 'Editar', deleteStudent: 'Remover',
    father: 'Pai', parent: 'Pai/Mãe', age: 'Idade', grade: 'Turma', attPct: 'Freq.',
    quran: "Qur'aan", surahs: 'Suras', duas: "Du'aas", imaaniAmaal: "A'maal Imani", other: 'Outro',
    statusLabels: { 'On Track': 'Em Curso', 'Needs Attention': 'Precisa de Atenção', 'At Risk': 'Em Risco', 'Excellent': 'Excelente' },
  },
};

const STATUS_OPTIONS = ['On Track', 'Needs Attention', 'At Risk', 'Excellent'];
const STATUS_CLASS = {
  'On Track': 'status-completed', 'Excellent': 'status-completed',
  'Needs Attention': 'status-in-progress', 'At Risk': 'status-incomplete',
};

function IntentionCircles({ value, onChange, readOnly }) {
  const mask = Number(value) || 0;
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {Array.from({ length: 8 }, (_, i) => {
        const done = !!(mask & (1 << i));
        return (
          <button key={i} type="button" title={`A'mal ${i + 1}`}
            onClick={() => !readOnly && onChange && onChange(mask ^ (1 << i))}
            style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: done ? '#6366f1' : 'var(--hover-bg)', color: done ? '#fff' : 'var(--text-secondary)', fontWeight: 700, fontSize: '0.75rem', cursor: readOnly ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.15s' }}>
            {i + 1}
          </button>
        );
      })}
    </div>
  );
}

function ProgressRow({ label, value, editing, onChange, placeholder }) {
  const inp = { padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.83rem', width: '100%', boxSizing: 'border-box' };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 8, alignItems: editing ? 'center' : 'start', paddingTop: 6, borderTop: '1px solid var(--border-color)' }}>
      <span style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</span>
      {editing
        ? <input value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} style={inp} />
        : <span style={{ fontSize: '0.83rem', color: value ? 'var(--text-primary)' : 'var(--text-secondary)', fontStyle: value ? 'normal' : 'italic' }}>{value || '—'}</span>
      }
    </div>
  );
}

function EllipsisMenu({ onEdit, onDelete, editLabel, deleteLabel }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler); };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 6, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', lineHeight: 1 }}
        title="Options"
      >
        <MoreHorizontal size={18} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%', zIndex: 100,
          background: 'var(--card-bg)', border: '1px solid var(--border-color)',
          borderRadius: 10, boxShadow: '0 4px 16px var(--shadow-color)',
          minWidth: 140, overflow: 'hidden',
        }}>
          <button
            type="button"
            onClick={() => { setOpen(false); onEdit(); }}
            style={{ width: '100%', padding: '11px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.88rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}
          >
            <Edit2 size={14} style={{ color: 'var(--accent-color)' }} /> {editLabel}
          </button>
          <div style={{ height: 1, background: 'var(--border-color)' }} />
          <button
            type="button"
            onClick={() => { setOpen(false); onDelete(); }}
            style={{ width: '100%', padding: '11px 16px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '0.88rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500 }}
          >
            <Trash2 size={14} /> {deleteLabel}
          </button>
        </div>
      )}
    </div>
  );
}

function StudentCard({ student, onSave, onDelete, t, defaultExpanded }) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(!!defaultExpanded);
  const [draft, setDraft] = useState({ ...student });

  const startEdit = () => { setDraft({ ...student }); setEditing(true); setExpanded(true); };
  const cancelEdit = () => { setEditing(false); setDraft({ ...student }); };
  const save = () => { onSave(student.id, draft); setEditing(false); };
  const d = (k, v) => setDraft(f => ({ ...f, [k]: v }));

  const mask = Number(student.intentions) || 0;
  const doneCount = Array.from({ length: 8 }, (_, i) => !!(mask & (1 << i))).filter(Boolean).length;
  const att = Number(student.attendance) || 0;
  const attColor = att >= 80 ? 'var(--success-color)' : att >= 60 ? '#f59e0b' : 'var(--danger-color)';
  const selStyle = { padding: '6px 8px', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '0.83rem', width: '100%', boxSizing: 'border-box' };

  const parentName = student.parentName || student.fatherName || student.motherName || '';

  return (
    <div style={{
      background: 'var(--card-bg)',
      borderRadius: 12,
      boxShadow: expanded || editing
        ? '0 4px 16px var(--shadow-color)'
        : '0 2px 8px var(--shadow-color)',
      marginBottom: 10,
      border: editing ? '1.5px solid var(--accent-color)' : '1.5px solid var(--border-color)',
      position: 'relative',
    }}>
      <div
        onClick={() => !editing && setExpanded(e => !e)}
        style={{
          padding: '12px 14px',
          cursor: editing ? 'default' : 'pointer',
          userSelect: 'none',
          borderRadius: expanded || editing ? '12px 12px 0 0' : 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {student.name}
            </span>
            {student.age && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', flexShrink: 0 }}>
                {t.age} {student.age}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <span className={`status-badge ${STATUS_CLASS[student.status] || 'status-in-progress'}`} style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
              {(t.statusLabels && t.statusLabels[student.status]) || student.status}
            </span>
            {!editing && (
              <EllipsisMenu
                onEdit={startEdit}
                onDelete={() => onDelete(student.id)}
                editLabel={t.editStudent}
                deleteLabel={t.deleteStudent}
              />
            )}
          </div>
        </div>

        {parentName && (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: 4 }}>
            {t.parent}: <span style={{ color: 'var(--text-primary)' }}>{parentName}</span>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {t.grade}: <strong style={{ color: 'var(--text-primary)' }}>{student.className}</strong>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.attPct}:</span>
            <div style={{ width: 70, height: 6, background: 'var(--hover-bg)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${att}%`, height: '100%', background: attColor, borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: attColor }}>{att}%</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {t.intentions}: <strong style={{ color: doneCount === 8 ? '#6366f1' : 'var(--text-primary)' }}>{doneCount}/8</strong>
            {doneCount === 8 && <span style={{ color: '#6366f1', marginLeft: 4, fontSize: '0.7rem' }}>{t.complete}</span>}
          </span>
          {!editing && (
            <ChevronDown
              size={15}
              style={{
                marginLeft: 'auto',
                color: 'var(--text-secondary)',
                flexShrink: 0,
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            />
          )}
        </div>
      </div>

      {(expanded || editing) && (
        <div style={{ padding: '4px 14px 14px', borderTop: '1px solid var(--border-color)', borderRadius: '0 0 12px 12px' }}>
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 10 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.78rem' }}>{t.attendance}</label>
                  <input type="number" min={0} max={100} value={draft.attendance} onChange={e => d('attendance', Number(e.target.value))} style={selStyle} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.78rem' }}>{t.age}</label>
                  <input type="number" min={1} max={30} value={draft.age || ''} onChange={e => d('age', e.target.value)} placeholder="—" style={selStyle} />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.78rem' }}>{t.status}</label>
                  <select value={draft.status} onChange={e => d('status', e.target.value)} style={selStyle}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{(t.statusLabels && t.statusLabels[s]) || s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label style={{ fontSize: '0.78rem' }}>{t.parent}</label>
                  <input type="text" value={draft.parentName || ''} onChange={e => d('parentName', e.target.value)} placeholder="Parent name" style={selStyle} />
                </div>
              </div>

              <div style={{ paddingTop: 6, borderTop: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6 }}>
                  {t.eightIntentions} <span style={{ fontWeight: 400 }}>{t.tapToggle}</span>
                </div>
                <IntentionCircles value={draft.intentions} onChange={v => d('intentions', v)} />
              </div>

              <ProgressRow label={t.quran} value={draft.quranJuz} editing onChange={v => d('quranJuz', v)} placeholder="e.g. Juz 5, Baqarah p.12" />
              <ProgressRow label={t.surahs} value={draft.surahs} editing onChange={v => d('surahs', v)} placeholder="e.g. Yaseen, Mulk" />
              <ProgressRow label={t.duas} value={draft.duas} editing onChange={v => d('duas', v)} placeholder="e.g. Morning, Evening" />
              <ProgressRow label={t.imaaniAmaal} value={draft.muzaakarahs} editing onChange={v => d('muzaakarahs', v)} placeholder="e.g. Salaah, Wudhu, Kalimah" />
              <ProgressRow label={t.other} value={draft.other} editing onChange={v => d('other', v)} placeholder="Other notes or progress" />

              <div style={{ paddingTop: 6, borderTop: '1px solid var(--border-color)' }}>
                <label style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: 4 }}>{t.notes}</label>
                <textarea rows={2} value={draft.notes || ''} onChange={e => d('notes', e.target.value)} placeholder="Add notes…"
                  style={{ ...selStyle, resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
                <button type="button" className="button-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }} onClick={cancelEdit}><X size={14} style={{ marginRight: 4 }} />{t.cancel}</button>
                <button type="button" className="button-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }} onClick={save}><Save size={14} style={{ marginRight: 4 }} />{t.save}</button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 10 }}>
              <div>
                <div style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: 6 }}>{t.eightIntentions}</div>
                <IntentionCircles value={student.intentions} readOnly />
              </div>
              <ProgressRow label={t.quran} value={student.quranJuz} />
              <ProgressRow label={t.surahs} value={student.surahs} />
              <ProgressRow label={t.duas} value={student.duas} />
              <ProgressRow label={t.imaaniAmaal} value={student.muzaakarahs} />
              {student.other && <ProgressRow label={t.other} value={student.other} />}
              {student.notes && <ProgressRow label={t.notes} value={student.notes} />}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyClasses({ user, language }) {
  const t = T[language] || T.en;
  const { myStudents, loading, syncStatus, addStudent, updateStudent, deleteStudent } = useStudents(user);

  const [selectedClass, setSelectedClass] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newParent, setNewParent] = useState('');

  const classes = [...new Set(myStudents.map(s => s.className).filter(Boolean))];
  const firstClass = classes[0] || null;
  const activeClass = classes.includes(selectedClass) ? selectedClass : firstClass;
  const classStudents = myStudents.filter(s => s.className === activeClass);

  const handleSave = async (id, changes) => { await updateStudent(id, changes); };
  const handleDelete = async (id) => {
    if (window.confirm(t.confirmRemove)) await deleteStudent(id);
  };
  const handleAdd = async () => {
    if (!newName.trim() || !activeClass) return;
    await addStudent({
      name: newName.trim(), phone: newPhone.trim(), age: newAge.trim(),
      parentName: newParent.trim(), className: activeClass,
      attendance: 90, status: 'On Track', intentions: 0,
      quranJuz: '', surahs: '', duas: '', muzaakarahs: '', other: '', notes: '',
    });
    setNewName(''); setNewPhone(''); setNewAge(''); setNewParent('');
    setShowAddStudent(false);
  };

  const syncLabel = syncStatus === 'syncing' ? t.syncing : syncStatus === 'done' ? t.synced : '';
  const n = classStudents.length;

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
        {syncLabel && <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{syncLabel}</span>}
      </div>

      {loading && classes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-secondary)' }}>{t.loadingStudents}</div>
      ) : classes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-secondary)' }}>
          <p>{t.noStudents}</p>
          <p style={{ fontSize: '0.9rem' }}>{t.noStudentsHint}</p>
        </div>
      ) : (
        <div className="my-classes-layout">
          <div className="class-list-sidebar">
            {classes.map(c => {
              const count = myStudents.filter(s => s.className === c).length;
              return (
                <button key={c} className={`class-list-item ${activeClass === c ? 'active' : ''}`}
                  onClick={() => { setSelectedClass(c); setShowAddStudent(false); }}>
                  {c}
                  <div style={{ fontSize: '0.8rem', fontWeight: 400, marginTop: 2, opacity: 0.7 }}>{t.studentCount(count)}</div>
                </button>
              );
            })}
          </div>

          <div className="class-details-content">
            {!activeClass ? (
              <div className="prompt-container">{t.selectClass}</div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
                  <div>
                    <h3 style={{ margin: 0, fontWeight: 700 }}>{activeClass}</h3>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{t.studentCount(n)}</span>
                  </div>
                  <button
                    className="button-primary icon-button"
                    style={{ fontSize: '0.88rem', padding: '8px 16px', flexShrink: 0 }}
                    onClick={() => setShowAddStudent(s => !s)}
                  >
                    <Plus size={15} /> {t.addStudent}
                  </button>
                </div>

                {showAddStudent && (
                  <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 16, marginBottom: 16, boxShadow: '0 2px 8px var(--shadow-color)', border: '1.5px solid var(--accent-color)' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: 600 }}>{t.addTo(activeClass)}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.82rem' }}>{t.studentNameLabel}</label>
                        <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Full name" autoFocus />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.82rem' }}>{t.ageLabelOpt}</label>
                          <input type="number" min={1} max={30} value={newAge} onChange={e => setNewAge(e.target.value)} placeholder="—" />
                        </div>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label style={{ fontSize: '0.82rem' }}>{t.phoneLabelOpt}</label>
                          <input type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="+27 82 000 0000" />
                        </div>
                      </div>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label style={{ fontSize: '0.82rem' }}>{t.parentLabel}</label>
                        <input type="text" value={newParent} onChange={e => setNewParent(e.target.value)} placeholder="Father / Mother name" />
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                      <button type="button" className="button-secondary" style={{ padding: '8px 16px', fontSize: '0.88rem' }} onClick={() => setShowAddStudent(false)}>
                        <X size={14} style={{ marginRight: 4 }} />{t.cancel}
                      </button>
                      <button type="button" className="button-primary" style={{ padding: '8px 16px', fontSize: '0.88rem' }} onClick={handleAdd} disabled={!newName.trim()}>
                        <Plus size={14} style={{ marginRight: 4 }} />{t.add}
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  {classStudents.length === 0 ? (
                    <div className="prompt-container">{t.noStudentsInClass}</div>
                  ) : classStudents.map((student, idx) => (
                    <StudentCard key={student.id} student={student} onSave={handleSave} onDelete={handleDelete} t={t} defaultExpanded={idx === 0} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
