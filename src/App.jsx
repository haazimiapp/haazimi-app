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

const MANAGER_ONLY_VIEWS = new Set(['pendingleaves', 'staff', 'redflags', 'budget', 'reports', 'admin']);

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

  const _doLogin = (sessionUser, isDev = false) => {
    const userWithTag = { ...sessionUser, isDev };
    localStorage.setItem('haazimi_user', JSON.stringify(userWithTag));
    setUser(userWithTag);
    setMobileSidebarOpen(false);
    setCurrentView(sessionUser.role === 'Admin' ? 'admin' : 'dashboard');
    return { success: true };
  };

  const handleLogin = async (email, password) => {
    const normalizedEmail = email.toLowerCase().trim();

    let gsheetsUsers = [];
    let gsheetsReachable = false;
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getUsers&t=${Date.now()}`, { mode: 'cors' });
      const data = await res.json();
      gsheetsUsers = Array.isArray(data) ? data : (data.users || []);
      gsheetsReachable = true;
    } catch {}

    if (gsheetsReachable && gsheetsUsers.length > 0) {
      const gsUser = gsheetsUsers.find((u) => (u.Email || '').toLowerCase() === normalizedEmail);
      if (gsUser) {
        if (gsUser.Password !== password) return { success: false, message: 'Incorrect password.' };
        const status = gsUser.Status || 'Pending';
        if (status === 'Pending') return { success: false, message: 'Awaiting admin approval.' };
        if (status === 'Denied') return { success: false, message: 'Registration denied.' };
        if (status === 'Approved') {
          return _doLogin({
            name: gsUser.Name, email: gsUser.Email, role: gsUser.Role,
            country: gsUser.Country, centre: gsUser.Centre,
          }, false);
        }
      }
    }

    try {
      const localAccounts = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
      const localUser = localAccounts.find((u) => (u.email || '').toLowerCase() === normalizedEmail);
      if (localUser) {
        if (localUser.password !== password) return { success: false, message: 'Incorrect password.' };
        if (localUser.status === 'Pending') return { success: false, message: 'Awaiting admin approval.' };
        if (localUser.status === 'Denied') return { success: false, message: 'Registration denied. Contact an admin.' };
        if (localUser.status === 'Approved') {
          return _doLogin({
            name: localUser.name, email: localUser.email, role: localUser.role || 'Teacher',
            country: localUser.country || '', centre: localUser.centre || '',
          }, false);
        }
      }
    } catch {}

    const mockUser = USERS.find((u) => (u.email || '').toLowerCase() === normalizedEmail);
    if (mockUser) {
      if (mockUser.password !== password) return { success: false, message: 'Incorrect password.' };
      return _doLogin({
        name: mockUser.name, email: mockUser.email, role: mockUser.role,
        country: mockUser.center || '', centre: mockUser.center || '',
      }, true);
    }

    return { success: false, message: 'No account found.' };
  };

  const handleRegister = async (name, email, password, country, centre) => {
    const normalizedEmail = email.toLowerCase().trim();

    let gsheetsUsers = [];
    try {
      const res = await fetch(`${GOOGLE_SCRIPT_URL}?type=getUsers&t=${Date.now()}`, { mode: 'cors' });
      const data = await res.json();
      gsheetsUsers = Array.isArray(data) ? data : (data.users || []);
    } catch {}

    const existingGS = gsheetsUsers.find((u) => (u.Email || '').toLowerCase() === normalizedEmail);
    if (existingGS) {
      if (existingGS.Status === 'Approved') return { success: false, message: 'An account with this email already exists. Please sign in.' };
      if (existingGS.Status === 'Pending') return { success: false, message: 'Your registration is already submitted and pending approval.' };
      if (existingGS.Status === 'Denied') return { success: false, message: 'Your registration was previously denied. Please contact an admin.' };
    }

    try {
      const existing = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
      if (existing.find((u) => (u.email || '').toLowerCase() === normalizedEmail)) {
        return { success: false, message: 'An account with this email already exists.' };
      }
    } catch {}

    const newAccount = {
      name: name.trim(), email: normalizedEmail, password,
      role: 'Teacher', country, centre,
      status: 'Pending', registeredAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
      existing.push(newAccount);
      localStorage.setItem('haazimi_accounts', JSON.stringify(existing));
    } catch {}

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'register', ...newAccount }),
      });
    } catch {}
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'updateUser',
          email: normalizedEmail, name: name.trim(), password,
          role: 'Teacher', country, centre, status: 'Pending',
        }),
      });
    } catch {}

    return { success: true };
  };

  const handleDevLogin = (role) => {
    const devUsers = {
      manager: { name: 'Dev Manager', email: 'manager@dev.local', role: 'Manager', country: 'South Africa', centre: 'Ext. 1 (Lenasia)' },
      dhimmedaar: { name: 'Dev Staff', email: 'staff@dev.local', role: 'Teacher', country: 'South Africa', centre: 'Ext. 13 (Lenasia)' },
      admin: { name: 'Dev Admin', email: 'admin@dev.local', role: 'Admin', country: 'South Africa', centre: 'Ext. 1 (Lenasia)' },
    };
    const sessionUser = devUsers[role] || devUsers.dhimmedaar;
    _doLogin(sessionUser, true);
  };

  const handleLogout = () => {
    localStorage.removeItem('haazimi_user');
    setUser(null);
    setMobileSidebarOpen(false);
    setCurrentView('dashboard');
  };

  const toggleTheme = () => setTheme((t) => t === 'light' ? 'dark' : 'light');
  const toggleSidebar = () => setSidebarCollapsed((c) => !c);
  const toggleMobileSidebar = () => setMobileSidebarOpen((o) => !o);

  const isManagerOrAdmin = (role) => ['Admin', 'Manager', 'manager'].includes(role);

  const handleNavigate = (view) => {
    if (MANAGER_ONLY_VIEWS.has(view) && !isManagerOrAdmin(user?.role)) return;
    setCurrentView(view);
    setMobileSidebarOpen(false);
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

  const resolvedView = MANAGER_ONLY_VIEWS.has(currentView) && !isManagerOrAdmin(user?.role) ? 'dashboard' : currentView;
  const ViewComponent = VIEWS[resolvedView] || Dashboard;

  return (
    <Layout
      user={user}
      currentView={resolvedView}
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
      <ViewComponent
        user={user}
        onNavigate={handleNavigate}
        language={language}
        isDev={!!user.isDev}
      />
    </Layout>
  );
}
