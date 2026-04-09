import { useState, useEffect } from 'react';
import { GOOGLE_SCRIPT_URL } from '../data/config';
import { RefreshCw, CheckCircle, XCircle, FileText, Trash2 } from 'lucide-react';

const T = {
  en: {
    title: 'Leave Requests', sub: 'pending approval',
    pending: 'Pending', history: 'History',
    approve: 'Approve', reject: 'Reject',
    noPending: 'No pending leave requests. All caught up!',
    noHistory: 'No leave history yet.',
    loading: 'Loading leave requests…',
    error: 'Could not load leave requests from server.',
    refresh: 'Refresh',
    days: 'day(s)', hours: 'hr(s)',
    reason: 'Reason',
    approved: 'Approved', rejected: 'Rejected',
    leaveTypes: { Casual: 'Casual', Medical: 'Medical', Emergency: 'Emergency', Annual: 'Annual', Other: 'Other' },
  },
  ar: {
    title: 'طلبات الإجازة', sub: 'في انتظار الموافقة',
    pending: 'معلقة', history: 'السجل',
    approve: 'موافقة', reject: 'رفض',
    noPending: 'لا توجد طلبات إجازة معلقة.',
    noHistory: 'لا يوجد سجل بعد.',
    loading: 'جارٍ تحميل الطلبات…',
    error: 'تعذّر تحميل طلبات الإجازة.',
    refresh: 'تحديث',
    days: 'يوم', hours: 'ساعات',
    reason: 'السبب',
    approved: 'موافق', rejected: 'مرفوض',
    leaveTypes: { Casual: 'عادية', Medical: 'طبية', Emergency: 'طارئة', Annual: 'سنوية', Other: 'أخرى' },
  },
  ur: {
    title: 'چھٹی کی درخواستیں', sub: 'منظوری کا انتظار',
    pending: 'زیر التواء', history: 'تاریخ',
    approve: 'منظور', reject: 'مسترد',
    noPending: 'کوئی زیر التواء چھٹی کی درخواست نہیں۔',
    noHistory: 'ابھی تک کوئی سجل نہیں۔',
    loading: 'درخواستیں لوڈ ہو رہی ہیں…',
    error: 'سرور سے درخواستیں لوڈ نہیں ہو سکیں۔',
    refresh: 'تازہ کریں',
    days: 'دن', hours: 'گھنٹے',
    reason: 'وجہ',
    approved: 'منظور', rejected: 'مسترد',
    leaveTypes: { Casual: 'غیر رسمی', Medical: 'طبی', Emergency: 'ہنگامی', Annual: 'سالانہ', Other: 'دیگر' },
  },
  es: {
    title: 'Solicitudes de Licencia', sub: 'pendientes de aprobación',
    pending: 'Pendientes', history: 'Historial',
    approve: 'Aprobar', reject: 'Rechazar',
    noPending: 'No hay solicitudes de licencia pendientes.',
    noHistory: 'Sin historial aún.',
    loading: 'Cargando solicitudes…',
    error: 'No se pudieron cargar las solicitudes.',
    refresh: 'Actualizar',
    days: 'día(s)', hours: 'hr(s)',
    reason: 'Motivo',
    approved: 'Aprobada', rejected: 'Rechazada',
    leaveTypes: { Casual: 'Casual', Medical: 'Médica', Emergency: 'Emergencia', Annual: 'Anual', Other: 'Otro' },
  },
  pt: {
    title: 'Solicitações de Licença', sub: 'aguardando aprovação',
    pending: 'Pendentes', history: 'Histórico',
    approve: 'Aprovar', reject: 'Rejeitar',
    noPending: 'Nenhuma solicitação de licença pendente.',
    noHistory: 'Sem histórico ainda.',
    loading: 'Carregando solicitações…',
    error: 'Não foi possível carregar as solicitações.',
    refresh: 'Atualizar',
    days: 'dia(s)', hours: 'hr(s)',
    reason: 'Motivo',
    approved: 'Aprovada', rejected: 'Rejeitada',
    leaveTypes: { Casual: 'Casual', Medical: 'Médica', Emergency: 'Emergência', Annual: 'Anual', Other: 'Outro' },
  },
};

