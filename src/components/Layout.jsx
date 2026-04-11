import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Calendar, Users, BookOpen, BarChart2, Clock,
  FileText, CheckSquare, AlertTriangle, MapPin, DollarSign, Settings,
  Sun, Moon, Globe, Menu, X, ChevronRight, LogOut, Shield, Wifi, WifiOff, Receipt, Bell, GraduationCap
} from 'lucide-react';

const NAV_LABELS = {
  en: {
    dashboard: 'Dashboard', calendar: 'Calendar', staff: 'Staff Management',
    pendingleaves: 'Leave Requests', redflags: 'Red Flags', visits: 'People to Visit',
    budget: 'Budget', reports: 'Reports', classes: 'My Classes', logtime: 'Log Time',
    leave: 'Leave History', settings: 'Settings', admin: 'Command Centre',
    main: 'Main', management: 'Management', personal: 'Personal',
    myWork: 'My Work', account: 'Account', adminSection: 'Admin',
    reimbursement: 'Reimbursement', students: 'Students',
    signOut: 'Sign Out', notifications: 'Notifications',
    noNotifications: 'No new notifications',
    online: 'Online', synced: 'Synced', offline: 'Offline — data saved locally',
  },
  ar: {
    dashboard: 'لوحة القيادة', calendar: 'التقويم', staff: 'إدارة الموظفين',
    pendingleaves: 'طلبات الإجازة', redflags: 'التنبيهات', visits: 'الزيارات',
    budget: 'الميزانية', reports: 'التقارير', classes: 'فصولي', logtime: 'تسجيل الوقت',
    leave: 'سجل الإجازات', settings: 'الإعدادات', admin: 'مركز القيادة',
    main: 'رئيسي', management: 'الإدارة', personal: 'شخصي',
    myWork: 'عملي', account: 'الحساب', adminSection: 'مسؤول',
    reimbursement: 'التعويض', students: 'الطلاب',
    signOut: 'تسجيل الخروج', notifications: 'الإشعارات',
    noNotifications: 'لا توجد إشعارات جديدة',
    online: 'متصل', synced: 'تمت المزامنة', offline: 'غير متصل — البيانات محفوظة محلياً',
  },
  ur: {
    dashboard: 'ڈیش بورڈ', calendar: 'کیلنڈر', staff: 'عملہ انتظام',
    pendingleaves: 'چھٹی کی درخواستیں', redflags: 'ریڈ فلیگز', visits: 'ملاقاتیں',
    budget: 'بجٹ', reports: 'رپورٹس', classes: 'میری کلاسیں', logtime: 'وقت ریکارڈ',
    leave: 'چھٹیوں کی تاریخ', settings: 'ترتیبات', admin: 'کمانڈ سینٹر',
    main: 'مرکزی', management: 'انتظامیہ', personal: 'ذاتی',
    myWork: 'میرا کام', account: 'اکاؤنٹ', adminSection: 'ایڈمن',
    reimbursement: 'معاوضہ', students: 'طلبہ',
    signOut: 'سائن آؤٹ', notifications: 'اطلاعات',
    noNotifications: 'کوئی نئی اطلاع نہیں',
    online: 'آن لائن', synced: 'ہم آہنگ', offline: 'آف لائن — ڈیٹا مقامی طور پر محفوظ',
  },
  es: {
    dashboard: 'Panel', calendar: 'Calendario', staff: 'Personal',
    pendingleaves: 'Solicitudes de Licencia', redflags: 'Alertas', visits: 'Visitas',
    budget: 'Presupuesto', reports: 'Informes', classes: 'Mis Clases', logtime: 'Registrar Tiempo',
    leave: 'Historial de Licencias', settings: 'Ajustes', admin: 'Centro de Comando',
    main: 'Principal', management: 'Gestión', personal: 'Personal',
    myWork: 'Mi Trabajo', account: 'Cuenta', adminSection: 'Admin',
    reimbursement: 'Reembolso', students: 'Estudiantes',
    signOut: 'Cerrar Sesión', notifications: 'Notificaciones',
    noNotifications: 'No hay notificaciones nuevas',
    online: 'En línea', synced: 'Sincronizado', offline: 'Sin conexión — datos guardados localmente',
  },
  pt: {
    dashboard: 'Painel', calendar: 'Calendário', staff: 'Funcionários',
    pendingleaves: 'Solicitações de Licença', redflags: 'Alertas', visits: 'Visitas',
    budget: 'Orçamento', reports: 'Relatórios', classes: 'Minhas Turmas', logtime: 'Registrar Tempo',
    leave: 'Histórico de Licenças', settings: 'Configurações', admin: 'Centro de Comando',
    main: 'Principal', management: 'Gestão', personal: 'Pessoal',
    myWork: 'Meu Trabalho', account: 'Conta', adminSection: 'Admin',
    reimbursement: 'Reembolso', students: 'Estudantes',
    signOut: 'Sair', notifications: 'Notificações',
    noNotifications: 'Nenhuma notificação nova',
    online: 'Online', synced: 'Sincronizado', offline: 'Sem conexão — dados salvos localmente',
  },
};

