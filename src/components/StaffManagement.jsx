import { useState, useEffect } from 'react';
import { Plus, MoreVertical, Search, Loader2 } from 'lucide-react';
import { STAFF as INITIAL_STAFF } from '../data/mockData';
import { GOOGLE_SCRIPT_URL } from '../data/config';

const T = {
  en: {
    title: 'Staff Management', loadingText: 'Loading staff directory...',
    addStaff: 'Add Staff', addStaffTitle: 'Add New Staff Member', searchPlaceholder: 'Search staff by name, role, or center...',
    name: 'Name', role: 'Role', center: 'Center', status: 'Status', phone: 'Phone', joinDate: 'Join Date', leaves: 'Leaves', actions: 'Actions',
    fullName: 'Full Name', centerBranch: 'Center / Branch', phoneNumber: 'Phone Number',
    cancel: 'Cancel', confirm: 'Confirm', confirmAction: 'Confirm Action',
    deactivate: 'Deactivate', activate: 'Activate', remove: 'Remove',
    confirmRemove: (name) => `Are you sure you want to remove ${name}?`,
    mockBadge: '⚗ Mock Data Active', mockBanner: '⚗ MOCK DATA MODE — Showing local sample data. No live API calls are being made.',
    totalStaff: (n) => `${n} total staff members`,
  },
  ar: {
    title: 'إدارة الموظفين', loadingText: 'جارٍ تحميل دليل الموظفين...',
    addStaff: 'إضافة موظف', addStaffTitle: 'إضافة موظف جديد', searchPlaceholder: 'ابحث عن موظف بالاسم أو الدور أو المركز...',
    name: 'الاسم', role: 'الدور', center: 'المركز', status: 'الحالة', phone: 'الهاتف', joinDate: 'تاريخ الانضمام', leaves: 'الإجازات', actions: 'إجراءات',
    fullName: 'الاسم الكامل', centerBranch: 'المركز / الفرع', phoneNumber: 'رقم الهاتف',
    cancel: 'إلغاء', confirm: 'تأكيد', confirmAction: 'تأكيد الإجراء',
    deactivate: 'تعطيل', activate: 'تفعيل', remove: 'حذف',
    confirmRemove: (name) => `هل أنت متأكد من حذف ${name}؟`,
    mockBadge: '⚗ بيانات تجريبية', mockBanner: '⚗ وضع البيانات التجريبية — عرض بيانات نموذجية محلية.',
    totalStaff: (n) => `${n} موظف إجمالي`,
  },
  ur: {
    title: 'عملہ انتظام', loadingText: 'عملے کی فہرست لوڈ ہو رہی ہے...',
    addStaff: 'عملہ شامل کریں', addStaffTitle: 'نیا عملہ شامل کریں', searchPlaceholder: 'نام، کردار، یا مرکز سے تلاش کریں...',
    name: 'نام', role: 'کردار', center: 'مرکز', status: 'حالت', phone: 'فون', joinDate: 'شمولیت کی تاریخ', leaves: 'چھٹیاں', actions: 'اقدامات',
    fullName: 'پورا نام', centerBranch: 'مرکز / برانچ', phoneNumber: 'فون نمبر',
    cancel: 'منسوخ', confirm: 'تصدیق کریں', confirmAction: 'اقدام کی تصدیق',
    deactivate: 'غیر فعال کریں', activate: 'فعال کریں', remove: 'ہٹائیں',
    confirmRemove: (name) => `کیا آپ واقعی ${name} کو ہٹانا چاہتے ہیں؟`,
    mockBadge: '⚗ موک ڈیٹا فعال', mockBanner: '⚗ موک ڈیٹا موڈ — مقامی نمونہ ڈیٹا دکھایا جا رہا ہے۔',
    totalStaff: (n) => `${n} کل عملہ`,
  },
  es: {
    title: 'Gestión de Personal', loadingText: 'Cargando directorio de personal...',
    addStaff: 'Agregar Personal', addStaffTitle: 'Agregar Nuevo Miembro', searchPlaceholder: 'Buscar personal por nombre, rol o centro...',
    name: 'Nombre', role: 'Rol', center: 'Centro', status: 'Estado', phone: 'Teléfono', joinDate: 'Fecha de Ingreso', leaves: 'Licencias', actions: 'Acciones',
    fullName: 'Nombre Completo', centerBranch: 'Centro / Sucursal', phoneNumber: 'Número de Teléfono',
    cancel: 'Cancelar', confirm: 'Confirmar', confirmAction: 'Confirmar Acción',
    deactivate: 'Desactivar', activate: 'Activar', remove: 'Eliminar',
    confirmRemove: (name) => `¿Está seguro de que desea eliminar a ${name}?`,
    mockBadge: '⚗ Datos de Prueba', mockBanner: '⚗ MODO DE DATOS DE PRUEBA — Mostrando datos de muestra locales.',
    totalStaff: (n) => `${n} miembros del personal en total`,
  },
  pt: {
    title: 'Gestão de Pessoal', loadingText: 'Carregando diretório de pessoal...',
    addStaff: 'Adicionar Pessoal', addStaffTitle: 'Adicionar Novo Membro', searchPlaceholder: 'Pesquisar pessoal por nome, função ou centro...',
    name: 'Nome', role: 'Função', center: 'Centro', status: 'Estado', phone: 'Telefone', joinDate: 'Data de Entrada', leaves: 'Licenças', actions: 'Ações',
    fullName: 'Nome Completo', centerBranch: 'Centro / Filial', phoneNumber: 'Número de Telefone',
    cancel: 'Cancelar', confirm: 'Confirmar', confirmAction: 'Confirmar Ação',
    deactivate: 'Desativar', activate: 'Ativar', remove: 'Remover',
    confirmRemove: (name) => `Tem certeza de que deseja remover ${name}?`,
    mockBadge: '⚗ Dados de Teste', mockBanner: '⚗ MODO DE DADOS DE TESTE — Exibindo dados de amostra locais.',
    totalStaff: (n) => `${n} membros do pessoal no total`,
  },
};

