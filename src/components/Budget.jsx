import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Paperclip, X, Save, Loader2, ChevronLeft, ChevronRight, ExternalLink, Upload } from 'lucide-react';
import { BUDGET_ITEMS as MOCK_BUDGET } from '../data/mockData';
import { GOOGLE_SCRIPT_URL } from '../data/config';

const T = {
  en: {
    title: 'Budget', sub: 'Monthly financial overview and expenditure tracking',
    totalBudget: 'Total Budget', totalSpent: 'Total Spent', remaining: 'Remaining', budgetUsed: 'Budget Used',
    expenseBreakdown: 'Expense Breakdown', category: 'Category', budgeted: 'Budgeted',
    spent: 'Spent', variance: 'Variance', progress: 'Progress', status: 'Status',
    total: 'Total', overBudget: 'Over Budget', nearLimit: 'Near Limit', onTrack: 'On Track', withinBudget: 'Within Budget',
    addItem: 'Add Item', editItem: 'Edit Budget Item', addItemTitle: 'Add Budget Item',
    categoryLabel: 'Category Name', budgetedLabel: 'Budgeted Amount', spentLabel: 'Amount Spent',
    notesLabel: 'Notes (optional)', receiptLabel: 'Attach Receipt (image/PDF)',
    cancel: 'Cancel', save: 'Save Changes', add: 'Add Item', delete: 'Delete', edit: 'Edit',
    confirmDelete: (c) => `Delete "${c}" from the budget?`,
    saving: 'Saving…', uploading: 'Uploading receipt…',
    noItems: 'No budget items for this month. Click "Add Item" to start.',
    viewReceipt: 'View Receipt', removeReceipt: 'Remove',
    mockBadge: 'Mock Data Active',
    mockBanner: 'MOCK DATA MODE — Showing sample data. No live API calls.',
    fetchError: 'Could not load budget from cloud. Showing local data.',
    actions: 'Actions', receipt: 'Receipt',
  },
  ar: {
    title: 'الميزانية', sub: 'نظرة عامة مالية شهرية',
    totalBudget: 'إجمالي الميزانية', totalSpent: 'إجمالي الإنفاق', remaining: 'المتبقي', budgetUsed: 'الميزانية المستخدمة',
    expenseBreakdown: 'تفصيل النفقات', category: 'الفئة', budgeted: 'المخطط',
    spent: 'المنفق', variance: 'الفارق', progress: 'التقدم', status: 'الحالة',
    total: 'الإجمالي', overBudget: 'تجاوز الميزانية', nearLimit: 'قريب من الحد', onTrack: 'في المسار', withinBudget: 'ضمن الميزانية',
    addItem: 'إضافة بند', editItem: 'تعديل بند', addItemTitle: 'إضافة بند ميزانية',
    categoryLabel: 'اسم الفئة', budgetedLabel: 'المبلغ المخطط', spentLabel: 'المبلغ المنفق',
    notesLabel: 'ملاحظات', receiptLabel: 'إرفاق إيصال',
    cancel: 'إلغاء', save: 'حفظ', add: 'إضافة', delete: 'حذف', edit: 'تعديل',
    confirmDelete: (c) => `حذف "${c}"؟`,
    saving: 'جارٍ الحفظ…', uploading: 'جارٍ الرفع…',
    noItems: 'لا توجد بنود لهذا الشهر.', viewReceipt: 'عرض الإيصال', removeReceipt: 'إزالة',
    mockBadge: 'بيانات تجريبية', mockBanner: 'وضع تجريبي.', fetchError: 'تعذّر التحميل.', actions: 'إجراءات', receipt: 'إيصال',
  },
  ur: {
    title: 'بجٹ', sub: 'ماہانہ مالی جائزہ',
    totalBudget: 'کل بجٹ', totalSpent: 'کل خرچ', remaining: 'باقی', budgetUsed: 'بجٹ استعمال',
    expenseBreakdown: 'اخراجات کی تفصیل', category: 'قسم', budgeted: 'مختص',
    spent: 'خرچ', variance: 'فرق', progress: 'پیش رفت', status: 'حالت',
    total: 'کل', overBudget: 'بجٹ سے زیادہ', nearLimit: 'حد کے قریب', onTrack: 'ٹھیک', withinBudget: 'بجٹ میں',
    addItem: 'شامل کریں', editItem: 'ترمیم', addItemTitle: 'بجٹ آئٹم شامل کریں',
    categoryLabel: 'قسم کا نام', budgetedLabel: 'مختص رقم', spentLabel: 'خرچ رقم',
    notesLabel: 'نوٹس', receiptLabel: 'رسید منسلک کریں',
    cancel: 'منسوخ', save: 'محفوظ', add: 'شامل', delete: 'ہٹائیں', edit: 'ترمیم',
    confirmDelete: (c) => `"${c}" ہٹائیں؟`,
    saving: 'محفوظ ہو رہا ہے…', uploading: 'اپلوڈ ہو رہا ہے…',
    noItems: 'اس ماہ کوئی آئٹم نہیں۔', viewReceipt: 'رسید دیکھیں', removeReceipt: 'ہٹائیں',
    mockBadge: 'موک ڈیٹا', mockBanner: 'موک ڈیٹا موڈ۔', fetchError: 'ڈیٹا لوڈ نہیں ہوا۔', actions: 'اقدامات', receipt: 'رسید',
  },
  es: {
    title: 'Presupuesto', sub: 'Resumen financiero mensual y seguimiento de gastos',
    totalBudget: 'Presupuesto Total', totalSpent: 'Total Gastado', remaining: 'Restante', budgetUsed: 'Presupuesto Usado',
    expenseBreakdown: 'Desglose de Gastos', category: 'Categoría', budgeted: 'Presupuestado',
    spent: 'Gastado', variance: 'Variación', progress: 'Progreso', status: 'Estado',
    total: 'Total', overBudget: 'Sobre Presupuesto', nearLimit: 'Cerca del Límite', onTrack: 'En Camino', withinBudget: 'Dentro del Presupuesto',
    addItem: 'Agregar', editItem: 'Editar Ítem', addItemTitle: 'Agregar Ítem de Presupuesto',
    categoryLabel: 'Nombre de Categoría', budgetedLabel: 'Monto Presupuestado', spentLabel: 'Monto Gastado',
    notesLabel: 'Notas (opcional)', receiptLabel: 'Adjuntar Comprobante',
    cancel: 'Cancelar', save: 'Guardar Cambios', add: 'Agregar', delete: 'Eliminar', edit: 'Editar',
    confirmDelete: (c) => `¿Eliminar "${c}"?`,
    saving: 'Guardando…', uploading: 'Subiendo…',
    noItems: 'No hay ítems para este mes.', viewReceipt: 'Ver Comprobante', removeReceipt: 'Quitar',
    mockBadge: 'Datos de Prueba', mockBanner: 'MODO DE PRUEBA.', fetchError: 'No se pudo cargar.', actions: 'Acciones', receipt: 'Comprobante',
  },
  pt: {
    title: 'Orçamento', sub: 'Visão geral financeira mensal',
    totalBudget: 'Orçamento Total', totalSpent: 'Total Gasto', remaining: 'Restante', budgetUsed: 'Orçamento Usado',
    expenseBreakdown: 'Detalhamento de Despesas', category: 'Categoria', budgeted: 'Orçado',
    spent: 'Gasto', variance: 'Variação', progress: 'Progresso', status: 'Estado',
    total: 'Total', overBudget: 'Acima do Orçamento', nearLimit: 'Perto do Limite', onTrack: 'No Caminho', withinBudget: 'Dentro do Orçamento',
    addItem: 'Adicionar', editItem: 'Editar Item', addItemTitle: 'Adicionar Item de Orçamento',
    categoryLabel: 'Nome da Categoria', budgetedLabel: 'Valor Orçado', spentLabel: 'Valor Gasto',
    notesLabel: 'Notas (opcional)', receiptLabel: 'Anexar Comprovante',
    cancel: 'Cancelar', save: 'Salvar Alterações', add: 'Adicionar', delete: 'Remover', edit: 'Editar',
    confirmDelete: (c) => `Remover "${c}"?`,
    saving: 'Salvando…', uploading: 'Enviando…',
    noItems: 'Nenhum item para este mês.', viewReceipt: 'Ver Comprovante', removeReceipt: 'Remover',
    mockBadge: 'Dados de Teste', mockBanner: 'MODO DE TESTE.', fetchError: 'Falha ao carregar.', actions: 'Ações', receipt: 'Comprovante',
  },
};

