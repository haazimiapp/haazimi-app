import { useState, useEffect } from 'react';
import { Plus, Search, Loader2, Edit2, Trash2, UserCheck, UserX, X, Save, ChevronDown } from 'lucide-react';
import { STAFF as INITIAL_STAFF } from '../data/mockData';
import { GOOGLE_SCRIPT_URL } from '../data/config';

const ROLES = [
  'Aapa / Mualima', 'Hafiz / Hafiza', 'Teacher', 'Centre Manager', 'Admin',
  'Coordinator', 'Support Staff', 'Cleaner', 'Gardener', 'Driver',
  'Conductor', 'Helper', 'Cook', 'Security Guard', 'Other',
];

const STATUSES = ['Active', 'Inactive', 'On Leave'];

const T = {
  en: {
    title: 'Staff Management', loadingText: 'Loading staff directory...',
    addStaff: 'Add Staff', editStaff: 'Edit Staff Member', addStaffTitle: 'Add New Staff Member',
    searchPlaceholder: 'Search by name, role, or centre...',
    name: 'Name', role: 'Role', centre: 'Centre', status: 'Status', phone: 'Phone',
    joinDate: 'Join Date', salary: 'Salary', notes: 'Notes', actions: 'Actions',
    fullName: 'Full Name', centreBranch: 'Centre / Branch', phoneNumber: 'Phone Number',
    salaryLabel: 'Monthly Salary (optional)', notesLabel: 'Notes (optional)',
    cancel: 'Cancel', save: 'Save Changes', add: 'Add Staff Member', delete: 'Delete',
    activate: 'Set Active', deactivate: 'Set Inactive', onLeave: 'Set On Leave',
    confirmDelete: (n) => `Remove ${n} from the staff directory? This cannot be undone.`,
    mockBadge: 'Mock Data Active',
    mockBanner: 'MOCK DATA MODE — Showing local sample data. No live API calls are being made.',
    totalStaff: (n) => `${n} total staff members`,
    saving: 'Saving…', noStaff: 'No staff found matching your search.',
    fetchError: 'Could not load staff from cloud. Showing local data.',
    active: 'Active', inactive: 'Inactive', leave: 'On Leave',
  },
  ar: {
    title: 'إدارة الموظفين', loadingText: 'جارٍ تحميل الموظفين...',
    addStaff: 'إضافة موظف', editStaff: 'تعديل الموظف', addStaffTitle: 'إضافة موظف جديد',
    searchPlaceholder: 'البحث بالاسم أو الدور أو المركز...',
    name: 'الاسم', role: 'الدور', centre: 'المركز', status: 'الحالة', phone: 'الهاتف',
    joinDate: 'تاريخ الانضمام', salary: 'الراتب', notes: 'ملاحظات', actions: 'إجراءات',
    fullName: 'الاسم الكامل', centreBranch: 'المركز / الفرع', phoneNumber: 'رقم الهاتف',
    salaryLabel: 'الراتب الشهري (اختياري)', notesLabel: 'ملاحظات (اختياري)',
    cancel: 'إلغاء', save: 'حفظ التغييرات', add: 'إضافة عضو', delete: 'حذف',
    activate: 'تفعيل', deactivate: 'تعطيل', onLeave: 'في إجازة',
    confirmDelete: (n) => `هل تريد حذف ${n}؟`,
    mockBadge: 'بيانات تجريبية', mockBanner: 'وضع البيانات التجريبية.',
    totalStaff: (n) => `${n} موظف`,
    saving: 'جارٍ الحفظ…', noStaff: 'لا يوجد موظفون.',
    fetchError: 'تعذّر تحميل البيانات.', active: 'نشط', inactive: 'غير نشط', leave: 'في إجازة',
  },
  ur: {
    title: 'عملہ انتظام', loadingText: 'لوڈ ہو رہا ہے...',
    addStaff: 'شامل کریں', editStaff: 'ترمیم', addStaffTitle: 'نیا عملہ شامل کریں',
    searchPlaceholder: 'نام، کردار یا مرکز سے تلاش...',
    name: 'نام', role: 'کردار', centre: 'مرکز', status: 'حالت', phone: 'فون',
    joinDate: 'تاریخ', salary: 'تنخواہ', notes: 'نوٹس', actions: 'اقدامات',
    fullName: 'پورا نام', centreBranch: 'مرکز', phoneNumber: 'فون نمبر',
    salaryLabel: 'ماہانہ تنخواہ (اختیاری)', notesLabel: 'نوٹس (اختیاری)',
    cancel: 'منسوخ', save: 'محفوظ کریں', add: 'شامل کریں', delete: 'ہٹائیں',
    activate: 'فعال', deactivate: 'غیر فعال', onLeave: 'چھٹی پر',
    confirmDelete: (n) => `${n} کو ہٹائیں؟`,
    mockBadge: 'موک ڈیٹا', mockBanner: 'موک ڈیٹا موڈ — مقامی ڈیٹا۔',
    totalStaff: (n) => `${n} کل عملہ`,
    saving: 'محفوظ ہو رہا ہے…', noStaff: 'کوئی عملہ نہیں ملا۔',
    fetchError: 'ڈیٹا لوڈ نہیں ہوا۔', active: 'فعال', inactive: 'غیر فعال', leave: 'چھٹی پر',
  },
  es: {
    title: 'Gestión de Personal', loadingText: 'Cargando personal...',
    addStaff: 'Agregar Personal', editStaff: 'Editar Miembro', addStaffTitle: 'Agregar Nuevo Miembro',
    searchPlaceholder: 'Buscar por nombre, rol o centro...',
    name: 'Nombre', role: 'Rol', centre: 'Centro', status: 'Estado', phone: 'Teléfono',
    joinDate: 'Fecha de Ingreso', salary: 'Salario', notes: 'Notas', actions: 'Acciones',
    fullName: 'Nombre Completo', centreBranch: 'Centro / Sucursal', phoneNumber: 'Teléfono',
    salaryLabel: 'Salario Mensual (opcional)', notesLabel: 'Notas (opcional)',
    cancel: 'Cancelar', save: 'Guardar Cambios', add: 'Agregar Miembro', delete: 'Eliminar',
    activate: 'Activar', deactivate: 'Desactivar', onLeave: 'De Licencia',
    confirmDelete: (n) => `¿Eliminar a ${n}?`,
    mockBadge: 'Datos de Prueba', mockBanner: 'MODO DE PRUEBA — Datos locales.',
    totalStaff: (n) => `${n} miembros en total`,
    saving: 'Guardando…', noStaff: 'No se encontró personal.',
    fetchError: 'No se pudo cargar.', active: 'Activo', inactive: 'Inactivo', leave: 'De Licencia',
  },
  pt: {
    title: 'Gestão de Pessoal', loadingText: 'Carregando...',
    addStaff: 'Adicionar', editStaff: 'Editar Membro', addStaffTitle: 'Adicionar Novo Membro',
    searchPlaceholder: 'Pesquisar por nome, função ou centro...',
    name: 'Nome', role: 'Função', centre: 'Centro', status: 'Estado', phone: 'Telefone',
    joinDate: 'Data de Entrada', salary: 'Salário', notes: 'Notas', actions: 'Ações',
    fullName: 'Nome Completo', centreBranch: 'Centro / Filial', phoneNumber: 'Telefone',
    salaryLabel: 'Salário Mensal (opcional)', notesLabel: 'Notas (opcional)',
    cancel: 'Cancelar', save: 'Salvar Alterações', add: 'Adicionar Membro', delete: 'Remover',
    activate: 'Ativar', deactivate: 'Desativar', onLeave: 'De Licença',
    confirmDelete: (n) => `Remover ${n}?`,
    mockBadge: 'Dados de Teste', mockBanner: 'MODO DE TESTE — Dados locais.',
    totalStaff: (n) => `${n} membros no total`,
    saving: 'Salvando…', noStaff: 'Nenhum membro encontrado.',
    fetchError: 'Falha ao carregar.', active: 'Ativo', inactive: 'Inativo', leave: 'De Licença',
  },
};

