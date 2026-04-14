import { useState } from 'react';
import { Receipt, Fuel, Trash2, Pencil, Check, X, ChevronDown, ChevronUp, Car, ShoppingBag } from 'lucide-react';
import { GOOGLE_SCRIPT_URL } from '../data/config';

const EFFICIENCY_OPTIONS = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const DEFAULT_WEAR_RATE = 0.10;

const getWearRate = () => {
  try {
    const saved = parseFloat(localStorage.getItem('haazimi_wear_rate'));
    return isNaN(saved) || saved < 0 ? DEFAULT_WEAR_RATE : saved;
  } catch { return DEFAULT_WEAR_RATE; }
};

const EXPENSE_CATEGORIES = {
  en: ['Stationery', 'Equipment', 'Printing', 'Food / Catering', 'Utilities', 'Cleaning Supplies', 'Maintenance', 'Transport / Delivery', 'Books / Materials', 'Other'],
  ar: ['قرطاسية', 'معدات', 'طباعة', 'طعام / تقديم', 'مرافق', 'مستلزمات تنظيف', 'صيانة', 'نقل / توصيل', 'كتب / مواد', 'أخرى'],
  ur: ['اسٹیشنری', 'آلات', 'پرنٹنگ', 'کھانا / کیٹرنگ', 'یوٹیلٹیز', 'صفائی کا سامان', 'مرمت', 'نقل و حمل', 'کتابیں / مواد', 'دیگر'],
  es: ['Papelería', 'Equipamiento', 'Impresión', 'Comida / Catering', 'Servicios', 'Limpieza', 'Mantenimiento', 'Transporte / Envío', 'Libros / Materiales', 'Otro'],
  pt: ['Papelaria', 'Equipamento', 'Impressão', 'Alimentação / Catering', 'Serviços', 'Limpeza', 'Manutenção', 'Transporte / Entrega', 'Livros / Materiais', 'Outro'],
};

