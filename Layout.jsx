import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Calendar, Users, BookOpen, BarChart2, Clock,
  FileText, CheckSquare, AlertTriangle, MapPin, DollarSign, Settings,
  Sun, Moon, Globe, Menu, X, ChevronRight, LogOut
} from 'lucide-react';

const NAV_SECTIONS = {
  manager: [
    {
      label: 'Main',
      links: [
        { view: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { view: 'calendar', icon: Calendar, label: 'Calendar' },
      ],
    },
    {
      label: 'Management',
      links: [
        { view: 'staff', icon: Users, label: 'Staff Management' },
        { view: 'pendingleaves', icon: FileText, label: 'Leave Requests' },
        { view: 'redflags', icon: AlertTriangle, label: 'Red Flags' },
        { view: 'visits', icon: MapPin, label: 'People to Visit' },
        { view: 'budget', icon: DollarSign, label: 'Budget' },
        { view: 'reports', icon: BarChart2, label: 'Reports' },
      ],
    },
    {
      label: 'Personal',
      links: [
        { view: 'classes', icon: BookOpen, label: 'My Classes' },
        { view: 'logtime', icon: Clock, label: 'Log Time' },
        { view: 'leave', icon: CheckSquare, label: 'Request Leave' },
        { view: 'settings', icon: Settings, label: 'Settings' },
      ],
    },
  ],
  dhimmedaar: [
    {
      label: 'Main',
      links: [
        { view: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { view: 'calendar', icon: Calendar, label: 'Calendar' },
      ],
    },
    {
      label: 'My Work',
      links: [
        { view: 'classes', icon: BookOpen, label: 'My Classes' },
        { view: 'logtime', icon: Clock, label: 'Log Time' },
        { view: 'leave', icon: CheckSquare, label: 'Request Leave' },
        { view: 'visits', icon: MapPin, label: 'People to Visit' },
      ],
    },
    {
      label: 'Account',
      links: [
        { view: 'settings', icon: Settings, label: 'Settings' },
      ],
    },
  ],
};

function NavSection({ section, currentView, onNavigate }) {
  const [open, setOpen] = useState(true);
  return (
    <div className={`nav-section ${open ? 'open' : ''}`}>
      <button className="nav-section-header" onClick={() => setOpen(o => !o)}>
        <span>{section.label}</span>
        <ChevronRight size={14} className="nav-section-chevron" />
      </button>
      <div className="nav-section-links">
        {section.links.map(link => (
          <a
            key={link.view}
            className={currentView === link.view ? 'active' : ''}
            onClick={() => onNavigate(link.view)}
            style={{ cursor: 'pointer' }}
          >
            <link.icon size={18} />
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

const BOTTOM_NAV = [
  { view: 'dashboard', icon: LayoutDashboard, label: 'Home' },
  { view: 'calendar', icon: Calendar, label: 'Calendar' },
  { view: 'logtime', icon: Clock, label: 'Log Time' },
  { view: 'classes', icon: BookOpen, label: 'Classes' },
  { view: 'settings', icon: Settings, label: 'Settings' },
];

export default function Layout({
  user, currentView, onNavigate, onLogout,
  theme, onToggleTheme, language, onChangeLanguage,
  sidebarCollapsed, onToggleSidebar,
  mobileSidebarOpen, onToggleMobileSidebar,
  children
}) {
  const [langOpen, setLangOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const sections = NAV_SECTIONS[user.role] || NAV_SECTIONS.dhimmedaar;

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleToggle = () => {
    if (isMobile) {
      onToggleMobileSidebar();
    } else {
      onToggleSidebar();
    }
  };

  const langs = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'عربي' },
    { code: 'ur', label: 'اردو' },
  ];

  return (
    <div className={`app-container has-bottom-nav ${sidebarCollapsed ? 'sidebar-collapsed' : ''} ${mobileSidebarOpen ? 'mobile-sidebar-open' : ''}`}>
      <div className="main-view-overlay" onClick={onToggleMobileSidebar} />

      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>IMS</h1>
        </div>
        <nav className="sidebar-nav">
          {sections.map(section => (
            <NavSection
              key={section.label}
              section={section}
              currentView={currentView}
              onNavigate={onNavigate}
            />
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="main-view">
        <header className="app-header">
          <button className="sidebar-toggle" onClick={handleToggle}>
            {mobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="user-info">
            <div className="user-profile">
              <div className="user-name">{user.name}</div>
              <div className="user-center">{user.center} · {user.role}</div>
            </div>
          </div>

          <div className="header-actions">
            <div className="language-switcher">
              <button className="language-switcher-button" onClick={() => setLangOpen(o => !o)}>
                <Globe size={22} />
              </button>
              {langOpen && (
                <div className="language-switcher-dropdown">
                  {langs.map(l => (
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

        <main className="main-content">
          {children}
        </main>

        <nav className="bottom-nav-bar">
          {BOTTOM_NAV.map(item => (
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
      </div>
    </div>
  );
}
