import { useState } from 'react';
import { Receipt, Fuel, Trash2 } from 'lucide-react';
import { GOOGLE_SCRIPT_URL } from '../data/config';

const EFFICIENCY_OPTIONS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const WEAR_RATE = 0.10;

const T = {
  en: {
    title: 'Reimbursement', sub: 'Calculate and submit travel reimbursement requests',
    calculator: 'Travel Cost Calculator',
    distance: 'Distance (km)', fuel: 'Fuel Price (per litre)', efficiency: 'Vehicle Efficiency',
    wearTear: 'Include Wear & Tear', wearTearDesc: 'Adds a standard depreciation rate per km',
    fuelCost: 'Fuel Cost', wearCost: 'Wear & Tear', totalCost: 'Total Cost',
    purpose: 'Purpose of Travel', purposePlaceholder: 'e.g. Student home visit, community meeting...',
    travelDate: 'Date of Travel',
    submit: 'Submit Request', submitted: 'Reimbursement request submitted successfully!',
    history: 'My Reimbursement Requests', noHistory: 'No requests submitted yet.',
    colDate: 'Date', colPurpose: 'Purpose', colDist: 'km', colTotal: 'Total', colStatus: 'Status',
    pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
    kmL: 'km/L', reqFields: 'Please fill in all required fields.',
    clear: 'Clear',
    cancelBtn: 'Cancel Request', cancelling: 'Cancelling…',
    confirmPrompt: 'Are you sure?', confirmYes: 'Yes, Cancel', confirmNo: 'Keep',
  },
  ar: {
    title: 'التعويض', sub: 'احسب طلبات تعويض السفر وقدّمها',
    calculator: 'حاسبة تكاليف السفر',
    distance: 'المسافة (كم)', fuel: 'سعر الوقود (لكل لتر)', efficiency: 'كفاءة المركبة',
    wearTear: 'تضمين التآكل', wearTearDesc: 'يضيف معدل إهلاك قياسي لكل كم',
    fuelCost: 'تكلفة الوقود', wearCost: 'التآكل', totalCost: 'التكلفة الإجمالية',
    purpose: 'غرض السفر', purposePlaceholder: 'مثل: زيارة منزل طالب...',
    travelDate: 'تاريخ السفر',
    submit: 'إرسال الطلب', submitted: 'تم إرسال طلب التعويض بنجاح!',
    history: 'طلبات التعويض', noHistory: 'لا توجد طلبات مقدمة بعد.',
    colDate: 'التاريخ', colPurpose: 'الغرض', colDist: 'كم', colTotal: 'المجموع', colStatus: 'الحالة',
    pending: 'معلق', approved: 'موافق', rejected: 'مرفوض',
    kmL: 'كم/لتر', reqFields: 'يرجى ملء جميع الحقول المطلوبة.',
    clear: 'مسح',
    cancelBtn: 'إلغاء الطلب', cancelling: 'جارٍ الإلغاء...',
    confirmPrompt: 'هل أنت متأكد؟', confirmYes: 'نعم، إلغاء', confirmNo: 'الإبقاء',
  },
  ur: {
    title: 'معاوضہ', sub: 'سفری معاوضے کی درخواستیں حساب کریں اور جمع کریں',
    calculator: 'سفری لاگت حساب کار',
    distance: 'فاصلہ (کلومیٹر)', fuel: 'ایندھن کی قیمت (فی لیٹر)', efficiency: 'گاڑی کی کارکردگی',
    wearTear: 'گھسٹ شامل کریں', wearTearDesc: 'فی کلومیٹر معیاری استہلاک شرح شامل کرتا ہے',
    fuelCost: 'ایندھن کی لاگت', wearCost: 'گھسٹ', totalCost: 'کل لاگت',
    purpose: 'سفر کا مقصد', purposePlaceholder: 'مثلاً طالب علم کے گھر کا دورہ...',
    travelDate: 'سفر کی تاریخ',
    submit: 'درخواست جمع کریں', submitted: 'معاوضہ درخواست کامیابی سے جمع کر دی گئی!',
    history: 'میری معاوضہ درخواستیں', noHistory: 'ابھی تک کوئی درخواست جمع نہیں کی گئی۔',
    colDate: 'تاریخ', colPurpose: 'مقصد', colDist: 'کلومیٹر', colTotal: 'کل', colStatus: 'حالت',
    pending: 'زیر التواء', approved: 'منظور', rejected: 'مسترد',
    kmL: 'کلومیٹر/لیٹر', reqFields: 'براہ کرم تمام ضروری خانے بھریں۔',
    clear: 'صاف کریں',
    cancelBtn: 'درخواست منسوخ کریں', cancelling: 'منسوخ ہو رہا ہے...',
    confirmPrompt: 'کیا آپ یقین سے چاہتے ہیں؟', confirmYes: 'ہاں، منسوخ کریں', confirmNo: 'رکھیں',
  },
  es: {
    title: 'Reembolso', sub: 'Calcula y envía solicitudes de reembolso de viaje',
    calculator: 'Calculadora de Costos de Viaje',
    distance: 'Distancia (km)', fuel: 'Precio del Combustible (por litro)', efficiency: 'Eficiencia del Vehículo',
    wearTear: 'Incluir Desgaste', wearTearDesc: 'Añade una tasa de depreciación estándar por km',
    fuelCost: 'Costo de Combustible', wearCost: 'Desgaste', totalCost: 'Costo Total',
    purpose: 'Propósito del Viaje', purposePlaceholder: 'ej. Visita al hogar del estudiante...',
    travelDate: 'Fecha del Viaje',
    submit: 'Enviar Solicitud', submitted: '¡Solicitud de reembolso enviada con éxito!',
    history: 'Mis Solicitudes de Reembolso', noHistory: 'No hay solicitudes enviadas aún.',
    colDate: 'Fecha', colPurpose: 'Propósito', colDist: 'km', colTotal: 'Total', colStatus: 'Estado',
    pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado',
    kmL: 'km/L', reqFields: 'Por favor complete todos los campos requeridos.',
    clear: 'Limpiar',
    cancelBtn: 'Cancelar Solicitud', cancelling: 'Cancelando…',
    confirmPrompt: '¿Estás seguro?', confirmYes: 'Sí, Cancelar', confirmNo: 'Mantener',
  },
  pt: {
    title: 'Reembolso', sub: 'Calcule e envie solicitações de reembolso de viagem',
    calculator: 'Calculadora de Custos de Viagem',
    distance: 'Distância (km)', fuel: 'Preço do Combustível (por litro)', efficiency: 'Eficiência do Veículo',
    wearTear: 'Incluir Desgaste', wearTearDesc: 'Adiciona uma taxa de depreciação padrão por km',
    fuelCost: 'Custo de Combustível', wearCost: 'Desgaste', totalCost: 'Custo Total',
    purpose: 'Propósito da Viagem', purposePlaceholder: 'ex. Visita ao lar do estudante...',
    travelDate: 'Data da Viagem',
    submit: 'Enviar Solicitação', submitted: 'Solicitação de reembolso enviada com sucesso!',
    history: 'Minhas Solicitações de Reembolso', noHistory: 'Nenhuma solicitação enviada ainda.',
    colDate: 'Data', colPurpose: 'Propósito', colDist: 'km', colTotal: 'Total', colStatus: 'Status',
    pending: 'Pendente', approved: 'Aprovado', rejected: 'Rejeitado',
    kmL: 'km/L', reqFields: 'Por favor preencha todos os campos obrigatórios.',
    clear: 'Limpar',
    cancelBtn: 'Cancelar Solicitação', cancelling: 'Cancelando…',
    confirmPrompt: 'Tem certeza?', confirmYes: 'Sim, Cancelar', confirmNo: 'Manter',
  },
};

