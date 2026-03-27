import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { RED_FLAGS as INITIAL } from '../data/mockData';

export default function RedFlags() {
  const [flags, setFlags] = useState(INITIAL);
  const [resolved, setResolved] = useState([]);

  const high = flags.filter(f => f.severity === 'high');
  const medium = flags.filter(f => f.severity === 'medium');

  const resolve = (id) => {
    const flag = flags.find(f => f.id === id);
    setResolved(r => [flag, ...r]);
    setFlags(f => f.filter(ff => ff.id !== id));
  };

  const FlagCard = ({ flag }) => (
    <div style={{
      background: 'var(--card-bg)',
      borderRadius: 10,
      padding: 20,
      borderLeft: `4px solid ${flag.severity === 'high' ? 'var(--danger-color)' : 'var(--warning-color)'}`,
      boxShadow: '0 2px 8px var(--shadow-color)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 16,
    }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1 }}>
        <AlertTriangle size={22} color={flag.severity === 'high' ? 'var(--danger-color)' : 'var(--warning-color)'} style={{ flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>{flag.staffName}</div>
          <div style={{ fontWeight: 500, marginBottom: 6, color: flag.severity === 'high' ? 'var(--danger-color)' : 'var(--warning-color)' }}>{flag.issue}</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--subtle-text-color)', lineHeight: 1.5 }}>{flag.detail}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--subtle-text-color)', marginTop: 8 }}>Flagged on {flag.date}</div>
        </div>
      </div>
      <button
        onClick={() => resolve(flag.id)}
        style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
      >
        <X size={14} /> Resolve
      </button>
    </div>
  );

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>Red Flags</h2>
          <p>{flags.length} active issue{flags.length !== 1 ? 's' : ''} requiring attention</p>
        </div>
      </div>

      {flags.length === 0 && resolved.length === 0 && (
        <div className="prompt-container">No red flags at this time. Everything looks good!</div>
      )}

      {high.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} /> High Priority ({high.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {high.map(f => <FlagCard key={f.id} flag={f} />)}
          </div>
        </div>
      )}

      {medium.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, color: 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} /> Medium Priority ({medium.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {medium.map(f => <FlagCard key={f.id} flag={f} />)}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 16, color: 'var(--success-color)' }}>Resolved ({resolved.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {resolved.map(f => (
              <div key={f.id} style={{ background: 'var(--card-bg)', borderRadius: 10, padding: 16, borderLeft: '4px solid var(--success-color)', boxShadow: '0 2px 8px var(--shadow-color)', opacity: 0.7 }}>
                <div style={{ fontWeight: 500 }}>{f.staffName} — {f.issue}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--success-color)', marginTop: 4 }}>✓ Resolved</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
