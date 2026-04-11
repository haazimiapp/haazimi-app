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
import SuperAdminDashboard from './components/SuperAdminDashboard';
import StudentsList from './components/StudentsList';
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
  superadmin: SuperAdminDashboard,
  students: StudentsList,
};

const MANAGER_ONLY_VIEWS = new Set(['pendingleaves', 'staff', 'redflags', 'budget', 'reports', 'admin']);
const SUPER_ADMIN_ONLY_VIEWS = new Set(['superadmin']);
const SUPER_ADMIN_BLOCKED_VIEWS = new Set(['logtime', 'leave', 'classes', 'staff', 'pendingleaves', 'reimbursement', 'admin']);

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
        if (u.role === 'Super Admin') return 'superadmin';
        if (u.role === 'Country Admin') return 'admin';
        if (u.role === 'Centre Manager') return 'dashboard';
      }
    } catch {}
    return 'dashboard';
  });

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  const [colorScheme, setColorScheme] = useState(() => localStorage.getItem('haazimi_color_scheme') || 'blue');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.setAttribute('data-color-scheme', colorScheme === 'blue' ? '' : colorScheme);
    localStorage.setItem('haazimi_color_scheme', colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    const handler = (e) => setColorScheme(e.detail.scheme);
    window.addEventListener('haazimi-color-scheme-changed', handler);
    return () => window.removeEventListener('haazimi-color-scheme-changed', handler);
  }, []);

  useEffect(() => {
    const rtl = language === 'ar' || language === 'ur';
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('language', language);
  }, [language]);

  const _doLogin = async (sessionUser, isDev = false) => {
    const userWithTag = { ...sessionUser, isDev };
    localStorage.setItem('haazimi_user', JSON.stringify(userWithTag));
    setUser(userWithTag);
    setMobileSidebarOpen(false);

    // Set the correct landing view IMMEDIATELY before any async work
    const role = sessionUser.role;
    if (role === 'Super Admin') setCurrentView('superadmin');
    else if (role === 'Country Admin') setCurrentView('admin');
    else if (role === 'Centre Manager') setCurrentView('dashboard');
    else setCurrentView('dashboard');

    // --- FETCH SETTINGS FROM GOOGLE (background) ---
    try {
      const resp = await fetch(`${GOOGLE_SCRIPT_URL}?type=getSettings`);
      const cloudSettings = await resp.json();
      localStorage.setItem('haazimi_global_settings', JSON.stringify(cloudSettings));
    } catch (e) {
      console.error("Cloud settings sync failed", e);
    }

    return { success: true };
  };

  // --- LOGIC TO FILTER MENU ITEMS BASED ON CLOUD SETTINGS ---
  const getFilteredMenuItems = () => {
    const globalSettings = JSON.parse(localStorage.getItem('haazimi_global_settings') || '{}');
    const myCentreSettings = globalSettings[user?.centre || user?.Centre] || {};

    // Define the mapping of view keys to the Feature Keys in your Google Sheet
    const featureMap = {
      logtime: 'leaves',
      leave: 'leaves',
      budget: 'budget',
      calendar: 'calendar',
      reimbursement: 'reimbursement',
      redflags: 'redflags',
      reports: 'reports',
      classes: 'classes',
      visits: 'redflags' // <--- ADD THIS. Maps "People to Visit" to the Red Flags toggle
    };

    // This checks if a view should be hidden based on the Google Sheet row
    const isVisible = (viewKey) => {
      const featureKey = featureMap[viewKey];
      if (!featureKey) return true; // Show by default if not mapped
      return myCentreSettings[featureKey] !== false; // Hide ONLY if explicitly false
    };

    return isVisible;
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
            name: localUser.name, email: localUser.email, role: localUser.role || 'Staff',
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

    const newAccount = {
      name: name.trim(), email: normalizedEmail, password,
      role: 'Staff', country, centre,
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
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'updateUser',
          email: normalizedEmail, name: name.trim(), password,
          role: 'Staff', country, centre, status: 'Pending',
        }),
      });
    } catch {}
    return { success: true };
  };

  const handleDevLogin = (role) => {
    const devUsers = {
      centremanager: { name: 'Dev Centre Manager', email: 'centremanager@dev.local', role: 'Centre Manager', country: 'South Africa', centre: 'Ext. 1 (Lenasia)' },
      staff: { name: 'Dev Staff', email: 'staff@dev.local', role: 'Staff', country: 'South Africa', centre: 'Ext. 13 (Lenasia)' },
      countryadmin: { name: 'Dev Country Admin', email: 'countryadmin@dev.local', role: 'Country Admin', country: 'South Africa', centre: 'Ext. 1 (Lenasia)' },
      superadmin: { name: 'Dev Super Admin', email: 'superadmin@dev.local', role: 'Super Admin', country: '', centre: '' },
    };
    const sessionUser = devUsers[role] || devUsers.staff;
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

  const isManagerOrAdmin = (role) => ['Centre Manager', 'Country Admin', 'Super Admin'].includes(role);
  const isSuperAdmin = (role) => role === 'Super Admin';

  const handleNavigate = (view) => {
    if (SUPER_ADMIN_ONLY_VIEWS.has(view) && !isSuperAdmin(user?.role)) return;
    if (MANAGER_ONLY_VIEWS.has(view) && !isManagerOrAdmin(user?.role)) return;
    if (SUPER_ADMIN_BLOCKED_VIEWS.has(view) && isSuperAdmin(user?.role)) return;

    // Check global settings before allowing navigation
    const checkVisibility = getFilteredMenuItems();
    if (!checkVisibility(view)) {
        alert("This feature has been disabled by your administrator.");
        return;
    }

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

  const checkVisibility = getFilteredMenuItems();
  const resolvedView = SUPER_ADMIN_ONLY_VIEWS.has(currentView) && !isSuperAdmin(user?.role) ? 'dashboard'
    : MANAGER_ONLY_VIEWS.has(currentView) && !isManagerOrAdmin(user?.role) ? 'dashboard'
    : SUPER_ADMIN_BLOCKED_VIEWS.has(currentView) && isSuperAdmin(user?.role) ? 'superadmin'
    : !checkVisibility(currentView) ? 'dashboard' // Fallback to dashboard if feature is disabled
    : currentView;

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
      // Pass the visibility check to Layout so Sidebar can use it
      checkVisibility={checkVisibility} 
    >
      <ViewComponent
        user={user}
        onNavigate={handleNavigate}
        language={language}
        isDev={!!user.isDev}
        checkVisibility={checkVisibility}
      />
    </Layout>
  );
}