const buildSections = (role, lbl, hasReimbNotify) => {
  const adminBadge = hasReimbNotify;

  const managerSections = [
    { key: 'main', label: lbl.main, links: [
      { view: 'dashboard', icon: LayoutDashboard, label: lbl.dashboard },
      { view: 'calendar', icon: Calendar, label: lbl.calendar },
    ]},
    { key: 'management', label: lbl.management, badge: adminBadge, links: [
      { view: 'staff', icon: Users, label: lbl.staff },
      { view: 'pendingleaves', icon: FileText, label: lbl.pendingleaves },
      { view: 'redflags', icon: AlertTriangle, label: lbl.redflags },
      { view: 'visits', icon: MapPin, label: lbl.visits },
      { view: 'budget', icon: DollarSign, label: lbl.budget },
      { view: 'reports', icon: BarChart2, label: lbl.reports },
    ]},
    { key: 'personal', label: lbl.personal, links: [
      { view: 'students', icon: GraduationCap, label: lbl.students },
      { view: 'classes', icon: BookOpen, label: lbl.classes },
      { view: 'logtime', icon: Clock, label: lbl.logtime },
      { view: 'leave', icon: CheckSquare, label: lbl.leave },
      { view: 'reimbursement', icon: Receipt, label: lbl.reimbursement },
      { view: 'settings', icon: Settings, label: lbl.settings },
    ]},
  ];

  if (role === 'Super Admin') {
    return [
      { key: 'superadmin', label: 'Super Admin', links: [
        { view: 'superadmin', icon: Shield, label: 'Super Admin Dashboard' },
        { view: 'dashboard', icon: LayoutDashboard, label: lbl.dashboard },
        { view: 'calendar', icon: Calendar, label: lbl.calendar },
        { view: 'reports', icon: BarChart2, label: lbl.reports },
      ]},
      { key: 'account', label: lbl.account, links: [
        { view: 'settings', icon: Settings, label: lbl.settings },
      ]},
    ];
  }

  if (role === 'Country Admin') {
    return [
      { key: 'admin', label: lbl.adminSection, links: [
        { view: 'admin', icon: Shield, label: lbl.admin, badge: adminBadge },
        { view: 'dashboard', icon: LayoutDashboard, label: lbl.dashboard },
      ]},
      { key: 'management', label: lbl.management, links: [
        { view: 'staff', icon: Users, label: lbl.staff },
        { view: 'pendingleaves', icon: FileText, label: lbl.pendingleaves },
        { view: 'redflags', icon: AlertTriangle, label: lbl.redflags },
        { view: 'visits', icon: MapPin, label: lbl.visits },
        { view: 'budget', icon: DollarSign, label: lbl.budget },
        { view: 'reports', icon: BarChart2, label: lbl.reports },
      ]},
      { key: 'personal', label: lbl.personal, links: [
        { view: 'students', icon: GraduationCap, label: lbl.students },
        { view: 'classes', icon: BookOpen, label: lbl.classes },
        { view: 'logtime', icon: Clock, label: lbl.logtime },
        { view: 'leave', icon: CheckSquare, label: lbl.leave },
        { view: 'reimbursement', icon: Receipt, label: lbl.reimbursement },
        { view: 'settings', icon: Settings, label: lbl.settings },
      ]},
    ];
  }

  if (role === 'Centre Manager') {
    return managerSections;
  }

  return [
    { key: 'main', label: lbl.main, links: [
      { view: 'dashboard', icon: LayoutDashboard, label: lbl.dashboard },
      { view: 'calendar', icon: Calendar, label: lbl.calendar },
    ]},
    { key: 'myWork', label: lbl.myWork, links: [
      { view: 'students', icon: GraduationCap, label: lbl.students },
      { view: 'classes', icon: BookOpen, label: lbl.classes },
      { view: 'logtime', icon: Clock, label: lbl.logtime },
      { view: 'leave', icon: CheckSquare, label: lbl.leave },
      { view: 'reimbursement', icon: Receipt, label: lbl.reimbursement },
      { view: 'visits', icon: MapPin, label: lbl.visits },
    ]},
    { key: 'account', label: lbl.account, links: [
      { view: 'settings', icon: Settings, label: lbl.settings },
    ]},
  ];
};