const T = {
  en: {
    title: 'Reimbursement', sub: 'Submit travel and expense reimbursement requests',
    travelSection: 'Travel Reimbursement',
    travelSectionSub: 'Calculate and claim travel costs based on distance driven',
    expenseSection: 'Expense / Purchase Reimbursement',
    expenseSectionSub: 'Claim back purchases or payments made on behalf of the madrasah',
    calculator: 'Travel Cost Calculator',
    distance: 'Distance (km)', fuel: 'Fuel Price (per litre)', efficiency: 'Vehicle Efficiency',
    wearTear: 'Include Wear & Tear', wearTearDesc: 'Adds a standard depreciation rate per km',
    fuelCost: 'Fuel Cost', wearCost: 'Wear & Tear', totalCost: 'Total Cost',
    purpose: 'Purpose of Travel', purposePlaceholder: 'e.g. Student home visit, community meeting...',
    travelDate: 'Date of Travel',
    expenseDate: 'Date of Purchase',
    expenseCategory: 'Category',
    expenseDescription: 'Description',
    expenseDescPlaceholder: 'e.g. A4 paper reams for printing class notes',
    expenseAmount: 'Amount',
    submit: 'Submit Travel Request',
    expenseSubmit: 'Submit Expense Request',
    submitted: 'Travel reimbursement request submitted!',
    expenseSubmitted: 'Expense reimbursement request submitted!',
    history: 'My Reimbursement Requests', noHistory: 'No requests submitted yet.',
    colDate: 'Date', colPurpose: 'Purpose / Description', colDist: 'km', colTotal: 'Total', colStatus: 'Status',
    pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
    kmL: 'km/L', reqFields: 'Please fill in all required fields.',
    clear: 'Clear',
    cancelBtn: 'Cancel Request', cancelling: 'Cancelling…',
    confirmPrompt: 'Are you sure?', confirmYes: 'Yes, Cancel', confirmNo: 'Keep',
    wearRateLabel: 'Wear & Tear Rate', wearRateDesc: 'Rate applied per km when staff include wear & tear',
    wearRateSaved: 'Rate updated!', wearRateInvalid: 'Please enter a valid rate (e.g. 0.10)',
    perKm: '/km', editRate: 'Edit rate',
    typeTravel: 'Travel', typeExpense: 'Expense',
  },
  ar: {
    title: 'التعويض', sub: 'تقديم طلبات تعويض السفر والمصاريف',
    travelSection: 'تعويض السفر',
    travelSectionSub: 'احسب وطالب بتكاليف السفر بناءً على المسافة المقطوعة',
    expenseSection: 'تعويض المصاريف / المشتريات',
    expenseSectionSub: 'استرداد المشتريات أو المدفوعات التي تمت نيابةً عن المدرسة',
    calculator: 'حاسبة تكاليف السفر',
    distance: 'المسافة (كم)', fuel: 'سعر الوقود (لكل لتر)', efficiency: 'كفاءة المركبة',
    wearTear: 'تضمين التآكل', wearTearDesc: 'يضيف معدل إهلاك قياسي لكل كم',
    fuelCost: 'تكلفة الوقود', wearCost: 'التآكل', totalCost: 'التكلفة الإجمالية',
    purpose: 'غرض السفر', purposePlaceholder: 'مثل: زيارة منزل طالب...',
    travelDate: 'تاريخ السفر',
    expenseDate: 'تاريخ الشراء',
    expenseCategory: 'الفئة',
    expenseDescription: 'الوصف',
    expenseDescPlaceholder: 'مثل: رزمات ورق A4 لطباعة ملاحظات الفصل',
    expenseAmount: 'المبلغ',
    submit: 'إرسال طلب السفر',
    expenseSubmit: 'إرسال طلب المصروف',
    submitted: 'تم إرسال طلب تعويض السفر!',
    expenseSubmitted: 'تم إرسال طلب تعويض المصروف!',
    history: 'طلبات التعويض', noHistory: 'لا توجد طلبات مقدمة بعد.',
    colDate: 'التاريخ', colPurpose: 'الغرض / الوصف', colDist: 'كم', colTotal: 'المجموع', colStatus: 'الحالة',
    pending: 'معلق', approved: 'موافق', rejected: 'مرفوض',
    kmL: 'كم/لتر', reqFields: 'يرجى ملء جميع الحقول المطلوبة.',
    clear: 'مسح',
    cancelBtn: 'إلغاء الطلب', cancelling: 'جارٍ الإلغاء...',
    confirmPrompt: 'هل أنت متأكد؟', confirmYes: 'نعم، إلغاء', confirmNo: 'الإبقاء',
    wearRateLabel: 'معدل التآكل', wearRateDesc: 'المعدل المطبق لكل كم عند تضمين التآكل',
    wearRateSaved: 'تم تحديث المعدل!', wearRateInvalid: 'يرجى إدخال معدل صالح (مثل: 0.10)',
    perKm: '/كم', editRate: 'تعديل المعدل',
    typeTravel: 'سفر', typeExpense: 'مصروف',
  },
  ur: {
    title: 'معاوضہ', sub: 'سفری اور اخراجاتی معاوضے کی درخواستیں جمع کریں',
    travelSection: 'سفری معاوضہ',
    travelSectionSub: 'طے شدہ فاصلے کی بنیاد پر سفری اخراجات کا حساب لگائیں اور دعوی کریں',
    expenseSection: 'اخراجات / خریداری کا معاوضہ',
    expenseSectionSub: 'مدرسے کی جانب سے کی گئی خریداریوں یا ادائیگیوں کا معاوضہ حاصل کریں',
    calculator: 'سفری لاگت حساب کار',
    distance: 'فاصلہ (کلومیٹر)', fuel: 'ایندھن کی قیمت (فی لیٹر)', efficiency: 'گاڑی کی کارکردگی',
    wearTear: 'گھسٹ شامل کریں', wearTearDesc: 'فی کلومیٹر معیاری استہلاک شرح شامل کرتا ہے',
    fuelCost: 'ایندھن کی لاگت', wearCost: 'گھسٹ', totalCost: 'کل لاگت',
    purpose: 'سفر کا مقصد', purposePlaceholder: 'مثلاً طالب علم کے گھر کا دورہ...',
    travelDate: 'سفر کی تاریخ',
    expenseDate: 'خریداری کی تاریخ',
    expenseCategory: 'زمرہ',
    expenseDescription: 'تفصیل',
    expenseDescPlaceholder: 'مثلاً کلاس نوٹس پرنٹ کرنے کے لیے A4 کاغذ',
    expenseAmount: 'رقم',
    submit: 'سفری درخواست جمع کریں',
    expenseSubmit: 'اخراجاتی درخواست جمع کریں',
    submitted: 'سفری معاوضہ درخواست جمع ہو گئی!',
    expenseSubmitted: 'اخراجاتی معاوضہ درخواست جمع ہو گئی!',
    history: 'میری معاوضہ درخواستیں', noHistory: 'ابھی تک کوئی درخواست جمع نہیں۔',
    colDate: 'تاریخ', colPurpose: 'مقصد / تفصیل', colDist: 'کلومیٹر', colTotal: 'کل', colStatus: 'حالت',
    pending: 'زیر التواء', approved: 'منظور', rejected: 'مسترد',
    kmL: 'کلومیٹر/لیٹر', reqFields: 'براہ کرم تمام ضروری خانے بھریں۔',
    clear: 'صاف کریں',
    cancelBtn: 'درخواست منسوخ کریں', cancelling: 'منسوخ ہو رہا ہے...',
    confirmPrompt: 'کیا آپ یقین سے چاہتے ہیں؟', confirmYes: 'ہاں، منسوخ کریں', confirmNo: 'رکھیں',
    wearRateLabel: 'گھسٹ کی شرح', wearRateDesc: 'گھسٹ شامل کرتے وقت فی کلومیٹر لاگو شرح',
    wearRateSaved: 'شرح اپ ڈیٹ ہو گئی!', wearRateInvalid: 'براہ کرم درست شرح درج کریں (مثلاً 0.10)',
    perKm: '/کلومیٹر', editRate: 'شرح تبدیل کریں',
    typeTravel: 'سفر', typeExpense: 'اخراجات',
  },
  es: {
    title: 'Reembolso', sub: 'Envía solicitudes de reembolso de viaje y gastos',
    travelSection: 'Reembolso de Viaje',
    travelSectionSub: 'Calcula y reclama los costos de viaje según la distancia recorrida',
    expenseSection: 'Reembolso de Gastos / Compras',
    expenseSectionSub: 'Reclama compras o pagos realizados en nombre de la madrassa',
    calculator: 'Calculadora de Costos de Viaje',
    distance: 'Distancia (km)', fuel: 'Precio del Combustible (por litro)', efficiency: 'Eficiencia del Vehículo',
    wearTear: 'Incluir Desgaste', wearTearDesc: 'Añade una tasa de depreciación estándar por km',
    fuelCost: 'Costo de Combustible', wearCost: 'Desgaste', totalCost: 'Costo Total',
    purpose: 'Propósito del Viaje', purposePlaceholder: 'ej. Visita al hogar del estudiante...',
    travelDate: 'Fecha del Viaje',
    expenseDate: 'Fecha de Compra',
    expenseCategory: 'Categoría',
    expenseDescription: 'Descripción',
    expenseDescPlaceholder: 'ej. Resmas de papel A4 para imprimir notas de clase',
    expenseAmount: 'Monto',
    submit: 'Enviar Solicitud de Viaje',
    expenseSubmit: 'Enviar Solicitud de Gasto',
    submitted: '¡Solicitud de reembolso de viaje enviada!',
    expenseSubmitted: '¡Solicitud de reembolso de gasto enviada!',
    history: 'Mis Solicitudes de Reembolso', noHistory: 'No hay solicitudes enviadas aún.',
    colDate: 'Fecha', colPurpose: 'Propósito / Descripción', colDist: 'km', colTotal: 'Total', colStatus: 'Estado',
    pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado',
    kmL: 'km/L', reqFields: 'Por favor complete todos los campos requeridos.',
    clear: 'Limpiar',
    cancelBtn: 'Cancelar Solicitud', cancelling: 'Cancelando…',
    confirmPrompt: '¿Estás seguro?', confirmYes: 'Sí, Cancelar', confirmNo: 'Mantener',
    wearRateLabel: 'Tasa de Desgaste', wearRateDesc: 'Tasa aplicada por km al incluir desgaste',
    wearRateSaved: '¡Tasa actualizada!', wearRateInvalid: 'Introduce una tasa válida (ej. 0.10)',
    perKm: '/km', editRate: 'Editar tasa',
    typeTravel: 'Viaje', typeExpense: 'Gasto',
  },
  pt: {
    title: 'Reembolso', sub: 'Envie solicitações de reembolso de viagem e despesas',
    travelSection: 'Reembolso de Viagem',
    travelSectionSub: 'Calcule e reclame os custos de viagem com base na distância percorrida',
    expenseSection: 'Reembolso de Despesas / Compras',
    expenseSectionSub: 'Reclame compras ou pagamentos feitos em nome da madrassa',
    calculator: 'Calculadora de Custos de Viagem',
    distance: 'Distância (km)', fuel: 'Preço do Combustível (por litro)', efficiency: 'Eficiência do Veículo',
    wearTear: 'Incluir Desgaste', wearTearDesc: 'Adiciona uma taxa de depreciação padrão por km',
    fuelCost: 'Custo de Combustível', wearCost: 'Desgaste', totalCost: 'Custo Total',
    purpose: 'Propósito da Viagem', purposePlaceholder: 'ex. Visita ao lar do estudante...',
    travelDate: 'Data da Viagem',
    expenseDate: 'Data da Compra',
    expenseCategory: 'Categoria',
    expenseDescription: 'Descrição',
    expenseDescPlaceholder: 'ex. Resmas de papel A4 para impressão de notas de aula',
    expenseAmount: 'Valor',
    submit: 'Enviar Pedido de Viagem',
    expenseSubmit: 'Enviar Pedido de Despesa',
    submitted: 'Pedido de reembolso de viagem enviado!',
    expenseSubmitted: 'Pedido de reembolso de despesa enviado!',
    history: 'Minhas Solicitações de Reembolso', noHistory: 'Nenhuma solicitação enviada ainda.',
    colDate: 'Data', colPurpose: 'Propósito / Descrição', colDist: 'km', colTotal: 'Total', colStatus: 'Status',
    pending: 'Pendente', approved: 'Aprovado', rejected: 'Rejeitado',
    kmL: 'km/L', reqFields: 'Por favor preencha todos os campos obrigatórios.',
    clear: 'Limpar',
    cancelBtn: 'Cancelar Solicitação', cancelling: 'Cancelando…',
    confirmPrompt: 'Tem certeza?', confirmYes: 'Sim, Cancelar', confirmNo: 'Manter',
    wearRateLabel: 'Taxa de Desgaste', wearRateDesc: 'Taxa aplicada por km ao incluir desgaste',
    wearRateSaved: 'Taxa atualizada!', wearRateInvalid: 'Insira uma taxa válida (ex. 0.10)',
    perKm: '/km', editRate: 'Editar taxa',
    typeTravel: 'Viagem', typeExpense: 'Despesa',
  },
};

