import { useState } from 'react';
import {
  ChevronRight, ChevronLeft, LayoutDashboard, Clock, CalendarOff,
  BookOpen, User, Car, CheckSquare, Users, BarChart2, DollarSign,
  Shield, Globe, PartyPopper, Building2, Moon
} from 'lucide-react';

const TOUR_KEY = 'haazimi_tour_v1';

export function markTourDone() {
  localStorage.setItem(TOUR_KEY, '1');
}
export function isTourDone() {
  return !!localStorage.getItem(TOUR_KEY);
}
export function resetTour() {
  localStorage.removeItem(TOUR_KEY);
}

const STEP_VIEW_MAP = {
  logtime: 'logtime',
  leave: 'leave',
  classes: 'classes',
  students: 'classes',
  visits: 'visits',
  pendingleaves: 'pendingleaves',
  staff: 'staff',
  reports: 'reports',
  budget: 'budget',
};

const STEPS_BY_ROLE = {
  staff:     ['welcome', 'dashboard', 'logtime', 'leave', 'classes', 'students', 'visits', 'done'],
  manager:   ['welcome', 'dashboard', 'logtime', 'pendingleaves', 'staff', 'classes', 'students', 'visits', 'reports', 'budget', 'done'],
  admin:     ['welcome', 'dashboard', 'admin', 'staff', 'reports', 'budget', 'done'],
  superadmin:['welcome', 'superadmin', 'reports', 'done'],
};

