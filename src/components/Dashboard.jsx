import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle,
  AlertTriangle,
  FileText,
  Clock,
  BookOpen,
  TrendingUp,
  Send,
  Plus,
  CalendarOff,
  ChevronDown,
  ChevronUp,
  Shield,
  Globe,
  BarChart2,
  Calendar,
  Settings,
  UserCheck,
  UserX,
  ToggleRight,
} from "lucide-react";
import { RED_FLAGS, BUDGET_ITEMS } from "../data/mockData";
import { GOOGLE_SCRIPT_URL, COUNTRY_CENTRES } from "../data/config"; // Added COUNTRY_CENTRES here

const DASH_T = {
  en: {
    greeting: "Assalamu Alaikum",
    managerTitle: "Manager Dashboard",
    managerSub: "Overview of your institution's performance",
    countryAdminTitle: "Country Admin Dashboard",
    countryAdminSub: "Overview of all centres in your country",
    adminTitle: "Centre Manager Dashboard",
    adminSub: "Manage your centre and staff",
    featureToggles: "Feature Toggles",
    featureTogglesSub:
      "Enable or disable features for centres in your country. Changes save immediately.",
    overviewTab: "Overview",
    totalStaff: "Total Staff",
    activeToday: "Active Today",
    redFlags: "Red Flags",
    pendingLeaves: "Pending Leaves",
    hrsLogged: "Hrs Logged (Month)",
    activeClasses: "Active Classes",
    totalStudents: "Total Students",
    avgAttendance: "Avg Attendance",
    quickActions: "Quick Actions",
    recentActivity: "Recent Activity",
    logTime: "Log Time",
    addStaff: "Add Staff",
    reviewLeaves: "Review Leaves",
    viewFlags: "View Flags",
    commandCentre: "Command Centre",
    hoursMonth: "Hours This Month",
    myClasses: "My Classes",
    myStudents: "My Students",
    recentLogs: "Recent Time Logs",
    aiTitle: "AI Assistant",
    aiSub: "Ask anything about your classes, students, or schedule.",
    aiPlaceholder: "e.g. How are my students performing this month?",
    ask: "Ask",
    aiDefault: "Your response will appear here...",
    requestLeave: "Request Leave",
    requestFor: "Request for",
    self: "Self",
    leaveType: "Leave Type",
    from: "From",
    to: "To",
    duration: "Duration",
    reason: "Reason",
    cancel: "Cancel",
    submit: "Submit Request",
    submitted: "Leave request submitted!",
    pendingApproval: "Your request is pending approval",
    submitSub: "Submit a leave request",
    pendingRequests: "Pending Requests",
    noPending: "No pending requests.",
  },
  ar: {
    greeting: "السلام عليكم",
    managerTitle: "لوحة المدير",
    managerSub: "نظرة عامة على أداء مؤسستك",
    countryAdminTitle: "لوحة مسؤول الدولة",
    countryAdminSub: "نظرة عامة على المراكز في دولتك",
    adminTitle: "لوحة مدير المركز",
    adminSub: "إدارة مركزك وموظفيك",
    featureToggles: "تبديل الميزات",
    featureTogglesSub:
      "تفعيل أو تعطيل الميزات للمراكز في دولتك. تُحفظ التغييرات فوراً.",
    overviewTab: "نظرة عامة",
    totalStaff: "إجمالي الموظفين",
    activeToday: "النشطون اليوم",
    redFlags: "التنبيهات",
    pendingLeaves: "الإجازات المعلقة",
    hrsLogged: "ساعات مسجلة (الشهر)",
    activeClasses: "الفصول النشطة",
    totalStudents: "إجمالي الطلاب",
    avgAttendance: "متوسط الحضور",
    quickActions: "إجراءات سريعة",
    recentActivity: "النشاط الأخير",
    logTime: "تسجيل الوقت",
    addStaff: "إضافة موظف",
    reviewLeaves: "مراجعة الإجازات",
    viewFlags: "عرض التنبيهات",
    commandCentre: "مركز القيادة",
    hoursMonth: "ساعات هذا الشهر",
    myClasses: "فصولي",
    myStudents: "طلابي",
    recentLogs: "سجلات الوقت الأخيرة",
    aiTitle: "المساعد الذكي",
    aiSub: "اسأل عن فصولك أو طلابك أو جدولك.",
    aiPlaceholder: "مثال: كيف أداء طلابي هذا الشهر؟",
    ask: "اسأل",
    aiDefault: "ستظهر إجابتك هنا...",
    requestLeave: "طلب إجازة",
    requestFor: "طلب لـ",
    self: "نفسي",
    leaveType: "نوع الإجازة",
    from: "من",
    to: "إلى",
    duration: "المدة",
    reason: "السبب",
    cancel: "إلغاء",
    submit: "إرسال الطلب",
    submitted: "تم إرسال طلب الإجازة!",
    pendingApproval: "طلبك في انتظار الموافقة",
    submitSub: "تقديم طلب إجازة",
    pendingRequests: "الطلبات المعلقة",
    noPending: "لا توجد طلبات معلقة.",
  },
  ur: {
    greeting: "السلام علیکم",
    managerTitle: "مینیجر ڈیش بورڈ",
    managerSub: "آپ کے ادارے کی کارکردگی کا جائزہ",
    countryAdminTitle: "کنٹری ایڈمن ڈیش بورڈ",
    countryAdminSub: "اپنے ملک کے تمام مراکز کا جائزہ",
    adminTitle: "سینٹر مینیجر ڈیش بورڈ",
    adminSub: "اپنے مرکز اور عملے کا انتظام کریں",
    featureToggles: "فیچر ٹوگلز",
    featureTogglesSub:
      "اپنے ملک کے مراکز کے لیے فیچرز فعال یا غیر فعال کریں۔ تبدیلیاں فوری محفوظ ہوتی ہیں۔",
    overviewTab: "جائزہ",
    totalStaff: "کل عملہ",
    activeToday: "آج فعال",
    redFlags: "ریڈ فلیگز",
    pendingLeaves: "زیر التواء چھٹیاں",
    hrsLogged: "گھنٹے (ماہ)",
    activeClasses: "فعال کلاسیں",
    totalStudents: "کل طلبہ",
    avgAttendance: "اوسط حاضری",
    quickActions: "فوری اقدامات",
    recentActivity: "حالیہ سرگرمی",
    logTime: "وقت ریکارڈ کریں",
    addStaff: "عملہ شامل کریں",
    reviewLeaves: "چھٹیاں دیکھیں",
    viewFlags: "فلیگز دیکھیں",
    commandCentre: "کمانڈ سینٹر",
    hoursMonth: "اس ماہ گھنٹے",
    myClasses: "میری کلاسیں",
    myStudents: "میرے طلبہ",
    recentLogs: "حالیہ وقت کے ریکارڈ",
    aiTitle: "AI اسسٹنٹ",
    aiSub: "اپنی کلاسوں، طلبہ یا شیڈول کے بارے میں پوچھیں۔",
    aiPlaceholder: "مثال: اس ماہ میرے طلبہ کیسا کر رہے ہیں؟",
    ask: "پوچھیں",
    aiDefault: "آپ کا جواب یہاں ظاہر ہوگا...",
    requestLeave: "چھٹی کی درخواست",
    requestFor: "کس کے لیے",
    self: "خود",
    leaveType: "چھٹی کی قسم",
    from: "سے",
    to: "تک",
    duration: "مدت",
    reason: "وجہ",
    cancel: "منسوخ",
    submit: "درخواست جمع کریں",
    submitted: "چھٹی کی درخواست جمع ہو گئی!",
    pendingApproval: "آپ کی درخواست منظوری کے انتظار میں ہے",
    submitSub: "چھٹی کی درخواست جمع کریں",
    pendingRequests: "زیر التواء درخواستیں",
    noPending: "کوئی زیر التواء درخواست نہیں۔",
  },
  es: {
    greeting: "Asalamu Alaikum",
    managerTitle: "Panel del Gerente",
    managerSub: "Resumen del rendimiento de tu institución",
    countryAdminTitle: "Panel del Administrador Nacional",
    countryAdminSub: "Vista general de los centros en tu país",
    adminTitle: "Panel del Gestor de Centro",
    adminSub: "Gestiona tu centro y personal",
    featureToggles: "Funciones Activas",
    featureTogglesSub:
      "Activa o desactiva funciones para los centros de tu país. Los cambios se guardan de inmediato.",
    overviewTab: "Resumen",
    totalStaff: "Personal Total",
    activeToday: "Activos Hoy",
    redFlags: "Alertas",
    pendingLeaves: "Licencias Pendientes",
    hrsLogged: "Horas Registradas (Mes)",
    activeClasses: "Clases Activas",
    totalStudents: "Total Estudiantes",
    avgAttendance: "Asistencia Promedio",
    quickActions: "Acciones Rápidas",
    recentActivity: "Actividad Reciente",
    logTime: "Registrar Tiempo",
    addStaff: "Agregar Personal",
    reviewLeaves: "Revisar Licencias",
    viewFlags: "Ver Alertas",
    commandCentre: "Centro de Comando",
    hoursMonth: "Horas Este Mes",
    myClasses: "Mis Clases",
    myStudents: "Mis Estudiantes",
    recentLogs: "Registros Recientes",
    aiTitle: "Asistente IA",
    aiSub: "Pregunta sobre tus clases, estudiantes o horario.",
    aiPlaceholder: "¿Cómo están mis estudiantes este mes?",
    ask: "Preguntar",
    aiDefault: "Tu respuesta aparecerá aquí...",
    requestLeave: "Solicitar Licencia",
    requestFor: "Solicitar para",
    self: "Yo mismo",
    leaveType: "Tipo de Licencia",
    from: "Desde",
    to: "Hasta",
    duration: "Duración",
    reason: "Razón",
    cancel: "Cancelar",
    submit: "Enviar Solicitud",
    submitted: "¡Solicitud enviada!",
    pendingApproval: "Tu solicitud está pendiente de aprobación",
    submitSub: "Enviar una solicitud de licencia",
    pendingRequests: "Solicitudes Pendientes",
    noPending: "No hay solicitudes pendientes.",
  },
  pt: {
    greeting: "Asalamu Alaikum",
    managerTitle: "Painel do Gerente",
    managerSub: "Visão geral do desempenho da sua instituição",
    countryAdminTitle: "Painel do Administrador Nacional",
    countryAdminSub: "Visão geral dos centros no seu país",
    adminTitle: "Painel do Gestor de Centro",
    adminSub: "Gerencie seu centro e equipe",
    featureToggles: "Funcionalidades Ativas",
    featureTogglesSub:
      "Ative ou desative funcionalidades para os centros do seu país. As alterações são salvas imediatamente.",
    overviewTab: "Visão Geral",
    totalStaff: "Total de Funcionários",
    activeToday: "Ativos Hoje",
    redFlags: "Alertas",
    pendingLeaves: "Licenças Pendentes",
    hrsLogged: "Horas Registradas (Mês)",
    activeClasses: "Turmas Ativas",
    totalStudents: "Total de Alunos",
    avgAttendance: "Freq. Média",
    quickActions: "Ações Rápidas",
    recentActivity: "Atividade Reciente",
    logTime: "Registrar Tempo",
    addStaff: "Adicionar Funcionário",
    reviewLeaves: "Revisar Licenças",
    viewFlags: "Ver Alertas",
    commandCentre: "Centro de Comando",
    hoursMonth: "Horas Neste Mês",
    myClasses: "Minhas Turmas",
    myStudents: "Meus Alunos",
    recentLogs: "Registros Recientes",
    aiTitle: "Assistente IA",
    aiSub: "Pergunte sobre suas turmas, alunos ou horário.",
    aiPlaceholder: "Como estão meus alunos este mês?",
    ask: "Perguntar",
    aiDefault: "Sua resposta aparecerá aqui...",
    requestLeave: "Solicitar Licença",
    requestFor: "Solicitar para",
    self: "Eu mesmo",
    leaveType: "Tipo de Licença",
    from: "De",
    to: "Até",
    duration: "Duração",
    reason: "Motivo",
    cancel: "Cancelar",
    submit: "Enviar Solicitação",
    submitted: "Solicitação enviada!",
    pendingApproval: "Sua solicitação está pendente de aprovação",
    submitSub: "Enviar uma solicitação de licença",
    pendingRequests: "Solicitações Pendentes",
    noPending: "Nenhuma solicitação pendente.",
  },
};

