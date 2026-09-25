import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { AppShell } from '@/components/AppShell'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { PlaceholderPage } from '@/pages/PlaceholderPage'
import type { UserRole } from '@shared/types'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppShell>
                  <DashboardPage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/tickets"
            element={
              <ProtectedRoute>
                <AppShell>
                  <PlaceholderPage
                    title="Tickets"
                    description="Customers submit support tickets here. Agents and managers can view, assign, and resolve them. This will be built in Phase 2."
                  />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/investigations"
            element={
              <ProtectedRoute allowedRoles={['SUPPORT_AGENT', 'SUPPORT_MANAGER', 'ADMIN'] as UserRole[]}>
                <AppShell>
                  <PlaceholderPage
                    title="Investigations"
                    description="The investigation engine will autonomously analyze tickets, gather evidence, and build root-cause graphs. This will be built in Phase 2."
                  />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute allowedRoles={['SUPPORT_MANAGER', 'ADMIN'] as UserRole[]}>
                <AppShell>
                  <PlaceholderPage
                    title="Analytics"
                    description="Resolution intelligence analytics, SLA tracking, and trend detection. This will be built in Phase 2."
                  />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN'] as UserRole[]}>
                <AppShell>
                  <PlaceholderPage
                    title="User Management"
                    description="Admins can manage user accounts, assign roles, and configure access. This will be built in Phase 2."
                  />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute allowedRoles={['ADMIN'] as UserRole[]}>
                <AppShell>
                  <PlaceholderPage
                    title="Settings"
                    description="System configuration, integrations, and policy engine settings. This will be built in Phase 2."
                  />
                </AppShell>
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
