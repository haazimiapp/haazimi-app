import { useState } from 'react';
import { BUDGET_ITEMS } from '../data/mockData';

const T = {
  en: {
    title: 'Budget', sub: 'Monthly financial overview and expenditure tracking',
    totalBudget: 'Total Budget', totalSpent: 'Total Spent', remaining: 'Remaining', budgetUsed: 'Budget Used',
    expenseBreakdown: 'Expense Breakdown', category: 'Category', budgeted: 'Budgeted',
    spent: 'Spent', variance: 'Variance', progress: 'Progress', status: 'Status',
    total: 'Total', overBudget: 'Over Budget', nearLimit: 'Near Limit', onTrack: 'On Track', withinBudget: 'Within Budget',
  },
  ar: {
    title: 'الميزانية', sub: 'نظرة عامة مالية شهرية وتتبع الإنفاق',
    totalBudget: 'إجمالي الميزانية', totalSpent: 'إجمالي الإنفاق', remaining: 'المتبقي', budgetUsed: 'الميزانية المستخدمة',
    expenseBreakdown: 'تفصيل النفقات', category: 'الفئة', budgeted: 'المخطط',
    spent: 'المنفق', variance: 'الفارق', progress: 'التقدم', status: 'الحالة',
    total: 'الإجمالي', overBudget: 'تجاوز الميزانية', nearLimit: 'قريب من الحد', onTrack: 'في المسار', withinBudget: 'ضمن الميزانية',
  },
  ur: {
    title: 'بجٹ', sub: 'ماہانہ مالی جائزہ اور اخراجات کا ٹریکنگ',
    totalBudget: 'کل بجٹ', totalSpent: 'کل خرچ', remaining: 'باقی', budgetUsed: 'بجٹ استعمال',
    expenseBreakdown: 'اخراجات کی تفصیل', category: 'قسم', budgeted: 'مختص',
    spent: 'خرچ', variance: 'فرق', progress: 'پیش رفت', status: 'حالت',
    total: 'کل', overBudget: 'بجٹ سے زیادہ', nearLimit: 'حد کے قریب', onTrack: 'ٹھیک ہے', withinBudget: 'بجٹ میں',
  },
  es: {
    title: 'Presupuesto', sub: 'Resumen financiero mensual y seguimiento de gastos',
    totalBudget: 'Presupuesto Total', totalSpent: 'Total Gastado', remaining: 'Restante', budgetUsed: 'Presupuesto Usado',
    expenseBreakdown: 'Desglose de Gastos', category: 'Categoría', budgeted: 'Presupuestado',
    spent: 'Gastado', variance: 'Variación', progress: 'Progreso', status: 'Estado',
    total: 'Total', overBudget: 'Sobre Presupuesto', nearLimit: 'Cerca del Límite', onTrack: 'En Camino', withinBudget: 'Dentro del Presupuesto',
  },
  pt: {
    title: 'Orçamento', sub: 'Visão geral financeira mensal e acompanhamento de despesas',
    totalBudget: 'Orçamento Total', totalSpent: 'Total Gasto', remaining: 'Restante', budgetUsed: 'Orçamento Usado',
    expenseBreakdown: 'Detalhamento de Despesas', category: 'Categoria', budgeted: 'Orçado',
    spent: 'Gasto', variance: 'Variação', progress: 'Progresso', status: 'Estado',
    total: 'Total', overBudget: 'Acima do Orçamento', nearLimit: 'Perto do Limite', onTrack: 'No Caminho', withinBudget: 'Dentro do Orçamento',
  },
};

export default function Budget({ language }) {
  const t = T[language] || T.en;
  const [currency] = useState(() => localStorage.getItem('haazimi_currency') || '$');

  const totalBudgeted = BUDGET_ITEMS.reduce((s, i) => s + i.budgeted, 0);
  const totalSpent = BUDGET_ITEMS.reduce((s, i) => s + i.spent, 0);
  const remaining = totalBudgeted - totalSpent;

  const fmt = (n) => `${currency} ${n.toLocaleString()}`;

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 30 }}>
        {[
          { label: t.totalBudget, value: fmt(totalBudgeted), color: 'var(--accent-color)' },
          { label: t.totalSpent, value: fmt(totalSpent), color: 'var(--warning-color)' },
          { label: t.remaining, value: fmt(remaining), color: remaining >= 0 ? 'var(--success-color)' : 'var(--danger-color)' },
          { label: t.budgetUsed, value: `${Math.round((totalSpent / totalBudgeted) * 100)}%`, color: totalSpent > totalBudgeted ? 'var(--danger-color)' : 'var(--accent-color)' },
        ].map((card, i) => (
          <div key={i} className="info-card">
            <div className="details">
              <div className="value" style={{ color: card.color }}>{card.value}</div>
              <div className="label">{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <h3>{t.expenseBreakdown} — March 2026</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="staff-table budget-table" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                <th>{t.category}</th>
                <th>{t.budgeted} ({currency})</th>
                <th>{t.spent} ({currency})</th>
                <th>{t.variance}</th>
                <th>{t.progress}</th>
                <th>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {BUDGET_ITEMS.map(item => {
                const variance = item.budgeted - item.spent;
                const pct = Math.min(100, Math.round((item.spent / item.budgeted) * 100));
                const over = item.spent > item.budgeted;
                return (
                  <tr key={item.id}>
                    <td><strong>{item.category}</strong></td>
                    <td>{item.budgeted.toLocaleString()}</td>
                    <td>{item.spent.toLocaleString()}</td>
                    <td className={over ? 'deduction-cell' : ''} style={!over ? { color: 'var(--success-color)' } : {}}>
                      {over ? `-${Math.abs(variance).toLocaleString()}` : `+${variance.toLocaleString()}`}
                    </td>
                    <td style={{ minWidth: 120 }}>
                      <div style={{ height: 8, background: 'var(--border-color)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: over ? 'var(--danger-color)' : pct > 80 ? 'var(--warning-color)' : 'var(--success-color)', borderRadius: 4 }} />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--subtle-text-color)', marginTop: 3 }}>{pct}%</div>
                    </td>
                    <td>
                      <span className={`status-badge ${over ? 'status-incomplete' : pct > 85 ? 'status-in-progress' : 'status-completed'}`}>
                        {over ? t.overBudget : pct > 85 ? t.nearLimit : t.onTrack}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>{t.total}</th>
                <th>{totalBudgeted.toLocaleString()}</th>
                <th>{totalSpent.toLocaleString()}</th>
                <td className={remaining < 0 ? 'deduction-cell' : ''} style={remaining >= 0 ? { color: 'var(--success-color)', fontWeight: 700 } : {}}>
                  {remaining < 0 ? `-${Math.abs(remaining).toLocaleString()}` : `+${remaining.toLocaleString()}`}
                </td>
                <td colSpan={2}>
                  <span className={`status-badge ${remaining < 0 ? 'status-incomplete' : 'status-completed'}`}>
                    {remaining < 0 ? t.overBudget : t.withinBudget}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
