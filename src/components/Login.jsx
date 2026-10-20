import { useEffect, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Sparkle from '../components/Sparkle.jsx'
import { isAuthenticated, login } from '../services/auth.js'
import './admin.css'

// Admin-only sign in. Not linked from the public site and hidden from search engines.
export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from?.pathname || '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Keep this page out of Google and set its own tab title.
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Admin login | Made You Look'

    const robots = document.createElement('meta')
    robots.name = 'robots'
    robots.content = 'noindex, nofollow'
    document.head.appendChild(robots)

    return () => {
      document.title = previousTitle
      document.head.removeChild(robots)
    }
  }, [])

  // Already signed in: go straight to the dashboard.
  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (loading) return

    setError('')
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-brand">
        <div className="admin-brand__name">MADE YOU LOOK</div>
        <div className="admin-brand__script">by Samiksha</div>
      </div>

      <section className="admin-card" aria-labelledby="admin-login-title">
        <span className="admin-badge">
          <Sparkle width={12} height={15} />
          Admin only
        </span>
        <h1 id="admin-login-title" className="admin-card__title">
          Sign in
        </h1>
        <p className="admin-card__lede">
          This area is for the studio owner to manage the website. If you are a
          customer, you can book from the main site.
        </p>

        {error && (
          <div className="admin-error" role="alert">
            {error}
          </div>
        )}

        <form className="form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck="false"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              aria-invalid={error ? 'true' : undefined}
            />
          </div>

          <div className="field">
            <label htmlFor="admin-password">Password</label>
            <div className="password-wrap">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Your password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                aria-invalid={error ? 'true' : undefined}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-pressed={showPassword}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn--solid form__submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <Link to="/" className="admin-back">
          ← Back to the website
        </Link>
      </section>
    </main>
  )
}