function InfoCard({ icon: Icon, iconClass, value, label, onClick }) {
  return (
    <div
      className={`info-card ${onClick ? "clickable" : ""}`}
      onClick={onClick}
    >
      <div className={`icon ${iconClass}`}>
        <Icon />
      </div>
      <div className="details">
        <div className="value">{value}</div>
        <div className="label">{label}</div>
      </div>
    </div>
  );
}

function LogTimeButton({ onNavigate, t }) {
  return (
    <div className="log-time-hero" onClick={() => onNavigate("logtime")}>
      <div className="log-time-hero-icon">
        <Clock size={28} />
      </div>
      <div className="log-time-hero-text">
        <strong>{t.logTime}</strong>
        <span>Tap to record your time</span>
      </div>
      <div className="log-time-hero-arrow">
        <Plus size={22} />
      </div>
    </div>
  );
}

const LEAVE_TYPES = ["Medical", "Casual", "Annual", "Emergency", "Personal"];

function QuickLeaveRequest({ userName, userKey, staffNames, t }) {
  const lsKey = `haazimi_quick_leaves_${userKey || userName || "default"}`;
  const today = new Date().toISOString().split("T")[0];
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: "Casual",
    from: today,
    to: today,
    fromTime: "08:00",
    toTime: "17:00",
    reason: "",
    requestFor: "self",
  });
  const [pendingList, setPendingList] = useState(() => {
    try {
      const ql = JSON.parse(localStorage.getItem(lsKey) || "[]");
      if (ql.length === 0) return [];
      const allLeaves = JSON.parse(
        localStorage.getItem("haazimi_leaves") || "[]",
      );
      const leaveById = {};
      allLeaves.forEach((l) => {
        leaveById[String(l.id)] = l;
      });
      return ql.map((q) => {
        const match = leaveById[String(q.id)];
        if (!match) return q;
        return {
          ...q,
          status: match.status || q.status,
          decidedBy: match.decidedBy || "",
          decidedAt: match.decidedAt || "",
          decisionReason: match.decisionReason || "",
        };
      });
    } catch {
      return [];
    }
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const isPartialDay = form.from === form.to;

  const calcDuration = () => {
    if (!form.from || !form.to) return "0 days";
    if (isPartialDay) {
      const [fh, fm] = (form.fromTime || "08:00").split(":").map(Number);
      const [th, tm] = (form.toTime || "17:00").split(":").map(Number);
      const mins = th * 60 + tm - (fh * 60 + fm);
      if (mins <= 0) return "0 hrs";
      const hrs = mins / 60;
      return hrs === Math.floor(hrs)
        ? `${hrs} hr${hrs !== 1 ? "s" : ""}`
        : `${hrs.toFixed(1)} hrs`;
    }
    const diff = Math.round(
      (new Date(form.to) - new Date(form.from)) / 86400000,
    );
    const days = Math.max(0, diff + 1);
    return `${days} day${days !== 1 ? "s" : ""}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      id: Date.now(),
      type: form.type,
      from: form.from,
      to: form.to,
      fromTime: isPartialDay ? form.fromTime : null,
      toTime: isPartialDay ? form.toTime : null,
      duration: calcDuration(),
      isHourly: isPartialDay,
      reason: form.reason,
      requestFor:
        form.requestFor === "self" ? userName || "Self" : form.requestFor,
      status: "Pending",
      submittedAt: new Date().toLocaleDateString(),
    };
    const updated = [entry, ...pendingList];
    setPendingList(updated);
    localStorage.setItem(lsKey, JSON.stringify(updated));

    const leaveEntry = {
      id: entry.id,
      staffName: entry.requestFor,
      staffEmail: "",
      type: entry.type,
      from: entry.from,
      to: entry.to,
      days: entry.duration,
      reason: entry.reason,
      status: "Pending",
      isHourly: entry.isHourly,
      fromTime: entry.fromTime,
      toTime: entry.toTime,
      source: "local",
      submittedAt: entry.submittedAt,
      submittedBy: userName,
    };
    try {
      const allLeaves = JSON.parse(
        localStorage.getItem("haazimi_leaves") || "[]",
      );
      localStorage.setItem(
        "haazimi_leaves",
        JSON.stringify([leaveEntry, ...allLeaves]),
      );
    } catch {}

    setOpen(false);
    setForm({
      type: "Casual",
      from: today,
      to: today,
      fromTime: "08:00",
      toTime: "17:00",
      reason: "",
      requestFor: "self",
    });
  };

  return (
    <div className="quick-leave-panel">
      <button
        className={`quick-leave-toggle ${open ? "open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <div className="quick-leave-toggle-left">
          <CalendarOff size={22} />
          <div>
            <strong>{t.requestLeave}</strong>
            <span>{t.submitSub}</span>
          </div>
        </div>
        <div className="quick-leave-toggle-arrow">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {open && (
        <div className="quick-leave-form">
          <form onSubmit={handleSubmit}>
            <div className="quick-leave-grid">
              <div className="form-group">
                <label>{t.requestFor}</label>
                <select
                  value={form.requestFor}
                  onChange={(e) => set("requestFor", e.target.value)}
                >
                  <option value="self">{t.self}</option>
                  {(staffNames || []).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t.leaveType}</label>
                <select
                  value={form.type}
                  onChange={(e) => set("type", e.target.value)}
                >
                  {LEAVE_TYPES.map((lt) => (
                    <option key={lt}>{lt}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>{t.from}</label>
                <input
                  type="date"
                  value={form.from}
                  min={today}
                  onChange={(e) => {
                    set("from", e.target.value);
                    if (e.target.value > form.to) set("to", e.target.value);
                  }}
                  required
                  style={{ marginBottom: 6 }}
                />
                <input
                  type="time"
                  value={form.fromTime}
                  onChange={(e) => set("fromTime", e.target.value)}
                  style={{ height: 40, width: "100%" }}
                />
              </div>
              <div className="form-group">
                <label>Until</label>
                <input
                  type="date"
                  value={form.to}
                  min={form.from}
                  onChange={(e) => set("to", e.target.value)}
                  required
                  style={{ marginBottom: 6 }}
                />
                <input
                  type="time"
                  value={form.toTime}
                  onChange={(e) => set("toTime", e.target.value)}
                  style={{ height: 40, width: "100%" }}
                />
              </div>
              <div
                className="form-group quick-leave-days"
                style={{ gridColumn: "1 / -1" }}
              >
                <label>{t.duration}</label>
                <div className="duration-display">{calcDuration()}</div>
              </div>
              <div className="form-group quick-leave-reason">
                <label>
                  {t.reason} <span style={{ color: "#e74c3c" }}>*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief reason..."
                  value={form.reason}
                  onChange={(e) => set("reason", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="quick-leave-actions">
              <button
                type="button"
                className="button-secondary"
                onClick={() => setOpen(false)}
              >
                {t.cancel}
              </button>
              <button type="submit" className="button-primary">
                {t.submit}
              </button>
            </div>
          </form>
        </div>
      )}

      {pendingList.length > 0 && (
        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            padding: "12px 16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {t.pendingRequests}
            </div>
            <button
              onClick={() => {
                setPendingList([]);
                localStorage.removeItem(lsKey);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#dc2626",
                fontSize: "0.75rem",
                fontWeight: 600,
                padding: "2px 6px",
              }}
            >
              Clear All
            </button>
          </div>
          {pendingList.map((req) => {
            const sl = String(req.status || "").toLowerCase();
            const isApproved = sl === "approved";
            const isRejected = sl === "rejected";
            const badgeBg = isApproved
              ? "#dcfce7"
              : isRejected
                ? "#fee2e2"
                : "#fff3cd";
            const badgeFg = isApproved
              ? "#15803d"
              : isRejected
                ? "#b91c1c"
                : "#856404";
            return (
              <div
                key={req.id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid var(--border-color)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "0.85rem",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 500 }}>{req.type}</span>
                    <span
                      style={{ color: "var(--text-secondary)", marginLeft: 8 }}
                    >
                      {req.from} → {req.to}
                    </span>
                    {req.requestFor &&
                      req.requestFor !== "Self" &&
                      req.requestFor !== userName && (
                        <span
                          style={{
                            color: "var(--primary-color)",
                            marginLeft: 8,
                            fontSize: "0.78rem",
                          }}
                        >
                          ({req.requestFor})
                        </span>
                      )}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        background: badgeBg,
                        color: badgeFg,
                        borderRadius: 4,
                        padding: "2px 8px",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {req.status}
                    </span>
                    <button
                      onClick={() => {
                        const updated = pendingList.filter(
                          (r) => r.id !== req.id,
                        );
                        setPendingList(updated);
                        localStorage.setItem(lsKey, JSON.stringify(updated));
                      }}
                      title="Dismiss"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#aaa",
                        fontSize: "1rem",
                        lineHeight: 1,
                        padding: "0 2px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                </div>
                {req.decidedBy && (
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: badgeFg,
                      marginTop: 3,
                    }}
                  >
                    {isApproved ? "✓" : "✗"} <strong>{req.decidedBy}</strong>
                    {req.decidedAt ? ` · ${req.decidedAt}` : ""}
                    {req.decisionReason ? ` — "${req.decisionReason}"` : ""}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const MGR_FEATURE_KEYS = [
  "logtime",
  "leaves",
  "budget",
  "calendar",
  "reimbursement",
  "redflags",
  "reports",
  "classes",
];
const MGR_FEATURE_LABELS = {
  logtime: "Log Time",
  leaves: "Leave Management",
  budget: "Budget",
  calendar: "Calendar",
  reimbursement: "Reimbursements",
  redflags: "Red Flags",
  reports: "Reports",
  classes: "My Classes",
};

function ManagerDashboard({ user, onNavigate, language }) {
  const t = DASH_T[language] || DASH_T.en;
  const isAdmin = user.role === "Centre Manager";
  const isCountryAdmin = user.role === "Country Admin";

  const [realUsers, setRealUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [toggles, setToggles] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("haazimi_feature_toggles") || "{}",
      );
    } catch {
      return {};
    }
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          `${GOOGLE_SCRIPT_URL}?type=getUsers&t=${Date.now()}`,
          { mode: "cors" },
        );
        const data = await res.json();
        setRealUsers(Array.isArray(data) ? data : data.users || []);
      } catch {
        try {
          const accounts = JSON.parse(
            localStorage.getItem("haazimi_accounts") || "[]",
          );
          setRealUsers(accounts.filter((a) => a.status === "Approved"));
        } catch {}
      }
      setLoadingUsers(false);
    };
    fetchUsers();
  }, []);

  const totalStaff = loadingUsers ? "…" : realUsers.length;
  const activeToday = loadingUsers
    ? "…"
    : realUsers.filter((u) => (u.Status || u.status) === "Approved").length;
  const pendingLeaves = (() => {
    try {
      const leaves = JSON.parse(localStorage.getItem("haazimi_leaves") || "[]");
      return leaves.filter(
        (l) => String(l.status || "").toLowerCase() === "pending",
      ).length;
    } catch {
      return 0;
    }
  })();
  const redFlags = RED_FLAGS.length;
  const staffNames = realUsers.map((u) => u.Name || u.name).filter(Boolean);

  const totalBudgeted = BUDGET_ITEMS.reduce((s, b) => s + b.budgeted, 0);
  const totalSpent = BUDGET_ITEMS.reduce((s, b) => s + b.spent, 0);
  const budgetVariance = totalBudgeted - totalSpent;

  const myCentres = (() => {
    // 1. Safety check: Get the country name regardless of capital 'C'
    const userCountry = user?.country || user?.Country;

    if (!isCountryAdmin) return user?.centre ? [user.centre] : [];

    try {
      // 2. Get centres from config.js
      const staticCentres = (typeof COUNTRY_CENTRES !== 'undefined' && COUNTRY_CENTRES[userCountry]) || [];

      // 3. Get centres from registered users
      const accts = JSON.parse(localStorage.getItem("haazimi_accounts") || "[]");
      const accountCentres = accts
        .filter((a) => (a.country || a.Country) === userCountry)
        .map((a) => a.centre || a.Centre);

      // 4. Get centres from manual 'Register' button
      const localCustom = JSON.parse(localStorage.getItem("haazimi_custom_centres") || "[]")
        .filter(c => (c.country || c.Country) === userCountry)
        .map(c => c.name);

      // Merge all three, remove empty values, and sort
      return [...new Set([...staticCentres, ...accountCentres, ...localCustom])]
        .filter(Boolean)
        .sort();
    } catch (err) {
      console.error("Centre retrieval error:", err);
      return [];
    }
  })();

  const getToggle = (centre, feature) => {
    if (!toggles || !toggles[centre]) return true;
    return toggles[centre][feature] !== false;
  };

  const setToggle = async (centre, feature, val) => {
    // 1. Update Local UI immediately so it feels fast
    const updated = {
      ...toggles,
      [centre]: { ...(toggles[centre] || {}), [feature]: val },
    };
    setToggles(updated);
    localStorage.setItem("haazimi_feature_toggles", JSON.stringify(updated));

    // 2. Sync to Google Sheets so OTHER users see the change
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", 
        body: JSON.stringify({
          action: "updateFeatureToggle",
          centre: centre,
          feature: feature,
          isEnabled: val,
          updatedBy: user?.email || "Unknown Admin"
        }),
      });
      console.log(`Synced ${feature} for ${centre} to Google Sheets`);
    } catch (e) {
      console.error("Cloud sync failed, change is only local:", e);
    }
  };

  const handleAddCentre = async () => {
    const name = prompt("Enter the name of the new centre:");
    if (!name || !name.trim()) return;

    // 1. Update Local (for instant UI feedback)
    const currentCustom = JSON.parse(localStorage.getItem("haazimi_custom_centres") || "[]");
    const updated = [...currentCustom, { name: name.trim(), country: user.country }];
    localStorage.setItem("haazimi_custom_centres", JSON.stringify(updated));

    // 2. Sync to Google Sheets (The important part!)
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Required for Apps Script
        body: JSON.stringify({
          action: "addCentre",
          centreName: name.trim(),
          country: user.country,
          adminEmail: user.email
        }),
      });
      window.location.reload();
    } catch (e) {
      console.error("Cloud sync failed:", e);
      alert("Saved locally, but failed to sync to the cloud.");
    }
  };

    const dashTitle = isAdmin
      ? t.adminTitle
      : isCountryAdmin
        ? t.countryAdminTitle
        : t.managerTitle;
    const dashSub = isAdmin
      ? t.adminSub
      : isCountryAdmin
        ? t.countryAdminSub
        : t.managerSub;

    return (
      <div>
        <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>{dashTitle}</h2>
            <p>{dashSub}</p>
          </div>
          {isCountryAdmin && activeTab === "toggles" && (
            <button 
              className="button-primary" 
              onClick={handleAddCentre}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                padding: '10px 20px',
                borderRadius: 8,
                cursor: 'pointer'
              }}
            >
              <Plus size={18} /> Register Centre
            </button>
          )}
        </div>

        {isCountryAdmin && (
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 24,
              background: "var(--card-bg)",
              borderRadius: 10,
              padding: 4,
              width: "fit-content",
              boxShadow: "0 2px 8px var(--shadow-color)",
            }}
          >
            {[
              { id: "overview", label: t.overviewTab || "Overview" },
              { id: "toggles", label: "Manage Centres" },
              { id: "userlist", label: "User List" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 20px",
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.85rem",
                  background:
                    activeTab === tab.id ? "var(--accent-color)" : "transparent",
                  color: activeTab === tab.id ? "#fff" : "var(--text-secondary)",
                  transition: "all 0.2s",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
        {isCountryAdmin && activeTab === "toggles" && (
          <div
            style={{
              background: "var(--card-bg)",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 2px 8px var(--shadow-color)",
            }}
          >
            <h3
              style={{
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <ToggleRight size={18} /> Manage Centres
            </h3>
            <p
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.83rem",
                marginBottom: 20,
              }}
            >
              {t.featureTogglesSub}
            </p>
            {myCentres.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', border: '1px dashed var(--border-color)', borderRadius: 12 }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: 16 }}>
                  No centres registered in {user.country} yet.
                </p>
                <button className="button-primary" onClick={handleAddCentre}>
                  Add Your First Centre
                </button>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>Centre</th>
                      {MGR_FEATURE_KEYS.map((f) => (
                        <th
                          key={f}
                          style={{ textAlign: "center", fontSize: "0.75rem" }}
                        >
                          {MGR_FEATURE_LABELS[f]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {myCentres.map((centre) => (
                      <tr key={centre}>
                        <td style={{ fontWeight: 500 }}>{centre}</td>
                        {MGR_FEATURE_KEYS.map((f) => {
                          const on = getToggle(centre, f);
                          return (
                            <td key={f} style={{ textAlign: "center" }}>
                              <button
                                onClick={() => setToggle(centre, f, !on)}
                                style={{
                                  background: on ? "#dcfce7" : "#fee2e2",
                                  border: "none",
                                  borderRadius: 20,
                                  padding: "3px 10px",
                                  fontSize: "0.72rem",
                                  fontWeight: 600,
                                  color: on ? "#16a34a" : "#dc2626",
                                  cursor: "pointer",
                                }}
                              >
                                {on ? "ON" : "OFF"}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {isCountryAdmin && activeTab === "userlist" && (
          <div
            style={{
              background: "var(--card-bg)",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 2px 8px var(--shadow-color)",
            }}
          >
            <h3 style={{ marginBottom: 16 }}>Users in {user.country}</h3>
            <div style={{ overflowX: "auto" }}>
              <table className="staff-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Centre</th>
                    <th>Role</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {realUsers
                    .filter((u) => (u.country || u.Country) === user.country)
                    .map((u, i) => (
                      <tr key={i}>
                        <td style={{ fontWeight: 500 }}>{u.Name || u.name}</td>
                        <td>{u.Email || u.email}</td>
                        <td>{u.Centre || u.centre}</td>
                        <td>{u.Role || u.role}</td>
                        <td>
                          <span
                            className={`status-badge status-${(u.Status || u.status || "pending").toLowerCase()}`}
                          >
                            {u.Status || u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {(!isCountryAdmin || activeTab === "overview") && (
        <>
          <div className="dashboard-hero-row">
            <LogTimeButton onNavigate={onNavigate} t={t} />
            <QuickLeaveRequest
              userName={user.name}
              userKey={user.email}
              staffNames={staffNames}
              t={t}
            />
          </div>

          <div className="dashboard-grid dashboard-grid--manager">
            <InfoCard
              icon={Users}
              iconClass="total-staff"
              value={totalStaff}
              label={t.totalStaff}
              onClick={() => onNavigate("staff")}
            />
            <InfoCard
              icon={CheckCircle}
              iconClass="active-today"
              value={activeToday}
              label={t.activeToday}
            />
            <InfoCard
              icon={AlertTriangle}
              iconClass="red-flags"
              value={redFlags}
              label={t.redFlags}
              onClick={() => onNavigate("redflags")}
            />
            <InfoCard
              icon={FileText}
              iconClass="pending-leaves"
              value={pendingLeaves}
              label={t.pendingLeaves}
              onClick={() => onNavigate("pendingleaves")}
            />
            <InfoCard
              icon={Clock}
              iconClass="hours"
              value="172h"
              label={t.hrsLogged}
              onClick={() => onNavigate("logtime")}
            />
            <InfoCard
              icon={BookOpen}
              iconClass="classes"
              value="3"
              label={t.activeClasses}
              onClick={() => onNavigate("classes")}
            />

            {/* SENSITIVE STAT: Only visible to Country Admin */}
            {isCountryAdmin && (
              <InfoCard
                icon={Users}
                iconClass="students"
                value="9"
                label={t.totalStudents}
              />
            )}

            <InfoCard
              icon={TrendingUp}
              iconClass="efficiency"
              value="87%"
              label={t.avgAttendance}
            />
          </div>

          <div className="dashboard-lower-grid">
            <div className="dashboard-section">
              <h3>{t.quickActions}</h3>
              <div className="quick-actions-buttons">
                <button
                  className="quick-action-button"
                  onClick={() => onNavigate("logtime")}
                >
                  <Clock size={20} /> {t.logTime}
                </button>
                <button
                  className="quick-action-button"
                  onClick={() => onNavigate("staff")}
                >
                  <Users size={20} /> {t.addStaff}
                </button>
                <button
                  className="quick-action-button"
                  onClick={() => onNavigate("pendingleaves")}
                >
                  <FileText size={20} /> {t.reviewLeaves}
                </button>
                <button
                  className="quick-action-button"
                  onClick={() => onNavigate("redflags")}
                >
                  <AlertTriangle size={20} /> {t.viewFlags}
                </button>

                {/* BUTTON HIDDEN FROM MANAGER: Only visible to Country Admin */}
                {isCountryAdmin && (
                  <button
                    className="quick-action-button"
                    onClick={() => onNavigate("admin")}
                  >
                    <Shield size={20} /> {t.commandCentre}
                  </button>
                )}
              </div>
            </div>

            {/* SENSITIVE SECTION: Only visible to Country Admin */}
            {isCountryAdmin && (
              <div className="dashboard-section">
                <h3>Bird's Eye View</h3>
                <ul className="activity-list">
                  <li className="activity-item">
                    <div className="activity-details">
                      <strong>Total Students</strong>
                      <span>Across all centres</span>
                    </div>
                    <div className="activity-time">
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--primary-color)",
                        }}
                      >
                        9
                      </span>
                    </div>
                  </li>
                  <li className="activity-item">
                    <div className="activity-details">
                      <strong>Active Red Flags</strong>
                      <span>Requires attention</span>
                    </div>
                    <div className="activity-time">
                      <span style={{ fontWeight: 700, color: "#e74c3c" }}>
                        {redFlags}
                      </span>
                    </div>
                  </li>
                  <li className="activity-item">
                    <div className="activity-details">
                      <strong>Budget vs. Actual</strong>
                      <span>Monthly variance</span>
                    </div>
                    <div className="activity-time">
                      <span
                        style={{
                          fontWeight: 700,
                          color: budgetVariance >= 0 ? "#22c55e" : "#e74c3c",
                        }}
                      >
                        {budgetVariance >= 0 ? "+" : ""}
                        {budgetVariance.toLocaleString()}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            )}

            <div className="dashboard-section">
              <h3>{t.recentActivity}</h3>
              {(() => {
                try {
                  const reimbs = JSON.parse(
                    localStorage.getItem("haazimi_reimbursements") || "[]",
                  );
                  const recentReimbs = reimbs.slice(0, 3).map((r) => ({
                    name: r.staffName || "Staff",
                    action: `Reimbursement request · ${r.purpose || ""}`,
                    time: r.date || "",
                    status:
                      r.status === "approved"
                        ? "completed"
                        : r.status === "rejected"
                          ? "incomplete"
                          : "in-progress",
                  }));
                  if (recentReimbs.length > 0) {
                    return (
                      <ul className="activity-list">
                        {recentReimbs.map((item, i) => (
                          <li key={i} className="activity-item">
                            <div className="activity-details">
                              <strong>{item.name}</strong>
                              <span>{item.action}</span>
                            </div>
                            <div className="activity-time">
                              <span>{item.time}</span>
                              <span
                                className={`status-badge status-${item.status}`}
                              >
                                {item.status.replace("-", " ")}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                } catch {}
                return (
                  <div
                    style={{
                      color: "var(--text-secondary)",
                      fontSize: "0.88rem",
                      padding: "12px 0",
                    }}
                  >
                    No recent activity yet.
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StaffDashboard({ user, onNavigate, language }) {
  const t = DASH_T[language] || DASH_T.en;
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const today = new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const myLogs = (() => {
    try {
      const all = JSON.parse(
        localStorage.getItem(`haazimi_timelogs_${user.email}`) || "[]",
      );
      return all.slice(0, 3);
    } catch {
      return [];
    }
  })();
  const totalHours = (() => {
    try {
      const all = JSON.parse(
        localStorage.getItem(`haazimi_timelogs_${user.email}`) || "[]",
      );
      return all.reduce((s, l) => s + (l.hours || 0), 0);
    } catch {
      return 0;
    }
  })();

  const handleAsk = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    await new Promise((r) => setTimeout(r, 1200));
    setAiResponse(
      `Based on your records, you have logged ${totalHours} hours this month across ${myLogs.length} sessions. Keep up the great work!`,
    );
    setAiLoading(false);
  };

  return (
    <div className="dhimmedaar-home-layout">
      <div className="view-header">
        <div>
          <h2>
            {t.greeting}, {user.name.split(" ")[0]}
          </h2>
          <p>{today}</p>
        </div>
      </div>
      <div className="dashboard-hero-row">
        <LogTimeButton onNavigate={onNavigate} t={t} />
        <QuickLeaveRequest
          userName={user.name}
          userKey={user.email}
          staffNames={[]}
          t={t}
        />
      </div>
      <div className="dashboard-grid">
        <InfoCard
          icon={Clock}
          iconClass="hours"
          value={`${totalHours}h`}
          label={t.hoursMonth}
          onClick={() => onNavigate("logtime")}
        />
        <InfoCard
          icon={BookOpen}
          iconClass="classes"
          value="3"
          label={t.myClasses}
          onClick={() => onNavigate("classes")}
        />
        <InfoCard
          icon={Users}
          iconClass="students"
          value="9"
          label={t.myStudents}
        />
        <InfoCard
          icon={CheckCircle}
          iconClass="active-today"
          value="88%"
          label={t.avgAttendance}
        />
      </div>
      <div className="dashboard-section ai-assistant-section">
        <h3>{t.aiTitle}</h3>
        <p className="ai-assistant-description">{t.aiSub}</p>
        <div
          className="ai-input-area"
          style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
        >
          <input
            type="text"
            placeholder={t.aiPlaceholder}
            value={aiInput}
            onChange={(e) => setAiInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            style={{ flex: "1 1 200px", minWidth: 0 }}
          />
          <button
            className="button-primary icon-button"
            onClick={handleAsk}
            disabled={aiLoading}
            style={{ flexShrink: 0 }}
          >
            <Send size={16} /> {t.ask}
          </button>
        </div>
        <div className="ai-response-area">
          {aiLoading ? (
            <div className="loading-spinner" />
          ) : aiResponse ? (
            <p>{aiResponse}</p>
          ) : (
            <p
              style={{ color: "var(--subtle-text-color)", fontStyle: "italic" }}
            >
              {t.aiDefault}
            </p>
          )}
        </div>
      </div>
      <div className="dashboard-section">
        <h3>{t.recentLogs}</h3>
        <div
          style={{
            width: "100%",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <table className="staff-table" style={{ minWidth: 520 }}>
            <thead>
              <tr>
                <th style={{ padding: "10px 8px" }}>Date</th>
                <th style={{ padding: "10px 8px" }}>In</th>
                <th style={{ padding: "10px 8px" }}>Out</th>
                <th style={{ padding: "10px 8px" }}>Hrs</th>
                <th style={{ padding: "10px 8px" }}>Activity</th>
              </tr>
            </thead>
            <tbody>
              {myLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>
                    {log.date}
                  </td>
                  <td style={{ padding: "10px 8px" }}>{log.checkIn}</td>
                  <td style={{ padding: "10px 8px" }}>{log.checkOut}</td>
                  <td style={{ padding: "10px 8px", fontWeight: 600 }}>
                    {log.hours}h
                  </td>
                  <td style={{ padding: "10px 8px" }}>{log.activity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SuperAdminGeneralDashboard({ user, onNavigate }) {
  const accounts = (() => {
    try {
      return JSON.parse(localStorage.getItem("haazimi_accounts") || "[]");
    } catch {
      return [];
    }
  })();
  const totalUsers = accounts.length;
  const pendingApprovals = accounts.filter(
    (a) => !a.status || a.status === "Pending",
  ).length;
  const approvedUsers = accounts.filter((a) => a.status === "Approved").length;
  const deniedUsers = accounts.filter((a) => a.status === "Denied").length;
  const countries = [
    ...new Set(accounts.map((a) => a.country).filter(Boolean)),
  ];
  const centres = [...new Set(accounts.map((a) => a.centre).filter(Boolean))];
  const byCountry = countries.map((c) => ({
    country: c,
    count: accounts.filter((a) => a.country === c).length,
  }));
  const recentAccounts = [...accounts].reverse().slice(0, 5);

  return (
    <div>
      <div className="view-header">
        <div>
          <h2>System Overview</h2>
          <p>Global snapshot across all countries and centres</p>
        </div>
      </div>
      <div
        className="dashboard-grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          marginBottom: 24,
        }}
      >
        <InfoCard
          icon={Users}
          iconClass="total-staff"
          value={totalUsers}
          label="Total Registered Users"
        />
        <InfoCard
          icon={UserCheck}
          iconClass="active-today"
          value={approvedUsers}
          label="Approved Users"
        />
        <InfoCard
          icon={FileText}
          iconClass="pending-leaves"
          value={pendingApprovals}
          label="Pending Approvals"
          onClick={
            pendingApprovals > 0 ? () => onNavigate("superadmin") : undefined
          }
        />
        <InfoCard
          icon={UserX}
          iconClass="red-flags"
          value={deniedUsers}
          label="Denied Users"
        />
        <InfoCard
          icon={Globe}
          iconClass="students"
          value={countries.length || "—"}
          label="Countries"
        />
        <InfoCard
          icon={Shield}
          iconClass="efficiency"
          value={centres.length || "—"}
          label="Centres"
        />
      </div>
      <div className="dashboard-lower-grid">
        <div className="dashboard-section">
          <h3>Quick Actions</h3>
          <div className="quick-actions-buttons">
            <button
              className="quick-action-button"
              onClick={() => onNavigate("superadmin")}
            >
              <Shield size={20} /> Super Admin Panel
            </button>
            <button
              className="quick-action-button"
              onClick={() => onNavigate("calendar")}
            >
              <Calendar size={20} /> Calendar
            </button>
            <button
              className="quick-action-button"
              onClick={() => onNavigate("reports")}
            >
              <BarChart2 size={20} /> Reports
            </button>
            <button
              className="quick-action-button"
              onClick={() => onNavigate("settings")}
            >
              <Settings size={20} /> Settings
            </button>
          </div>
        </div>
        {byCountry.length > 0 && (
          <div className="dashboard-section">
            <h3>Users by Country</h3>
            <ul className="activity-list">
              {byCountry.map((row, i) => (
                <li key={i} className="activity-item">
                  <div className="activity-details">
                    <strong>{row.country}</strong>
                    <span>
                      {row.count} user{row.count !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="activity-time">
                    <span
                      style={{ fontWeight: 700, color: "var(--primary-color)" }}
                    >
                      {row.count}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="dashboard-section">
          <h3>Recent Registrations</h3>
          {recentAccounts.length === 0 ? (
            <div
              style={{
                color: "var(--text-secondary)",
                fontSize: "0.88rem",
                padding: "12px 0",
              }}
            >
              No registered users yet.
            </div>
          ) : (
            <ul className="activity-list">
              {recentAccounts.map((acc, i) => (
                <li key={i} className="activity-item">
                  <div className="activity-details">
                    <strong>{acc.name || acc.email}</strong>
                    <span>
                      {acc.role || "Staff"} · {acc.country || "—"}
                    </span>
                  </div>
                  <div className="activity-time">
                    <span
                      className={`status-badge status-${(acc.status || "pending").toLowerCase()}`}
                    >
                      {acc.status || "Pending"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ user, onNavigate, language }) {
  const role = user.role;
  if (role === "Super Admin") {
    return <SuperAdminGeneralDashboard user={user} onNavigate={onNavigate} />;
  }
  if (["Centre Manager", "Country Admin"].includes(role)) {
    return (
      <ManagerDashboard
        user={user}
        onNavigate={onNavigate}
        language={language}
      />
    );
  }
  return (
    <StaffDashboard user={user} onNavigate={onNavigate} language={language} />
  );
}
