import { STAFF } from '../data/mockData';

const T = {
  en: {
    title: 'Reports', sub: 'Insights and analytics for your institution',
    staffStatus: 'Staff Status Breakdown', staffByCenter: 'Staff by Center',
    classAttendance: 'Class Attendance Rate (%)', monthlyHours: 'Monthly Hours Logged',
    leaveSummary: 'Leave Summary',
    active: 'Active', onLeave: 'On Leave', inactive: 'Inactive',
    staffMember: 'Staff Member', totalLeaves: 'Total Leaves', used: 'Used', remaining: 'Remaining', status: 'Status',
    overLimit: 'Over Limit', nearLimit: 'Near Limit', good: 'Good',
  },
  ar: {
    title: 'التقارير', sub: 'رؤى وتحليلات لمؤسستك',
    staffStatus: 'توزيع حالة الموظفين', staffByCenter: 'الموظفون حسب المركز',
    classAttendance: 'معدل حضور الفصل (%)', monthlyHours: 'الساعات الشهرية المسجلة',
    leaveSummary: 'ملخص الإجازات',
    active: 'نشط', onLeave: 'في إجازة', inactive: 'غير نشط',
    staffMember: 'الموظف', totalLeaves: 'إجمالي الإجازات', used: 'المستخدم', remaining: 'المتبقي', status: 'الحالة',
    overLimit: 'تجاوز الحد', nearLimit: 'قريب من الحد', good: 'جيد',
  },
  ur: {
    title: 'رپورٹس', sub: 'آپ کے ادارے کے لیے بصیرت اور تجزیات',
    staffStatus: 'عملے کی حالت کا خلاصہ', staffByCenter: 'مرکز کے مطابق عملہ',
    classAttendance: 'کلاس حاضری شرح (%)', monthlyHours: 'ماہانہ ریکارڈ شدہ گھنٹے',
    leaveSummary: 'چھٹیوں کا خلاصہ',
    active: 'فعال', onLeave: 'چھٹی پر', inactive: 'غیر فعال',
    staffMember: 'عملہ', totalLeaves: 'کل چھٹیاں', used: 'استعمال شدہ', remaining: 'باقی', status: 'حالت',
    overLimit: 'حد سے زیادہ', nearLimit: 'حد کے قریب', good: 'ٹھیک',
  },
  es: {
    title: 'Informes', sub: 'Perspectivas y análisis para tu institución',
    staffStatus: 'Desglose del Estado del Personal', staffByCenter: 'Personal por Centro',
    classAttendance: 'Tasa de Asistencia a Clase (%)', monthlyHours: 'Horas Mensuales Registradas',
    leaveSummary: 'Resumen de Licencias',
    active: 'Activo', onLeave: 'De Licencia', inactive: 'Inactivo',
    staffMember: 'Miembro del Personal', totalLeaves: 'Licencias Totales', used: 'Usadas', remaining: 'Restantes', status: 'Estado',
    overLimit: 'Sobre el Límite', nearLimit: 'Cerca del Límite', good: 'Bien',
  },
  pt: {
    title: 'Relatórios', sub: 'Perspectivas e análises para sua instituição',
    staffStatus: 'Distribuição do Estado do Pessoal', staffByCenter: 'Pessoal por Centro',
    classAttendance: 'Taxa de Frequência da Turma (%)', monthlyHours: 'Horas Mensais Registadas',
    leaveSummary: 'Resumo de Licenças',
    active: 'Ativo', onLeave: 'De Licença', inactive: 'Inativo',
    staffMember: 'Membro do Pessoal', totalLeaves: 'Licenças Totais', used: 'Usadas', remaining: 'Restantes', status: 'Estado',
    overLimit: 'Acima do Limite', nearLimit: 'Perto do Limite', good: 'Bom',
  },
};

