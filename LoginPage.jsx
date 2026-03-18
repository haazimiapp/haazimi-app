import { useState } from 'react';
import { Eye, EyeOff, Sun, Moon, Globe } from 'lucide-react';

export default function LoginPage({ onLogin, onDevLogin, theme, onToggleTheme, language, onChangeLanguage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const langs = [
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'عربي' },
    { code: 'ur', label: 'اردو' },
  ];

  const t = {
    en: { title: 'IMS', welcome: 'Welcome Back', sub: 'Sign in to your account', email: 'Email Address', password: 'Password', forgot: 'Forgot password?', signin: 'Sign In', dev: 'Developer Quick Login', manager: 'Login as Manager', staff: 'Login as Staff' },
    ar: { title: 'IMS', welcome: 'مرحبا بعودتك', sub: 'تسجيل الدخول إلى حسابك', email: 'البريد الإلكتروني', password: 'كلمة المرور', forgot: 'نسيت كلمة المرور؟', signin: 'تسجيل الدخول', dev: 'دخول سريع للمطور', manager: 'دخول كمدير', staff: 'دخول كموظف' },
    ur: { title: 'IMS', welcome: 'خوش آمدید', sub: 'اپنے اکاؤنٹ میں سائن ان کریں', email: 'ای میل ایڈریس', password: 'پاسورڈ', forgot: 'پاسورڈ بھول گئے؟', signin: 'سائن ان', dev: 'ڈویلپر کوئیک لاگن', manager: 'منیجر کے طور پر', staff: 'عملے کے طور پر' },
  }[language] || { title: 'IMS', welcome: 'Welcome Back', sub: 'Sign in to your account', email: 'Email Address', password: 'Password', forgot: 'Forgot password?', signin: 'Sign In', dev: 'Developer Quick Login', manager: 'Login as Manager', staff: 'Login as Staff' };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = onLogin(email, password);
    if (!ok) setError('Invalid email or password. Please try again.');
    setLoading(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-header-actions">
        <div className="language-switcher" style={{ position: 'relative' }}>
          <button className="language-switcher-button" onClick={() => setLangOpen(o => !o)} title="Language">
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
        <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>

      <div className="login-form-container">
        <div className="login-branding">
          <h1>{t.title}</h1>
        </div>
        <div className="login-intro">
          <h2>{t.welcome}</h2>
          <p>{t.sub}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error-message">{error}</div>}
          <div className="form-group">
            <label>{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>{t.password}</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div className="login-actions">
            <button type="button" className="forgot-password-link">{t.forgot}</button>
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <div className="button-spinner" /> : t.signin}
          </button>
        </form>

        <div className="developer-login">
          <h4>{t.dev}</h4>
          <div className="dev-buttons">
            <button onClick={() => onDevLogin('manager')}>{t.manager}</button>
            <button onClick={() => onDevLogin('dhimmedaar')}>{t.staff}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