export default function PendingLeaves({ user, language }) {
  const t = T[language] || T.en;
  const isAuthorised = ['Centre Manager', 'Country Admin', 'Super Admin'].includes(user?.role);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('pending');
  const [updating, setUpdating] = useState(null);

  const readLocal = () => {
    try {
      const all = JSON.parse(localStorage.getItem('haazimi_leaves') || '[]');
      return all.map(l => {
        const isHourly = !!(l.partial || l.isHourly || (typeof l.days === 'string' && l.days.includes('hr')));
        const rawDays = l.days;
        const days = typeof rawDays === 'string' ? (parseFloat(rawDays) || rawDays) : (rawDays || 1);
        return {
          id: String(l.id),
          staffName: l.staffName || 'Unknown',
          staffEmail: l.staffEmail || '',
          type: l.type || 'Casual',
          from: l.from || '',
          to: l.to || l.from || '',
          days,
          reason: l.reason || '',
          status: String(l.status || 'Pending').toLowerCase(),
          isHourly,
          source: 'local',
          decidedBy: l.decidedBy || '',
          decidedAt: l.decidedAt || '',
          decisionReason: l.decisionReason || '',
        };
      });
    } catch { return []; }
  };

  const fetchLeaves = async () => {
    setError('');
    setLoading(true);

    const local = readLocal();
    setRequests(local);
    setLoading(false);

    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=attendance&t=${Date.now()}`);
      const data = await res.json();
      const leaveOnly = data.filter(l => {
        const act = String(l["activity"] || "").toLowerCase();
        return act && act !== "teaching" && act !== "work";
      });
      const remote = leaveOnly.map(l => ({
        id: l["sync time"] || String(Date.now() + Math.random()),
        staffName: l["teacher name"] || 'Unknown',
        staffEmail: '',
        type: l["activity"] || 'Casual',
        from: l["work date"] || '',
        to: l["work date"] || '',
        days: l["hours"] || 1,
        reason: l["notes"] || '',
        status: String(l["status"] || 'pending').toLowerCase().trim(),
        isHourly: parseFloat(l["hours"]) < 1 || (l["check in"] !== "08:00" && l["check in"] !== ""),
        source: 'remote',
      }));
      const localIds = new Set(local.map(x => x.id));
      setRequests([...local, ...remote.filter(r => !localIds.has(r.id))]);
    } catch {}
  };

  useEffect(() => { if (isAuthorised) fetchLeaves(); }, []);

  const updateStatus = async (req, newStatus) => {
    let reason = '';
    if (newStatus === 'rejected') {
      reason = window.prompt('Reason for rejection (optional):') || '';
    }
    setUpdating(req.id);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'updateLeave',
          leaveId: req.id,
          status: newStatus,
          reason: reason,
          approvedBy: user?.name || 'Admin',
        }),
      });
    } catch {}

    try {
      const all = JSON.parse(localStorage.getItem('haazimi_leaves') || '[]');
      const capitalStatus = newStatus === 'approved' ? 'Approved' : 'Rejected';
      const updated = all.map(l => String(l.id) === String(req.id) ? {
        ...l,
        status: capitalStatus,
        decidedBy: user?.name || 'Manager',
        decidedAt: new Date().toLocaleDateString(),
        decisionReason: reason || '',
      } : l);
      localStorage.setItem('haazimi_leaves', JSON.stringify(updated));
    } catch {}

    setRequests(rs => rs.map(r => r.id === req.id ? {
      ...r,
      status: newStatus,
      decidedBy: user?.name || 'Manager',
      decidedAt: new Date().toLocaleDateString(),
      decisionReason: reason || '',
    } : r));
    setUpdating(null);
  };

  const deleteRequest = (reqId) => {
    try {
      const all = JSON.parse(localStorage.getItem('haazimi_leaves') || '[]');
      localStorage.setItem('haazimi_leaves', JSON.stringify(all.filter(l => String(l.id) !== String(reqId))));
    } catch {}
    setRequests(rs => rs.filter(r => r.id !== reqId));
  };

  const clearAllPending = () => {
    try {
      const all = JSON.parse(localStorage.getItem('haazimi_leaves') || '[]');
      localStorage.setItem('haazimi_leaves', JSON.stringify(all.filter(l => String(l.status || '').toLowerCase() !== 'pending')));
    } catch {}
    setRequests(rs => rs.filter(r => r.status !== 'pending'));
  };

  const pending = requests.filter(r => r.status === 'pending');
  const history = requests.filter(r => r.status !== 'pending');
  const shown = tab === 'pending' ? pending : history;

  if (!isAuthorised) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
        <FileText size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <p style={{ fontSize: '1.1rem' }}>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{pending.length} {t.sub}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {pending.length > 0 && (
            <button className="button-secondary" onClick={clearAllPending}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#dc2626', borderColor: '#dc2626' }}>
              <Trash2 size={15} /> Clear All
            </button>
          )}
          <button className="button-secondary" onClick={fetchLeaves} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} /> {t.refresh}
          </button>
        </div>
      </div>

      <div className="pending-leaves-layout">
        {tab === 'pending' && pending.length > 0 && (
          <div className="request-section">
            <h3>{t.pending} ({pending.length})</h3>
            {loading ? (
              <div style={{ textAlign: 'center', padding: 32 }}>
                <div className="button-spinner" style={{ margin: '0 auto' }} />
              </div>
            ) : error ? (
              <div style={{ padding: 16, color: '#dc2626', background: 'rgba(239,68,68,0.07)', borderRadius: 8 }}>{error}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {pending.map(req => (
                  <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', border: '1px solid #f59e0b', borderRadius: '8px', background: '#fffbeb', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{req.staffName}</div>
                      <div style={{ fontSize: '0.78rem', color: '#666', marginTop: 2 }}>
                        {(t.leaveTypes && t.leaveTypes[req.type]) || req.type} · {req.from}{req.to && req.to !== req.from ? ` → ${req.to}` : ''} · <strong>{req.days} {req.isHourly ? t.hours : t.days}</strong>
                      </div>
                      {req.reason && <div style={{ fontSize: '0.78rem', color: '#888', marginTop: 2, fontStyle: 'italic' }}>{req.reason}</div>}
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
                      <button disabled={updating === req.id} onClick={() => updateStatus(req, 'approved')}
                        style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle size={13} /> {t.approve}
                      </button>
                      <button disabled={updating === req.id} onClick={() => updateStatus(req, 'rejected')}
                        style={{ background: '#dc2626', color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <XCircle size={13} /> {t.reject}
                      </button>
                      <button onClick={() => deleteRequest(req.id)} title="Dismiss"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', padding: 3, lineHeight: 1 }}
                        onMouseEnter={e => e.currentTarget.style.color = '#dc2626'}
                        onMouseLeave={e => e.currentTarget.style.color = '#bbb'}>
                        <XCircle size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="request-section">
          <div className="history-tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button className={`history-tab ${tab === 'pending' ? 'active' : ''}`} onClick={() => setTab('pending')} style={{ padding: '8px 16px', border: 'none', background: tab === 'pending' ? '#e0e7ff' : 'transparent', borderRadius: '4px', cursor: 'pointer' }}>
              {t.pending} ({pending.length})
            </button>
            <button className={`history-tab ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')} style={{ padding: '8px 16px', border: 'none', background: tab === 'history' ? '#e0e7ff' : 'transparent', borderRadius: '4px', cursor: 'pointer' }}>
              {t.history} ({history.length})
            </button>
          </div>

          {loading && tab === 'pending' && pending.length === 0 && (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div className="button-spinner" style={{ margin: '0 auto' }} />
            </div>
          )}

          {!loading && error && (
            <div style={{ padding: 16, color: '#dc2626', background: 'rgba(239,68,68,0.07)', borderRadius: 8, marginTop: 12 }}>{error}</div>
          )}

          {tab === 'history' && !loading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>{t.noHistory}</div>
              ) : history.map(req => {
                const isApproved = req.status === 'approved';
                const borderColor = isApproved ? '#16a34a' : '#dc2626';
                const bgColor = isApproved ? '#f0fdf4' : '#fef2f2';
                return (
                  <div key={req.id} style={{ padding: '10px 12px', border: `1px solid ${borderColor}`, borderRadius: 8, background: bgColor, opacity: 0.9 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{req.staffName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#666', marginTop: 2 }}>
                          {(t.leaveTypes && t.leaveTypes[req.type]) || req.type} · {req.from}{req.to && req.to !== req.from ? ` → ${req.to}` : ''} · <strong>{req.days} {req.isHourly ? t.hours : t.days}</strong>
                        </div>
                        {req.reason && <div style={{ fontSize: '0.78rem', color: '#555', marginTop: 3, fontStyle: 'italic' }}>{req.reason}</div>}
                      </div>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: 4, background: borderColor, color: '#fff', flexShrink: 0, marginLeft: 8 }}>
                        {isApproved ? t.approved : t.rejected}
                      </span>
                    </div>
                    {req.decidedBy && (
                      <div style={{ marginTop: 6, fontSize: '0.75rem', color: borderColor, borderTop: `1px solid ${borderColor}30`, paddingTop: 5 }}>
                        {isApproved ? '✓' : '✗'} <strong>{req.decidedBy}</strong>{req.decidedAt ? ` · ${req.decidedAt}` : ''}
                        {req.decisionReason && <span style={{ fontStyle: 'italic' }}> — "{req.decisionReason}"</span>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'pending' && !loading && pending.length === 0 && !error && (
            <div className="prompt-container" style={{ textAlign: 'center', padding: '40px', background: '#f8f9fa', borderRadius: '8px' }}>
              <FileText size={32} style={{ color: '#a0aec0', marginBottom: 8 }} />
              <div style={{ color: '#4a5568' }}>{t.noPending}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}