const STATUS_CLASS = { pending: 'status-in-progress', approved: 'status-completed', rejected: 'status-incomplete' };

export default function Reimbursement({ user, language }) {
  const t = T[language] || T.en;
  const currencySymbol = localStorage.getItem('haazimi_currency') || '$';

  const [form, setForm] = useState({
    distance: '',
    fuelPrice: '',
    efficiency: 10,
    includeWear: false,
    purpose: '',
    travelDate: new Date().toISOString().split('T')[0],
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  const [requests, setRequests] = useState(() => {
    try { return JSON.parse(localStorage.getItem('haazimi_reimbursements') || '[]'); } catch { return []; }
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const km = parseFloat(form.distance) || 0;
  const pricePerL = parseFloat(form.fuelPrice) || 0;
  const eff = parseFloat(form.efficiency) || 10;

  const litresUsed = km > 0 && eff > 0 ? km / eff : 0;
  const fuelCost = litresUsed * pricePerL;
  const wearCost = form.includeWear ? km * WEAR_RATE : 0;
  const totalCost = fuelCost + wearCost;

  const fmt = (n) => `${currencySymbol}${n.toFixed(2)}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.distance || !form.fuelPrice || !form.purpose || !form.travelDate) {
      setError(t.reqFields);
      return;
    }
    setError('');

    const newRequest = {
      id: Date.now(),
      staffName: user.name,
      staffEmail: user.email,
      date: form.travelDate,
      purpose: form.purpose,
      distance: km,
      fuelCost: parseFloat(fuelCost.toFixed(2)),
      wearCost: parseFloat(wearCost.toFixed(2)),
      total: parseFloat(totalCost.toFixed(2)),
      currency: currencySymbol,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...requests];
    setRequests(updated);
    localStorage.setItem('haazimi_reimbursements', JSON.stringify(updated));
    localStorage.setItem('haazimi_reimbursement_notify', 'true');

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ distance: '', fuelPrice: '', efficiency: 10, includeWear: false, purpose: '', travelDate: new Date().toISOString().split('T')[0] });
    }, 4000);
  };

  const handleCancel = async (req) => {
    setConfirmingId(null);
    setCancelling(req.id);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'cancelRequest',
          requestType: 'reimbursement',
          email: user.email,
          requestId: req.id,
          requestDate: req.date,
        }),
      });
    } catch {}
    const updated = requests.filter(r => r.id !== req.id);
    setRequests(updated);
    localStorage.setItem('haazimi_reimbursements', JSON.stringify(updated));
    setCancelling(null);
  };

  const myRequests = requests.filter(r => r.staffEmail === user.email);
  const statusLabel = { pending: t.pending, approved: t.approved, rejected: t.rejected };

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
      </div>

      <div className="leave-page-layout">
        <div className="form-container" style={{ flex: '1 1 420px' }}>
          <div className="form-header">
            <h2>{t.calculator}</h2>
          </div>

          {submitted && <div className="forgot-password-success" style={{ marginBottom: 20 }}>{t.submitted}</div>}
          {error && <div className="login-error-message" style={{ marginBottom: 16 }}>{error}</div>}

          <form className="generic-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label>{t.travelDate}</label>
                <input type="date" value={form.travelDate} onChange={e => set('travelDate', e.target.value)} required />
              </div>

              <div className="form-group">
                <label>{t.distance}</label>
                <input
                  type="number" min="0" step="0.1"
                  value={form.distance} onChange={e => set('distance', e.target.value)}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label>{t.fuel}</label>
                <input
                  type="number" min="0" step="0.01"
                  value={form.fuelPrice} onChange={e => set('fuelPrice', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="form-group">
                <label>{t.efficiency}</label>
                <select value={form.efficiency} onChange={e => set('efficiency', parseFloat(e.target.value))}>
                  {EFFICIENCY_OPTIONS.map(o => (
                    <option key={o} value={o}>{o} {t.kmL}</option>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label>{t.purpose}</label>
                <textarea value={form.purpose} onChange={e => set('purpose', e.target.value)} rows={2} placeholder={t.purposePlaceholder} />
              </div>

              <div className="form-group full-width">
                <label
                  style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', userSelect: 'none', padding: '12px 16px', borderRadius: 10, border: `1px solid ${form.includeWear ? 'var(--accent-color)' : 'var(--border-color)'}`, background: form.includeWear ? 'rgba(var(--accent-rgb, 59,130,246),0.06)' : 'transparent', transition: 'all 0.2s' }}
                  onClick={() => set('includeWear', !form.includeWear)}
                >
                  <div style={{ position: 'relative', width: 46, height: 26, borderRadius: 13, background: form.includeWear ? 'var(--accent-color)' : 'var(--border-color)', transition: 'background 0.2s', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 3, left: form.includeWear ? 23 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{t.wearTear}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{t.wearTearDesc} ({currencySymbol}{WEAR_RATE.toFixed(2)}/km)</div>
                  </div>
                </label>
              </div>
            </div>

            {km > 0 && pricePerL > 0 && (
              <div className="calculations-display" style={{ margin: '16px 0' }}>
                <div className="calc-item">
                  <span>{fmt(fuelCost)}</span>
                  {t.fuelCost}
                </div>
                {form.includeWear && (
                  <div className="calc-item">
                    <span>{fmt(wearCost)}</span>
                    {t.wearCost}
                  </div>
                )}
                <div className="calc-item">
                  <span style={{ color: 'var(--accent-color)', fontSize: '1.4rem' }}>{fmt(totalCost)}</span>
                  {t.totalCost}
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="button-secondary" onClick={() => setForm({ distance: '', fuelPrice: '', efficiency: 10, includeWear: false, purpose: '', travelDate: new Date().toISOString().split('T')[0] })}>{t.clear}</button>
              <button type="submit" className="button-primary"><Receipt size={16} style={{ marginRight: 6 }} />{t.submit}</button>
            </div>
          </form>
        </div>

        <div className="leave-history-panel" style={{ flex: '1 1 340px' }}>
          <h3>{t.history}</h3>
          {myRequests.length === 0 ? (
            <div className="prompt-container" style={{ marginTop: 0 }}>{t.noHistory}</div>
          ) : (
            <div className="leave-history-list">
              {myRequests.map(r => {
                const isPending = r.status === 'pending';
                return (
                  <div key={r.id} className={`leave-history-card leave-history-card--${r.status}`}>
                    <div className="leave-history-card-top">
                      <div className="leave-history-type" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Fuel size={14} /> {r.distance} {t.colDist}
                      </div>
                      <span className={`status-badge ${STATUS_CLASS[r.status] || 'status-in-progress'}`}>
                        {statusLabel[r.status] || r.status}
                      </span>
                    </div>
                    <div className="leave-history-dates">
                      {r.date}
                      <span className="leave-history-days" style={{ fontWeight: 700, color: 'var(--accent-color)' }}>{r.currency || currencySymbol}{r.total.toFixed(2)}</span>
                    </div>
                    <div className="leave-history-reason">{r.purpose}</div>
                    {r.auditNote && (
                      <div style={{ marginTop: 6, fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: 6 }}>
                        {r.auditNote}
                      </div>
                    )}
                    {isPending && (
                      confirmingId === r.id ? (
                        <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', flex: 1, minWidth: 100 }}>{t.confirmPrompt}</span>
                          <button
                            className="button-primary"
                            style={{ background: '#dc2626', borderColor: '#dc2626', padding: '5px 12px', fontSize: '0.82rem' }}
                            onClick={() => handleCancel(r)}
                            disabled={cancelling === r.id}
                          >
                            {cancelling === r.id ? t.cancelling : t.confirmYes}
                          </button>
                          <button className="button-secondary" style={{ padding: '5px 12px', fontSize: '0.82rem' }} onClick={() => setConfirmingId(null)}>{t.confirmNo}</button>
                        </div>
                      ) : (
                        <button
                          className="button-secondary"
                          style={{ width: '100%', marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: '#dc2626', borderColor: '#dc2626', fontSize: '0.85rem', padding: '7px 12px' }}
                          onClick={() => setConfirmingId(r.id)}
                        >
                          <Trash2 size={14} />
                          {t.cancelBtn}
                        </button>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
