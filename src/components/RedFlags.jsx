import { useState } from 'react';
import { AlertTriangle, X, CheckCircle, ClipboardList } from 'lucide-react';
import { RED_FLAGS as INITIAL } from '../data/mockData';

const T = {
  en: {
    title: 'Red Flags', subPlural: 'active issues requiring attention', subSingular: 'active issue requiring attention',
    noFlags: 'No red flags at this time. Everything looks good!',
    highPriority: 'High Priority', medPriority: 'Medium Priority', resolved: 'Resolved',
    flaggedOn: 'Flagged on', resolve: 'Resolve', cancel: 'Cancel', confirmResolved: 'Confirm Resolved',
    stepsTaken: 'Steps taken to resolve', stepsPlaceholder: 'Describe the steps taken, actions completed, or notes about the resolution…',
    resolvedOn: 'Resolved',
  },
  ar: {
    title: 'التنبيهات', subPlural: 'مشكلة نشطة تحتاج اهتماماً', subSingular: 'مشكلة نشطة تحتاج اهتماماً',
    noFlags: 'لا توجد تنبيهات حالياً. كل شيء يبدو جيداً!',
    highPriority: 'أولوية عالية', medPriority: 'أولوية متوسطة', resolved: 'تم الحل',
    flaggedOn: 'تم الإبلاغ في', resolve: 'حل', cancel: 'إلغاء', confirmResolved: 'تأكيد الحل',
    stepsTaken: 'خطوات الحل', stepsPlaceholder: 'صف الخطوات المتخذة…',
    resolvedOn: 'تم الحل في',
  },
  ur: {
    title: 'ریڈ فلیگز', subPlural: 'فعال مسائل جن پر توجہ ضروری ہے', subSingular: 'فعال مسئلہ جس پر توجہ ضروری ہے',
    noFlags: 'اس وقت کوئی ریڈ فلیگ نہیں۔ سب کچھ ٹھیک ہے!',
    highPriority: 'اعلیٰ ترجیح', medPriority: 'درمیانی ترجیح', resolved: 'حل ہو گیا',
    flaggedOn: 'اٹھایا گیا', resolve: 'حل کریں', cancel: 'منسوخ', confirmResolved: 'حل کی تصدیق کریں',
    stepsTaken: 'اٹھائے گئے اقدامات', stepsPlaceholder: 'اٹھائے گئے اقدامات بیان کریں…',
    resolvedOn: 'حل ہوا',
  },
  es: {
    title: 'Alertas', subPlural: 'problemas activos que requieren atención', subSingular: 'problema activo que requiere atención',
    noFlags: 'Sin alertas en este momento. ¡Todo se ve bien!',
    highPriority: 'Prioridad Alta', medPriority: 'Prioridad Media', resolved: 'Resueltos',
    flaggedOn: 'Marcado el', resolve: 'Resolver', cancel: 'Cancelar', confirmResolved: 'Confirmar Resuelto',
    stepsTaken: 'Pasos tomados para resolver', stepsPlaceholder: 'Describa los pasos tomados, acciones completadas…',
    resolvedOn: 'Resuelto',
  },
  pt: {
    title: 'Alertas', subPlural: 'problemas ativos que requerem atenção', subSingular: 'problema ativo que requer atenção',
    noFlags: 'Nenhum alerta neste momento. Tudo parece bem!',
    highPriority: 'Alta Prioridade', medPriority: 'Prioridade Média', resolved: 'Resolvidos',
    flaggedOn: 'Sinalizado em', resolve: 'Resolver', cancel: 'Cancelar', confirmResolved: 'Confirmar Resolvido',
    stepsTaken: 'Passos tomados para resolver', stepsPlaceholder: 'Descreva os passos tomados, ações concluídas…',
    resolvedOn: 'Resolvido',
  },
};

