import { useState } from 'react';
import { Eye, EyeOff, Sun, Moon, Globe } from 'lucide-react';
import { COUNTRY_CENTRES, GOOGLE_SCRIPT_URL } from '../data/config';
import logo from '../assets/Logo.png';

const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'ar', label: 'عربي' },
  { code: 'ur', label: 'اردو' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
];

const TRANSLATIONS = {
  en: {
    title: 'Madrassa Haazimi', welcome: 'Welcome Back', sub: 'Sign in to your account',
    email: 'Email Address', password: 'Password', forgot: 'Forgot password?',
    signin: 'Sign In', dev: 'Developer Quick Login', manager: 'Login as Manager',
    staff: 'Login as Staff', adminDev: 'Login as Admin', register: 'Register here',
    signup: 'Create Account', already: 'Already have an account? Sign in',
    name: 'Full Name', noAccount: "Don't have an account? Register here",
    country: 'Country', centre: 'Centre',
    nameTip: 'Name must match your official timesheet exactly.',
    pending: 'Registration submitted! Your account is pending approval by an admin.',
    pwdHint: 'Minimum 8 characters · Must contain letters and numbers',
    selectCountry: 'Select a country',
    selectCentre: 'Select a centre',
    forgotPrompt: 'Enter your registered email address to receive your password:',
    forgotSuccess: 'If that email is registered, your password has been sent to your inbox!',
    forgotError: 'Error connecting to the server. Please try again.'
  },
  ar: {
    title: 'مدرسة حازمي', welcome: 'مرحباً بعودتك', sub: 'تسجيل الدخول إلى حسابك',
    email: 'عنوان البريد الإلكتروني', password: 'كلمة المرور', forgot: 'نسيت كلمة المرور؟',
    signin: 'تسجيل الدخول', dev: 'تسجيل دخول سريع للمطور', manager: 'تسجيل كمدير',
    staff: 'تسجيل كموظف', adminDev: 'تسجيل كمسؤول', register: 'سجّل هنا',
    signup: 'إنشاء حساب', already: 'لديك حساب بالفعل؟ تسجيل الدخول',
    name: 'الاسم الكامل', noAccount: 'ليس لديك حساب؟ سجّل هنا',
    country: 'الدولة', centre: 'المركز',
    nameTip: 'يجب أن يتطابق الاسم مع كشف الدوام الرسمي تماماً.',
    pending: 'تم إرسال التسجيل! حسابك في انتظار موافقة المسؤول.',
    pwdHint: '٨ أحرف على الأقل · يجب أن تحتوي على حروف وأرقام',
    selectCountry: 'اختر دولة',
    selectCentre: 'اختر مركزاً',
    forgotPrompt: 'أدخل بريدك الإلكتروني المسجّل لاستلام كلمة المرور:',
    forgotSuccess: 'إذا كان هذا البريد مسجّلاً، فقد تم إرسال كلمة المرور إلى بريدك!',
    forgotError: 'خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.'
  },
  ur: {
    title: 'مدرسہ حازمی', welcome: 'خوش آمدید', sub: 'اپنے اکاؤنٹ میں سائن ان کریں',
    email: 'ای میل ایڈریس', password: 'پاس ورڈ', forgot: 'پاس ورڈ بھول گئے؟',
    signin: 'سائن ان', dev: 'ڈیولپر فوری لاگ ان', manager: 'مینیجر کے طور پر لاگ ان',
    staff: 'عملے کے طور پر لاگ ان', adminDev: 'ایڈمن کے طور پر لاگ ان', register: 'یہاں رجسٹر کریں',
    signup: 'اکاؤنٹ بنائیں', already: 'پہلے سے اکاؤنٹ ہے؟ سائن ان کریں',
    name: 'پورا نام', noAccount: 'اکاؤنٹ نہیں ہے؟ یہاں رجسٹر کریں',
    country: 'ملک', centre: 'مرکز',
    nameTip: 'نام آپ کے سرکاری ٹائم شیٹ سے بالکل مطابقت رکھنا چاہیے۔',
    pending: 'رجسٹریشن جمع ہو گئی! آپ کا اکاؤنٹ ایڈمن کی منظوری کا انتظار کر رہا ہے۔',
    pwdHint: 'کم از کم ۸ حروف · حروف اور اعداد دونوں ہونے چاہئیں',
    selectCountry: 'ملک منتخب کریں',
    selectCentre: 'مرکز منتخب کریں',
    forgotPrompt: 'پاس ورڈ حاصل کرنے کے لیے اپنا رجسٹرڈ ای میل ایڈریس درج کریں:',
    forgotSuccess: 'اگر وہ ای میل رجسٹرڈ ہے تو پاس ورڈ آپ کے ان باکس میں بھیج دیا گیا ہے!',
    forgotError: 'سرور سے جڑنے میں خرابی۔ براہ کرم دوبارہ کوشش کریں۔'
  },
  es: {
    title: 'Madrassa Haazimi', welcome: 'Bienvenido de nuevo', sub: 'Inicia sesión en tu cuenta',
    email: 'Correo Electrónico', password: 'Contraseña', forgot: '¿Olvidaste tu contraseña?',
    signin: 'Iniciar Sesión', dev: 'Acceso Rápido Desarrollador', manager: 'Entrar como Manager',
    staff: 'Entrar como Personal', adminDev: 'Entrar como Admin', register: 'Regístrate aquí',
    signup: 'Crear Cuenta', already: '¿Ya tienes cuenta? Inicia sesión',
    name: 'Nombre Completo', noAccount: '¿No tienes cuenta? Regístrate aquí',
    country: 'País', centre: 'Centro',
    nameTip: 'El nombre debe coincidir exactamente con tu hoja de asistencia oficial.',
    pending: '¡Registro enviado! Tu cuenta está pendiente de aprobación por un admin.',
    pwdHint: 'Mínimo 8 caracteres · Debe contener letras y números',
    selectCountry: 'Selecciona un país',
    selectCentre: 'Selecciona un centro',
    forgotPrompt: 'Ingresa tu correo registrado para recibir tu contraseña:',
    forgotSuccess: '¡Si ese correo está registrado, tu contraseña fue enviada a tu bandeja!',
    forgotError: 'Error al conectar con el servidor. Por favor intenta de nuevo.'
  },
  pt: {
    title: 'Madrassa Haazimi', welcome: 'Bem-vindo de volta', sub: 'Entre na sua conta',
    email: 'Endereço de E-mail', password: 'Senha', forgot: 'Esqueceu a senha?',
    signin: 'Entrar', dev: 'Acesso Rápido Desenvolvedor', manager: 'Entrar como Gerente',
    staff: 'Entrar como Funcionário', adminDev: 'Entrar como Admin', register: 'Registre-se aqui',
    signup: 'Criar Conta', already: 'Já tem uma conta? Entre',
    name: 'Nome Completo', noAccount: 'Não tem uma conta? Registre-se aqui',
    country: 'País', centre: 'Centro',
    nameTip: 'O nome deve corresponder exatamente ao seu ponto oficial.',
    pending: 'Cadastro enviado! Sua conta aguarda aprovação do administrador.',
    pwdHint: 'Mínimo 8 caracteres · Deve conter letras e números',
    selectCountry: 'Selecione um país',
    selectCentre: 'Selecione um centro',
    forgotPrompt: 'Digite seu e-mail cadastrado para receber sua senha:',
    forgotSuccess: 'Se esse e-mail estiver cadastrado, sua senha foi enviada para sua caixa de entrada!',
    forgotError: 'Erro ao conectar ao servidor. Tente novamente.'
  },
};

