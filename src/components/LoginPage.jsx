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