const fmtMonth = (d) => d.toLocaleString('default', { month: 'long', year: 'numeric' });
const monthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
const EMPTY_FORM = { category: '', budgeted: '', spent: '', notes: '', receiptName: '', receiptData: '', receiptUrl: '' };

function BudgetModal({ item, onClose, onSave, t, saving, uploading, onUploadReceipt, isDev }) {
  const [form, setForm] = useState(item
    ? { category: item.category, budgeted: String(item.budgeted), spent: String(item.spent), notes: item.notes || '', receiptName: item.receiptName || '', receiptData: item.receiptData || '', receiptUrl: item.receiptUrl || '' }
    : { ...EMPTY_FORM }
  );
  const fileRef = useRef();
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (isDev) {
      const reader = new FileReader();
      reader.onload = ev => set('receiptData', ev.target.result) || set('receiptName', file.name) || set('receiptUrl', ev.target.result);
      reader.readAsDataURL(file);
      set('receiptName', file.name);
    } else {
      const url = await onUploadReceipt(file);
      set('receiptUrl', url || '');
      set('receiptName', file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, budgeted: parseFloat(form.budgeted) || 0, spent: parseFloat(form.spent) || 0 });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 480, width: '95%' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>{item ? t.editItem : t.addItemTitle}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>{t.categoryLabel} *</label>
              <input value={form.category} onChange={e => set('category', e.target.value)} required placeholder="e.g. Teacher Salaries" />
            </div>
            <div className="form-group">
              <label>{t.budgetedLabel} *</label>
              <input type="number" value={form.budgeted} onChange={e => set('budgeted', e.target.value)} required min="0" step="0.01" placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>{t.spentLabel}</label>
              <input type="number" value={form.spent} onChange={e => set('spent', e.target.value)} min="0" step="0.01" placeholder="0.00" />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>{t.notesLabel}</label>
              <input value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any notes..." />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>{t.receiptLabel}</label>
              <input type="file" ref={fileRef} accept="image/*,application/pdf" style={{ display: 'none' }} onChange={handleFile} />
              {form.receiptName ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: 8, background: 'var(--input-bg)', fontSize: '.83rem' }}>
                  <Paperclip size={14} style={{ color: 'var(--accent-color)', flexShrink: 0 }} />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{form.receiptName}</span>
                  {uploading && <Loader2 size={14} className="animate-spin" />}
                  <button type="button" onClick={() => { set('receiptName', ''); set('receiptData', ''); set('receiptUrl', ''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={14} /></button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 14px', border: '2px dashed var(--border-color)', borderRadius: 8, background: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '.83rem', width: '100%', justifyContent: 'center' }}>
                  <Upload size={15} /> {uploading ? t.uploading : 'Choose file'}
                </button>
              )}
            </div>
          </div>
          <div className="modal-actions" style={{ marginTop: 20 }}>
            <button type="button" className="button-secondary" onClick={onClose} disabled={saving}>{t.cancel}</button>
            <button type="submit" className="button-primary" disabled={saving || uploading} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saving ? t.saving : (item ? t.save : t.add)}
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
      <div className="modal-content" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
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

