import { useState, useEffect } from 'react';
import { GOOGLE_SCRIPT_URL, COUNTRY_CENTRES } from '../data/config';
import { Shield, RefreshCw, PlusCircle, AlertCircle, UserCheck, Users, AlertTriangle, DollarSign, ChevronDown, ChevronRight, Receipt, CheckCircle, XCircle, Edit2, Save, X, Trash2 } from 'lucide-react';
import { RED_FLAGS, BUDGET_ITEMS } from '../data/mockData';

const ROLES = ['Staff', 'Centre Manager', 'Country Admin', 'Super Admin'];
const STATUSES = ['Approved', 'Denied', 'Pending'];

const T = {
  en: { title: 'Admin Command Centre', sub: 'Manage all registered users', refresh: 'Refresh', name: 'Name', email: 'Email', role: 'Role', country: 'Country', centre: 'Centre', status: 'Status', noUsers: 'No users found — check your Google Sheet connection.', addCentre: 'Add Centre', managecentres: 'Manage Centres', saved: 'Saved!', loadErr: 'Could not load users from server.', awaiting: 'users awaiting approval', pendingReg: 'Pending Registrations', birdseye: "Bird's Eye View", totalStudents: 'Total Students', activeFlags: 'Active Red Flags', budgetVsActual: 'Budget vs. Actual', userList: 'User List', reimbTitle: 'Reimbursement Requests', reimbNone: 'No pending reimbursement requests.', reimbApprove: 'Approve', reimbReject: 'Reject', reimbPurpose: 'Purpose', reimbDist: 'Distance', reimbTotal: 'Total', reimbStaff: 'Staff', reimbDate: 'Date', reimbStatus: 'Status', auditTitle: 'Audit Trail', auditNone: 'No audit records yet.', approve: 'Approve', deny: 'Deny', approving: 'Approving...', editName: 'Edit name', editCentre: 'Edit centre', actions: 'Actions', deleteUser: 'Delete user', deleteConfirm: 'Delete', deleteCancel: 'Cancel', deleteMsg: 'Are you sure you want to delete' },
  ar: { title: 'مركز إدارة المسؤولين', sub: 'إدارة جميع المستخدمين', refresh: 'تحديث', name: 'الاسم', email: 'البريد', role: 'الدور', country: 'البلد', centre: 'المركز', status: 'الحالة', noUsers: 'لا يوجد مستخدمون.', addCentre: 'إضافة مركز', managecentres: 'إدارة المراكز', saved: 'تم!', loadErr: 'خطأ في تحميل المستخدمين.', awaiting: 'بانتظار الموافقة', pendingReg: 'طلبات التسجيل المعلقة', birdseye: 'نظرة شاملة', totalStudents: 'إجمالي الطلاب', activeFlags: 'تنبيهات نشطة', budgetVsActual: 'الميزانية مقابل الفعلي', userList: 'قائمة المستخدمين', reimbTitle: 'طلبات التعويض', reimbNone: 'لا توجد طلبات تعويض معلقة.', reimbApprove: 'موافقة', reimbReject: 'رفض', reimbPurpose: 'الغرض', reimbDist: 'المسافة', reimbTotal: 'المجموع', reimbStaff: 'الموظف', reimbDate: 'التاريخ', reimbStatus: 'الحالة', auditTitle: 'سجل التدقيق', auditNone: 'لا توجد سجلات تدقيق بعد.', approve: 'موافقة', deny: 'رفض', approving: 'جارٍ...', editName: 'تعديل الاسم', editCentre: 'تعديل المركز', actions: 'إجراءات', deleteUser: 'حذف', deleteConfirm: 'حذف', deleteCancel: 'إلغاء', deleteMsg: 'هل أنت متأكد من حذف' },
  ur: { title: 'ایڈمن کمانڈ سینٹر', sub: 'تمام صارفین کا انتظام', refresh: 'تازہ کریں', name: 'نام', email: 'ای میل', role: 'کردار', country: 'ملک', centre: 'مرکز', status: 'حیثیت', noUsers: 'کوئی صارف نہیں ملا۔', addCentre: 'مرکز شامل کریں', managecentres: 'مراکز کا انتظام', saved: 'محفوظ!', loadErr: 'سرور سے لوڈ نہیں ہوا۔', awaiting: 'منظوری کے منتظر', pendingReg: 'زیر التواء رجسٹریشن', birdseye: 'مکمل جائزہ', totalStudents: 'کل طلبہ', activeFlags: 'فعال ریڈ فلیگز', budgetVsActual: 'بجٹ بنام اصل', userList: 'صارفین کی فہرست', reimbTitle: 'معاوضہ درخواستیں', reimbNone: 'کوئی زیر التواء معاوضہ درخواست نہیں۔', reimbApprove: 'منظور', reimbReject: 'مسترد', reimbPurpose: 'مقصد', reimbDist: 'فاصلہ', reimbTotal: 'کل', reimbStaff: 'عملہ', reimbDate: 'تاریخ', reimbStatus: 'حالت', auditTitle: 'آڈٹ ریکارڈ', auditNone: 'ابھی تک کوئی آڈٹ ریکارڈ نہیں۔', approve: 'منظور', deny: 'مسترد', approving: 'جاری...', editName: 'نام ترمیم', editCentre: 'مرکز ترمیم', actions: 'اقدامات', deleteUser: 'حذف کریں', deleteConfirm: 'حذف', deleteCancel: 'منسوخ', deleteMsg: 'کیا آپ واقعی حذف کرنا چاہتے ہیں' },
  es: { title: 'Centro de Comando Admin', sub: 'Gestionar todos los usuarios', refresh: 'Actualizar', name: 'Nombre', email: 'Correo', role: 'Rol', country: 'País', centre: 'Centro', status: 'Estado', noUsers: 'No se encontraron usuarios.', addCentre: 'Añadir Centro', managecentres: 'Gestionar Centros', saved: '¡Guardado!', loadErr: 'Error cargando usuarios.', awaiting: 'usuarios esperando aprobación', pendingReg: 'Registros Pendientes', birdseye: 'Vista General', totalStudents: 'Total Estudiantes', activeFlags: 'Alertas Activas', budgetVsActual: 'Presupuesto vs. Real', userList: 'Lista de Usuarios', reimbTitle: 'Solicitudes de Reembolso', reimbNone: 'No hay solicitudes de reembolso pendientes.', reimbApprove: 'Aprobar', reimbReject: 'Rechazar', reimbPurpose: 'Propósito', reimbDist: 'Distancia', reimbTotal: 'Total', reimbStaff: 'Personal', reimbDate: 'Fecha', reimbStatus: 'Estado', auditTitle: 'Registro de Auditoría', auditNone: 'Sin registros de auditoría aún.', approve: 'Aprobar', deny: 'Rechazar', approving: 'Procesando...', editName: 'Editar nombre', editCentre: 'Editar centro', actions: 'Acciones', deleteUser: 'Eliminar', deleteConfirm: 'Eliminar', deleteCancel: 'Cancelar', deleteMsg: '¿Seguro que deseas eliminar a' },
  pt: { title: 'Centro de Comando Admin', sub: 'Gerenciar todos os usuários', refresh: 'Atualizar', name: 'Nome', email: 'Email', role: 'Função', country: 'País', centre: 'Centro', status: 'Status', noUsers: 'Nenhum usuário encontrado.', addCentre: 'Adicionar Centro', managecentres: 'Gerenciar Centros', saved: 'Salvo!', loadErr: 'Erro ao carregar usuários.', awaiting: 'usuários aguardando aprovação', pendingReg: 'Registros Pendentes', birdseye: 'Visão Geral', totalStudents: 'Total de Alunos', activeFlags: 'Alertas Ativas', budgetVsActual: 'Orçamento vs. Real', userList: 'Lista de Usuários', reimbTitle: 'Solicitações de Reembolso', reimbNone: 'Nenhuma solicitação de reembolso pendente.', reimbApprove: 'Aprobar', reimbReject: 'Rejeitar', reimbPurpose: 'Propósito', reimbDist: 'Distância', reimbTotal: 'Total', reimbStaff: 'Funcionário', reimbDate: 'Data', reimbStatus: 'Status', auditTitle: 'Registro de Auditoria', auditNone: 'Sem registros de auditoria ainda.', approve: 'Aprovar', deny: 'Rejeitar', approving: 'Processando...', editName: 'Editar nome', editCentre: 'Editar centro', actions: 'Ações', deleteUser: 'Excluir', deleteConfirm: 'Excluir', deleteCancel: 'Cancelar', deleteMsg: 'Tem certeza que deseja excluir' },
};

