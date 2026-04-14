import { useState } from 'react';
import { Bell, Shield, User, DollarSign, Layout as LayoutIcon, Navigation, ChevronDown, Palette, HelpCircle, PlayCircle } from 'lucide-react';

const T = {
  en: {
    title: 'Settings', sub: 'Manage your preferences and account settings',
    profile: 'Profile', profileSub: 'Your account information',
    fullName: 'Full Name', email: 'Email', centre: 'Center / Branch', role: 'Role',
    nameHint: 'ⓘ Contact your manager to update your name',
    centreHint: 'ⓘ Centre is assigned by your administrator',
    emailHint: 'ⓘ Email can only be changed once every 30 days',
    currency: 'Currency Display', currencySub: 'Choose the currency symbol used across Budget and financial views',
    notifications: 'Notifications', notifSub: 'Choose what you want to be notified about',
    security: 'Security', securitySub: 'Manage your password and security settings',
    currentPwd: 'Current Password', newPwd: 'New Password', confirmPwd: 'Confirm New Password',
    discard: 'Discard Changes', save: 'Save Settings', saved: 'Settings saved successfully!',
    help: 'Help & Tutorial', helpSub: 'Replay the onboarding tour or get tips',
    replayTour: 'Replay App Tour', replayTourDesc: 'Go through the guided walkthrough again to rediscover features.',
    replayBtn: 'Start Tour',
    display: 'Display Preferences', displaySub: 'Customise how the app looks and behaves on your device',
    showBottomNav: 'Show bottom navigation bar',
    showBottomNavDesc: 'Display the quick-access navigation bar at the bottom of the screen on mobile',
    customiseNavBar: 'Customise Navigation Bar',
    customiseNavBarDesc: 'Choose which items appear in the bottom navigation bar. Tick the ones you want.',
    selectAtLeastOne: 'Select at least one item to show in the bottom bar.',
    theme: 'App Theme', themeSub: 'Choose a colour theme to personalise your app',
    themes: { blue: 'Ocean Blue', green: 'Forest Green', red: 'Crimson Red', purple: 'Royal Purple', gold: 'Amber Gold', pink: 'Rose Pink' },
    notif: {
      leaveApproval: 'Leave Approvals', leaveApprovalDesc: 'Notify when your leave request status changes',
      newRequest: 'New Leave Requests', newRequestDesc: 'Notify when staff submit new leave requests',
      redFlags: 'Red Flag Alerts', redFlagsDesc: 'Notify when new red flags are raised',
      calendarEvents: 'Calendar Events', calendarEventsDesc: 'Notify 24 hours before scheduled events',
      weeklyReport: 'Weekly Summary', weeklyReportDesc: 'Receive a weekly summary every Monday',
    },
  },
  ar: {
    title: 'الإعدادات', sub: 'إدارة تفضيلاتك وإعدادات حسابك',
    profile: 'الملف الشخصي', profileSub: 'معلومات حسابك',
    fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', centre: 'المركز / الفرع', role: 'الدور',
    nameHint: 'ⓘ تواصل مع مديرك لتحديث اسمك',
    centreHint: 'ⓘ المركز يُعيّنه مسؤولك',
    emailHint: 'ⓘ يمكن تغيير البريد مرة واحدة كل 30 يوماً',
    currency: 'عرض العملة', currencySub: 'اختر رمز العملة المستخدم في طرق عرض الميزانية والمالية',
    notifications: 'الإشعارات', notifSub: 'اختر ما تريد الإخطار به',
    security: 'الأمان', securitySub: 'إدارة كلمة المرور وإعدادات الأمان',
    currentPwd: 'كلمة المرور الحالية', newPwd: 'كلمة المرور الجديدة', confirmPwd: 'تأكيد كلمة المرور الجديدة',
    discard: 'تجاهل التغييرات', save: 'حفظ الإعدادات', saved: 'تم حفظ الإعدادات بنجاح!',
    help: 'المساعدة والتعليمات', helpSub: 'أعد تشغيل الجولة التعريفية أو احصل على نصائح',
    replayTour: 'إعادة جولة التطبيق', replayTourDesc: 'مر بالجولة الإرشادية مرة أخرى لاكتشاف الميزات.',
    replayBtn: 'ابدأ الجولة',
    display: 'تفضيلات العرض', displaySub: 'تخصيص مظهر التطبيق وسلوكه على جهازك',
    showBottomNav: 'إظهار شريط التنقل السفلي',
    showBottomNavDesc: 'عرض شريط التنقل السريع أسفل الشاشة',
    customiseNavBar: 'تخصيص شريط التنقل',
    customiseNavBarDesc: 'اختر العناصر التي تظهر في شريط التنقل السفلي. ضع علامة على ما تريد.',
    selectAtLeastOne: 'اختر عنصراً واحداً على الأقل لإظهاره في الشريط السفلي.',
    theme: 'سمة التطبيق', themeSub: 'اختر لون السمة لتخصيص تطبيقك',
    themes: { blue: 'أزرق محيطي', green: 'أخضر الغابة', red: 'أحمر قرمزي', purple: 'بنفسجي ملكي', gold: 'ذهبي كهرماني', pink: 'وردي ورود' },
    notif: {
      leaveApproval: 'موافقات الإجازة', leaveApprovalDesc: 'إشعار عند تغيير حالة طلب إجازتك',
      newRequest: 'طلبات إجازة جديدة', newRequestDesc: 'إشعار عند تقديم الموظفين طلبات إجازة جديدة',
      redFlags: 'تنبيهات العلم الأحمر', redFlagsDesc: 'إشعار عند رفع تنبيهات جديدة',
      calendarEvents: 'أحداث التقويم', calendarEventsDesc: 'إشعار قبل 24 ساعة من الأحداث المجدولة',
      weeklyReport: 'الملخص الأسبوعي', weeklyReportDesc: 'تلقّ ملخصاً أسبوعياً كل اثنين',
    },
  },
  ur: {
    title: 'ترتیبات', sub: 'اپنی ترجیحات اور اکاؤنٹ کی ترتیبات کا انتظام کریں',
    profile: 'پروفائل', profileSub: 'آپ کی اکاؤنٹ معلومات',
    fullName: 'پورا نام', email: 'ای میل', centre: 'مرکز / شاخ', role: 'کردار',
    nameHint: 'ⓘ اپنا نام اپ ڈیٹ کرنے کے لیے اپنے مینیجر سے رابطہ کریں',
    centreHint: 'ⓘ مرکز آپ کے منتظم کی طرف سے مقرر ہے',
    emailHint: 'ⓘ ای میل ہر 30 دن میں صرف ایک بار تبدیل کی جا سکتی ہے',
    currency: 'کرنسی ڈسپلے', currencySub: 'بجٹ اور مالی ویوز میں استعمال ہونے والی کرنسی کی علامت منتخب کریں',
    notifications: 'اطلاعات', notifSub: 'منتخب کریں کہ آپ کس بارے میں مطلع ہونا چاہتے ہیں',
    security: 'سیکورٹی', securitySub: 'اپنا پاس ورڈ اور سیکورٹی ترتیبات مینیج کریں',
    currentPwd: 'موجودہ پاس ورڈ', newPwd: 'نیا پاس ورڈ', confirmPwd: 'نیا پاس ورڈ تصدیق کریں',
    discard: 'تبدیلیاں مسترد کریں', save: 'ترتیبات محفوظ کریں', saved: 'ترتیبات کامیابی سے محفوظ ہو گئیں!',
    help: 'مدد اور ٹیوٹوریل', helpSub: 'آن بورڈنگ ٹور دوبارہ چلائیں یا تجاویز حاصل کریں',
    replayTour: 'ایپ ٹور دوبارہ چلائیں', replayTourDesc: 'فیچرز دریافت کرنے کے لیے گائیڈڈ واک تھرو دوبارہ کریں۔',
    replayBtn: 'ٹور شروع کریں',
    display: 'ڈسپلے ترجیحات', displaySub: 'ایپ کی ظاہری شکل اور طرز عمل کو اپنی مرضی کے مطابق بنائیں',
    showBottomNav: 'نیچے نیوی گیشن بار دکھائیں',
    showBottomNavDesc: 'موبائل اسکرین کے نیچے فوری رسائی نیوی گیشن بار دکھائیں',
    customiseNavBar: 'نیوی گیشن بار کو اپنی مرضی سے ترتیب دیں',
    customiseNavBarDesc: 'وہ آئٹمز منتخب کریں جو نیچے کے نیوی گیشن بار میں ظاہر ہوں۔',
    selectAtLeastOne: 'نیچے بار میں دکھانے کے لیے کم از کم ایک آئٹم منتخب کریں۔',
    theme: 'ایپ تھیم', themeSub: 'اپنی ایپ کو ذاتی بنانے کے لیے رنگ تھیم منتخب کریں',
    themes: { blue: 'سمندری نیلا', green: 'جنگلی سبز', red: 'گہرا سرخ', purple: 'شاہی بنفشی', gold: 'عنبری سنہری', pink: 'گلابی' },
    notif: {
      leaveApproval: 'چھٹی کی منظوری', leaveApprovalDesc: 'جب آپ کی چھٹی کی درخواست کی حالت بدلے',
      newRequest: 'نئی چھٹی کی درخواستیں', newRequestDesc: 'جب عملہ نئی چھٹی کی درخواستیں جمع کرے',
      redFlags: 'ریڈ فلیگ الرٹس', redFlagsDesc: 'جب نئے ریڈ فلیگز اٹھائے جائیں',
      calendarEvents: 'کیلنڈر تقریبات', calendarEventsDesc: 'مقررہ تقریبات سے 24 گھنٹے پہلے',
      weeklyReport: 'ہفتہ وار خلاصہ', weeklyReportDesc: 'ہر پیر کو ہفتہ وار خلاصہ موصول کریں',
    },
  },
  es: {
    title: 'Ajustes', sub: 'Administra tus preferencias y configuraciones de cuenta',
    profile: 'Perfil', profileSub: 'Información de tu cuenta',
    fullName: 'Nombre Completo', email: 'Correo Electrónico', centre: 'Centro / Sucursal', role: 'Rol',
    nameHint: 'ⓘ Contacta a tu manager para actualizar tu nombre',
    centreHint: 'ⓘ El centro es asignado por tu administrador',
    emailHint: 'ⓘ El correo solo puede cambiarse una vez cada 30 días',
    currency: 'Visualización de Moneda', currencySub: 'Elige el símbolo de moneda usado en las vistas de Presupuesto',
    notifications: 'Notificaciones', notifSub: 'Elige sobre qué quieres ser notificado',
    security: 'Seguridad', securitySub: 'Administra tu contraseña y configuraciones de seguridad',
    currentPwd: 'Contraseña Actual', newPwd: 'Nueva Contraseña', confirmPwd: 'Confirmar Nueva Contraseña',
    discard: 'Descartar Cambios', save: 'Guardar Configuración', saved: '¡Configuración guardada con éxito!',
    help: 'Ayuda y Tutorial', helpSub: 'Repite el tour de introducción u obtén consejos',
    replayTour: 'Repetir Tour de la App', replayTourDesc: 'Recorre el tutorial guiado de nuevo para redescubrir funciones.',
    replayBtn: 'Iniciar Tour',
    display: 'Preferencias de Visualización', displaySub: 'Personaliza cómo se ve la app en tu dispositivo',
    showBottomNav: 'Mostrar barra de navegación inferior',
    showBottomNavDesc: 'Muestra la barra de navegación rápida en la parte inferior de la pantalla',
    customiseNavBar: 'Personalizar barra de navegación',
    customiseNavBarDesc: 'Elige qué elementos aparecen en la barra de navegación inferior. Marca los que deseas.',
    selectAtLeastOne: 'Selecciona al menos un elemento para mostrar en la barra inferior.',
    theme: 'Tema de la App', themeSub: 'Elige un tema de color para personalizar tu app',
    themes: { blue: 'Azul Oceánico', green: 'Verde Bosque', red: 'Rojo Carmesí', purple: 'Púrpura Real', gold: 'Dorado Ámbar', pink: 'Rosa' },
    notif: {
      leaveApproval: 'Aprobaciones de Licencia', leaveApprovalDesc: 'Notificar cuando cambie el estado de tu solicitud',
      newRequest: 'Nuevas Solicitudes de Licencia', newRequestDesc: 'Notificar cuando el personal envíe nuevas solicitudes',
      redFlags: 'Alertas de Bandera Roja', redFlagsDesc: 'Notificar cuando se levanten nuevas alertas',
      calendarEvents: 'Eventos del Calendario', calendarEventsDesc: 'Notificar 24 horas antes de eventos programados',
      weeklyReport: 'Resumen Semanal', weeklyReportDesc: 'Recibir un resumen semanal cada lunes',
    },
  },
  pt: {
    title: 'Configurações', sub: 'Gerencie suas preferências e configurações de conta',
    profile: 'Perfil', profileSub: 'Informações da sua conta',
    fullName: 'Nome Completo', email: 'E-mail', centre: 'Centro / Filial', role: 'Função',
    nameHint: 'ⓘ Contate seu gerente para atualizar seu nome',
    centreHint: 'ⓘ O centro é atribuído pelo seu administrador',
    emailHint: 'ⓘ O e-mail só pode ser alterado uma vez a cada 30 dias',
    currency: 'Exibição de Moeda', currencySub: 'Escolha o símbolo de moeda usado nas visualizações de Orçamento',
    notifications: 'Notificações', notifSub: 'Escolha sobre o que deseja ser notificado',
    security: 'Segurança', securitySub: 'Gerencie sua senha e configurações de segurança',
    currentPwd: 'Senha Atual', newPwd: 'Nova Senha', confirmPwd: 'Confirmar Nova Senha',
    discard: 'Descartar Alterações', save: 'Salvar Configurações', saved: 'Configurações salvas com sucesso!',
    help: 'Ajuda e Tutorial', helpSub: 'Repita o tour de introdução ou obtenha dicas',
    replayTour: 'Repetir Tour do App', replayTourDesc: 'Percorra o tutorial guiado novamente para redescobrir funcionalidades.',
    replayBtn: 'Iniciar Tour',
    display: 'Preferências de Exibição', displaySub: 'Personalize como o app aparece no seu dispositivo',
    showBottomNav: 'Mostrar barra de navegação inferior',
    showBottomNavDesc: 'Exibir a barra de navegação rápida na parte inferior da tela',
    customiseNavBar: 'Personalizar barra de navegação',
    customiseNavBarDesc: 'Escolha quais itens aparecem na barra de navegação inferior. Marque os que deseja.',
    selectAtLeastOne: 'Selecione pelo menos um item para mostrar na barra inferior.',
    theme: 'Tema do App', themeSub: 'Escolha um tema de cores para personalizar seu app',
    themes: { blue: 'Azul Oceânico', green: 'Verde Floresta', red: 'Vermelho Carmim', purple: 'Roxo Real', gold: 'Dourado Âmbar', pink: 'Rosa' },
    notif: {
      leaveApproval: 'Aprovações de Licença', leaveApprovalDesc: 'Notificar quando o status da sua solicitação mudar',
      newRequest: 'Novas Solicitações de Licença', newRequestDesc: 'Notificar quando o pessoal enviar novas solicitações',
      redFlags: 'Alertas de Bandeira Vermelha', redFlagsDesc: 'Notificar quando novas alertas forem levantadas',
      calendarEvents: 'Eventos do Calendário', calendarEventsDesc: 'Notificar 24 horas antes de eventos programados',
      weeklyReport: 'Resumo Semanal', weeklyReportDesc: 'Receber um resumo semanal toda segunda-feira',
    },
  },
};