export default function Budget({ user, isDev: isDevProp, language }) {
  const t = T[language] || T.en;
  const isDev = (() => {
    if (isDevProp === true) return true;
    if (user?.isDev === true) return true;
    try { return JSON.parse(localStorage.getItem('haazimi_user') || '{}').isDev === true; } catch { return false; }
  })();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [currency] = useState(() => localStorage.getItem('haazimi_currency') || '$');

  const mk = monthKey(currentMonth);

  useEffect(() => {
    if (isDev) {
      setItems(MOCK_BUDGET.map((b, i) => ({ ...b, id: String(b.id || i + 1), month: mk, notes: '', receiptName: '', receiptUrl: '' })));
      setLoading(false);
    } else {
      loadBudget();
    }
  }, [isDev, mk]);

  const loadBudget = async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getBudget&month=${mk}&t=${Date.now()}`);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : (data.items || []);
      setItems(rows.map(r => ({
        id: r.id || r.ID,
        month: r.month || r.Month || mk,
        category: r.category || r.Category || '',
        budgeted: parseFloat(r.budgeted || r.Budgeted) || 0,
        spent: parseFloat(r.spent || r.Spent) || 0,
        notes: r.notes || r.Notes || '',
        receiptName: r.receiptname || r.receiptName || r.ReceiptName || '',
        receiptUrl: r.receipturl || r.receiptUrl || r.ReceiptUrl || '',
      })));
    } catch {
      setFetchError(t.fetchError);
      setItems(MOCK_BUDGET.map((b, i) => ({ ...b, id: String(b.id || i + 1), month: mk, notes: '', receiptName: '', receiptUrl: '' })));
    } finally { setLoading(false); }
  };

  const postToSheets = async (payload) => {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  };

  const uploadReceipt = async (file) => {
    setUploading(true);
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = e => res(e.target.result.split(',')[1]);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      const resp = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'uploadBudgetReceipt', fileName: file.name, mimeType: file.type, base64Data: base64 }),
      });
      const data = await resp.json().catch(() => ({}));
      return data.url || '';
    } catch { return ''; }
    finally { setUploading(false); }
  };

  const handleAdd = async (form) => {
    setSaving(true);
    const newItem = { id: String(Date.now()), month: mk, ...form };
    setItems(s => [...s, newItem]);
    setShowModal(false);
    if (!isDev) {
      try { await postToSheets({ type: 'addBudgetItem', ...newItem, addedBy: user?.name || '', addedAt: new Date().toISOString() }); } catch {}
    }
    setSaving(false);
  };

  const handleEdit = async (form) => {
    setSaving(true);
    setItems(s => s.map(i => i.id === editItem.id ? { ...i, ...form } : i));
    setShowModal(false);
    setEditItem(null);
    if (!isDev) {
      try { await postToSheets({ type: 'updateBudgetItem', id: editItem.id, month: mk, ...form }); } catch {}
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    setSaving(true);
    const id = confirmDelete.id;
    setItems(s => s.filter(i => i.id !== id));
    setConfirmDelete(null);
    if (!isDev) {
      try { await postToSheets({ type: 'deleteBudgetItem', id, month: mk }); } catch {}
    }
    setSaving(false);
  };

  const prevMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(d => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const totalBudgeted = items.reduce((s, i) => s + (i.budgeted || 0), 0);
  const totalSpent = items.reduce((s, i) => s + (i.spent || 0), 0);
  const remaining = totalBudgeted - totalSpent;
  const pctUsed = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0;
  const fmt = (n) => `${currency} ${(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div>
      <style>{`
        .budget-table { width:100%;border-collapse:collapse; }
        .budget-table th { text-align:left;padding:10px 12px;font-size:.75rem;font-weight:600;color:var(--text-secondary);text-transform:uppercase;letter-spacing:.06em;border-bottom:2px solid var(--border-color); }
        .budget-table td { padding:11px 12px;border-bottom:1px solid var(--border-color);font-size:.88rem;vertical-align:middle; }
        .budget-table tfoot td, .budget-table tfoot th { border-top:2px solid var(--border-color);border-bottom:none;padding:12px; }
        .budget-table tr:last-child td { border-bottom:none; }
        .budget-table tr:hover td { background:var(--hover-bg, rgba(0,0,0,.03)); }
        .bgt-action-btn { background:none;border:1px solid var(--border-color);border-radius:6px;padding:4px 8px;cursor:pointer;font-size:.78rem;color:var(--text-secondary);transition:all .15s;display:inline-flex;align-items:center;gap:3px; }
        .bgt-action-btn:hover { background:var(--accent-color);color:#fff;border-color:var(--accent-color); }
        .bgt-action-btn.danger:hover { background:#ef4444;color:#fff;border-color:#ef4444; }
        .dev-badge { display:inline-flex;align-items:center;gap:5px;background:#fbbf24;color:#1c1917;border:2px solid #f59e0b;padding:3px 10px;border-radius:6px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-left:12px; }
        .dev-mode-banner { background:linear-gradient(90deg,#fef3c7,#fde68a);border:1px solid #fbbf24;border-radius:8px;padding:8px 14px;margin-bottom:16px;font-size:13px;font-weight:600;color:#78350f; }
        @media(max-width:640px){.bgt-hide{display:none!important}}
      `}</style>

      <div className="view-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <h2>{t.title}</h2>
            {isDev && <span className="dev-badge">{t.mockBadge}</span>}
          </div>
          <p>{t.sub}</p>
        </div>
        <button className="button-primary icon-button" onClick={() => { setEditItem(null); setShowModal(true); }}>
          <Plus size={18} /> {t.addItem}
        </button>
      </div>

      {isDev && <div className="dev-mode-banner">{t.mockBanner}</div>}
      {fetchError && <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: '.83rem', color: '#92400e' }}>{fetchError}</div>}

      {/* Month navigator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, background: 'var(--card-bg)', borderRadius: 10, padding: '10px 16px', boxShadow: '0 2px 8px var(--shadow-color)', width: 'fit-content' }}>
        <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}><ChevronLeft size={18} /></button>
        <span style={{ fontWeight: 600, fontSize: '.95rem', minWidth: 160, textAlign: 'center' }}>{fmtMonth(currentMonth)}</span>
        <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}><ChevronRight size={18} /></button>
      </div>

      {/* Summary cards */}
      <div className="dashboard-grid" style={{ marginBottom: 28 }}>
        {[
          { label: t.totalBudget, value: fmt(totalBudgeted), color: 'var(--accent-color)' },
          { label: t.totalSpent, value: fmt(totalSpent), color: 'var(--warning-color)' },
          { label: t.remaining, value: fmt(remaining), color: remaining >= 0 ? 'var(--success-color)' : 'var(--danger-color)' },
          { label: t.budgetUsed, value: `${pctUsed}%`, color: totalSpent > totalBudgeted ? 'var(--danger-color)' : 'var(--accent-color)' },
        ].map((card, i) => (
          <div key={i} className="info-card">
            <div className="details">
              <div className="value" style={{ color: card.color }}>{card.value}</div>
              <div className="label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Items table */}
      <div className="table-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
          <h3 style={{ margin: 0 }}>{t.expenseBreakdown} — {fmtMonth(currentMonth)}</h3>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 48, gap: 12 }}>
            <Loader2 size={24} className="animate-spin" style={{ color: 'var(--accent-color)' }} />
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="budget-table">
              <thead>
                <tr>
                  <th>{t.category}</th>
                  <th>{t.budgeted} ({currency})</th>
                  <th>{t.spent} ({currency})</th>
                  <th className="bgt-hide">{t.variance}</th>
                  <th className="bgt-hide">{t.progress}</th>
                  <th>{t.status}</th>
                  <th className="bgt-hide">{t.receipt}</th>
                  <th>{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: 40 }}>{t.noItems}</td></tr>
                ) : items.map(item => {
                  const variance = item.budgeted - item.spent;
                  const pct = item.budgeted > 0 ? Math.min(100, Math.round((item.spent / item.budgeted) * 100)) : 0;
                  const over = item.spent > item.budgeted;
                  return (
                    <tr key={item.id}>
                      <td>
                        <strong style={{ display: 'block' }}>{item.category}</strong>
                        {item.notes && <span style={{ fontSize: '.73rem', color: 'var(--text-secondary)' }}>{item.notes}</span>}
                      </td>
                      <td>{(item.budgeted || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td>{(item.spent || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                      <td className="bgt-hide" style={{ color: over ? 'var(--danger-color)' : 'var(--success-color)', fontWeight: 500 }}>
                        {over ? `-${Math.abs(variance).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `+${variance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                      </td>
                      <td className="bgt-hide" style={{ minWidth: 120 }}>
                        <div style={{ height: 7, background: 'var(--border-color)', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: over ? 'var(--danger-color)' : pct > 80 ? 'var(--warning-color)' : 'var(--success-color)', borderRadius: 4 }} />
                        </div>
                        <div style={{ fontSize: '.72rem', color: 'var(--text-secondary)', marginTop: 2 }}>{pct}%</div>
                      </td>
                      <td>
                        <span className={`status-badge ${over ? 'status-incomplete' : pct > 85 ? 'status-in-progress' : 'status-completed'}`}>
                          {over ? t.overBudget : pct > 85 ? t.nearLimit : t.onTrack}
                        </span>
                      </td>
                      <td className="bgt-hide">
                        {item.receiptUrl ? (
                          <a href={item.receiptUrl} target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '.78rem', color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 500 }}>
                            <Paperclip size={12} /> {item.receiptName || t.viewReceipt}
                          </a>
                        ) : <span style={{ color: 'var(--text-secondary)', fontSize: '.78rem' }}>—</span>}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 5 }}>
                          <button className="bgt-action-btn" onClick={() => { setEditItem(item); setShowModal(true); }} title={t.edit}><Edit2 size={12} /></button>
                          <button className="bgt-action-btn danger" onClick={() => setConfirmDelete(item)} title={t.delete}><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {items.length > 0 && (
                <tfoot>
                  <tr>
                    <th>{t.total}</th>
                    <th>{totalBudgeted.toLocaleString(undefined, { minimumFractionDigits: 2 })}</th>
                    <th>{totalSpent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</th>
                    <td className="bgt-hide" style={{ color: remaining >= 0 ? 'var(--success-color)' : 'var(--danger-color)', fontWeight: 700 }}>
                      {remaining < 0 ? `-${Math.abs(remaining).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : `+${remaining.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                    </td>
                    <td className="bgt-hide" />
                    <td colSpan={3}>
                      <span className={`status-badge ${remaining < 0 ? 'status-incomplete' : 'status-completed'}`}>
                        {remaining < 0 ? t.overBudget : t.withinBudget}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <BudgetModal
          item={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSave={editItem ? handleEdit : handleAdd}
          t={t}
          saving={saving}
          uploading={uploading}
          onUploadReceipt={uploadReceipt}
          isDev={isDev}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={t.confirmDelete(confirmDelete.category)}
          onConfirm={handleDelete}
          onClose={() => setConfirmDelete(null)}
          t={t}
          saving={saving}
        />
      )}
    </div>
  );
}
