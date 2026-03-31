import { useState } from 'react';
import { Bell, Shield, User, DollarSign, Layout as LayoutIcon } from 'lucide-react';

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
    display: 'Display Preferences', displaySub: 'Customise how the app looks and behaves on your device',
    showBottomNav: 'Show bottom navigation bar',
    showBottomNavDesc: 'Display the quick-access navigation bar at the bottom of the screen on mobile',
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
    display: 'تفضيلات العرض', displaySub: 'تخصيص مظهر التطبيق وسلوكه على جهازك',
    showBottomNav: 'إظهار شريط التنقل السفلي',
    showBottomNavDesc: 'عرض شريط التنقل السريع أسفل الشاشة',
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
    display: 'ڈسپلے ترجیحات', displaySub: 'ایپ کی ظاہری شکل اور طرز عمل کو اپنی مرضی کے مطابق بنائیں',
    showBottomNav: 'نیچے نیوی گیشن بار دکھائیں',
    showBottomNavDesc: 'موبائل اسکرین کے نیچے فوری رسائی نیوی گیشن بار دکھائیں',
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
    display: 'Preferencias de Visualización', displaySub: 'Personaliza cómo se ve la app en tu dispositivo',
    showBottomNav: 'Mostrar barra de navegación inferior',
    showBottomNavDesc: 'Muestra la barra de navegación rápida en la parte inferior de la pantalla',
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
    display: 'Preferências de Exibição', displaySub: 'Personalize como o app aparece no seu dispositivo',
    showBottomNav: 'Mostrar barra de navegação inferior',
    showBottomNavDesc: 'Exibir a barra de navegação rápida na parte inferior da tela',
    notif: {
      leaveApproval: 'Aprovações de Licença', leaveApprovalDesc: 'Notificar quando o status da sua solicitação mudar',
      newRequest: 'Novas Solicitações de Licença', newRequestDesc: 'Notificar quando o pessoal enviar novas solicitações',
      redFlags: 'Alertas de Bandeira Vermelha', redFlagsDesc: 'Notificar quando novas alertas forem levantadas',
      calendarEvents: 'Eventos do Calendário', calendarEventsDesc: 'Notificar 24 horas antes de eventos programados',
      weeklyReport: 'Resumo Semanal', weeklyReportDesc: 'Receber um resumo semanal toda segunda-feira',
    },
  },
};

const CURRENCIES = [
  { symbol: '$', label: 'US Dollar ($)' },
  { symbol: 'R', label: 'South African Rand (R)' },
  { symbol: 'PKR', label: 'Pakistani Rupee (PKR)' },
  { symbol: 'Bs', label: 'Venezuelan Bolívar (Bs)' },
  { symbol: 'ARS$', label: 'Argentine Peso (ARS$)' },
  { symbol: 'BRL', label: 'Brazilian Real (BRL)' },
];

export default function Settings({ user, language }) {
  const t = T[language] || T.en;
  const isTeacher = !['Centre Manager', 'Country Admin', 'Super Admin'].includes(user?.role);
  const isSuperAdmin = user?.role === 'Super Admin';

  // Email 30-day rule
  const emailLastChanged = (() => {
    try { return localStorage.getItem('haazimi_email_changed') || null; } catch { return null; }
  })();
  const canChangeEmail = !isTeacher && (() => {
    if (!emailLastChanged) return true;
    const diff = (Date.now() - new Date(emailLastChanged).getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 30;
  })();

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('haazimi_notifications') || 'null');
      if (saved) return saved;
    } catch {}
    return { leaveApproval: true, newRequest: true, redFlags: true, calendarEvents: false, weeklyReport: true };
  });
  const [currency, setCurrency] = useState(() => localStorage.getItem('haazimi_currency') || '$');
  const [showBottomNav, setShowBottomNav] = useState(() => localStorage.getItem('haazimi_show_bottom_nav') !== 'false');
  const [saved, setSaved] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdOk, setPwdOk] = useState(false);

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
    window.dispatchEvent(new CustomEvent('haazimi-settings-changed', { detail: { showBottomNav } }));
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
    <div>
      <div className="view-header">
        <div>
          <h2>{t.title}</h2>
          <p>{t.sub}</p>
        </div>
      </div>

      <div className="form-container" style={{ maxWidth: 700 }}>
        {saved && <div className="forgot-password-success" style={{ marginBottom: 24 }}>{t.saved}</div>}

        <div className="settings-layout">

          {/* Profile */}
          <div className="settings-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <User size={20} color="var(--accent-color)" />
              <h3>{t.profile}</h3>
            </div>
            <p>{t.profileSub}</p>
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
          </div>

          {/* Currency — hidden from Teachers and Super Admin */}
          {!isTeacher && !isSuperAdmin && (
            <div className="settings-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <DollarSign size={20} color="var(--accent-color)" />
                <h3>{t.currency}</h3>
              </div>
              <p>{t.currencySub}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {CURRENCIES.map(c => (
                  <label
                    key={c.symbol}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '10px 16px',
                      border: `1px solid ${currency === c.symbol ? 'var(--accent-color)' : 'var(--border-color)'}`,
                      borderRadius: 8, cursor: 'pointer',
                      backgroundColor: currency === c.symbol ? 'var(--main-bg)' : 'transparent',
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
            </div>
          )}

          {/* Notifications — hidden from Super Admin */}
          {!isSuperAdmin && (
            <div className="settings-section">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Bell size={20} color="var(--accent-color)" />
                <h3>{t.notifications}</h3>
              </div>
              <p>{t.notifSub}</p>
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
            </div>
          )}

          {/* Display Preferences */}
          <div className="settings-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <LayoutIcon size={20} color="var(--accent-color)" />
              <h3>{t.display}</h3>
            </div>
            <p>{t.displaySub}</p>
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
          </div>

          {/* Security */}
          <div className="settings-section">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Shield size={20} color="var(--accent-color)" />
              <h3>{t.security}</h3>
            </div>
            <p>{t.securitySub}</p>
            {pwdError && <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: '0.85rem', marginBottom: 12 }}>{pwdError}</div>}
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
          </div>
        </div>

        <div className="form-actions" style={{ marginTop: 8 }}>
          <button className="button-secondary">{t.discard}</button>
          <button className="button-primary" onClick={handleSave}>{t.save}</button>
        </div>
      </div>
    </div>
  );
}