const ALL_STEPS = {
  welcome: {
    Icon: Moon, color: '#6366f1',
    en: { title: 'Welcome to Madrassa Haazimi', body: 'This app helps you manage your maktab — classes, students, attendance, leave and more. This quick tour shows you the key features available to you.' },
    ar: { title: 'مرحباً بك في مدرسة حازمي', body: 'يساعدك هذا التطبيق على إدارة مدرستك — الفصول والطلاب والحضور والإجازات وأكثر.' },
    ur: { title: 'مدرسہ حازمی میں خوش آمدید', body: 'یہ ایپ آپ کے مکتب کو منظم کرنے میں مدد کرتی ہے — کلاسیں، طلبہ، حاضری، چھٹیاں اور بہت کچھ۔' },
    es: { title: 'Bienvenido a Madrassa Haazimi', body: 'Esta app te ayuda a gestionar tu maktab — clases, alumnos, asistencia, licencias y más.' },
    pt: { title: 'Bem-vindo à Madrassa Haazimi', body: 'Este app ajuda a gerir o seu maktab — turmas, alunos, frequência, licenças e muito mais.' },
  },
  dashboard: {
    Icon: LayoutDashboard, color: '#3b82f6',
    en: { title: 'Your Dashboard', body: 'This is your home screen. See pending tasks, your recent time logs, quick stats, and a shortcut to request leave — all at a glance.' },
    ar: { title: 'لوحة القيادة', body: 'هذه هي شاشتك الرئيسية. اطلع على المهام المعلقة وسجلات وقتك الأخيرة والإحصاءات السريعة وطلب الإجازة.' },
    ur: { title: 'آپ کا ڈیش بورڈ', body: 'یہ آپ کی ہوم اسکرین ہے۔ زیر التواء کام، حالیہ ٹائم لاگز، فوری اعدادوشمار اور چھٹی کی درخواست یہاں دیکھیں۔' },
    es: { title: 'Tu Panel', body: 'Esta es tu pantalla de inicio. Ve tareas pendientes, registros recientes, estadísticas y un acceso rápido a solicitudes de licencia.' },
    pt: { title: 'O Seu Painel', body: 'Este é o seu ecrã inicial. Veja tarefas pendentes, registos recentes, estatísticas e um atalho para pedidos de licença.' },
  },
  logtime: {
    Icon: Clock, color: '#10b981',
    en: { title: 'Log Your Sessions', body: 'After every class, tap Log Time to record your activity, check-in/out times, and how many students attended. You can also mark absent students by name. Do this daily!' },
    ar: { title: 'تسجيل جلساتك', body: 'بعد كل درس، اضغط على "تسجيل الوقت" لتسجيل نشاطك وأوقات الدخول/الخروج وعدد الطلاب الحاضرين.' },
    ur: { title: 'اپنے سیشن ریکارڈ کریں', body: 'ہر کلاس کے بعد "لاگ ٹائم" پر ٹیپ کریں۔ سرگرمی، آمد/رخصت کے اوقات اور حاضر طلبہ نوٹ کریں۔' },
    es: { title: 'Registra tus Sesiones', body: 'Después de cada clase, toca Registrar Tiempo para anotar tu actividad, horario y cuántos alumnos asistieron.' },
    pt: { title: 'Registe as Suas Sessões', body: 'Após cada aula, toque em Registar Tempo para registar a actividade, horário e quantos alunos assistiram.' },
  },
  leave: {
    Icon: CalendarOff, color: '#f59e0b',
    en: { title: 'Leave Requests', body: 'Need time off? Use the Leave History page to submit a request. You\'ll need to read and accept a disclaimer before submitting. Your manager will then approve or decline it.' },
    ar: { title: 'طلبات الإجازة', body: 'تحتاج إلى إجازة؟ استخدم صفحة سجل الإجازات لتقديم طلب. ستحتاج إلى قراءة إقرار والموافقة عليه. سيوافق مديرك أو يرفضه.' },
    ur: { title: 'چھٹی کی درخواستیں', body: 'چھٹی چاہیے؟ چھٹی کے صفحے سے درخواست جمع کریں۔ جمع کرانے سے پہلے ایک اقرار نامہ پڑھنا ہوگا۔' },
    es: { title: 'Solicitudes de Licencia', body: '¿Necesitas tiempo libre? Usa la página de Historial de Licencias. Deberás leer y aceptar un descargo antes de enviar.' },
    pt: { title: 'Pedidos de Licença', body: 'Precisa de folga? Use a página de Histórico de Licenças. Terá de ler e aceitar um aviso antes de enviar.' },
  },
  classes: {
    Icon: BookOpen, color: '#8b5cf6',
    en: { title: 'My Classes', body: 'See all your classes and the students in each one. Tap any student card to expand their full profile — Qur\'aan progress, Imaani A\'maal, attendance, and notes.' },
    ar: { title: 'فصولي', body: 'اطلع على جميع فصولك وطلابها. اضغط على بطاقة أي طالب لرؤية ملفه الكامل — تقدم القرآن والأعمال الإيمانية والحضور.' },
    ur: { title: 'میری کلاسیں', body: 'اپنی تمام کلاسیں اور ہر کلاس کے طلبہ دیکھیں۔ کسی بھی طالب کا کارڈ دبائیں — قرآن، ایمانی اعمال، حاضری اور نوٹس۔' },
    es: { title: 'Mis Clases', body: 'Ve todas tus clases y los alumnos de cada una. Toca cualquier tarjeta para ver el perfil completo — Qur\'aan, A\'maal Imáni, asistencia y notas.' },
    pt: { title: 'Minhas Turmas', body: 'Veja todas as turmas e alunos. Toque na ficha de qualquer aluno para ver o perfil completo — Qur\'aan, A\'maal Imani, frequência e notas.' },
  },
  students: {
    Icon: User, color: '#6366f1',
    en: { title: 'Student Directory', body: 'The Students page is your full contact list. Tap a phone number to call, or tap an address to open it in Maps. You can also add new students or edit existing ones here.' },
    ar: { title: 'دليل الطلاب', body: 'صفحة الطلاب هي قائمة اتصالك الكاملة. اضغط على رقم الهاتف للاتصال أو على العنوان لفتح الخرائط.' },
    ur: { title: 'طلبہ ڈائریکٹری', body: 'طلبہ کا صفحہ آپ کی مکمل رابطہ فہرست ہے۔ فون نمبر پر ٹیپ کریں کال کرنے کے لیے، یا پتے پر میپس کھولنے کے لیے۔' },
    es: { title: 'Directorio de Alumnos', body: 'La página de Alumnos es tu lista de contactos completa. Toca un número para llamar o una dirección para abrirla en Mapas.' },
    pt: { title: 'Directório de Alunos', body: 'A página de Alunos é a sua lista de contactos completa. Toque num número para ligar, ou num endereço para abrir no Maps.' },
  },
  visits: {
    Icon: Car, color: '#0ea5e9',
    en: { title: 'Mulaaqaats (Visits)', body: 'Track outreach visits to students\' families, community leaders, and donors. Log when a visit is done and it moves to the Upcoming list, keeping your follow-ups organised.' },
    ar: { title: 'الملاقاات (الزيارات)', body: 'تتبع زيارات التواصل لأسر الطلاب والقادة المجتمعيين والمانحين. سجّل إتمام الزيارة وستنتقل إلى قائمة القادمة.' },
    ur: { title: 'ملاقاتیں (وزٹ)', body: 'طلبہ کے خاندانوں، کمیونٹی لیڈروں اور عطیہ دہندگان کے دورے ٹریک کریں۔' },
    es: { title: 'Mulaaqaats (Visitas)', body: 'Rastrea visitas de alcance a familias de alumnos, líderes comunitarios y donantes.' },
    pt: { title: 'Mulaaqaats (Visitas)', body: 'Acompanhe visitas a famílias de alunos, líderes comunitários e doadores.' },
  },
  pendingleaves: {
    Icon: CheckSquare, color: '#10b981',
    en: { title: 'Approving Leave Requests', body: 'Staff leave requests appear under Leave Requests. Review each one and approve or decline with a reason. Staff see the decision immediately in their app.' },
    ar: { title: 'الموافقة على الإجازات', body: 'تظهر طلبات إجازة الموظفين ضمن طلبات الإجازة. راجع كل طلب وافق عليه أو ارفضه مع ذكر السبب.' },
    ur: { title: 'چھٹی کی درخواستیں منظور کرنا', body: 'عملے کی چھٹی کی درخواستیں یہاں نظر آئیں گی۔ ہر درخواست دیکھیں اور وجہ کے ساتھ منظور یا رد کریں۔' },
    es: { title: 'Aprobación de Solicitudes', body: 'Las solicitudes del personal aparecen en Solicitudes de Licencia. Revisa cada una y aprueba o rechaza con un motivo.' },
    pt: { title: 'Aprovação de Licenças', body: 'Os pedidos do pessoal aparecem em Pedidos de Licença. Reveja cada um e aprove ou rejeite com um motivo.' },
  },
  staff: {
    Icon: Users, color: '#3b82f6',
    en: { title: 'Staff Management', body: 'View all staff at your centre — their role, status, contact details, and leave balance. You can add new staff members and update their information here.' },
    ar: { title: 'إدارة الموظفين', body: 'عرض جميع موظفي مركزك — دورهم وحالتهم وبيانات الاتصال ورصيد الإجازات.' },
    ur: { title: 'عملہ انتظام', body: 'اپنے مرکز کے تمام عملے کو دیکھیں — کردار، حیثیت، رابطہ کی تفصیلات اور چھٹی کا توازن۔' },
    es: { title: 'Gestión del Personal', body: 'Ve todo el personal de tu centro — rol, estado, datos de contacto y saldo de licencias.' },
    pt: { title: 'Gestão do Pessoal', body: 'Veja todo o pessoal do seu centro — função, estado, contactos e saldo de licenças.' },
  },
  reports: {
    Icon: BarChart2, color: '#f59e0b',
    en: { title: 'Reports & Insights', body: 'See attendance rates, total hours logged, leave summaries, and class activity broken down by staff member — useful for monthly reviews and planning.' },
    ar: { title: 'التقارير والتحليلات', body: 'اطلع على معدلات الحضور والساعات المسجلة وملخصات الإجازات ونشاط الفصول مقسمةً حسب الموظف.' },
    ur: { title: 'رپورٹس اور بصیرت', body: 'حاضری کی شرح، کل ریکارڈ شدہ گھنٹے، چھٹی کا خلاصہ اور کلاس کی سرگرمی فی عملہ رکن دیکھیں۔' },
    es: { title: 'Informes y Estadísticas', body: 'Ve tasas de asistencia, horas totales registradas, resúmenes de licencias y actividad de clases por miembro del personal.' },
    pt: { title: 'Relatórios e Estatísticas', body: 'Veja taxas de frequência, horas totais registadas, resumos de licenças e actividade de turmas por membro do pessoal.' },
  },
  budget: {
    Icon: DollarSign, color: '#16a34a',
    en: { title: 'Budget Tracking', body: 'Track income and expenses for your centre. Each budget item shows how much was planned vs. spent. You can upload receipts directly and everything syncs to Google Sheets.' },
    ar: { title: 'تتبع الميزانية', body: 'تتبع إيرادات ومصروفات مركزك. يُظهر كل بند الميزانية المخطط مقابل المنفق. يمكنك رفع الإيصالات مباشرة.' },
    ur: { title: 'بجٹ ٹریکنگ', body: 'اپنے مرکز کی آمدنی اور اخراجات ٹریک کریں۔ ہر بجٹ آئٹم منصوبہ بمقابلہ خرچ دکھاتا ہے۔ رسیدیں براہ راست اپلوڈ کریں۔' },
    es: { title: 'Seguimiento Presupuestario', body: 'Rastrea ingresos y gastos de tu centro. Cada partida muestra lo planificado vs. gastado. Puedes subir recibos directamente.' },
    pt: { title: 'Acompanhamento Orçamental', body: 'Acompanhe receitas e despesas do seu centro. Cada rubrica mostra o planeado vs. gasto. Pode carregar recibos diretamente.' },
  },
  admin: {
    Icon: Building2, color: '#6366f1',
    en: { title: 'Command Centre', body: 'As a Country Admin you have oversight of all centres in your country. Approve registrations, manage users, review reimbursements, and enable or disable features per centre.' },
    ar: { title: 'مركز القيادة', body: 'بوصفك مسؤول الدولة، لديك إشراف على جميع المراكز. وافق على التسجيلات وأدر المستخدمين وفعّل أو عطّل الميزات.' },
    ur: { title: 'کمانڈ سینٹر', body: 'بحیثیت کنٹری ایڈمن، اپنے ملک کے تمام مراکز پر نظر رکھیں۔ رجسٹریشن منظور کریں، صارفین کا انتظام کریں۔' },
    es: { title: 'Centro de Comando', body: 'Como Admin de País tienes supervisión de todos los centros. Aprueba registros, gestiona usuarios y activa o desactiva funciones.' },
    pt: { title: 'Centro de Comando', body: 'Como Admin do País tem supervisão de todos os centros. Aprove registos, gira utilizadores e ative ou desative funcionalidades.' },
  },
  superadmin: {
    Icon: Globe, color: '#ef4444',
    en: { title: 'Super Admin Dashboard', body: 'You have full global visibility across all countries and centres. Monitor KPIs, staff activity, student at-risk counts, and class attendance across the entire system.' },
    ar: { title: 'لوحة المشرف العام', body: 'لديك رؤية عالمية كاملة على جميع الدول والمراكز. راقب مؤشرات الأداء ونشاط الموظفين وأعداد الطلاب المعرضين للخطر.' },
    ur: { title: 'سپر ایڈمن ڈیش بورڈ', body: 'تمام ممالک اور مراکز پر مکمل عالمی نظر ہے۔ KPIs، عملہ سرگرمی اور خطرے میں طلبہ کی تعداد مانیٹر کریں۔' },
    es: { title: 'Panel del Super Admin', body: 'Tienes visibilidad global completa. Monitorea KPIs, actividad del personal, alumnos en riesgo y asistencia en todo el sistema.' },
    pt: { title: 'Painel do Super Admin', body: 'Tem visibilidade global completa. Monitorize KPIs, actividade do pessoal, alunos em risco e frequência em todo o sistema.' },
  },
  done: {
    Icon: PartyPopper, color: '#10b981',
    en: { title: "You're all set!", body: 'You can replay this tour anytime from the Settings page. If you have any questions, speak to your centre manager. May Allah put barakah in your work.' },
    ar: { title: 'أنت مستعد!', body: 'يمكنك إعادة هذه الجولة في أي وقت من صفحة الإعدادات. إذا كان لديك أسئلة، تحدث إلى مدير مركزك. جعل الله في عملك بركة.' },
    ur: { title: 'آپ تیار ہیں!', body: 'آپ کسی بھی وقت ترتیبات کے صفحے سے یہ ٹور دوبارہ چلا سکتے ہیں۔ اللہ آپ کے کام میں برکت عطا فرمائے۔' },
    es: { title: '¡Todo listo!', body: 'Puedes repetir este tour en cualquier momento desde Configuración. Que Allah bendiga tu trabajo.' },
    pt: { title: 'Está tudo pronto!', body: 'Pode repetir este tour em qualquer altura nas Configurações. Que Allah abençoe o seu trabalho.' },
  },
};