const NAV_VIEW_LABELS = {
  en: { dashboard: 'Dashboard', calendar: 'Calendar', students: 'Students', classes: 'My Classes', logtime: 'Log Time', leave: 'Leave History', reimbursement: 'Reimbursement', visits: 'Mulaaqaats', staff: 'Staff Management', pendingleaves: 'Leave Requests', redflags: 'Red Flags', budget: 'Budget', reports: 'Reports', admin: 'Command Centre', superadmin: 'Super Admin Dashboard', settings: 'Settings' },
  ar: { dashboard: 'لوحة القيادة', calendar: 'التقويم', students: 'الطلاب', classes: 'فصولي', logtime: 'تسجيل الوقت', leave: 'سجل الإجازات', reimbursement: 'السداد', visits: 'الزيارات', staff: 'إدارة الموظفين', pendingleaves: 'طلبات الإجازة', redflags: 'التنبيهات', budget: 'الميزانية', reports: 'التقارير', admin: 'مركز القيادة', superadmin: 'لوحة المشرف', settings: 'الإعدادات' },
  ur: { dashboard: 'ڈیش بورڈ', calendar: 'کیلنڈر', students: 'طلبہ', classes: 'میری کلاسیں', logtime: 'وقت ریکارڈ', leave: 'چھٹیوں کی تاریخ', reimbursement: 'معاوضہ', visits: 'ملاقات', staff: 'عملہ مینجمنٹ', pendingleaves: 'چھٹی کی درخواستیں', redflags: 'ریڈ فلیگز', budget: 'بجٹ', reports: 'رپورٹس', admin: 'کمانڈ سینٹر', superadmin: 'سپر ایڈمن', settings: 'ترتیبات' },
  es: { dashboard: 'Tablero', calendar: 'Calendario', students: 'Estudiantes', classes: 'Mis Clases', logtime: 'Registrar Tiempo', leave: 'Historial de Licencias', reimbursement: 'Reembolso', visits: 'Mulaaqaats', staff: 'Gestión de Personal', pendingleaves: 'Solicitudes de Licencia', redflags: 'Alertas Rojas', budget: 'Presupuesto', reports: 'Reportes', admin: 'Centro de Comando', superadmin: 'Super Admin', settings: 'Ajustes' },
  pt: { dashboard: 'Painel', calendar: 'Calendário', students: 'Alunos', classes: 'Minhas Turmas', logtime: 'Registrar Tempo', leave: 'Histórico de Licenças', reimbursement: 'Reembolso', visits: 'Mulaaqaats', staff: 'Gestão de Pessoal', pendingleaves: 'Solicitações de Licença', redflags: 'Alertas Vermelhas', budget: 'Orçamento', reports: 'Relatórios', admin: 'Centro de Comando', superadmin: 'Super Admin', settings: 'Configurações' },
};

