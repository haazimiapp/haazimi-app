import { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CLASSES as INITIAL_CLASSES } from '../data/mockData';

const T = {
  en: {
    title: 'My Classes', sub: 'Select a class, then tap a student to view or edit their details',
    selectPrompt: 'Select a class from the list to view and edit student details.',
    noStudents: 'No students in this class yet. Add one above.',
    addStudent: 'Add Student', addNewStudent: 'Add New Student',
    studentName: 'Student Name', studentNamePlaceholder: 'Full name',
    juzProgress: 'Juz Progress', attendance: 'Attendance %',
    status: 'Status', notes: 'Notes', noNotes: 'No notes',
    notesPlaceholder: 'Add notes...', optionalNotes: 'Optional notes...',
    save: 'Save', cancel: 'Cancel',
    student: 'student', students: 'students',
    juz: 'Juz',
    editTitle: 'Edit student', removeTitle: 'Remove student', editClassTitle: 'Edit class name',
  },
  ar: {
    title: 'فصولي', sub: 'اختر فصلاً ثم انقر على طالب لعرض تفاصيله أو تعديلها',
    selectPrompt: 'اختر فصلاً من القائمة لعرض تفاصيل الطلاب وتعديلها.',
    noStudents: 'لا يوجد طلاب في هذا الفصل بعد. أضف واحداً أعلاه.',
    addStudent: 'إضافة طالب', addNewStudent: 'إضافة طالب جديد',
    studentName: 'اسم الطالب', studentNamePlaceholder: 'الاسم الكامل',
    juzProgress: 'تقدم الجزء', attendance: 'نسبة الحضور %',
    status: 'الحالة', notes: 'ملاحظات', noNotes: 'لا توجد ملاحظات',
    notesPlaceholder: 'أضف ملاحظات...', optionalNotes: 'ملاحظات اختيارية...',
    save: 'حفظ', cancel: 'إلغاء',
    student: 'طالب', students: 'طلاب',
    juz: 'جزء',
    editTitle: 'تعديل الطالب', removeTitle: 'إزالة الطالب', editClassTitle: 'تعديل اسم الفصل',
  },
  ur: {
    title: 'میری کلاسیں', sub: 'ایک کلاس منتخب کریں، پھر طالب علم کی تفصیلات دیکھنے یا ترمیم کرنے کے لیے ٹیپ کریں',
    selectPrompt: 'طالب علم کی تفصیلات دیکھنے اور ترمیم کرنے کے لیے فہرست سے ایک کلاس منتخب کریں۔',
    noStudents: 'اس کلاس میں ابھی کوئی طالب علم نہیں۔ اوپر ایک شامل کریں۔',
    addStudent: 'طالب علم شامل کریں', addNewStudent: 'نیا طالب علم شامل کریں',
    studentName: 'طالب علم کا نام', studentNamePlaceholder: 'پورا نام',
    juzProgress: 'جز کی پیشرفت', attendance: 'حاضری %',
    status: 'حالت', notes: 'نوٹس', noNotes: 'کوئی نوٹس نہیں',
    notesPlaceholder: 'نوٹس شامل کریں...', optionalNotes: 'اختیاری نوٹس...',
    save: 'محفوظ کریں', cancel: 'منسوخ',
    student: 'طالب علم', students: 'طلبہ',
    juz: 'جز',
    editTitle: 'طالب علم ترمیم کریں', removeTitle: 'طالب علم ہٹائیں', editClassTitle: 'کلاس کا نام ترمیم کریں',
  },
  es: {
    title: 'Mis Clases', sub: 'Selecciona una clase y toca un estudiante para ver o editar sus detalles',
    selectPrompt: 'Selecciona una clase de la lista para ver y editar los detalles del estudiante.',
    noStudents: 'No hay estudiantes en esta clase todavía. Añade uno arriba.',
    addStudent: 'Agregar Estudiante', addNewStudent: 'Agregar Nuevo Estudiante',
    studentName: 'Nombre del Estudiante', studentNamePlaceholder: 'Nombre completo',
    juzProgress: 'Progreso de Juz', attendance: 'Asistencia %',
    status: 'Estado', notes: 'Notas', noNotes: 'Sin notas',
    notesPlaceholder: 'Agregar notas...', optionalNotes: 'Notas opcionales...',
    save: 'Guardar', cancel: 'Cancelar',
    student: 'estudiante', students: 'estudiantes',
    juz: 'Juz',
    editTitle: 'Editar estudiante', removeTitle: 'Eliminar estudiante', editClassTitle: 'Editar nombre de clase',
  },
  pt: {
    title: 'Minhas Turmas', sub: 'Selecione uma turma e toque num estudante para ver ou editar os seus detalhes',
    selectPrompt: 'Selecione uma turma da lista para ver e editar os detalhes do estudante.',
    noStudents: 'Ainda não há estudantes nesta turma. Adicione um acima.',
    addStudent: 'Adicionar Estudante', addNewStudent: 'Adicionar Novo Estudante',
    studentName: 'Nome do Estudante', studentNamePlaceholder: 'Nome completo',
    juzProgress: 'Progresso do Juz', attendance: 'Frequência %',
    status: 'Estado', notes: 'Notas', noNotes: 'Sem notas',
    notesPlaceholder: 'Adicionar notas...', optionalNotes: 'Notas opcionais...',
    save: 'Guardar', cancel: 'Cancelar',
    student: 'estudante', students: 'estudantes',
    juz: 'Juz',
    editTitle: 'Editar estudante', removeTitle: 'Remover estudante', editClassTitle: 'Editar nome da turma',
  },
};

