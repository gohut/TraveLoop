function AuthModeSwitch({ mode, onModeChange }) {
  return (
    <div className="auth-switch">
      <button
        type="button"
        className={`auth-switch-button ${mode === 'login' ? 'is-active' : ''}`}
        onClick={() => onModeChange('login')}
      >
        Login
      </button>
      <button
        type="button"
        className={`auth-switch-button ${mode === 'signup' ? 'is-active' : ''}`}
        onClick={() => onModeChange('signup')}
      >
        Signup
      </button>
    </div>
  )
}

export default AuthModeSwitch