function NavSection({ section, currentView, onNavigate, checkVisibility }) {
  const [open, setOpen] = useState(true);

  // Filter individual links based on cloud visibility
  const visibleLinks = section.links.filter(link => checkVisibility(link.view));

  // If no links are visible in this section, don't show the section header at all
  if (visibleLinks.length === 0) return null;

  return (
    <div className={`nav-section ${open ? 'open' : ''}`}>
      <button className="nav-section-header" onClick={() => setOpen(o => !o)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {section.label}
          {section.badge && (
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />
          )}
        </span>
        <ChevronRight size={14} className="nav-section-chevron" />
      </button>
      <div className="nav-section-links">
        {visibleLinks.map(link => (
          <a
            key={link.view}
            className={currentView === link.view ? 'active' : ''}
            onClick={() => onNavigate(link.view)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <link.icon size={18} />
              {link.label}
            </span>
            {link.badge && (
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, borderRadius: 9, background: '#ef4444', color: '#fff', fontSize: '0.68rem', fontWeight: 700, padding: '0 5px' }}>
                !
              </span>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

const ALL_BOTTOM_NAV_ICONS = {
  dashboard: LayoutDashboard, calendar: Calendar, logtime: Clock, classes: BookOpen,
  settings: Settings, students: GraduationCap, leave: CheckSquare, reimbursement: Receipt,
  visits: MapPin, staff: Users, pendingleaves: FileText, redflags: AlertTriangle,
  budget: DollarSign, reports: BarChart2, admin: Shield, superadmin: Shield,
};

const DEFAULT_BOTTOM_NAV_KEYS = {
  'Super Admin':     ['superadmin', 'dashboard', 'calendar', 'reports', 'settings'],
  'Country Admin':   ['dashboard', 'calendar', 'admin', 'logtime', 'settings'],
  'Centre Manager':  ['dashboard', 'calendar', 'staff', 'logtime', 'settings'],
  'Staff':           ['dashboard', 'calendar', 'logtime', 'classes', 'settings'],
};

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'عربي' },
  { code: 'ur', label: 'اردو' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
];

export default function Layout({
  user, currentView, onNavigate, onLogout,
  theme, onToggleTheme, language, onChangeLanguage,
  sidebarCollapsed, onToggleSidebar,
  mobileSidebarOpen, onToggleMobileSidebar,
  children,
  checkVisibility // <-- Received from App.jsx
}) {
  const [langOpen, setLangOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSynced, setLastSynced] = useState(() => localStorage.getItem('haazimi_last_synced') || null);
  const [hasReimbNotify, setHasReimbNotify] = useState(() => {
    const isAdminOrManager = ['Centre Manager', 'Country Admin', 'Super Admin'].includes(user?.role);
    return isAdminOrManager && localStorage.getItem('haazimi_reimbursement_notify') === 'true';
  });
  const [showBottomNav, setShowBottomNav] = useState(() => localStorage.getItem('haazimi_show_bottom_nav') !== 'false');
  const [customBottomNavKeys, setCustomBottomNavKeys] = useState(() => {
    try {
      const saved = localStorage.getItem('haazimi_bottom_nav_items');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const lbl = NAV_LABELS[language] || NAV_LABELS.en;
  const sections = buildSections(user.role, lbl, hasReimbNotify);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      const ts = new Date().toLocaleTimeString();
      setLastSynced(ts);
      localStorage.setItem('haazimi_last_synced', ts);
    };
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline); };
  }, []);

  useEffect(() => {
    if (currentView === 'admin' && hasReimbNotify) {
      localStorage.removeItem('haazimi_reimbursement_notify');
      setHasReimbNotify(false);
    }
  }, [currentView, hasReimbNotify]);

  useEffect(() => {
    const handler = () => {
      setShowBottomNav(localStorage.getItem('haazimi_show_bottom_nav') !== 'false');
      try {
        const saved = localStorage.getItem('haazimi_bottom_nav_items');
        setCustomBottomNavKeys(saved ? JSON.parse(saved) : null);
      } catch {}
    };
    window.addEventListener('haazimi-settings-changed', handler);
    return () => window.removeEventListener('haazimi-settings-changed', handler);
  }, []);

  useEffect(() => {
    const handler = () => { setBellOpen(false); setLangOpen(false); };
    if (bellOpen || langOpen) {
      setTimeout(() => document.addEventListener('click', handler), 0);
      return () => document.removeEventListener('click', handler);
    }
  }, [bellOpen, langOpen]);

  const isAdminOrManager = ['Centre Manager', 'Country Admin', 'Super Admin'].includes(user?.role);
  const pendingLocalRegs = (() => {
    try {
      const accounts = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
      return accounts.filter(a => !a.status || a.status === 'Pending');
    } catch { return []; }
  })();
  const pendingReimbs = (() => {
    try {
      const reimbs = JSON.parse(localStorage.getItem('haazimi_reimbursements') || '[]');
      return reimbs.filter(r => r.status === 'pending');
    } catch { return []; }
  })();
  const pendingLeaveCount = (() => {
    if (!isAdminOrManager) return 0;
    try {
      const leaves = JSON.parse(localStorage.getItem('haazimi_leaves') || '[]');
      return leaves.filter(l => String(l.status || '').toLowerCase() === 'pending').length;
    } catch { return 0; }
  })();

  const notifications = [];
  if (isAdminOrManager) {
    if (pendingLeaveCount > 0) notifications.push({ text: `${pendingLeaveCount} pending leave request${pendingLeaveCount > 1 ? 's' : ''}`, view: 'pendingleaves', color: '#f59e0b' });
    if (pendingLocalRegs.length > 0) notifications.push({ text: `${pendingLocalRegs.length} pending registration${pendingLocalRegs.length > 1 ? 's' : ''}`, view: 'admin', color: '#8b5cf6' });
    if (pendingReimbs.length > 0) notifications.push({ text: `${pendingReimbs.length} reimbursement request${pendingReimbs.length > 1 ? 's' : ''}`, view: 'admin', color: '#3b82f6' });
  }
  const notifCount = notifications.length;

  const handleToggle = () => {
    if (isMobile) { onToggleMobileSidebar(); } else { onToggleSidebar(); }
  };

  const isSuperAdmin = user?.role === 'Super Admin';
  const activeBottomNavKeys = customBottomNavKeys || DEFAULT_BOTTOM_NAV_KEYS[user?.role] || DEFAULT_BOTTOM_NAV_KEYS['Staff'];

  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const touchInScrollable = useRef(false);

  const isInsideHScrollable = (el) => {
    while (el && el !== document.body) {
      const style = window.getComputedStyle(el);
      const ox = style.overflowX;
      if ((ox === 'scroll' || ox === 'auto') && el.scrollWidth > el.clientWidth) return true;
      el = el.parentElement;
    }
    return false;
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchInScrollable.current = isInsideHScrollable(e.target);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    const inScrollable = touchInScrollable.current;
    touchStartX.current = null;
    touchStartY.current = null;
    touchInScrollable.current = false;
    if (inScrollable) return;
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const currentIndex = bottomNavItems.findIndex(item => item.view === currentView);
    if (dx < 0) {
      const next = bottomNavItems[currentIndex + 1];
      if (next) onNavigate(next.view);
    } else {
      const prev = bottomNavItems[currentIndex - 1];
      if (prev) onNavigate(prev.view);
    }
  };

  const middleKeys = activeBottomNavKeys.filter(k => k !== 'dashboard' && k !== 'settings');
  const orderedNavKeys = ['dashboard', ...middleKeys, 'settings'];

  const bottomNavItems = orderedNavKeys
    .filter(k => ALL_BOTTOM_NAV_ICONS[k] && checkVisibility(k))
    .map(k => ({
      view: k,
      icon: ALL_BOTTOM_NAV_ICONS[k],
      label: lbl[k] || k,
    }));

  return (
    <div className={`app-container ${showBottomNav ? 'has-bottom-nav' : ''} ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
      <div className="main-view-overlay" onClick={onToggleMobileSidebar} />

      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>Madrassa Haazimi</h1>
        </div>
        <nav className="sidebar-nav">
          {sections.map(section => (
            <NavSection
              key={section.key}
              section={section}
              currentView={currentView}
              onNavigate={onNavigate}
              checkVisibility={checkVisibility} // Pass visibility check to section
            />
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
            {isOnline
              ? <><Wifi size={12} style={{ color: '#22c55e' }} /><span style={{ color: '#22c55e' }}>{lbl.online}{lastSynced ? ` · ${lbl.synced} ${lastSynced}` : ''}</span></>
              : <><WifiOff size={12} style={{ color: '#f59e0b' }} /><span style={{ color: '#f59e0b' }}>{lbl.offline}</span></>
            }
          </div>
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <LogOut size={16} /> {lbl.signOut}
          </button>
        </div>
      </aside>

      <div className="main-view" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        <header className="app-header">
          <button className="sidebar-toggle" onClick={handleToggle}>
            {mobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="user-info">
            <div className="user-profile">
              <div className="user-name">{user.name}</div>
              <div className="user-center">{user.centre || user.center} · {user.role}</div>
            </div>
          </div>
          <div className="header-actions">
            <div style={{ position: 'relative' }}>
              <button
                className="theme-toggle"
                onClick={(e) => { e.stopPropagation(); setBellOpen(o => !o); setLangOpen(false); }}
                style={{ position: 'relative' }}
                title="Notifications"
              >
                <Bell size={22} />
                {notifCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 2, right: 2, width: 16, height: 16,
                    borderRadius: '50%', background: '#ef4444', color: '#fff',
                    fontSize: '0.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '2px solid var(--main-bg)',
                  }}>{notifCount}</span>
                )}
              </button>
              {bellOpen && (
                <div onClick={e => e.stopPropagation()} style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 200,
                  background: 'var(--card-bg)', border: '1px solid var(--border-color)',
                  borderRadius: 10, minWidth: 240, boxShadow: '0 8px 24px var(--shadow-color)',
                  overflow: 'hidden',
                }}>
                  <div style={{ padding: '10px 14px', fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {lbl.notifications}
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '16px 14px', color: 'var(--text-secondary)', fontSize: '0.88rem', textAlign: 'center' }}>
                      {lbl.noNotifications}
                    </div>
                  ) : notifications.map((n, i) => (
                    <button key={i} onClick={() => { onNavigate(n.view); setBellOpen(false); }}
                      style={{ width: '100%', textAlign: 'left', padding: '11px 14px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: n.color, flexShrink: 0 }} />
                      {n.text}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="language-switcher">
              <button className="language-switcher-button" onClick={(e) => { e.stopPropagation(); setLangOpen(o => !o); setBellOpen(false); }}>
                <Globe size={22} />
              </button>
              {langOpen && (
                <div className="language-switcher-dropdown" onClick={e => e.stopPropagation()}>
                  {LANGS.map(l => (
                    <button
                      key={l.code}
                      className={language === l.code ? 'active' : ''}
                      onClick={() => { onChangeLanguage(l.code); setLangOpen(false); }}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="theme-toggle" onClick={onToggleTheme}>
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </header>

        <main className="main-content">{children}</main>

        {showBottomNav && (
          <nav className="bottom-nav-bar">
            {bottomNavItems.map(item => (
              <button
                key={item.view}
                className={`bottom-nav-item ${currentView === item.view ? 'active' : ''}`}
                onClick={() => onNavigate(item.view)}
              >
                <item.icon size={22} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </div>
  );
}