const ROLE_NAV_VIEWS = {
  'Super Admin':    ['superadmin', 'dashboard', 'calendar', 'reports', 'settings'],
  'Country Admin':  ['dashboard', 'calendar', 'admin', 'students', 'classes', 'logtime', 'leave', 'reimbursement', 'visits', 'staff', 'pendingleaves', 'redflags', 'budget', 'reports', 'settings'],
  'Centre Manager': ['dashboard', 'calendar', 'students', 'classes', 'logtime', 'leave', 'reimbursement', 'visits', 'staff', 'pendingleaves', 'redflags', 'budget', 'reports', 'settings'],
  'Staff':          ['dashboard', 'calendar', 'students', 'classes', 'logtime', 'leave', 'reimbursement', 'visits', 'settings'],
};

const DEFAULT_BOTTOM_NAV = {
  'Super Admin':    ['superadmin', 'dashboard', 'calendar', 'reports', 'settings'],
  'Country Admin':  ['dashboard', 'calendar', 'admin', 'logtime', 'settings'],
  'Centre Manager': ['dashboard', 'calendar', 'staff', 'logtime', 'settings'],
  'Staff':          ['dashboard', 'calendar', 'logtime', 'classes', 'settings'],
};

const CURRENCIES = [
  { symbol: '$', label: 'US Dollar ($)' },
  { symbol: 'R', label: 'South African Rand (R)' },
  { symbol: 'Bs', label: 'Venezuelan Bolívar (Bs)' },
  { symbol: 'ARS$', label: 'Argentine Peso (ARS$)' },
  { symbol: 'BRL', label: 'Brazilian Real (BRL)' },
];

