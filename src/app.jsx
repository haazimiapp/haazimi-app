import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import StaffManagement from './components/StaffManagement';
import MyClasses from './components/MyClasses';
import Reports from './components/Reports';
import LogTime from './components/LogTime';
import LeaveRequest from './components/LeaveRequest';
import PendingLeaves from './components/PendingLeaves';
import RedFlags from './components/RedFlags';
import PeopleToVisit from './components/PeopleToVisit';
import Budget from './components/Budget';
import Settings from './components/Settings';
import AdminPanel from './components/AdminPanel';
import Reimbursement from './components/Reimbursement';
import { USERS } from './data/mockData';
import { GOOGLE_SCRIPT_URL } from './data/config';

const VIEWS = {
  dashboard: Dashboard,
  calendar: Calendar,
  staff: StaffManagement,
  classes: MyClasses,
  reports: Reports,
  logtime: LogTime,
  leave: LeaveRequest,
  pendingleaves: PendingLeaves,
  redflags: RedFlags,
  visits: PeopleToVisit,
  budget: Budget,
  settings: Settings,
  admin: AdminPanel,
  reimbursement: Reimbursement,
};

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('haazimi_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  const [currentView, setCurrentView] = useState(() => {
    try {
      const saved = localStorage.getItem('haazimi_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === 'Admin') return 'admin';
      }
    } catch {}
    return 'dashboard';
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const rtl = language === 'ar' || language === 'ur';
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('language', language);
  }, [language]);

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getUsers`, { mode: 'cors' });
      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.users || []);
      const found = list.find(
        u => u.Email?.toLowerCase() === email.toLowerCase() &&
             u.Password === password &&
             u.Status === 'Approved'
      );
      if (found) {
        return _doLogin({ name: found.Name, email: found.Email, role: found.Role, country: found.Country, centre: found.Centre });
      }
    } catch {}

    try {
      const localAccounts = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
      const foundLocal = localAccounts.find(
        u => u.email?.toLowerCase() === email.toLowerCase() && u.password === password
      );
      if (foundLocal) {
        return _doLogin({ name: foundLocal.name, email: foundLocal.email, role: foundLocal.role || 'Teacher', country: foundLocal.country || '', centre: foundLocal.centre || '' });
      }
    } catch {}

    const foundMock = USERS.find(
      u => u.email?.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (foundMock) {
      return _doLogin({ name: foundMock.name, email: foundMock.email, role: foundMock.role, country: foundMock.center || '', centre: foundMock.center || '' });
    }

    return { success: false, message: 'Invalid credentials or account not yet approved.' };
  };

  const _doLogin = (sessionUser) => {
    localStorage.setItem('haazimi_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    setMobileSidebarOpen(false); // Auto-close mobile sidebar on login
    setCurrentView(sessionUser.role === 'Admin' ? 'admin' : 'dashboard');
    return { success: true };
  };

  const handleRegister = async (name, email, password, country, centre) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return { success: false, message: 'Please enter a valid email address.' };
    if (password.length < 8) return { success: false, message: 'Password must be at least 8 characters.' };

    try {
      const accounts = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
      if (!accounts.find(u => u.email?.toLowerCase() === email.toLowerCase())) {
        accounts.push({ name, email, password, role: 'Teacher', country, centre, status: 'Pending', timestamp: new Date().toISOString() });
        localStorage.setItem('haazimi_accounts', JSON.stringify(accounts));
      }
    } catch {}

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'register', name, email, password, role: 'Teacher', country, centre, status: 'Pending' }),
      });
    } catch {}

    return { success: true };
  };

  const handleLogout = () => {
    localStorage.removeItem('haazimi_user');
    setUser(null);
    setMobileSidebarOpen(false);
    setCurrentView('dashboard');
  };

  const handleDevLogin = (role) => {
    const devUsers = {
      manager: { name: 'Dev Manager', email: 'manager@dev.local', role: 'Manager', country: 'South Africa', centre: 'Ext. 1 (Lenasia)' },
      dhimmedaar: { name: 'Dev Staff', email: 'staff@dev.local', role: 'Teacher', country: 'South Africa', centre: 'Ext. 13 (Lenasia)' },
      admin: { name: 'Dev Admin', email: 'admin@dev.local', role: 'Admin', country: 'South Africa', centre: 'Ext. 1 (Lenasia)' },
    };
    const sessionUser = devUsers[role] || devUsers.dhimmedaar;
    localStorage.setItem('haazimi_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
    setMobileSidebarOpen(false); // Auto-close mobile sidebar on login
    setCurrentView(role === 'admin' ? 'admin' : 'dashboard');
  };

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const toggleSidebar = () => setSidebarCollapsed(c => !c);
  const toggleMobileSidebar = () => setMobileSidebarOpen(o => !o);

  const handleNavigate = (view) => {
    setCurrentView(view);
    setMobileSidebarOpen(false); // Auto-close mobile sidebar on navigation
  };

  if (!user) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDevLogin={handleDevLogin}
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onChangeLanguage={setLanguage}
      />
    );
  }

  const ViewComponent = VIEWS[currentView] || Dashboard;

  return (
    <Layout
      user={user}
      currentView={currentView}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      theme={theme}
      onToggleTheme={toggleTheme}
      language={language}
      onChangeLanguage={setLanguage}
      sidebarCollapsed={sidebarCollapsed}
      onToggleSidebar={toggleSidebar}
      mobileSidebarOpen={mobileSidebarOpen}
      onToggleMobileSidebar={toggleMobileSidebar}
    >
      <ViewComponent user={user} onNavigate={handleNavigate} language={language} />
    </Layout>
  );
}
