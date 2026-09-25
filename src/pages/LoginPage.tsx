import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useLocation } from 'react-router-dom'
import { LifeBuoy, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export function LoginPage() {
  const { signIn, user, loading, error } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    const from = (location.state as { from?: { pathname: string } })?.from?.pathname
    return <Navigate to={from ?? '/dashboard'} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    const { error: signInError } = await signIn(email, password)
    if (signInError) {
      setFormError(signInError)
      setSubmitting(false)
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  const displayError = formError ?? error

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-2">
          <LifeBuoy className="h-8 w-8 text-slate-700" />
          <span className="text-2xl font-bold text-slate-900">ResolveAI</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-xl font-semibold text-slate-900">Sign In</h1>
          <p className="mb-6 text-sm text-slate-600">
            Autonomous Customer Support & Resolution Intelligence
          </p>

          {displayError && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {displayError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={submitting}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={submitting}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Don't have an account?{' '}
            <a href="/register" className="font-medium text-slate-900 hover:underline">
              Create one
            </a>
          </p>
        </div>

        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4 text-xs text-slate-600">
          <p className="mb-2 font-semibold text-slate-700">Demo Credentials:</p>
          <ul className="space-y-1">
            <li>Customer: customer@resolveai.dev / Customer123!</li>
            <li>Agent: agent@resolveai.dev / Agent123!</li>
            <li>Manager: manager@resolveai.dev / Manager123!</li>
            <li>Admin: admin@resolveai.dev / Admin123!</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
