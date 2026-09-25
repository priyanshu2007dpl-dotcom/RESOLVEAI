import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ROLE_LABELS, ROLE_PERMISSIONS, type UserRole } from '@shared/types'
import { getHealth } from '@/lib/api'
import { LoadingSpinner, ErrorState } from '@/components/ui/States'
import { Activity, Shield, Database, Heart, Zap } from 'lucide-react'

interface HealthData {
  status: string
  service: string
  timestamp: string
  version: string
  checks?: Record<string, boolean>
}

export function DashboardPage() {
  const { user } = useAuth()
  const [health, setHealth] = useState<HealthData | null>(null)
  const [healthLoading, setHealthLoading] = useState(true)
  const [healthError, setHealthError] = useState<string | null>(null)

  useEffect(() => {
    getHealth()
      .then((data) => {
        setHealth(data)
        setHealthLoading(false)
      })
      .catch((err: unknown) => {
        setHealthError(err instanceof Error ? err.message : 'Failed to fetch health')
        setHealthLoading(false)
      })
  }, [])

  if (!user) return null

  const role = user.role as UserRole
  const permissions = ROLE_PERMISSIONS[role] ?? []
  const dbOk = health?.checks?.database ?? false

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome, {user.fullName ?? user.email}
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          You are signed in as <span className="font-medium">{ROLE_LABELS[role]}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Shield} label="Role" value={ROLE_LABELS[role]} color="text-blue-700 bg-blue-50" />
        <StatCard icon={Activity} label="Permissions" value={`${permissions.length} granted`} color="text-green-700 bg-green-50" />
        <StatCard icon={Database} label="Database" value={dbOk ? 'Connected' : healthLoading ? 'Checking…' : 'Unknown'} color="text-amber-700 bg-amber-50" />
        <StatCard icon={Heart} label="API Status" value={health ? health.status.toUpperCase() : healthLoading ? 'Checking…' : 'Error'} color={health?.status === 'ok' ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-slate-700" />
          <h2 className="text-lg font-semibold text-slate-900">System Health</h2>
        </div>
        {healthLoading && <LoadingSpinner label="Checking system health…" />}
        {healthError && <ErrorState message={healthError} />}
        {health && !healthLoading && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500">Service:</span>{' '}
                <span className="font-medium text-slate-900">{health.service}</span>
              </div>
              <div>
                <span className="text-slate-500">Version:</span>{' '}
                <span className="font-medium text-slate-900">{health.version}</span>
              </div>
              <div>
                <span className="text-slate-500">Status:</span>{' '}
                <span className={`font-medium ${health.status === 'ok' ? 'text-green-700' : 'text-amber-700'}`}>
                  {health.status.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Timestamp:</span>{' '}
                <span className="font-medium text-slate-900">
                  {new Date(health.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
            {health.checks && (
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium text-slate-700">Checks</h3>
                <div className="space-y-2">
                  {Object.entries(health.checks).map(([check, ok]) => (
                    <div key={check} className="flex items-center gap-2 text-sm">
                      <span className={`h-2 w-2 rounded-full ${ok ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-slate-700">{check}</span>
                      <span className={`font-medium ${ok ? 'text-green-700' : 'text-red-700'}`}>
                        {ok ? 'OK' : 'FAIL'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Your Permissions</h2>
        <div className="flex flex-wrap gap-2">
          {permissions.map((perm) => (
            <span key={perm} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {perm}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
        <h2 className="text-sm font-semibold text-slate-700">Phase 1 — Foundation</h2>
        <p className="mt-2 text-sm text-slate-600">
          This is the ResolveAI foundation. Phase 2 will add ticket management,
          investigation engine, AI orchestration, and the Case Digital Twin.
          The demo scenario is: "My order hasn't arrived and I was charged twice."
        </p>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Shield
  label: string
  value: string
  color: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center gap-3">
        <div className={`rounded-lg p-2 ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500">{label}</p>
          <p className="text-sm font-semibold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  )
}