function BarChart({ data, horizontal = false }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className={`bar-chart ${horizontal ? 'horizontal' : ''}`}>
      {data.map((item, i) => (
        <div key={i} className="bar-wrapper">
          {!horizontal && <div className="bar-label">{item.label}</div>}
          {horizontal ? (
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', alignItems: 'center', gap: 12 }}>
              <div className="bar-label" style={{ textAlign: 'right' }}>{item.label}</div>
              <div className="bar" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color || 'var(--accent-color)', padding: '8px 12px', justifyContent: 'flex-end', color: 'white', fontSize: '0.9rem', fontWeight: 500 }}>
                <span>{item.value}{item.unit || ''}</span>
              </div>
            </div>
          ) : (
            <div className="bar" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color || 'var(--accent-color)' }} />
          )}
        </div>
      ))}
    </div>
  );
}

function PieChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const gradient = data.map(d => {
    const start = (cumulative / total) * 360;
    cumulative += d.value;
    const end = (cumulative / total) * 360;
    return `${d.color} ${start}deg ${end}deg`;
  }).join(', ');

  return (
    <div className="pie-chart-container">
      <div className="pie-chart" style={{ background: `conic-gradient(${gradient})` }} />
      <div className="pie-chart-legend">
        {data.map((d, i) => (
          <div key={i} className="legend-item">
            <div className="legend-dot" style={{ backgroundColor: d.color }} />
            <span>{d.label}: <strong>{d.value}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reports({ language }) {
  const t = T[language] || T.en;
  const activeStaff = STAFF.filter(s => s.status === 'Active').length;
  const onLeave = STAFF.filter(s => s.status === 'On Leave').length;
  const inactive = STAFF.filter(s => s.status === 'Inactive').length;

  const attendanceData = [
    { label: 'Hifz Class A', value: 92, color: '#2ecc71' },
    { label: 'Nazra Class B', value: 81, color: '#3498db' },
    { label: 'Tajweed Class C', value: 86, color: '#9b59b6' },
  ];

  const staffByCenter = [
    { label: 'Head Office', value: 2, color: '#3498db' },
    { label: 'Branch A', value: 2, color: '#2ecc71' },
    { label: 'Branch B', value: 2, color: '#e67e22' },
    { label: 'Branch C', value: 1, color: '#e74c3c' },
  ];

  const monthlyHours = [
    { label: 'Jan', value: 160 },
    { label: 'Feb', value: 152 },
    { label: 'Mar', value: 172 },
    { label: 'Apr', value: 168 },
    { label: 'May', value: 145 },
  ];

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
      </div>

      <div className="reports-layout">
        <div className="report-widget">
          <h3>{t.staffStatus}</h3>
          <PieChart data={[
            { label: t.active, value: activeStaff, color: '#2ecc71' },
            { label: t.onLeave, value: onLeave, color: '#f39c12' },
            { label: t.inactive, value: inactive, color: '#e74c3c' },
          ]} />
        </div>

        <div className="report-widget">
          <h3>{t.staffByCenter}</h3>
          <BarChart data={staffByCenter} horizontal />
        </div>

        <div className="report-widget">
          <h3>{t.classAttendance}</h3>
          <BarChart data={attendanceData} horizontal />
        </div>

        <div className="report-widget">
          <h3>{t.monthlyHours}</h3>
          <BarChart data={monthlyHours} />
        </div>

        <div className="report-widget large-widget">
          <h3>{t.leaveSummary}</h3>
          <table className="staff-table">
            <thead>
              <tr>
                <th>{t.staffMember}</th>
                <th>{t.totalLeaves}</th>
                <th>{t.used}</th>
                <th>{t.remaining}</th>
                <th>{t.status}</th>
              </tr>
            </thead>
            <tbody>
              {STAFF.map(s => {
                const remaining = Math.max(0, 10 - s.leaves);
                return (
                  <tr key={s.id}>
                    <td><strong>{s.name}</strong></td>
                    <td>10</td>
                    <td>{s.leaves}</td>
                    <td>{remaining}</td>
                    <td>
                      <span className={`status-badge ${s.leaves > 10 ? 'status-incomplete' : s.leaves > 7 ? 'status-in-progress' : 'status-completed'}`}>
                        {s.leaves > 10 ? t.overLimit : s.leaves > 7 ? t.nearLimit : t.good}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
