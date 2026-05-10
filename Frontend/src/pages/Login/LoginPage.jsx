import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../../assets/logo.png'
import { useTravelApp } from '../../context/TravelAppContext'
import AuthFields from './components/AuthFields'
import AuthModeSwitch from './components/AuthModeSwitch'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useTravelApp()
  const [mode, setMode] = useState('login')
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormState((currentState) => ({ ...currentState, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!formState.email.includes('@')) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (formState.password.trim().length < 4) {
      nextErrors.password = 'Use at least 4 characters.'
    }

    if (mode === 'signup' && !formState.name.trim()) {
      nextErrors.name = 'Tell us what to call you.'
    }

    setErrors(nextErrors)
    login({ email: formState.email })

    const destination = location.state?.from?.pathname || '/dashboard'
    navigate(destination, { replace: true })
  }

  return (
    <div className="auth-page">
      <div className="auth-map-layer" aria-hidden="true" />
      <div className="auth-card">
        <div className="auth-brand-pill">
          <img src={logo} alt="Travel Loop" className="auth-logo" />
        </div>

        <div className="auth-copy">
          <p className="page-eyebrow">Luxury trip planning</p>
          <h1 className="auth-title">
            {mode === 'login' ? 'Access your travel hub' : 'Create your Travel Loop account'}
          </h1>
          <p className="auth-description">
            Save itineraries, manage budgets, track packing, and keep every trip detail in
            one elegant workspace.
          </p>
        </div>

        <AuthModeSwitch mode={mode} onModeChange={setMode} />

        <form className="auth-form" onSubmit={handleSubmit}>
          <AuthFields
            mode={mode}
            formState={formState}
            errors={errors}
            onChange={handleChange}
          />

          <div className="auth-row">
            <button type="submit" className="site-button site-button-primary auth-submit">
              {mode === 'login' ? 'Login' : 'Create Account'}
            </button>
            <button type="button" className="text-button">
              Forgot Password
            </button>
          </div>
        </form>

        <p className="auth-footer">
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
          <Link to="/login" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Signup' : 'Login'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