const STATUS_OPTIONS = ['On Track', 'Needs Attention', 'At Risk', 'Excellent'];
const STATUS_CLASS = {
  'On Track': 'status-completed',
  'Excellent': 'status-completed',
  'Needs Attention': 'status-in-progress',
  'At Risk': 'status-incomplete',
};

function StudentCard({ student, classId, hasJuz, onSave, onDelete, t }) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [draft, setDraft] = useState({ ...student });

  const startEdit = () => { setDraft({ ...student }); setEditing(true); setExpanded(true); };
  const cancelEdit = () => { setEditing(false); setDraft({ ...student }); };
  const save = () => { onSave(classId, draft); setEditing(false); };
  const d = (k, v) => setDraft(f => ({ ...f, [k]: v }));

  return (
    <div className={`student-card ${editing ? 'student-card--editing' : ''}`}>
      <div className="student-card-header" onClick={() => !editing && setExpanded(e => !e)}>
        <div className="student-card-name-row">
          <strong>{student.name}</strong>
          <span className={`status-badge ${STATUS_CLASS[student.status] || 'status-in-progress'}`}>{student.status}</span>
        </div>
        <div className="student-card-actions" onClick={e => e.stopPropagation()}>
          {!editing && (
            <>
              <button className="icon-btn" onClick={startEdit} title={t.editTitle}><Edit2 size={15} /></button>
              <button className="icon-btn icon-btn--danger" onClick={() => onDelete(classId, student.id)} title={t.removeTitle}><Trash2 size={15} /></button>
              <button className="icon-btn" onClick={() => setExpanded(e => !e)}>
                {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="student-card-attendance">
        <div className="attendance-bar-wrap">
          <div className="attendance-bar-bg">
            <div
              className="attendance-bar-fill"
              style={{ width: `${editing ? draft.attendance : student.attendance}%`, background: (editing ? draft.attendance : student.attendance) >= 80 ? 'var(--success-color)' : 'var(--danger-color)' }}
            />
          </div>
          <span className="attendance-pct">{editing ? draft.attendance : student.attendance}%</span>
        </div>
      </div>

      {(expanded || editing) && (
        <div className="student-card-body">
          {editing ? (
            <div className="student-edit-grid">
              {hasJuz && (
                <div className="form-group">
                  <label>{t.juzProgress}</label>
                  <input type="number" min={1} max={30} value={draft.juz || ''} onChange={e => d('juz', e.target.value ? Number(e.target.value) : null)} placeholder="1–30" />
                </div>
              )}
              <div className="form-group">
                <label>{t.attendance}</label>
                <input type="number" min={0} max={100} value={draft.attendance} onChange={e => d('attendance', Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label>{t.status}</label>
                <select value={draft.status} onChange={e => d('status', e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group student-edit-full">
                <label>{t.notes}</label>
                <textarea rows={2} value={draft.notes} onChange={e => d('notes', e.target.value)} placeholder={t.notesPlaceholder} />
              </div>
              <div className="student-edit-actions">
                <button type="button" className="button-secondary" onClick={cancelEdit}><X size={14} /> {t.cancel}</button>
                <button type="button" className="button-primary" onClick={save}><Save size={14} /> {t.save}</button>
              </div>
            </div>
          ) : (
            <div className="student-card-details">
              {hasJuz && (
                <div className="student-detail-row">
                  <span className="student-detail-label">{t.juzProgress}</span>
                  <span>{student.juz ? `${t.juz} ${student.juz}` : 'N/A'}</span>
                </div>
              )}
              <div className="student-detail-row">
                <span className="student-detail-label">{t.notes}</span>
                <span>{student.notes || <em style={{ color: 'var(--subtle-text-color)' }}>{t.noNotes}</em>}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddStudentForm({ classId, hasJuz, onAdd, onClose, t }) {
  const [draft, setDraft] = useState({ name: '', juz: '', attendance: 90, status: 'On Track', notes: '' });
  const d = (k, v) => setDraft(f => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!draft.name.trim()) return;
    onAdd(classId, { id: Date.now(), name: draft.name.trim(), juz: hasJuz ? (draft.juz ? Number(draft.juz) : null) : undefined, attendance: Number(draft.attendance), status: draft.status, notes: draft.notes });
    onClose();
  };

  return (
    <div className="add-student-form">
      <h4>{t.addNewStudent}</h4>
      <div className="student-edit-grid">
        <div className="form-group student-edit-full">
          <label>{t.studentName} <span style={{ color: '#e74c3c' }}>*</span></label>
          <input type="text" value={draft.name} onChange={e => d('name', e.target.value)} placeholder={t.studentNamePlaceholder} autoFocus />
        </div>
        {hasJuz && (
          <div className="form-group">
            <label>{t.juzProgress}</label>
            <input type="number" min={1} max={30} value={draft.juz} onChange={e => d('juz', e.target.value)} placeholder="1–30" />
          </div>
        )}
        <div className="form-group">
          <label>{t.attendance}</label>
          <input type="number" min={0} max={100} value={draft.attendance} onChange={e => d('attendance', e.target.value)} />
        </div>
        <div className="form-group">
          <label>{t.status}</label>
          <select value={draft.status} onChange={e => d('status', e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group student-edit-full">
          <label>{t.notes}</label>
          <textarea rows={2} value={draft.notes} onChange={e => d('notes', e.target.value)} placeholder={t.optionalNotes} />
        </div>
        <div className="student-edit-actions">
          <button type="button" className="button-secondary" onClick={onClose}><X size={14} /> {t.cancel}</button>
          <button type="button" className="button-primary" onClick={handleAdd}><Plus size={14} /> {t.addStudent}</button>
        </div>
      </div>
    </div>
  );
}

export default function MyClasses({ language }) {
  const t = T[language] || T.en;

  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingClassName, setEditingClassName] = useState(false);
  const [classNameDraft, setClassNameDraft] = useState('');

  const cls = classes.find(c => c.id === selectedClass);
  const hasJuz = cls?.students[0]?.juz !== undefined;

  const saveStudent = (classId, updated) => setClasses(cs => cs.map(c => c.id === classId ? { ...c, students: c.students.map(s => s.id === updated.id ? updated : s) } : c));
  const deleteStudent = (classId, studentId) => setClasses(cs => cs.map(c => c.id === classId ? { ...c, students: c.students.filter(s => s.id !== studentId) } : c));
  const addStudent = (classId, newStudent) => setClasses(cs => cs.map(c => c.id === classId ? { ...c, students: [...c.students, newStudent] } : c));
  const saveClassName = () => { setClasses(cs => cs.map(c => c.id === selectedClass ? { ...c, name: classNameDraft } : c)); setEditingClassName(false); };
  const selectClass = (id) => { setSelectedClass(id); setShowAddStudent(false); setEditingClassName(false); };

  const studentCount = (n) => `${n} ${n === 1 ? t.student : t.students}`;

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
      </div>

      <div className="my-classes-layout">
        <div className="class-list-sidebar">
          {classes.map(c => (
            <button key={c.id} className={`class-list-item ${selectedClass === c.id ? 'active' : ''}`} onClick={() => selectClass(c.id)}>
              {c.name}
              <div style={{ fontSize: '0.8rem', fontWeight: 400, marginTop: 2, opacity: 0.7 }}>{studentCount(c.students.length)}</div>
            </button>
          ))}
        </div>

        <div className="class-details-content">
          {!cls ? (
            <div className="prompt-container">{t.selectPrompt}</div>
          ) : (
            <div>
              <div className="class-detail-header">
                {editingClassName ? (
                  <div className="class-name-edit">
                    <input type="text" value={classNameDraft} onChange={e => setClassNameDraft(e.target.value)} autoFocus />
                    <button className="button-primary" onClick={saveClassName}><Save size={15} /> {t.save}</button>
                    <button className="button-secondary" onClick={() => setEditingClassName(false)}><X size={15} /></button>
                  </div>
                ) : (
                  <div className="class-name-row">
                    <h3>{cls.name}</h3>
                    <button className="icon-btn" title={t.editClassTitle} onClick={() => { setClassNameDraft(cls.name); setEditingClassName(true); }}>
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
                <button className="button-primary icon-button" onClick={() => setShowAddStudent(s => !s)}>
                  <Plus size={16} /> {t.addStudent}
                </button>
              </div>

              {showAddStudent && (
                <AddStudentForm classId={cls.id} hasJuz={hasJuz} onAdd={addStudent} onClose={() => setShowAddStudent(false)} t={t} />
              )}

              <div className="student-cards-list">
                {cls.students.length === 0 ? (
                  <div className="prompt-container">{t.noStudents}</div>
                ) : cls.students.map(student => (
                  <StudentCard key={student.id} student={student} classId={cls.id} hasJuz={hasJuz} onSave={saveStudent} onDelete={deleteStudent} t={t} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