export default function LoginPage({ onLogin, onRegister, onDevLogin, theme, onToggleTheme, language, onChangeLanguage }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [centre, setCentre] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [pendingMsg, setPendingMsg] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const countries = Object.keys(COUNTRY_CENTRES);
  const centres = country ? COUNTRY_CENTRES[country] || [] : [];

  const handleCountryChange = (val) => {
    setCountry(val);
    setCentre('');
  };

  const handleForgotPassword = async () => {
    const userEmail = prompt(t.forgotPrompt);
    if (!userEmail) return;

    setLoading(true);
    setForgotMsg('');
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ type: 'forgotPassword', email: userEmail })
      });
      setForgotMsg(t.forgotSuccess);
    } catch (err) {
      setError(t.forgotError);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPendingMsg('');
    setForgotMsg('');
    setLoading(true);

    if (isRegistering) {
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      if (password.length < 8 || !hasLetter || !hasNumber) {
        setError('Password must be at least 8 characters and contain both letters and numbers.');
        setLoading(false);
        return;
      }
      const result = await onRegister(name, email, password, country, centre);
      if (result.success) {
        setPendingMsg(t.pending);
        setIsRegistering(false);
        setName(''); setEmail(''); setPassword(''); setCountry(''); setCentre('');
      } else {
        setError(result.message);
      }
    } else {
      const result = await onLogin(email, password);
      if (!result.success) setError(result.message || 'Invalid email or password.');
    }
    setLoading(false);
  };

  const switchMode = () => {
    setIsRegistering(r => !r);
    setError('');
    setPendingMsg('');
    setForgotMsg('');
  };

  return (
    <div className="login-page-container">
      <div className="login-form-container">

        <div className="login-card-actions">
          <div className="language-switcher" style={{ position: 'relative' }}>
            <button className="language-switcher-button" onClick={() => setLangOpen(o => !o)} title="Language">
              <Globe size={20} />
            </button>
            {langOpen && (
              <div className="language-switcher-dropdown">
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
          <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="login-branding">
          <img src={logo} alt="Madrassa Haazimi" className="login-logo" />
        </div>

        <div className="login-intro">
          <h2>{isRegistering ? t.signup : t.welcome}</h2>
          <p>{isRegistering ? '' : t.sub}</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error-message">{error}</div>}
          {pendingMsg && <div className="forgot-password-success">{pendingMsg}</div>}
          {forgotMsg && <div className="forgot-password-success" style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)', color: '#2e7d32' }}>{forgotMsg}</div>}

          {isRegistering && (
            <div className="form-group">
              <label>{t.name}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Muhammad"
                required
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--primary-color)', marginTop: 4, display: 'block' }}>
                ⓘ {t.nameTip}
              </span>
            </div>
          )}

          <div className="form-group">
            <label>{t.email}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoFocus={!isRegistering}
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
                minLength={isRegistering ? 8 : 1}
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(s => !s)}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {isRegistering && (
              <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 4, display: 'block' }}>
                {t.pwdHint}
              </span>
            )}
          </div>

          {isRegistering && (
            <>
              <div className="form-group">
                <label>{t.country}</label>
                <select value={country} onChange={e => handleCountryChange(e.target.value)} required>
                  <option value="">{t.selectCountry}</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>{t.centre}</label>
                <select value={centre} onChange={e => setCentre(e.target.value)} disabled={!country || centres.length === 0}>
                  <option value="">{centres.length === 0 && country ? '(Admin will assign)' : t.selectCentre}</option>
                  {centres.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </>
          )}

          {!isRegistering && (
            <div className="login-actions">
              <button
                type="button"
                className="forgot-password-link"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                {t.forgot}
              </button>
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <div className="button-spinner" /> : (isRegistering ? t.signup : t.signin)}
          </button>

          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <button
              type="button"
              className="forgot-password-link"
              onClick={switchMode}
              style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}
            >
              {isRegistering ? t.already : t.noAccount}
            </button>
          </div>
        </form>

        <div className="developer-login">
          <h4>{t.dev}</h4>
          <div className="dev-buttons">
            <button onClick={() => onDevLogin('countryadmin')}>Country Admin</button>
            <button onClick={() => onDevLogin('centremanager')}>Centre Manager</button>
            <button onClick={() => onDevLogin('staff')}>Staff</button>
          </div>
        </div>
      </div>
    </div>
  );
}
