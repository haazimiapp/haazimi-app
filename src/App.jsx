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
import { USERS } from './data/mockData';
import { GOOGLE_SCRIPT_URL } from './data/config'; // Importing from the config file we just made

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
};

export default function App() {
  // 2. We now check localStorage first so the user stays logged in after a refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('haazimi_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');
  
  // EDIT HERE: Responsive sidebar - starts collapsed (true) on screens smaller than 1200px
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 1200);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-theme', theme === 'dark' ? 'dark' : '');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('language', language);
  }, [language]);

  // 3. NEW REGISTRATION LOGIC
  const handleRegister = async (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
    
    if (users.find(u => u.email === email)) {
      return { success: false, message: "Email already registered on this device." };
    }

    const newUser = { name, email, password, role: 'Teacher' };
    users.push(newUser);
    localStorage.setItem('haazimi_accounts', JSON.stringify(users));

    try {
      // Using the variable GOOGLE_SCRIPT_URL for consistency
      await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "register",
          name: name,
          email: email,
          role: "Teacher"
        })
      });
    } catch(e) { console.log("Sync error", e); }

    return { success: true };
  };

  // 4. UPDATED LOGIN LOGIC
  const handleLogin = (email, password) => {
    // Check locally registered accounts first
    const localUsers = JSON.parse(localStorage.getItem('haazimi_accounts') || '[]');
    const foundLocal = localUsers.find(u => u.email === email && u.password === password);
    
    // Fallback to your mock USERS list if not found locally
    const found = foundLocal || USERS.find(u => u.email === email && u.password === password);
    
    if (found) {
      // Save session memory so LogTime.jsx knows who this is
      localStorage.setItem('haazimi_user', JSON.stringify({ name: found.name, role: found.role }));
      setUser(found);
      return { success: true };
    }
    return { success: false, message: "Invalid email or password." };
  };

  // 5. UPDATED LOGOUT & DEV LOGIN
  const handleLogout = () => {
    localStorage.removeItem('haazimi_user'); // Clear memory on logout
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleDevLogin = (role) => {
    const found = USERS.find(u => u.role === role) || USERS[0];
    localStorage.setItem('haazimi_user', JSON.stringify({ name: found.name, role: found.role }));
    setUser(found);
  };

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');
  const toggleSidebar = () => setSidebarCollapsed(c => !c);
  const toggleMobileSidebar = () => setMobileSidebarOpen(o => !o);

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
      onNavigate={(view) => { setCurrentView(view); setMobileSidebarOpen(false); }}
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
      <ViewComponent user={user} onNavigate={setCurrentView} language={language} />
    </Layout>
  );
}