const T_UI = {
  en: { skip: 'Skip tour', next: 'Next', prev: 'Back', finish: 'Get Started', of: 'of' },
  ar: { skip: 'تخطي', next: 'التالي', prev: 'السابق', finish: 'ابدأ', of: 'من' },
  ur: { skip: 'چھوڑیں', next: 'اگلا', prev: 'پچھلا', finish: 'شروع کریں', of: 'میں سے' },
  es: { skip: 'Omitir', next: 'Siguiente', prev: 'Anterior', finish: 'Comenzar', of: 'de' },
  pt: { skip: 'Pular', next: 'Próximo', prev: 'Anterior', finish: 'Começar', of: 'de' },
};

function getRoleKey(role) {
  if (!role) return 'staff';
  if (role === 'Super Admin') return 'superadmin';
  if (role === 'Country Admin') return 'admin';
  if (role === 'Centre Manager') return 'manager';
  return 'staff';
}

export default function OnboardingTour({ user, language, onDone, checkVisibility }) {
  const lang = language || 'en';
  const ui = T_UI[lang] || T_UI.en;
  const roleKey = getRoleKey(user?.role);
  const allKeys = STEPS_BY_ROLE[roleKey] || STEPS_BY_ROLE.staff;

  const stepKeys = allKeys.filter(key => {
    const viewKey = STEP_VIEW_MAP[key];
    if (!viewKey) return true;
    if (!checkVisibility) return true;
    return checkVisibility(viewKey);
  });

  const steps = stepKeys.map(k => ({ key: k, ...ALL_STEPS[k] }));

  const [idx, setIdx] = useState(0);
  const [animDir, setAnimDir] = useState(null);

  const step = steps[idx];
  const isLast = idx === steps.length - 1;
  const isRtl = lang === 'ar' || lang === 'ur';

  const go = (dir) => {
    setAnimDir(dir);
    setTimeout(() => {
      setIdx(i => i + dir);
      setAnimDir(null);
    }, 150);
  };

  const finish = () => {
    markTourDone();
    onDone();
  };

  const text = step[lang] || step.en;
  const StepIcon = step.Icon;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'var(--card-bg)',
        borderRadius: 20,
        width: '100%',
        maxWidth: 420,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        direction: isRtl ? 'rtl' : 'ltr',
      }}>
        <div style={{ height: 6, background: 'var(--hover-bg)', position: 'relative' }}>
          <div style={{
            height: '100%',
            width: `${((idx + 1) / steps.length) * 100}%`,
            background: step.color,
            transition: 'width 0.3s ease',
            borderRadius: '0 3px 3px 0',
          }} />
        </div>

        <div style={{ padding: '28px 28px 24px', minHeight: 280 }}>
          <div style={{
            display: 'flex', justifyContent: 'center', marginBottom: 18,
            opacity: animDir ? 0 : 1,
            transform: animDir === 1 ? 'translateX(-20px)' : animDir === -1 ? 'translateX(20px)' : 'none',
            transition: 'opacity 0.15s, transform 0.15s',
          }}>
            <div style={{
              width: 68, height: 68,
              borderRadius: '50%',
              background: step.color + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <StepIcon size={32} color={step.color} strokeWidth={1.75} />
            </div>
          </div>

          <div style={{
            opacity: animDir ? 0 : 1,
            transform: animDir === 1 ? 'translateX(-16px)' : animDir === -1 ? 'translateX(16px)' : 'none',
            transition: 'opacity 0.15s, transform 0.15s',
          }}>
            <h2 style={{
              fontSize: '1.2rem', fontWeight: 700, color: step.color,
              margin: '0 0 12px', textAlign: 'center',
            }}>
              {text.title}
            </h2>
            <p style={{
              fontSize: '0.93rem', color: 'var(--text-secondary)',
              lineHeight: 1.65, margin: 0, textAlign: 'center',
            }}>
              {text.body}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', paddingBottom: 8 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              width: i === idx ? 22 : 7, height: 7,
              borderRadius: 4,
              background: i === idx ? step.color : 'var(--hover-bg)',
              transition: 'width 0.3s, background 0.3s',
            }} />
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px 20px', gap: 10,
        }}>
          {idx > 0 ? (
            <button onClick={() => go(-1)} style={{
              background: 'transparent', border: '1.5px solid var(--border-color)',
              borderRadius: 10, padding: '9px 16px', cursor: 'pointer',
              color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {isRtl ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
              {ui.prev}
            </button>
          ) : (
            <button onClick={finish} style={{
              background: 'transparent', border: 'none',
              cursor: 'pointer', color: 'var(--text-secondary)',
              fontSize: '0.83rem', padding: '9px 6px',
            }}>
              {ui.skip}
            </button>
          )}

          <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            {idx + 1} {ui.of} {steps.length}
          </span>

          {isLast ? (
            <button onClick={finish} style={{
              background: step.color, border: 'none',
              borderRadius: 10, padding: '10px 22px', cursor: 'pointer',
              color: 'white', fontSize: '0.92rem', fontWeight: 600,
            }}>
              {ui.finish}
            </button>
          ) : (
            <button onClick={() => go(1)} style={{
              background: step.color, border: 'none',
              borderRadius: 10, padding: '10px 18px', cursor: 'pointer',
              color: 'white', fontSize: '0.88rem', fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {ui.next}
              {isRtl ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
