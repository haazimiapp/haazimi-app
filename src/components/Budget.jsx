import { useState } from 'react';
import { BUDGET_ITEMS } from '../data/mockData';

export default function Budget() {
  const [currency] = useState(() => localStorage.getItem('haazimi_currency') || '$');

  const totalBudgeted = BUDGET_ITEMS.reduce((s, i) => s + i.budgeted, 0);
  const totalSpent = BUDGET_ITEMS.reduce((s, i) => s + i.spent, 0);
  const remaining = totalBudgeted - totalSpent;

  const fmt = (n) => `${currency} ${n.toLocaleString()}`;

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>Budget</h2>
          <p>Monthly financial overview and expenditure tracking</p>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 30 }}>
        {[
          { label: 'Total Budget', value: fmt(totalBudgeted), color: 'var(--accent-color)' },
          { label: 'Total Spent', value: fmt(totalSpent), color: 'var(--warning-color)' },
          { label: 'Remaining', value: fmt(remaining), color: remaining >= 0 ? 'var(--success-color)' : 'var(--danger-color)' },
          { label: 'Budget Used', value: `${Math.round((totalSpent / totalBudgeted) * 100)}%`, color: totalSpent > totalBudgeted ? 'var(--danger-color)' : 'var(--accent-color)' },
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
        <h3>Expense Breakdown — March 2026</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="staff-table budget-table" style={{ minWidth: 640 }}>
            <thead>
              <tr>
                <th>Category</th>
                <th>Budgeted ({currency})</th>
                <th>Spent ({currency})</th>
                <th>Variance</th>
                <th>Progress</th>
                <th>Status</th>
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
                        {over ? 'Over Budget' : pct > 85 ? 'Near Limit' : 'On Track'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <th>{totalBudgeted.toLocaleString()}</th>
                <th>{totalSpent.toLocaleString()}</th>
                <td className={remaining < 0 ? 'deduction-cell' : ''} style={remaining >= 0 ? { color: 'var(--success-color)', fontWeight: 700 } : {}}>
                  {remaining < 0 ? `-${Math.abs(remaining).toLocaleString()}` : `+${remaining.toLocaleString()}`}
                </td>
                <td colSpan={2}>
                  <span className={`status-badge ${remaining < 0 ? 'status-incomplete' : 'status-completed'}`}>
                    {remaining < 0 ? 'Over Budget' : 'Within Budget'}
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