const COLOR_THEMES = [
  { key: 'blue',   sidebar: '#2c3e50', accent: '#3498db' },
  { key: 'green',  sidebar: '#1e3a2f', accent: '#27ae60' },
  { key: 'red',    sidebar: '#7b1e1e', accent: '#c0392b' },
  { key: 'purple', sidebar: '#2d1b65', accent: '#8e44ad' },
  { key: 'gold',   sidebar: '#3d2800', accent: '#d4860a' },
  { key: 'pink',   sidebar: '#6b1a3a', accent: '#e91e8c' },
];

function AccordionSection({ id, open, onToggle, icon, title, subtitle, children }) {
  return (
    <div style={{
      border: '1px solid var(--border-color)',
      borderRadius: 12,
      overflow: 'hidden',
      background: 'var(--card-bg)',
      transition: 'box-shadow 0.2s',
      boxShadow: open ? '0 2px 12px rgba(0,0,0,0.07)' : 'none',
    }}>
      <button
        onClick={() => onToggle(id)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 18px', background: 'none', border: 'none',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <span style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 36, height: 36, borderRadius: 8,
          background: open ? 'var(--accent-color)' : 'var(--hover-bg)',
          flexShrink: 0, transition: 'background 0.2s',
        }}>
          {icon && <icon.type {...icon.props} size={18} color={open ? '#fff' : 'var(--accent-color)'} />}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: 1.3 }}>{title}</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--subtle-text-color)', marginTop: 2, lineHeight: 1.4 }}>{subtitle}</div>
        </div>
        <ChevronDown
          size={18}
          color="var(--text-secondary)"
          style={{ flexShrink: 0, transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <div style={{ padding: '0 18px 18px 18px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ paddingTop: 16 }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Settings({ user, language, checkVisibility, onReplayTour }) {
  const t = T[language] || T.en;
  const isTeacher = !['Centre Manager', 'Country Admin', 'Super Admin'].includes(user?.role);
  const isSuperAdmin = user?.role === 'Super Admin';

  const emailLastChanged = (() => {
    try { return localStorage.getItem('haazimi_email_changed') || null; } catch { return null; }
  })();
  const canChangeEmail = !isTeacher && (() => {
    if (!emailLastChanged) return true;
    const diff = (Date.now() - new Date(emailLastChanged).getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 30;
  })();

  const [openSection, setOpenSection] = useState('profile');

  const handleToggle = (id) => {
    setOpenSection(prev => (prev === id ? null : id));
  };

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('haazimi_notifications') || 'null');
      if (saved) return saved;
    } catch {}
    return { leaveApproval: true, newRequest: true, redFlags: true, calendarEvents: false, weeklyReport: true };
  });
  const [currency, setCurrency] = useState(() => localStorage.getItem('haazimi_currency') || '$');
  const [showBottomNav, setShowBottomNav] = useState(() => localStorage.getItem('haazimi_show_bottom_nav') !== 'false');
  const [customBottomNavKeys, setCustomBottomNavKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('haazimi_bottom_nav_items');
      return saved ? JSON.parse(saved) : (DEFAULT_BOTTOM_NAV[user?.role] || DEFAULT_BOTTOM_NAV['Staff']);
    } catch { return DEFAULT_BOTTOM_NAV[user?.role] || DEFAULT_BOTTOM_NAV['Staff']; }
  });
  const allRoleViews = ROLE_NAV_VIEWS[user?.role] || ROLE_NAV_VIEWS['Staff'];
  const availableViews = checkVisibility
    ? allRoleViews.filter(k => checkVisibility(k))
    : allRoleViews;
  const customizableViews = availableViews.filter(k => k !== 'dashboard' && k !== 'settings');
  const toggleBottomNavKey = (key) => {
    setCustomBottomNavKeys(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };
  const [colorScheme, setColorScheme] = useState(() => localStorage.getItem('haazimi_color_scheme') || 'blue');
  const [saved, setSaved] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdOk, setPwdOk] = useState(false);

  const handleColorSchemeChange = (key) => {
    setColorScheme(key);
  };

  const toggle = (key) => setNotifications(n => ({ ...n, [key]: !n[key] }));

  const validateNewPassword = (pwd) => {
    if (pwd.length < 8) return 'Password must be at least 8 characters.';
    if (!/[a-zA-Z]/.test(pwd)) return 'Password must contain letters.';
    if (!/[0-9]/.test(pwd)) return 'Password must contain numbers.';
    return '';
  };

  const handleSave = () => {
    if (newPwd || currentPwd || confirmPwd) {
      const validationErr = validateNewPassword(newPwd);
      if (validationErr) { setPwdError(validationErr); return; }
      if (newPwd !== confirmPwd) { setPwdError('New passwords do not match.'); return; }
      try {
        const accounts = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
        const idx = accounts.findIndex(u => u.email === user?.email);
        if (idx !== -1) {
          if (accounts[idx].password && accounts[idx].password !== currentPwd) { setPwdError('Current password is incorrect.'); return; }
          accounts[idx].password = newPwd;
          localStorage.setItem('haazimi_accounts', JSON.stringify(accounts));
        }
      } catch {}
      setPwdError('');
      setPwdOk(true);
      setCurrentPwd(''); setNewPwd(''); setConfirmPwd('');
      setTimeout(() => setPwdOk(false), 3000);
    }
    if (!isTeacher) {
      localStorage.setItem('haazimi_currency', currency);
    }
    localStorage.setItem('haazimi_notifications', JSON.stringify(notifications));
    localStorage.setItem('haazimi_show_bottom_nav', showBottomNav ? 'true' : 'false');
    localStorage.setItem('haazimi_bottom_nav_items', JSON.stringify(customBottomNavKeys));
    localStorage.setItem('haazimi_color_scheme', colorScheme);
    window.dispatchEvent(new CustomEvent('haazimi-settings-changed', { detail: { showBottomNav, bottomNavItems: customBottomNavKeys } }));
    window.dispatchEvent(new CustomEvent('haazimi-color-scheme-changed', { detail: { scheme: colorScheme } }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const notifItems = [
    { key: 'leaveApproval', label: t.notif.leaveApproval, desc: t.notif.leaveApprovalDesc },
    { key: 'newRequest', label: t.notif.newRequest, desc: t.notif.newRequestDesc },
    { key: 'redFlags', label: t.notif.redFlags, desc: t.notif.redFlagsDesc },
    { key: 'calendarEvents', label: t.notif.calendarEvents, desc: t.notif.calendarEventsDesc },
    { key: 'weeklyReport', label: t.notif.weeklyReport, desc: t.notif.weeklyReportDesc },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
      </div>

      <div className="form-container" style={{ maxWidth: 700, flex: 1 }}>
        {saved && <div className="forgot-password-success" style={{ marginBottom: 16 }}>{t.saved}</div>}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

          {/* 1. Profile */}
          <AccordionSection
            id="profile"
            open={openSection === 'profile'}
            onToggle={handleToggle}
            icon={<User size={18} color="var(--accent-color)" />}
            title={t.profile}
            subtitle={t.profileSub}
          >
            <div className="generic-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>{t.fullName}</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    readOnly={isTeacher}
                    style={isTeacher ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                  />
                  {isTeacher && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--subtle-text-color)', marginTop: 4, display: 'block' }}>
                      {t.nameHint}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>{t.email}</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    readOnly={isTeacher || !canChangeEmail}
                    style={(isTeacher || !canChangeEmail) ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
                  />
                  {(isTeacher || !canChangeEmail) && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--subtle-text-color)', marginTop: 4, display: 'block' }}>
                      {t.emailHint}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label>{t.centre}</label>
                  <input
                    type="text"
                    defaultValue={user.centre || user.center}
                    readOnly
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                  <span style={{ fontSize: '0.78rem', color: 'var(--subtle-text-color)', marginTop: 4, display: 'block' }}>
                    {t.centreHint}
                  </span>
                </div>
                <div className="form-group">
                  <label>{t.role}</label>
                  <input type="text" defaultValue={user.role} disabled style={{ opacity: 0.7 }} />
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* 2. Security */}
          <AccordionSection
            id="security"
            open={openSection === 'security'}
            onToggle={handleToggle}
            icon={<Shield size={18} color="var(--accent-color)" />}
            title={t.security}
            subtitle={t.securitySub}
          >
            {pwdError && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: '0.85rem', marginBottom: 12 }}>
                {pwdError}
              </div>
            )}
            {pwdOk && <div className="forgot-password-success" style={{ marginBottom: 12 }}>Password updated successfully!</div>}
            <div className="generic-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>{t.currentPwd}</label>
                  <input type="password" placeholder="••••••••" value={currentPwd} onChange={e => { setCurrentPwd(e.target.value); setPwdError(''); }} />
                </div>
                <div className="form-group">
                  <label>{t.newPwd}</label>
                  <input type="password" placeholder="••••••••" value={newPwd} onChange={e => { setNewPwd(e.target.value); setPwdError(''); }} />
                </div>
                <div className="form-group full-width">
                  <label>{t.confirmPwd}</label>
                  <input type="password" placeholder="••••••••" value={confirmPwd} onChange={e => { setConfirmPwd(e.target.value); setPwdError(''); }} />
                  {newPwd && <span style={{ fontSize: '0.78rem', color: 'var(--subtle-text-color)', marginTop: 4, display: 'block' }}>Min 8 characters · Must contain letters and numbers</span>}
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* 3. Notifications — hidden from Super Admin */}
          {!isSuperAdmin && (
            <AccordionSection
              id="notifications"
              open={openSection === 'notifications'}
              onToggle={handleToggle}
              icon={<Bell size={18} color="var(--accent-color)" />}
              title={t.notifications}
              subtitle={t.notifSub}
            >
              <div className="checkbox-grid">
                {notifItems.map(item => (
                  <label key={item.key} className="custom-checkbox-label">
                    <input type="checkbox" checked={notifications[item.key]} onChange={() => toggle(item.key)} />
                    <span className={`checkbox-icon ${notifications[item.key] ? 'checked' : ''}`} />
                    <div>
                      <strong style={{ display: 'block', fontSize: '0.9rem' }}>{item.label}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--subtle-text-color)' }}>{item.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </AccordionSection>
          )}

          {/* 4. Display Preferences */}
          <AccordionSection
            id="display"
            open={openSection === 'display'}
            onToggle={handleToggle}
            icon={<LayoutIcon size={18} color="var(--accent-color)" />}
            title={t.display}
            subtitle={t.displaySub}
          >
            <div className="checkbox-grid">
              <label className="custom-checkbox-label">
                <input type="checkbox" checked={showBottomNav} onChange={() => setShowBottomNav(v => !v)} />
                <span className={`checkbox-icon ${showBottomNav ? 'checked' : ''}`} />
                <div>
                  <strong style={{ display: 'block', fontSize: '0.9rem' }}>{t.showBottomNav}</strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--subtle-text-color)' }}>{t.showBottomNavDesc}</span>
                </div>
              </label>
            </div>
          </AccordionSection>

          {/* 5. App Theme */}
          <AccordionSection
            id="theme"
            open={openSection === 'theme'}
            onToggle={handleToggle}
            icon={<Palette size={18} color="var(--accent-color)" />}
            title={t.theme}
            subtitle={t.themeSub}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {COLOR_THEMES.map(th => {
                const selected = colorScheme === th.key;
                return (
                  <button
                    key={th.key}
                    onClick={() => handleColorSchemeChange(th.key)}
                    title={t.themes[th.key]}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                      padding: '12px 8px', border: `2px solid ${selected ? th.accent : 'var(--border-color)'}`,
                      borderRadius: 12, cursor: 'pointer', background: selected ? `${th.accent}18` : 'transparent',
                      transition: 'all 0.18s', width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 4 }}>
                      <div style={{ width: 22, height: 38, borderRadius: '6px 0 0 6px', background: th.sidebar }} />
                      <div style={{ width: 38, height: 38, borderRadius: '0 6px 6px 0', background: th.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {selected && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} />}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: selected ? 700 : 400, color: selected ? th.accent : 'var(--subtle-text-color)', textAlign: 'center', lineHeight: 1.2 }}>
                      {t.themes[th.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </AccordionSection>

          {/* 6. Customise Navigation Bar — only when bottom nav is enabled */}
          {showBottomNav && (
            <AccordionSection
              id="navbar"
              open={openSection === 'navbar'}
              onToggle={handleToggle}
              icon={<Navigation size={18} color="var(--accent-color)" />}
              title={t.customiseNavBar}
              subtitle={t.customiseNavBarDesc}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 8 }}>
                {customizableViews.map(key => (
                  <label key={key} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                    border: `1px solid ${customBottomNavKeys.includes(key) ? 'var(--accent-color)' : 'var(--border-color)'}`,
                    borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
                    background: customBottomNavKeys.includes(key) ? 'var(--hover-bg)' : 'transparent',
                  }}>
                    <input
                      type="checkbox"
                      checked={customBottomNavKeys.includes(key)}
                      onChange={() => toggleBottomNavKey(key)}
                      style={{ accentColor: 'var(--accent-color)', width: 15, height: 15, flexShrink: 0 }}
                    />
                    <span style={{ fontSize: '0.88rem', fontWeight: customBottomNavKeys.includes(key) ? 600 : 400, color: customBottomNavKeys.includes(key) ? 'var(--accent-color)' : 'var(--text-dark)' }}>
                      {(NAV_VIEW_LABELS[language] || NAV_VIEW_LABELS.en)[key] || key}
                    </span>
                  </label>
                ))}
              </div>
              {customBottomNavKeys.length === 0 && (
                <p style={{ fontSize: '0.82rem', color: 'var(--danger-color)', marginTop: 10 }}>{t.selectAtLeastOne}</p>
              )}
            </AccordionSection>
          )}

          {/* 6. Currency Display — hidden from Teachers and Super Admin */}
          {!isTeacher && !isSuperAdmin && (
            <AccordionSection
              id="currency"
              open={openSection === 'currency'}
              onToggle={handleToggle}
              icon={<DollarSign size={18} color="var(--accent-color)" />}
              title={t.currency}
              subtitle={t.currencySub}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {CURRENCIES.map(c => (
                  <label
                    key={c.symbol}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 16px',
                      border: `1px solid ${currency === c.symbol ? 'var(--accent-color)' : 'var(--border-color)'}`,
                      borderRadius: 8, cursor: 'pointer',
                      backgroundColor: currency === c.symbol ? 'var(--hover-bg)' : 'transparent',
                      transition: 'all 0.2s', fontSize: '0.9rem',
                    }}
                  >
                    <input
                      type="radio" name="currency" value={c.symbol}
                      checked={currency === c.symbol}
                      onChange={() => setCurrency(c.symbol)}
                      style={{ accentColor: 'var(--accent-color)' }}
                    />
                    <span style={{ fontWeight: currency === c.symbol ? 600 : 400, color: currency === c.symbol ? 'var(--accent-color)' : 'var(--text-dark)' }}>
                      {c.label}
                    </span>
                  </label>
                ))}
              </div>
            </AccordionSection>
          )}

          <AccordionSection
            id="help"
            open={openSection === 'help'}
            onToggle={handleToggle}
            icon={<HelpCircle />}
            title={t.help}
            subtitle={t.helpSub}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: 4 }}>{t.replayTour}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--subtle-text-color)', lineHeight: 1.5 }}>{t.replayTourDesc}</div>
              </div>
              <button
                onClick={onReplayTour}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 7,
                  padding: '9px 18px', borderRadius: 10,
                  background: 'var(--accent-color)', color: 'white',
                  border: 'none', cursor: 'pointer', fontWeight: 600,
                  fontSize: '0.88rem', flexShrink: 0, whiteSpace: 'nowrap',
                }}
              >
                <PlayCircle size={16} /> {t.replayBtn}
              </button>
            </div>
          </AccordionSection>

        </div>

        {/* Sticky action bar */}
                <div style={{
                  position: 'sticky', 
                  bottom: -40, 
                  zIndex: 10,
                  marginTop: 20, 
                  marginLeft: -1, 
                  marginRight: -1,
                  padding: '14px 18px',
                  background: 'transparent', 
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)', // Support for Safari
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex', 
                  gap: 12, 
                  justifyContent: 'flex-end',
                }}>
                  <button className="button-secondary">{t.discard}</button>
                  <button className="button-primary" onClick={handleSave}>{t.save}</button>
                </div>
              </div>
            </div>
          );
        }