const STATUS_CLASS = { pending: 'status-in-progress', approved: 'status-completed', rejected: 'status-incomplete' };
const ADMIN_ROLES = ['Country Admin', 'Centre Manager'];

function AccordionSection({ icon: Icon, iconColor, title, subtitle, open, onToggle, children }) {
  return (
    <div style={{
      border: '1px solid var(--border-color)',
      borderRadius: 14,
      overflow: 'hidden',
      marginBottom: 16,
    }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 14,
          width: '100%', padding: '16px 20px',
          background: open ? 'var(--card-bg)' : 'var(--main-bg)',
          border: 'none', cursor: 'pointer',
          borderBottom: open ? '1px solid var(--border-color)' : 'none',
          transition: 'background 0.2s',
          textAlign: 'left',
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: iconColor + '18',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={iconColor} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.97rem', color: 'var(--text-dark)' }}>{title}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--subtle-text-color)', marginTop: 2 }}>{subtitle}</div>
        </div>
        {open ? <ChevronUp size={18} color="var(--subtle-text-color)" /> : <ChevronDown size={18} color="var(--subtle-text-color)" />}
      </button>
      {open && (
        <div style={{ padding: '20px 20px 24px', background: 'var(--card-bg)' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default function Reimbursement({ user, language, checkVisibility }) {
  const t = T[language] || T.en;
  const lang = language || 'en';
  const currencySymbol = localStorage.getItem('haazimi_currency') || '$';
  const isAdmin = ADMIN_ROLES.includes(user?.role);
  const showExpenses = checkVisibility ? checkVisibility('expenses') : false;

  const [travelOpen, setTravelOpen] = useState(true);
  const [expenseOpen, setExpenseOpen] = useState(true);

  const [wearRate, setWearRate] = useState(getWearRate);
  const [editingRate, setEditingRate] = useState(false);
  const [rateInput, setRateInput] = useState('');
  const [rateError, setRateError] = useState('');
  const [rateSaved, setRateSaved] = useState(false);

  const [form, setForm] = useState({
    distance: '', fuelPrice: '', efficiency: 10,
    includeWear: false, purpose: '',
    travelDate: new Date().toISOString().split('T')[0],
  });
  const [travelSubmitted, setTravelSubmitted] = useState(false);
  const [travelError, setTravelError] = useState('');

  const categories = EXPENSE_CATEGORIES[lang] || EXPENSE_CATEGORIES.en;
  const [expForm, setExpForm] = useState({
    date: new Date().toISOString().split('T')[0],
    category: categories[0],
    description: '',
    amount: '',
  });
  const [expSubmitted, setExpSubmitted] = useState(false);
  const [expError, setExpError] = useState('');

  const [cancelling, setCancelling] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  const [requests, setRequests] = useState(() => {
    try { return JSON.parse(localStorage.getItem('haazimi_reimbursements') || '[]'); } catch { return []; }
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setExp = (k, v) => setExpForm(f => ({ ...f, [k]: v }));

  const km = parseFloat(form.distance) || 0;
  const pricePerL = parseFloat(form.fuelPrice) || 0;
  const eff = parseFloat(form.efficiency) || 10;
  const litresUsed = km > 0 && eff > 0 ? km / eff : 0;
  const fuelCost = litresUsed * pricePerL;
  const wearCost = form.includeWear ? km * wearRate : 0;
  const totalCost = fuelCost + wearCost;
  const fmt = (n) => `${currencySymbol}${n.toFixed(2)}`;

  const startEditRate = () => { setRateInput(wearRate.toFixed(2)); setRateError(''); setRateSaved(false); setEditingRate(true); };
  const cancelEditRate = () => { setEditingRate(false); setRateError(''); };
  const saveRate = () => {
    const parsed = parseFloat(rateInput);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) { setRateError(t.wearRateInvalid); return; }
    setWearRate(parsed);
    localStorage.setItem('haazimi_wear_rate', parsed.toString());
    setEditingRate(false); setRateError('');
    setRateSaved(true); setTimeout(() => setRateSaved(false), 3000);
  };

  const handleTravelSubmit = (e) => {
    e.preventDefault();
    if (!form.distance || !form.fuelPrice || !form.purpose || !form.travelDate) {
      setTravelError(t.reqFields); return;
    }
    setTravelError('');
    const newReq = {
      id: Date.now(), type: 'travel',
      staffName: user.name, staffEmail: user.email,
      date: form.travelDate, purpose: form.purpose,
      distance: km,
      fuelCost: parseFloat(fuelCost.toFixed(2)),
      wearCost: parseFloat(wearCost.toFixed(2)),
      total: parseFloat(totalCost.toFixed(2)),
      currency: currencySymbol, status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    const updated = [newReq, ...requests];
    setRequests(updated);
    localStorage.setItem('haazimi_reimbursements', JSON.stringify(updated));
    localStorage.setItem('haazimi_reimbursement_notify', 'true');
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ type: 'reimbursement', ...newReq }),
    }).catch(() => {});
    setTravelSubmitted(true);
    setTimeout(() => {
      setTravelSubmitted(false);
      setForm({ distance: '', fuelPrice: '', efficiency: 10, includeWear: false, purpose: '', travelDate: new Date().toISOString().split('T')[0] });
    }, 3500);
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expForm.date || !expForm.category || !expForm.description || !expForm.amount) {
      setExpError(t.reqFields); return;
    }
    const amt = parseFloat(expForm.amount);
    if (isNaN(amt) || amt <= 0) { setExpError(t.reqFields); return; }
    setExpError('');
    const newReq = {
      id: Date.now(), type: 'expense',
      staffName: user.name, staffEmail: user.email,
      date: expForm.date, purpose: expForm.description,
      category: expForm.category,
      total: parseFloat(amt.toFixed(2)),
      currency: currencySymbol, status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    const updated = [newReq, ...requests];
    setRequests(updated);
    localStorage.setItem('haazimi_reimbursements', JSON.stringify(updated));
    localStorage.setItem('haazimi_reimbursement_notify', 'true');
    fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ type: 'expenseReimbursement', ...newReq }),
    }).catch(() => {});
    setExpSubmitted(true);
    setTimeout(() => {
      setExpSubmitted(false);
      setExpForm({ date: new Date().toISOString().split('T')[0], category: categories[0], description: '', amount: '' });
    }, 3500);
  };

  const handleCancel = async (req) => {
    setConfirmingId(null); setCancelling(req.id);
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ type: 'cancelRequest', requestType: 'reimbursement', email: user.email, requestId: req.id, requestDate: req.date }),
      });
    } catch {}
    const updated = requests.filter(r => r.id !== req.id);
    setRequests(updated);
    localStorage.setItem('haazimi_reimbursements', JSON.stringify(updated));
    setCancelling(null);
  };

  const myRequests = requests.filter(r => r.staffEmail === user.email);
  const statusLabel = { pending: t.pending, approved: t.approved, rejected: t.rejected };

  const Toggle = ({ checked, onChange }) => (
    <div
      onClick={onChange}
      style={{
        position: 'relative', width: 46, height: 26, borderRadius: 13,
        background: checked ? 'var(--accent-color)' : 'var(--border-color)',
        transition: 'background 0.2s', flexShrink: 0, cursor: 'pointer',
      }}
    >
      <div style={{
        position: 'absolute', top: 3, left: checked ? 23 : 3, width: 20, height: 20,
        borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
        boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
      }} />
    </div>
  );

  return (
    <div>
      <div className="view-header">
        <div><h2>{t.title}</h2><p>{t.sub}</p></div>
      </div>

      {/* Wear & Tear Rate Banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
        background: 'var(--card-bg)', border: '1px solid var(--border-color)',
        borderRadius: 10, padding: '12px 16px', marginBottom: 20,
        borderLeft: '4px solid var(--accent-color)',
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-dark)' }}>{t.wearRateLabel}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--subtle-text-color)', marginTop: 2 }}>{t.wearRateDesc}</div>
        </div>
        {editingRate ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--subtle-text-color)' }}>{currencySymbol}</span>
              <input
                type="number" min="0" step="0.01" value={rateInput}
                onChange={e => { setRateInput(e.target.value); setRateError(''); }}
                style={{ width: 80, padding: '6px 8px', border: `1px solid ${rateError ? '#e74c3c' : 'var(--accent-color)'}`, borderRadius: 6, fontSize: '0.9rem', background: 'var(--input-bg)', color: 'var(--text-dark)' }}
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter') saveRate(); if (e.key === 'Escape') cancelEditRate(); }}
              />
              <span style={{ fontSize: '0.85rem', color: 'var(--subtle-text-color)' }}>{t.perKm}</span>
            </div>
            {rateError && <span style={{ fontSize: '0.78rem', color: '#e74c3c', width: '100%' }}>{rateError}</span>}
            <button onClick={saveRate} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
              <Check size={14} /> Save
            </button>
            <button onClick={cancelEditRate} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '6px 10px', background: 'transparent', color: 'var(--subtle-text-color)', border: '1px solid var(--border-color)', borderRadius: 6, cursor: 'pointer', fontSize: '0.85rem' }}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {rateSaved && <span style={{ fontSize: '0.78rem', color: 'var(--success-color)', fontWeight: 600 }}>{t.wearRateSaved}</span>}
            <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-color)' }}>{currencySymbol}{wearRate.toFixed(2)}{t.perKm}</span>
            {isAdmin && (
              <button onClick={startEditRate} title={t.editRate} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: 'transparent', color: 'var(--accent-color)', border: '1px solid var(--accent-color)', borderRadius: 6, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>
                <Pencil size={13} /> {t.editRate}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="leave-page-layout">
        <div style={{ flex: '1 1 420px', minWidth: 0 }}>

          {/* Travel Reimbursement Accordion */}
          <AccordionSection
            icon={Car}
            iconColor="#3b82f6"
            title={t.travelSection}
            subtitle={t.travelSectionSub}
            open={travelOpen}
            onToggle={() => setTravelOpen(o => !o)}
          >
            {travelSubmitted && <div className="forgot-password-success" style={{ marginBottom: 16 }}>{t.submitted}</div>}
            {travelError && <div className="login-error-message" style={{ marginBottom: 14 }}>{travelError}</div>}

            <form className="generic-form" onSubmit={handleTravelSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>{t.travelDate}</label>
                  <input type="date" value={form.travelDate} onChange={e => set('travelDate', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>{t.distance}</label>
                  <input type="number" min="0" step="0.1" value={form.distance} onChange={e => set('distance', e.target.value)} placeholder="0" />
                </div>
                <div className="form-group">
                  <label>{t.fuel}</label>
                  <input type="number" min="0" step="0.01" value={form.fuelPrice} onChange={e => set('fuelPrice', e.target.value)} placeholder="0.00" />
                </div>
                <div className="form-group">
                  <label>{t.efficiency}</label>
                  <select value={form.efficiency} onChange={e => set('efficiency', parseFloat(e.target.value))}>
                    {EFFICIENCY_OPTIONS.map(o => <option key={o} value={o}>{o} {t.kmL}</option>)}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>{t.purpose}</label>
                  <textarea value={form.purpose} onChange={e => set('purpose', e.target.value)} rows={2} placeholder={t.purposePlaceholder} />
                </div>
                <div className="form-group full-width">
                  <label
                    style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', userSelect: 'none', padding: '12px 16px', borderRadius: 10, border: `1px solid ${form.includeWear ? 'var(--accent-color)' : 'var(--border-color)'}`, background: form.includeWear ? 'rgba(59,130,246,0.06)' : 'transparent', transition: 'all 0.2s' }}
                    onClick={() => set('includeWear', !form.includeWear)}
                  >
                    <Toggle checked={form.includeWear} onChange={() => {}} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{t.wearTear}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--subtle-text-color)' }}>{t.wearTearDesc} ({currencySymbol}{wearRate.toFixed(2)}/km)</div>
                    </div>
                  </label>
                </div>
              </div>

              {km > 0 && pricePerL > 0 && (
                <div className="calculations-display" style={{ margin: '16px 0' }}>
                  <div className="calc-item"><span>{fmt(fuelCost)}</span>{t.fuelCost}</div>
                  {form.includeWear && <div className="calc-item"><span>{fmt(wearCost)}</span>{t.wearCost}</div>}
                  <div className="calc-item"><span style={{ color: 'var(--accent-color)', fontSize: '1.4rem' }}>{fmt(totalCost)}</span>{t.totalCost}</div>
                </div>
              )}

              <div className="form-actions">
                <button type="button" className="button-secondary" onClick={() => setForm({ distance: '', fuelPrice: '', efficiency: 10, includeWear: false, purpose: '', travelDate: new Date().toISOString().split('T')[0] })}>{t.clear}</button>
                <button type="submit" className="button-primary"><Car size={15} style={{ marginRight: 6 }} />{t.submit}</button>
              </div>
            </form>
          </AccordionSection>

          {/* Expense / Purchase Reimbursement Accordion — only if enabled */}
          {showExpenses && (
            <AccordionSection
              icon={ShoppingBag}
              iconColor="#8b5cf6"
              title={t.expenseSection}
              subtitle={t.expenseSectionSub}
              open={expenseOpen}
              onToggle={() => setExpenseOpen(o => !o)}
            >
              {expSubmitted && <div className="forgot-password-success" style={{ marginBottom: 16 }}>{t.expenseSubmitted}</div>}
              {expError && <div className="login-error-message" style={{ marginBottom: 14 }}>{expError}</div>}

              <form className="generic-form" onSubmit={handleExpenseSubmit}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>{t.expenseDate}</label>
                    <input type="date" value={expForm.date} onChange={e => setExp('date', e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>{t.expenseCategory}</label>
                    <select value={expForm.category} onChange={e => setExp('category', e.target.value)}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>{t.expenseDescription}</label>
                    <textarea value={expForm.description} onChange={e => setExp('description', e.target.value)} rows={2} placeholder={t.expenseDescPlaceholder} />
                  </div>
                  <div className="form-group">
                    <label>{t.expenseAmount}</label>
                    <input
                      type="number" min="0.01" step="0.01"
                      value={expForm.amount} onChange={e => setExp('amount', e.target.value)}
                      placeholder={`${currencySymbol}0.00`}
                    />
                  </div>
                </div>

                {expForm.amount && parseFloat(expForm.amount) > 0 && (
                  <div className="calculations-display" style={{ margin: '16px 0' }}>
                    <div className="calc-item">
                      <span style={{ color: '#8b5cf6', fontSize: '1.4rem' }}>{currencySymbol}{parseFloat(expForm.amount || 0).toFixed(2)}</span>
                      {t.totalCost}
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button type="button" className="button-secondary" onClick={() => setExpForm({ date: new Date().toISOString().split('T')[0], category: categories[0], description: '', amount: '' })}>{t.clear}</button>
                  <button type="submit" className="button-primary" style={{ background: '#8b5cf6', borderColor: '#8b5cf6' }}>
                    <ShoppingBag size={15} style={{ marginRight: 6 }} />{t.expenseSubmit}
                  </button>
                </div>
              </form>
            </AccordionSection>
          )}
        </div>

        {/* History Panel */}
        <div className="leave-history-panel" style={{ flex: '1 1 340px' }}>
          <h3>{t.history}</h3>
          {myRequests.length === 0 ? (
            <div className="prompt-container" style={{ marginTop: 0 }}>{t.noHistory}</div>
          ) : (
            <div className="leave-history-list">
              {myRequests.map(r => {
                const isPending = r.status === 'pending';
                const isTravel = r.type !== 'expense';
                return (
                  <div key={r.id} className={`leave-history-card leave-history-card--${r.status}`}>
                    <div className="leave-history-card-top">
                      <div className="leave-history-type" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {isTravel
                          ? <><Car size={13} /> {r.distance} {t.colDist}</>
                          : <><ShoppingBag size={13} /> {r.category || t.typeExpense}</>
                        }
                        <span style={{
                          marginLeft: 4, padding: '1px 7px', borderRadius: 99, fontSize: '0.7rem', fontWeight: 600,
                          background: isTravel ? 'rgba(59,130,246,0.12)' : 'rgba(139,92,246,0.12)',
                          color: isTravel ? '#3b82f6' : '#8b5cf6',
                        }}>
                          {isTravel ? t.typeTravel : t.typeExpense}
                        </span>
                      </div>
                      <span className={`status-badge ${STATUS_CLASS[r.status] || 'status-in-progress'}`}>
                        {statusLabel[r.status] || r.status}
                      </span>
                    </div>
                    <div className="leave-history-dates">
                      {r.date}
                      <span className="leave-history-days" style={{ fontWeight: 700, color: isTravel ? 'var(--accent-color)' : '#8b5cf6' }}>
                        {r.currency || currencySymbol}{r.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="leave-history-reason">{r.purpose}</div>
                    {r.auditNote && (
                      <div style={{ marginTop: 6, fontSize: '0.78rem', color: 'var(--subtle-text-color)', borderTop: '1px solid var(--border-color)', paddingTop: 6 }}>
                        {r.auditNote}
                      </div>
                    )}
                    {isPending && (
                      confirmingId === r.id ? (
                        <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.82rem', color: 'var(--subtle-text-color)', flex: 1, minWidth: 100 }}>{t.confirmPrompt}</span>
                          <button className="button-primary" style={{ background: '#dc2626', borderColor: '#dc2626', padding: '5px 12px', fontSize: '0.82rem' }} onClick={() => handleCancel(r)} disabled={cancelling === r.id}>
                            {cancelling === r.id ? t.cancelling : t.confirmYes}
                          </button>
                          <button className="button-secondary" style={{ padding: '5px 12px', fontSize: '0.82rem' }} onClick={() => setConfirmingId(null)}>{t.confirmNo}</button>
                        </div>
                      ) : (
                        <button className="button-secondary" style={{ marginTop: 10, padding: '5px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 5 }} onClick={() => setConfirmingId(r.id)} disabled={cancelling === r.id}>
                          <Trash2 size={13} /> {t.cancelBtn}
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