export default function AdminPanel({ user, language }) {
  const t = T[language] || T.en;

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(null);
  const [centreInputs, setCentreInputs] = useState({});
  const [customCentres, setCustomCentres] = useState(() => {
    try { return JSON.parse(localStorage.getItem('haazimi_custom_centres') || '{}'); } catch { return {}; }
  });
  const [successMsg, setSuccessMsg] = useState('');
  const [centresOpen, setCentresOpen] = useState(false);

  // Inline editing state
  const [editingCell, setEditingCell] = useState(null); // { email, field }
  const [editValue, setEditValue] = useState('');

  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState(null); // user object to delete

  // Local registrations state (re-read from localStorage each render)
  const [localAccounts, setLocalAccounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('haazimi_accounts') || '[]'); } catch { return []; }
  });
  const [approvingLocal, setApprovingLocal] = useState(null);

  const [reimbursements, setReimbursements] = useState(() => {
    try { return JSON.parse(localStorage.getItem('haazimi_reimbursements') || '[]'); } catch { return []; }
  });

  const _adminCountry = user?.country || user?.Country || '';
  const localPendingRegs = localAccounts.filter(u =>
    (!u.status || u.status === 'Pending') &&
    (!_adminCountry || (u.country || u.Country || '').toLowerCase() === _adminCountry.toLowerCase())
  );

  const totalStudents = 9;
  const activeRedFlags = RED_FLAGS.length;
  const totalBudgeted = BUDGET_ITEMS.reduce((s, b) => s + b.budgeted, 0);
  const totalSpent = BUDGET_ITEMS.reduce((s, b) => s + b.spent, 0);
  const budgetVariance = totalBudgeted - totalSpent;

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getUsers&t=${Date.now()}`, { mode: 'cors' });
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : (data.users || []));
    } catch {
      setError(t.loadErr);
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const saveFlash = (msg) => {
    setSuccessMsg(msg || t.saved);
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  // Approve or deny a local (localStorage) pending registration globally via GSheets
  const handleLocalRegistration = async (localUser, newStatus) => {
    let reason = '';
    if (newStatus === 'Denied') {
      reason = window.prompt('Reason for denial (optional):') || '';
    }
    setApprovingLocal(localUser.email);
    try {
      // Send to Google Sheets — this is the cross-device approval
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'updateUser',
          email: localUser.email,
          status: newStatus,
          reason,
          // Also send all registration info in case GSheets needs to create the record
          name: localUser.name,
          role: localUser.role || 'Staff',
          country: localUser.country || '',
          centre: localUser.centre || '',
          password: localUser.password || '',
        }),
      });
    } catch {}

    // Update localStorage so this device reflects the change
    const updated = localAccounts.map(u =>
      u.email === localUser.email ? { ...u, status: newStatus } : u
    );
    setLocalAccounts(updated);
    localStorage.setItem('haazimi_accounts', JSON.stringify(updated));

    setApprovingLocal(null);
    saveFlash(newStatus === 'Approved' ? `${localUser.name} approved!` : `${localUser.name} denied.`);

    // Refresh GSheets users list so the newly approved user appears there
    fetchUsers();
  };

  // Persist role/status/name/centre overrides locally so they survive GSheets sync gaps
  const saveOverride = (email, field, value) => {
    try {
      const overrides = JSON.parse(localStorage.getItem('haazimi_user_overrides') || '{}');
      const normalizedEmail = email.toLowerCase();
      overrides[normalizedEmail] = { ...(overrides[normalizedEmail] || {}), [field]: value };
      localStorage.setItem('haazimi_user_overrides', JSON.stringify(overrides));
    } catch {}
  };

  const updateUser = async (u, field, newValue) => {
    const email = u.Email || u.email;
    let reason = '';
    if (field === 'status' && newValue === 'Denied') {
      reason = window.prompt('Reason for denial (optional):') || '';
    }
    setUpdating(email + '_' + field);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'updateUser', email, [field]: newValue, reason }),
      });
      // Save override locally so login always gets the correct role/status even if GSheets lags
      saveOverride(email, field, newValue);
      // Also update haazimi_accounts if this user is registered locally
      try {
        const accounts = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
        const updated = accounts.map(a =>
          (a.email || '').toLowerCase() === email.toLowerCase()
            ? { ...a, [field]: newValue }
            : a
        );
        localStorage.setItem('haazimi_accounts', JSON.stringify(updated));
      } catch {}
      setUsers(prev => prev.map(x => {
        const xEmail = x.Email || x.email;
        if (xEmail !== email) return x;
        const cap = field.charAt(0).toUpperCase() + field.slice(1);
        return { ...x, [cap]: newValue, [field]: newValue };
      }));
      saveFlash();
    } catch (e) { console.error('Update failed', e); }
    setUpdating(null);
  };

  const deleteUser = async (u) => {
    const email = u.Email || u.email;
    setUpdating(email + '_delete');
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'deleteUser', email }),
      });
    } catch {}
    // Remove from local overrides
    try {
      const overrides = JSON.parse(localStorage.getItem('haazimi_user_overrides') || '{}');
      delete overrides[email.toLowerCase()];
      localStorage.setItem('haazimi_user_overrides', JSON.stringify(overrides));
    } catch {}
    // Remove from haazimi_accounts if present
    try {
      const accounts = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
      const filtered = accounts.filter(a => (a.email || '').toLowerCase() !== email.toLowerCase());
      localStorage.setItem('haazimi_accounts', JSON.stringify(filtered));
      setLocalAccounts(filtered);
    } catch {}
    setUsers(prev => prev.filter(x => (x.Email || x.email) !== email));
    setConfirmDelete(null);
    setUpdating(null);
    saveFlash(`${u.Name || u.name || email} deleted.`);
  };

  const startEdit = (email, field, currentValue) => {
    setEditingCell({ email, field });
    setEditValue(currentValue || '');
  };

  const cancelEdit = () => {
    setEditingCell(null);
    setEditValue('');
  };

  const saveEdit = async (u) => {
    if (!editingCell) return;
    const { field } = editingCell;
    const trimmed = editValue.trim();
    if (!trimmed) { cancelEdit(); return; }
    await updateUser(u, field, trimmed);
    cancelEdit();
  };

  const handleReimbursement = (id, newStatus) => {
    let reason = '';
    if (newStatus === 'rejected') {
      reason = window.prompt('Reason for rejection (optional):') || '';
    }
    const updated = reimbursements.map(r => {
      if (r.id !== id) return r;
      const note = `${newStatus === 'approved' ? 'Approved' : 'Rejected'} by ${user.name}${reason ? ': ' + reason : ''}`;
      return { ...r, status: newStatus, auditNote: note };
    });
    setReimbursements(updated);
    localStorage.setItem('haazimi_reimbursements', JSON.stringify(updated));
    saveFlash();
  };

  const pendingReimbs = reimbursements.filter(r => r.status === 'pending');
  const getAllCentres = (country) => [...new Set([...(COUNTRY_CENTRES[country] || []), ...(customCentres[country] || [])])];

  const addCentre = (country) => {
    const val = (centreInputs[country] || '').trim();
    if (!val) return;
    const updated = { ...customCentres, [country]: [...(customCentres[country] || []), val] };
    setCustomCentres(updated);
    localStorage.setItem('haazimi_custom_centres', JSON.stringify(updated));
    setCentreInputs(prev => ({ ...prev, [country]: '' }));
    saveFlash();
  };

  const adminCountry = _adminCountry;
  const countryUsers = adminCountry
    ? users.filter(u => (u.Country || u.country || '').toLowerCase() === adminCountry.toLowerCase())
    : users;

  const cloudPendingCount = countryUsers.filter(u => (u.Status || u.status) === 'Pending').length;
  const totalPending = cloudPendingCount + localPendingRegs.length;

  const inputStyle = {
    fontSize: '0.8rem', padding: '4px 6px', borderRadius: 4,
    border: '1px solid var(--border-color)', background: 'var(--input-bg)',
    color: 'var(--text-primary)', width: '100%',
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Shield size={22} style={{ color: 'var(--primary-color)' }} /> {t.title}
          </h2>
          <p>{t.sub}</p>
        </div>
        <button className="button-secondary" onClick={fetchUsers} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <RefreshCw size={15} /> {t.refresh}
        </button>
      </div>

      {successMsg && <div className="forgot-password-success" style={{ marginBottom: 16 }}>{successMsg}</div>}
      {error && <div className="login-error-message" style={{ marginBottom: 16 }}>{error}</div>}

      {/* Bird's Eye View */}
      <div className="dashboard-grid dashboard-grid--manager" style={{ marginBottom: 24 }}>
        <div className="info-card">
          <div className="icon students"><Users /></div>
          <div className="details"><div className="value">{totalStudents}</div><div className="label">{t.totalStudents}</div></div>
        </div>
        <div className="info-card">
          <div className="icon red-flags"><AlertTriangle /></div>
          <div className="details"><div className="value">{activeRedFlags}</div><div className="label">{t.activeFlags}</div></div>
        </div>
        <div className="info-card">
          <div className="icon" style={{ background: budgetVariance >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
            <DollarSign style={{ color: budgetVariance >= 0 ? '#22c55e' : '#ef4444' }} />
          </div>
          <div className="details">
            <div className="value" style={{ color: budgetVariance >= 0 ? '#22c55e' : '#ef4444' }}>
              {budgetVariance >= 0 ? '+' : ''}{budgetVariance.toLocaleString()}
            </div>
            <div className="label">{t.budgetVsActual}</div>
          </div>
        </div>
        <div className="info-card">
          <div className="icon pending-leaves"><UserCheck /></div>
          <div className="details"><div className="value">{totalPending}</div><div className="label">{t.awaiting}</div></div>
        </div>
      </div>

      {/* Pending Registrations — with Approve / Deny */}
      {localPendingRegs.length > 0 && (
        <div className="form-container" style={{ marginBottom: 24, borderLeft: '4px solid #f59e0b' }}>
          <div className="form-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={18} style={{ color: '#f59e0b' }} />
            <h2 style={{ margin: 0 }}>{t.pendingReg} ({localPendingRegs.length})</h2>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10, marginTop: 4 }}>
            These accounts registered from this device and are awaiting your approval. Approving will allow them to login from any device.
          </p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 520, borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px' }}>{t.name}</th>
                  <th style={{ padding: '8px 10px' }}>{t.email}</th>
                  <th style={{ padding: '8px 10px' }}>{t.country}</th>
                  <th style={{ padding: '8px 10px' }}>{t.centre}</th>
                  <th style={{ padding: '8px 10px' }}>Registered</th>
                  <th style={{ padding: '8px 10px' }}>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {localPendingRegs.map((u, i) => {
                  const busy = approvingLocal === u.email;
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,193,7,0.05)', opacity: busy ? 0.6 : 1 }}>
                      <td style={{ padding: '8px 10px', fontWeight: 500 }}>{u.name}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{u.email}</td>
                      <td style={{ padding: '8px 10px' }}>{u.country || '—'}</td>
                      <td style={{ padding: '8px 10px' }}>{u.centre || '—'}</td>
                      <td style={{ padding: '8px 10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {u.timestamp ? new Date(u.timestamp).toLocaleDateString() : '—'}
                      </td>
                      <td style={{ padding: '8px 10px' }}>
                        {busy ? (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.approving}</span>
                        ) : (
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => handleLocalRegistration(u, 'Approved')}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: '1px solid #22c55e', background: 'rgba(34,197,94,0.1)', color: '#16a34a', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                            >
                              <CheckCircle size={13} /> {t.approve}
                            </button>
                            <button
                              onClick={() => handleLocalRegistration(u, 'Denied')}
                              style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: '1px solid #ef4444', background: 'rgba(239,68,68,0.1)', color: '#dc2626', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
                            >
                              <XCircle size={13} /> {t.deny}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reimbursement Requests */}
      <div className="form-container" style={{ marginBottom: 24, borderLeft: pendingReimbs.length > 0 ? '4px solid var(--primary-color)' : undefined }}>
        <div className="form-header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Receipt size={18} style={{ color: 'var(--primary-color)' }} />
          <h2 style={{ margin: 0 }}>
            {t.reimbTitle}
            {pendingReimbs.length > 0 && (
              <span style={{ fontSize: '0.8rem', background: 'var(--primary-color)', color: '#fff', borderRadius: 12, padding: '2px 8px', marginLeft: 8 }}>
                {pendingReimbs.length}
              </span>
            )}
          </h2>
        </div>
        {reimbursements.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', marginTop: 12 }}>{t.reimbNone}</p>
        ) : (
          <div style={{ overflowX: 'auto', marginTop: 12 }}>
            <table style={{ width: '100%', minWidth: 560, borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px' }}>{t.reimbDate}</th>
                  <th style={{ padding: '8px 10px' }}>{t.reimbStaff}</th>
                  <th style={{ padding: '8px 10px' }}>{t.reimbPurpose}</th>
                  <th style={{ padding: '8px 10px' }}>{t.reimbDist}</th>
                  <th style={{ padding: '8px 10px' }}>{t.reimbTotal}</th>
                  <th style={{ padding: '8px 10px' }}>{t.reimbStatus}</th>
                  <th style={{ padding: '8px 10px' }}></th>
                </tr>
              </thead>
              <tbody>
                {reimbursements.map(r => (
                  <tr key={r.id} style={{ borderBottom: '1px solid var(--border-color)', opacity: r.status !== 'pending' ? 0.65 : 1 }}>
                    <td style={{ padding: '8px 10px', fontSize: '0.8rem' }}>{r.date}</td>
                    <td style={{ padding: '8px 10px', fontWeight: 500 }}>{r.staffName}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--text-secondary)', maxWidth: 180 }}>{r.purpose}</td>
                    <td style={{ padding: '8px 10px' }}>{r.distance} km</td>
                    <td style={{ padding: '8px 10px', fontWeight: 600, color: 'var(--primary-color)' }}>{r.currency || '$'}{r.total?.toFixed(2)}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <span style={{
                        display: 'inline-block', padding: '3px 10px', borderRadius: 12, fontSize: '0.78rem', fontWeight: 600,
                        background: r.status === 'approved' ? 'rgba(34,197,94,0.1)' : r.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)',
                        color: r.status === 'approved' ? '#16a34a' : r.status === 'rejected' ? '#dc2626' : '#b45309'
                      }}>
                        {r.status}
                      </span>
                    </td>
                    <td style={{ padding: '8px 10px' }}>
                      {r.status === 'pending' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleReimbursement(r.id, 'approved')}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: '1px solid #22c55e', background: 'rgba(34,197,94,0.1)', color: '#16a34a', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                            <CheckCircle size={13} /> {t.reimbApprove}
                          </button>
                          <button onClick={() => handleReimbursement(r.id, 'rejected')}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 10px', borderRadius: 6, border: '1px solid #ef4444', background: 'rgba(239,68,68,0.1)', color: '#dc2626', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                            <XCircle size={13} /> {t.reimbReject}
                          </button>
                        </div>
                      )}
                      {r.auditNote && r.status !== 'pending' && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>{r.auditNote}</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User List — with inline name/centre editing */}
      <div className="form-container" style={{ marginBottom: 24 }}>
        <div className="form-header">
          <h2>{t.userList}</h2>
          {cloudPendingCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', color: '#856404', background: 'rgba(255,193,7,0.15)', borderRadius: 6, padding: '4px 10px' }}>
              <AlertCircle size={14} /> {cloudPendingCount} {t.awaiting}
            </div>
          )}
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 10, marginTop: 4 }}>
          Click the <Edit2 size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> icon to edit a user's name or centre. Changes are saved to Google Sheets immediately.
        </p>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 32 }}>
            <div className="button-spinner" style={{ margin: '0 auto', borderTopColor: 'var(--accent-color)', border: '4px solid var(--border-color)' }} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', minWidth: 680, borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 8px' }}>{t.name}</th>
                  <th style={{ padding: '10px 8px' }}>{t.email}</th>
                  <th style={{ padding: '10px 8px' }}>{t.country}</th>
                  <th style={{ padding: '10px 8px' }}>{t.centre}</th>
                  <th style={{ padding: '10px 8px' }}>{t.role}</th>
                  <th style={{ padding: '10px 8px' }}>{t.status}</th>
                  <th style={{ padding: '10px 8px', width: 40 }}></th>
                </tr>
              </thead>
              <tbody>
                {countryUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'var(--text-secondary)' }}>{t.noUsers}</td>
                  </tr>
                ) : countryUsers.map((u, i) => {
                  const uEmail = u.Email || u.email;
                  const isMe = uEmail === user.email;
                  const uStatus = u.Status || u.status || 'Pending';
                  const busyRole = updating === uEmail + '_role';
                  const busyStatus = updating === uEmail + '_status';
                  const busyName = updating === uEmail + '_name';
                  const busyCentre = updating === uEmail + '_centre';
                  const isEditingName = editingCell?.email === uEmail && editingCell?.field === 'name';
                  const isEditingCentre = editingCell?.email === uEmail && editingCell?.field === 'centre';
                  const currentName = u.Name || u.name || '';
                  const currentCentre = u.Centre || u.centre || '';

                  return (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      {/* Name — inline editable */}
                      <td style={{ padding: '10px 8px', fontWeight: 500 }}>
                        {isEditingName ? (
                          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            <input
                              style={inputStyle}
                              value={editValue}
                              autoFocus
                              onChange={e => setEditValue(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') saveEdit(u); if (e.key === 'Escape') cancelEdit(); }}
                            />
                            <button onClick={() => saveEdit(u)} disabled={busyName}
                              style={{ padding: '3px 5px', borderRadius: 4, border: '1px solid #22c55e', background: 'rgba(34,197,94,0.1)', color: '#16a34a', cursor: 'pointer' }}>
                              <Save size={13} />
                            </button>
                            <button onClick={cancelEdit}
                              style={{ padding: '3px 5px', borderRadius: 4, border: '1px solid var(--border-color)', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>{currentName}</span>
                            {!isMe && (
                              <button onClick={() => startEdit(uEmail, 'name', currentName)} title={t.editName}
                                style={{ padding: 2, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--subtle-text-color)', flexShrink: 0 }}>
                                <Edit2 size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Email */}
                      <td style={{ padding: '10px 8px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{uEmail}</td>

                      {/* Country */}
                      <td style={{ padding: '10px 8px' }}>{u.Country || u.country || '—'}</td>

                      {/* Centre — inline editable */}
                      <td style={{ padding: '10px 8px' }}>
                        {isEditingCentre ? (
                          <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            {(() => {
                              const userCountry = u.Country || u.country || user?.country || '';
                              const baseCentres = getAllCentres(userCountry);
                              const centreOptions = baseCentres.includes(editValue) || !editValue
                                ? baseCentres
                                : [editValue, ...baseCentres];
                              return centreOptions.length > 0 ? (
                                <select
                                  style={inputStyle}
                                  value={editValue}
                                  autoFocus
                                  onChange={e => setEditValue(e.target.value)}
                                >
                                  {centreOptions.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                              ) : (
                                <input
                                  style={inputStyle}
                                  value={editValue}
                                  autoFocus
                                  onChange={e => setEditValue(e.target.value)}
                                  onKeyDown={e => { if (e.key === 'Enter') saveEdit(u); if (e.key === 'Escape') cancelEdit(); }}
                                />
                              );
                            })()}
                            <button onClick={() => saveEdit(u)} disabled={busyCentre}
                              style={{ padding: '3px 5px', borderRadius: 4, border: '1px solid #22c55e', background: 'rgba(34,197,94,0.1)', color: '#16a34a', cursor: 'pointer' }}>
                              <Save size={13} />
                            </button>
                            <button onClick={cancelEdit}
                              style={{ padding: '3px 5px', borderRadius: 4, border: '1px solid var(--border-color)', background: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                              <X size={13} />
                            </button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span>{currentCentre || '—'}</span>
                            {!isMe && (
                              <button onClick={() => startEdit(uEmail, 'centre', currentCentre)} title={t.editCentre}
                                style={{ padding: 2, border: 'none', background: 'none', cursor: 'pointer', color: 'var(--subtle-text-color)', flexShrink: 0 }}>
                                <Edit2 size={12} />
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Role */}
                      <td style={{ padding: '10px 8px' }}>
                        <select value={u.Role || u.role || 'Staff'} disabled={isMe || busyRole}
                          onChange={e => updateUser(u, 'role', e.target.value)}
                          style={{ ...inputStyle, opacity: busyRole ? 0.5 : 1 }}>
                          {ROLES.filter(r => user?.role === 'Centre Manager' ? r !== 'Country Admin' && r !== 'Super Admin' : true).map(r => <option key={r}>{r}</option>)}
                        </select>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '10px 8px' }}>
                        <select value={uStatus} disabled={isMe || busyStatus}
                          onChange={e => updateUser(u, 'status', e.target.value)}
                          style={{
                            ...inputStyle,
                            opacity: busyStatus ? 0.5 : 1,
                            background: uStatus === 'Pending' ? '#fff3cd' : uStatus === 'Approved' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                          }}>
                          {STATUSES.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>

                      {/* Delete */}
                      <td style={{ padding: '10px 8px', textAlign: 'center' }}>
                        {!isMe && (
                          <button
                            onClick={() => setConfirmDelete(u)}
                            disabled={updating === uEmail + '_delete'}
                            title={t.deleteUser}
                            style={{ padding: 5, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.08)', borderRadius: 6, cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'var(--card-bg)', borderRadius: 14, padding: 28, maxWidth: 380, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ padding: 8, borderRadius: 8, background: 'rgba(239,68,68,0.1)', flexShrink: 0 }}>
                <Trash2 size={20} style={{ color: '#ef4444' }} />
              </div>
              <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{t.deleteUser}</h3>
            </div>
            <p style={{ margin: '0 0 24px 0', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {t.deleteMsg} <strong style={{ color: 'var(--text-primary)' }}>{confirmDelete.Name || confirmDelete.name}</strong> ({confirmDelete.Email || confirmDelete.email})?
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="button-secondary" onClick={() => setConfirmDelete(null)}>{t.deleteCancel}</button>
              <button
                onClick={() => deleteUser(confirmDelete)}
                disabled={updating === (confirmDelete.Email || confirmDelete.email) + '_delete'}
                style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid #ef4444', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Trash2 size={14} /> {t.deleteConfirm}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Centres — collapsible */}
      <div className="form-container">
        <button
          onClick={() => setCentresOpen(o => !o)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-dark)' }}
        >
          <h2 style={{ margin: 0 }}>{t.managecentres}</h2>
          {centresOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>
        {centresOpen && (
          <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {Object.keys(COUNTRY_CENTRES).map(country => (
              <div key={country} style={{ minWidth: 180, flex: '1 1 180px' }}>
                <div style={{ fontWeight: 600, marginBottom: 6, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{country}</div>
                <ul style={{ margin: '0 0 8px 0', paddingLeft: 16, fontSize: '0.85rem' }}>
                  {getAllCentres(country).length === 0 && <li style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>—</li>}
                  {getAllCentres(country).map(c => <li key={c}>{c}</li>)}
                </ul>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input
                    style={{ flex: 1, padding: '6px 10px', fontSize: '0.85rem', borderRadius: 6, border: '1px solid var(--border-color)', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
                    placeholder={t.addCentre}
                    value={centreInputs[country] || ''}
                    onChange={e => setCentreInputs(prev => ({ ...prev, [country]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addCentre(country)}
                  />
                  <button className="button-primary" style={{ padding: '6px 10px' }} onClick={() => addCentre(country)}>
                    <PlusCircle size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