const EMPTY_FORM = { name: '', role: 'Aapa / Mualima', centre: '', phone: '', joinDate: '', salary: '', notes: '', status: 'Active' };

function StaffModal({ member, onClose, onSave, t, userCentre, saving }) {
  const [form, setForm] = useState(member
    ? { name: member.name, role: member.role, centre: member.centre, phone: member.phone || '', joinDate: member.joinDate || '', salary: member.salary || '', notes: member.notes || '', status: member.status }
    : { ...EMPTY_FORM, centre: userCentre || '' }
  );
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 520, width: '95%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>{member ? t.editStaff : t.addStaffTitle}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>{t.fullName} *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Fatima Patel" />
            </div>
            <div className="form-group">
              <label>{t.role}</label>
              <select value={form.role} onChange={e => set('role', e.target.value)}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>{t.status}</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>{t.centreBranch} *</label>
              <input value={form.centre} onChange={e => set('centre', e.target.value)} required placeholder="e.g. Ext. 1 (Lenasia)" />
            </div>
            <div className="form-group">
              <label>{t.phoneNumber}</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0300-0000000" />
            </div>
            <div className="form-group">
              <label>{t.joinDate}</label>
              <input type="date" value={form.joinDate} onChange={e => set('joinDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label>{t.salaryLabel}</label>
              <input type="number" value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="0.00" min="0" />
            </div>
            <div className="form-group">
              <label>{t.notesLabel}</label>
              <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional notes..." />
            </div>
          </div>
          <div className="modal-actions" style={{ marginTop: 20 }}>
            <button type="button" className="button-secondary" onClick={onClose} disabled={saving}>{t.cancel}</button>
            <button type="submit" className="button-primary" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
              {saving ? t.saving : (member ? t.save : t.add)}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onClose, t, saving }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 12 }}>Confirm</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 20, lineHeight: 1.5 }}>{message}</p>
        <div className="modal-actions">
          <button className="button-secondary" onClick={onClose} disabled={saving}>{t.cancel}</button>
          <button className="button-danger" onClick={onConfirm} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            {saving ? t.saving : t.delete}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StaffManagement({ user, isDev: isDevProp, language }) {
  const t = T[language] || T.en;
  const isDev = (() => {
    if (isDevProp === true) return true;
    if (user?.isDev === true) return true;
    try { return JSON.parse(localStorage.getItem('haazimi_user') || '{}').isDev === true; } catch { return false; }
  })();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (isDev) { setStaff(INITIAL_STAFF.map(s => ({ ...s, centre: s.center || s.centre || '', salary: '', notes: '' }))); setLoading(false); }
    else loadStaff();
  }, [isDev]);

  useEffect(() => {
    const close = () => setOpenMenu(null);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getCentreStaff&t=${Date.now()}`);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : (data.staff || []);
      setStaff(rows.map(r => ({
        id: r.id || r.ID,
        name: r.name || r.Name || '',
        role: r.role || r.Role || '',
        centre: r.centre || r.Centre || '',
        phone: r.phone || r.Phone || '',
        joinDate: r.joinDate || r.JoinDate || r['join date'] || '',
        salary: r.salary || r.Salary || '',
        notes: r.notes || r.Notes || '',
        status: r.status || r.Status || 'Active',
      })));
    } catch {
      setFetchError(t.fetchError);
      setStaff(INITIAL_STAFF.map(s => ({ ...s, centre: s.center || s.centre || '', salary: '', notes: '' })));
    } finally { setLoading(false); }
  };

  const postToSheets = async (payload) => {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  const handleAdd = async (form) => {
    setSaving(true);
    const newMember = { id: String(Date.now()), ...form };
    setStaff(s => [newMember, ...s]);
    setShowModal(false);
    if (!isDev) {
      try { await postToSheets({ type: 'addCentreStaff', ...newMember }); } catch {}
    }
    setSaving(false);
  };

  const handleEdit = async (form) => {
    setSaving(true);
    setStaff(s => s.map(m => m.id === editMember.id ? { ...m, ...form } : m));
    setShowModal(false);
    setEditMember(null);
    if (!isDev) {
      try { await postToSheets({ type: 'updateCentreStaff', id: editMember.id, ...form }); } catch {}
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setSaving(true);
    const id = confirmDelete.id;
    setStaff(s => s.filter(m => m.id !== id));
    setConfirmDelete(null);
    if (!isDev) {
      try { await postToSheets({ type: 'deleteCentreStaff', id }); } catch {}
    }
    setSaving(false);
  };

  const handleStatusChange = async (member, newStatus) => {
    setStaff(s => s.map(m => m.id === member.id ? { ...m, status: newStatus } : m));
    setOpenMenu(null);
    if (!isDev) {
      try { await postToSheets({ type: 'updateCentreStaff', id: member.id, status: newStatus }); } catch {}
    }
  };

  const filtered = staff.filter(s =>
    [s.name, s.role, s.centre].some(v => (v || '').toLowerCase().includes(search.toLowerCase()))
  );

  const statusBadgeClass = (s) => s === 'Active' ? 'status-completed' : s === 'On Leave' ? 'status-in-progress' : 'status-incomplete';

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400 }}>
      <Loader2 className="animate-spin" size={48} style={{ color: 'var(--accent-color)', marginBottom: 16 }} />
      <p style={{ color: 'var(--text-secondary)' }}>{t.loadingText}</p>
    </div>
  );

  return (
    <div>
      <style>{`
        .dev-badge { display:inline-flex;align-items:center;gap:5px;background:#fbbf24;color:#1c1917;border:2px solid #f59e0b;padding:3px 10px;border-radius:6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-left:12px; }
        .dev-mode-banner { background:linear-gradient(90deg,#fef3c7,#fde68a);border:1px solid #fbbf24;border-radius:8px;padding:8px 14px;margin-bottom:16px;font-size:13px;font-weight:600;color:#78350f; }
        .sm-table { width:100%;border-collapse:collapse; }
        .sm-table th { text-align:left;padding:10px 12px;font-size:.75rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid var(--border-color); }
        .sm-table td { padding:12px;border-bottom:1px solid var(--border-color);font-size:.88rem;vertical-align:middle; }
        .sm-table tr:last-child td { border-bottom:none; }
        .sm-table tr:hover td { background:var(--hover-bg, rgba(0,0,0,.03)); }
        .sm-role-pill { display:inline-block;padding:2px 10px;border-radius:20px;background:var(--accent-color-light,#e0e7ff);color:var(--accent-color);font-size:.75rem;font-weight:600; }
        .sm-action-btn { background:none;border:1px solid var(--border-color);border-radius:6px;padding:5px 10px;cursor:pointer;font-size:.78rem;font-weight:500;color:var(--text-secondary);transition:all .15s;display:flex;align-items:center;gap:4px; }
        .sm-action-btn:hover { background:var(--accent-color);color:#fff;border-color:var(--accent-color); }
        .sm-action-btn.danger:hover { background:#ef4444;color:#fff;border-color:#ef4444; }
        .sm-actions-cell { display:flex;gap:6px;align-items:center; }
        @media(max-width:680px){.sm-hide{display:none!important}}
      `}</style>

      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <h2>{t.title}</h2>
            {isDev && <span className="dev-badge">{t.mockBadge}</span>}
          </div>
          <p>{t.totalStaff(staff.length)}</p>
        </div>
        <button className="button-primary icon-button" onClick={() => { setEditMember(null); setShowModal(true); }}>
          <Plus size={18} /> {t.addStaff}
        </button>
      </div>

      {isDev && <div className="dev-mode-banner">{t.mockBanner}</div>}
      {fetchError && <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: '.83rem', color: '#92400e' }}>{fetchError}</div>}

      <div className="table-container">
        <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center' }}>
          <Search size={17} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '9px 12px', border: '1px solid var(--border-color)', borderRadius: 8, background: 'var(--input-bg)', color: 'var(--text-primary)', fontSize: '.88rem' }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="sm-table">
            <thead>
              <tr>
                <th>{t.name}</th>
                <th>{t.role}</th>
                <th className="sm-hide">{t.centre}</th>
                <th>{t.status}</th>
                <th className="sm-hide">{t.phone}</th>
                <th className="sm-hide">{t.joinDate}</th>
                <th>{t.actions}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 32 }}>{t.noStaff}</td></tr>
              ) : filtered.map(member => (
                <tr key={member.id}>
                  <td>
                    <strong style={{ display: 'block' }}>{member.name}</strong>
                    {member.notes && <span style={{ fontSize: '.73rem', color: 'var(--text-secondary)' }}>{member.notes}</span>}
                  </td>
                  <td><span className="sm-role-pill">{member.role}</span></td>
                  <td className="sm-hide">{member.centre || '—'}</td>
                  <td>
                    <span className={`status-badge ${statusBadgeClass(member.status)}`}>{member.status}</span>
                  </td>
                  <td className="sm-hide">{member.phone || '—'}</td>
                  <td className="sm-hide">{member.joinDate || '—'}</td>
                  <td>
                    <div className="sm-actions-cell">
                      <button className="sm-action-btn" onClick={() => { setEditMember(member); setShowModal(true); }} title={t.edit}>
                        <Edit2 size={13} />
                      </button>
                      <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                        <button className="sm-action-btn" onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)} title="Status">
                          <ChevronDown size={13} />
                        </button>
                        {openMenu === member.id && (
                          <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: 8, boxShadow: '0 4px 16px var(--shadow-color)', zIndex: 50, minWidth: 130, overflow: 'hidden' }}>
                            {STATUSES.filter(s => s !== member.status).map(s => (
                              <button key={s} onClick={() => handleStatusChange(member, s)}
                                style={{ width: '100%', textAlign: 'left', padding: '9px 14px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '.83rem', color: 'var(--text-primary)' }}
                                onMouseEnter={e => e.target.style.background = 'var(--hover-bg, rgba(0,0,0,.05))'}
                                onMouseLeave={e => e.target.style.background = 'none'}
                              >
                                {s === 'Active' ? <UserCheck size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} /> : <UserX size={13} style={{ marginRight: 6, verticalAlign: 'middle' }} />}
                                {s}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <button className="sm-action-btn danger" onClick={() => setConfirmDelete(member)} title={t.delete}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <StaffModal
          member={editMember}
          onClose={() => { setShowModal(false); setEditMember(null); }}
          onSave={editMember ? handleEdit : handleAdd}
          t={t}
          userCentre={user?.centre || user?.center || ''}
          saving={saving}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={t.confirmDelete(confirmDelete.name)}
          onConfirm={handleDelete}
          onClose={() => setConfirmDelete(null)}
          t={t}
          saving={saving}
        />
      )}
    </div>
  );
}