export default function RedFlags({ language }) {
  const t = T[language] || T.en;
  const [flags, setFlags] = useState(INITIAL);
  const [resolved, setResolved] = useState([]);
  const [resolvingId, setResolvingId] = useState(null);
  const [steps, setSteps] = useState('');

  const high = flags.filter(f => f.severity === 'high');
  const medium = flags.filter(f => f.severity === 'medium');

  const startResolve = (id) => { setResolvingId(id); setSteps(''); };
  const cancelResolve = () => { setResolvingId(null); setSteps(''); };

  const confirmResolve = (id) => {
    const flag = flags.find(f => f.id === id);
    setResolved(r => [{ ...flag, stepsTaken: steps.trim(), resolvedAt: new Date().toLocaleDateString() }, ...r]);
    setFlags(f => f.filter(ff => ff.id !== id));
    setResolvingId(null);
    setSteps('');
  };

  const FlagCard = ({ flag }) => {
    const isResolving = resolvingId === flag.id;
    return (
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: 10,
        padding: 20,
        borderLeft: `4px solid ${flag.severity === 'high' ? 'var(--danger-color)' : 'var(--warning-color)'}`,
        boxShadow: '0 2px 8px var(--shadow-color)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flex: 1 }}>
            <AlertTriangle size={22} color={flag.severity === 'high' ? 'var(--danger-color)' : 'var(--warning-color)'} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: 4 }}>{flag.staffName}</div>
              <div style={{ fontWeight: 500, marginBottom: 6, color: flag.severity === 'high' ? 'var(--danger-color)' : 'var(--warning-color)' }}>{flag.issue}</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--subtle-text-color)', lineHeight: 1.5 }}>{flag.detail}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--subtle-text-color)', marginTop: 8 }}>{t.flaggedOn} {flag.date}</div>
            </div>
          </div>
          {!isResolving && (
            <button
              onClick={() => startResolve(flag.id)}
              style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: '0.85rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
            >
              <CheckCircle size={14} /> {t.resolve}
            </button>
          )}
        </div>

        {isResolving && (
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <ClipboardList size={16} color="var(--accent-color)" />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.stepsTaken}</span>
            </div>
            <textarea
              value={steps}
              onChange={e => setSteps(e.target.value)}
              placeholder={t.stepsPlaceholder}
              rows={3}
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 8,
                border: '1px solid var(--border-color)', background: 'var(--input-bg)',
                color: 'var(--text-primary)', fontSize: '0.88rem', resize: 'vertical',
                boxSizing: 'border-box', lineHeight: 1.5,
              }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 10, justifyContent: 'flex-end' }}>
              <button
                onClick={cancelResolve}
                style={{ background: 'none', border: '1px solid var(--border-color)', borderRadius: 6, padding: '7px 14px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <X size={14} /> {t.cancel}
              </button>
              <button
                onClick={() => confirmResolve(flag.id)}
                style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 16px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <CheckCircle size={14} /> {t.confirmResolved}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{flags.length} {flags.length !== 1 ? t.subPlural : t.subSingular}</p>
        </div>
      </div>

      {flags.length === 0 && resolved.length === 0 && (
        <div className="prompt-container">{t.noFlags}</div>
      )}

      {high.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, color: 'var(--danger-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} /> {t.highPriority} ({high.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {high.map(f => <FlagCard key={f.id} flag={f} />)}
          </div>
        </div>
      )}

      {medium.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ marginBottom: 16, color: 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} /> {t.medPriority} ({medium.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {medium.map(f => <FlagCard key={f.id} flag={f} />)}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <h3 style={{ marginBottom: 16, color: 'var(--success-color)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <CheckCircle size={20} /> {t.resolved} ({resolved.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {resolved.map((f, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', borderRadius: 10, padding: 16, borderLeft: '4px solid var(--success-color)', boxShadow: '0 2px 8px var(--shadow-color)', opacity: 0.85 }}>
                <div style={{ fontWeight: 600 }}>{f.staffName} — {f.issue}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--subtle-text-color)', marginTop: 2 }}>{f.detail}</div>
                {f.stepsTaken && (
                  <div style={{ marginTop: 10, padding: '10px 12px', background: 'var(--hover-bg)', borderRadius: 8, borderLeft: '3px solid var(--success-color)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <ClipboardList size={12} /> {t.stepsTaken}
                    </div>
                    <div style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>{f.stepsTaken}</div>
                  </div>
                )}
                <div style={{ fontSize: '0.78rem', color: 'var(--success-color)', marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <CheckCircle size={13} /> {t.resolvedOn} {f.resolvedAt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
