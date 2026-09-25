import type { HealthResponse } from '@shared/types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const headers: Record<string, string> = {
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
}

export async function getHealth(): Promise<HealthResponse> {
  const resp = await fetch(`${supabaseUrl}/functions/v1/health`, { headers })
  if (!resp.ok) {
    throw new Error(`Health check failed (${resp.status})`)
  }
  return resp.json()
}

export async function getHealthLive(): Promise<HealthResponse> {
  const resp = await fetch(`${supabaseUrl}/functions/v1/health-live`, { headers })
  if (!resp.ok) {
    throw new Error(`Liveness check failed (${resp.status})`)
  }
  return resp.json()
}

export async function getHealthReady(): Promise<HealthResponse> {
  const resp = await fetch(`${supabaseUrl}/functions/v1/health-ready`, { headers })
  if (!resp.ok) {
    throw new Error(`Readiness check failed (${resp.status})`)
  }
  return resp.json()
}
