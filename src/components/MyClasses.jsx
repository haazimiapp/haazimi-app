import { useState } from 'react';
import { Edit2, Save, X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CLASSES as INITIAL_CLASSES } from '../data/mockData';

const STATUS_OPTIONS = ['On Track', 'Needs Attention', 'At Risk', 'Excellent'];
const STATUS_CLASS = {
  'On Track': 'status-completed',
  'Excellent': 'status-completed',
  'Needs Attention': 'status-in-progress',
  'At Risk': 'status-incomplete',
};

function StudentCard({ student, classId, hasJuz, onSave, onDelete }) {
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
          <span className={`status-badge ${STATUS_CLASS[student.status] || 'status-in-progress'}`}>
            {student.status}
          </span>
        </div>
        <div className="student-card-actions" onClick={e => e.stopPropagation()}>
          {!editing && (
            <>
              <button className="icon-btn" onClick={startEdit} title="Edit student"><Edit2 size={15} /></button>
              <button className="icon-btn icon-btn--danger" onClick={() => onDelete(classId, student.id)} title="Remove student"><Trash2 size={15} /></button>
              <button className="icon-btn" onClick={() => setExpanded(e => !e)}>
                {expanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Attendance bar always visible */}
      <div className="student-card-attendance">
        <div className="attendance-bar-wrap">
          <div className="attendance-bar-bg">
            <div
              className="attendance-bar-fill"
              style={{
                width: `${editing ? draft.attendance : student.attendance}%`,
                background: (editing ? draft.attendance : student.attendance) >= 80 ? 'var(--success-color)' : 'var(--danger-color)'
              }}
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
                  <label>Juz Progress</label>
                  <input type="number" min={1} max={30} value={draft.juz || ''} onChange={e => d('juz', e.target.value ? Number(e.target.value) : null)} placeholder="1–30" />
                </div>
              )}
              <div className="form-group">
                <label>Attendance %</label>
                <input type="number" min={0} max={100} value={draft.attendance} onChange={e => d('attendance', Number(e.target.value))} />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={draft.status} onChange={e => d('status', e.target.value)}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group student-edit-full">
                <label>Notes</label>
                <textarea rows={2} value={draft.notes} onChange={e => d('notes', e.target.value)} placeholder="Add notes..." />
              </div>
              <div className="student-edit-actions">
                <button type="button" className="button-secondary" onClick={cancelEdit}><X size={14} /> Cancel</button>
                <button type="button" className="button-primary" onClick={save}><Save size={14} /> Save</button>
              </div>
            </div>
          ) : (
            <div className="student-card-details">
              {hasJuz && (
                <div className="student-detail-row">
                  <span className="student-detail-label">Juz Progress</span>
                  <span>{student.juz ? `Juz ${student.juz}` : 'N/A'}</span>
                </div>
              )}
              <div className="student-detail-row">
                <span className="student-detail-label">Notes</span>
                <span>{student.notes || <em style={{ color: 'var(--subtle-text-color)' }}>No notes</em>}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AddStudentForm({ classId, hasJuz, onAdd, onClose }) {
  const [draft, setDraft] = useState({ name: '', juz: '', attendance: 90, status: 'On Track', notes: '' });
  const d = (k, v) => setDraft(f => ({ ...f, [k]: v }));

  const handleAdd = () => {
    if (!draft.name.trim()) return;
    onAdd(classId, {
      id: Date.now(),
      name: draft.name.trim(),
      juz: hasJuz ? (draft.juz ? Number(draft.juz) : null) : undefined,
      attendance: Number(draft.attendance),
      status: draft.status,
      notes: draft.notes,
    });
    onClose();
  };

  return (
    <div className="add-student-form">
      <h4>Add New Student</h4>
      <div className="student-edit-grid">
        <div className="form-group student-edit-full">
          <label>Student Name <span style={{ color: '#e74c3c' }}>*</span></label>
          <input type="text" value={draft.name} onChange={e => d('name', e.target.value)} placeholder="Full name" autoFocus />
        </div>
        {hasJuz && (
          <div className="form-group">
            <label>Juz Progress</label>
            <input type="number" min={1} max={30} value={draft.juz} onChange={e => d('juz', e.target.value)} placeholder="1–30" />
          </div>
        )}
        <div className="form-group">
          <label>Attendance %</label>
          <input type="number" min={0} max={100} value={draft.attendance} onChange={e => d('attendance', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={draft.status} onChange={e => d('status', e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group student-edit-full">
          <label>Notes</label>
          <textarea rows={2} value={draft.notes} onChange={e => d('notes', e.target.value)} placeholder="Optional notes..." />
        </div>
        <div className="student-edit-actions">
          <button type="button" className="button-secondary" onClick={onClose}><X size={14} /> Cancel</button>
          <button type="button" className="button-primary" onClick={handleAdd}><Plus size={14} /> Add Student</button>
        </div>
      </div>
    </div>
  );
}

export default function MyClasses() {
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [editingClassName, setEditingClassName] = useState(false);
  const [classNameDraft, setClassNameDraft] = useState('');

  const cls = classes.find(c => c.id === selectedClass);
  const hasJuz = cls?.students[0]?.juz !== undefined;

  const saveStudent = (classId, updated) => {
    setClasses(cs => cs.map(c => c.id === classId ? {
      ...c,
      students: c.students.map(s => s.id === updated.id ? updated : s)
    } : c));
  };

  const deleteStudent = (classId, studentId) => {
    setClasses(cs => cs.map(c => c.id === classId ? {
      ...c,
      students: c.students.filter(s => s.id !== studentId)
    } : c));
  };

  const addStudent = (classId, newStudent) => {
    setClasses(cs => cs.map(c => c.id === classId ? {
      ...c,
      students: [...c.students, newStudent]
    } : c));
  };

  const saveClassName = () => {
    setClasses(cs => cs.map(c => c.id === selectedClass ? { ...c, name: classNameDraft } : c));
    setEditingClassName(false);
  };

  const selectClass = (id) => {
    setSelectedClass(id);
    setShowAddStudent(false);
    setEditingClassName(false);
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>My Classes</h2>
          <p>Select a class, then tap a student to view or edit their details</p>
        </div>
      </div>

      <div className="my-classes-layout">
        <div className="class-list-sidebar">
          {classes.map(c => (
            <button
              key={c.id}
              className={`class-list-item ${selectedClass === c.id ? 'active' : ''}`}
              onClick={() => selectClass(c.id)}
            >
              {c.name}
              <div style={{ fontSize: '0.8rem', fontWeight: 400, marginTop: 2, opacity: 0.7 }}>
                {c.students.length} student{c.students.length !== 1 ? 's' : ''}
              </div>
            </button>
          ))}
        </div>

        <div className="class-details-content">
          {!cls ? (
            <div className="prompt-container">
              Select a class from the list to view and edit student details.
            </div>
          ) : (
            <div>
              <div className="class-detail-header">
                {editingClassName ? (
                  <div className="class-name-edit">
                    <input
                      type="text"
                      value={classNameDraft}
                      onChange={e => setClassNameDraft(e.target.value)}
                      autoFocus
                    />
                    <button className="button-primary" onClick={saveClassName}><Save size={15} /> Save</button>
                    <button className="button-secondary" onClick={() => setEditingClassName(false)}><X size={15} /></button>
                  </div>
                ) : (
                  <div className="class-name-row">
                    <h3>{cls.name}</h3>
                    <button className="icon-btn" title="Edit class name" onClick={() => { setClassNameDraft(cls.name); setEditingClassName(true); }}>
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
                <button className="button-primary icon-button" onClick={() => setShowAddStudent(s => !s)}>
                  <Plus size={16} /> Add Student
                </button>
              </div>

              {showAddStudent && (
                <AddStudentForm
                  classId={cls.id}
                  hasJuz={hasJuz}
                  onAdd={addStudent}
                  onClose={() => setShowAddStudent(false)}
                />
              )}

              <div className="student-cards-list">
                {cls.students.length === 0 ? (
                  <div className="prompt-container">No students in this class yet. Add one above.</div>
                ) : cls.students.map(student => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    classId={cls.id}
                    hasJuz={hasJuz}
                    onSave={saveStudent}
                    onDelete={deleteStudent}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