function AddStaffModal({ onClose, onAdd, t }) {
  const [form, setForm] = useState({ name: '', role: 'Staff', center: '', phone: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd({ 
      ...form, 
      id: Date.now(), 
      status: 'Active', 
      joinDate: new Date().toISOString().split('T')[0], 
      leaves: 0 
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{t.addStaffTitle}</h3>
        <form onSubmit={handleSubmit}>
          <div className="add-staff-form">
            <div className="form-group">
              <label>{t.fullName}</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} required placeholder="e.g. Muhammad Haffejee" />
            </div>
            <div className="form-group">
              <label>{t.role}</label>
              <select value={form.role} onChange={e => set('role', e.target.value)}>
                <option>Teacher</option>
                <option>Admin</option>
                <option>Coordinator</option>
                <option>Support</option>
              </select>
            </div>
            <div className="form-group">
              <label>{t.centerBranch}</label>
              <input value={form.center} onChange={e => set('center', e.target.value)} required placeholder="e.g. Branch A" />
            </div>
            <div className="form-group">
              <label>{t.phoneNumber}</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="0300-0000000" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="button-secondary" onClick={onClose}>{t.cancel}</button>
            <button type="submit" className="button-primary">{t.addStaff}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onClose, t }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h3>{t.confirmAction}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="button-secondary" onClick={onClose}>{t.cancel}</button>
          <button className="button-danger" onClick={onConfirm}>{t.confirm}</button>
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
    try {
      const stored = JSON.parse(localStorage.getItem('haazimi_user') || '{}');
      return stored.isDev === true;
    } catch { return false; }
  })();

  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (isDev) {
      setStaff(INITIAL_STAFF);
      setLoading(false);
    } else {
      loadLiveStaff();
    }
  }, [isDev]);

  const loadLiveStaff = async () => {
    if (isDev) return;
    setLoading(true);
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getUsers&t=${Date.now()}`);
      const data = await res.json();
      const liveData = (Array.isArray(data) ? data : (data.users || [])).map(u => ({
        id: u.Email || Math.random(),
        name: u.Name || 'Unknown',
        role: u.Role || 'Staff',
        center: u.Centre || u.Country || 'Main',
        status: u.Status || 'Active',
        phone: u.Phone || '-',
        joinDate: u.JoinDate || '-',
        leaves: u.Leaves || 0
      }));
      if (!isDev) setStaff(liveData);
    } catch (err) {
      console.error("Cloud fetch failed:", err);
      if (!isDev) setStaff([]);
    } finally {
      if (!isDev) setLoading(false);
    }
  };

  const filtered = staff.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.role || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.center || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id) => {
    setStaff(s => s.filter(m => m.id !== id));
    setConfirmDelete(null);
    setOpenMenu(null);
  };

  const toggleStatus = (id) => {
    setStaff(s => s.map(m => m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' : 'Active' } : m));
    setOpenMenu(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <Loader2 className="animate-spin" size={48} style={{ color: 'var(--primary-color)', marginBottom: 16 }} />
        <p style={{ color: 'var(--subtle-text-color)', fontSize: '1.1rem' }}>{t.loadingText}</p>
      </div>
    );
  }

  return (
    <div>
      <style>{`
        .dev-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: #fbbf24;
          color: #1c1917;
          border: 2px solid #f59e0b;
          padding: 3px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-left: 12px;
          box-shadow: 0 0 0 3px rgba(251,191,36,0.3);
          animation: dev-pulse 2s infinite;
        }
        @keyframes dev-pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(251,191,36,0.3); }
          50% { box-shadow: 0 0 0 6px rgba(251,191,36,0.1); }
        }
        .dev-mode-banner {
          background: linear-gradient(90deg, #fef3c7, #fde68a);
          border: 1px solid #fbbf24;
          border-radius: 8px;
          padding: 8px 14px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #78350f;
        }
      `}</style>

      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h2>{t.title}</h2>
            {isDev && <span className="dev-badge">{t.mockBadge}</span>}
          </div>
          <p>{t.totalStaff(staff.length)}</p>
        </div>
        <button className="button-primary icon-button" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> {t.addStaff}
        </button>
      </div>

      {isDev && (
        <div className="dev-mode-banner">
          {t.mockBanner}
        </div>
      )}

      <div className="table-container">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <Search size={18} style={{ color: 'var(--subtle-text-color)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: 8, background: 'var(--input-bg)', color: 'var(--text-dark)' }}
          />
        </div>
        <table className="staff-table">
          <thead>
            <tr>
              <th>{t.name}</th><th>{t.role}</th><th>{t.center}</th><th>{t.status}</th><th>{t.phone}</th><th>{t.joinDate}</th><th>{t.leaves}</th><th>{t.actions}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(member => (
              <tr key={member.id}>
                <td><strong>{member.name}</strong></td>
                <td>{member.role}</td>
                <td>{member.center}</td>
                <td>
                  <span className={`status-badge ${member.status === 'Active' ? 'status-completed' : member.status === 'On Leave' ? 'status-in-progress' : 'status-incomplete'}`}>
                    {member.status}
                  </span>
                </td>
                <td>{member.phone}</td>
                <td>{member.joinDate}</td>
                <td>{member.leaves}</td>
                <td className="actions-cell">
                  <button className="action-button" onClick={() => setOpenMenu(openMenu === member.id ? null : member.id)}>
                    <MoreVertical size={18} />
                  </button>
                  {openMenu === member.id && (
                    <div className="actions-dropdown">
                      <button onClick={() => toggleStatus(member.id)}>
                        {member.status === 'Active' ? t.deactivate : t.activate}
                      </button>
                      <button className="danger-action" onClick={() => { setConfirmDelete(member); setOpenMenu(null); }}>
                        {t.remove}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && <AddStaffModal onClose={() => setShowAdd(false)} onAdd={m => setStaff(s => [...s, m])} t={t} />}
      {confirmDelete && (
        <ConfirmModal
          message={t.confirmRemove(confirmDelete.name)}
          onConfirm={() => handleDelete(confirmDelete.id)}
          onClose={() => setConfirmDelete(null)}
          t={t}
        />
      )}
    </div>
  );
}
