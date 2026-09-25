import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Ticket,
  Search,
  BarChart3,
  Settings,
  Users,
  LogOut,
  LifeBuoy,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { ROLE_LABELS, hasPermission, type UserRole, type Permission } from '@shared/types'

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
  permission?: Permission
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tickets', label: 'Tickets', icon: Ticket, permission: 'ticket:read:own' },
  { to: '/investigations', label: 'Investigations', icon: Search, permission: 'case:investigate' },
  { to: '/analytics', label: 'Analytics', icon: BarChart3, permission: 'analytics:read' },
  { to: '/users', label: 'User Management', icon: Users, permission: 'user:manage' },
  { to: '/settings', label: 'Settings', icon: Settings, permission: 'system:configure' },
]

export function Sidebar() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const visibleItems = navItems.filter(
    (item) => !item.permission || hasPermission(user.role as UserRole, item.permission)
  )

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
        <LifeBuoy className="h-6 w-6 text-slate-700" />
        <span className="text-lg font-bold text-slate-900">ResolveAI</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {visibleItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <div className="mb-2 rounded-lg bg-slate-50 px-3 py-2">
          <p className="truncate text-sm font-medium text-slate-900">
            {user.fullName ?? user.email}
          </p>
          <p className="text-xs text-slate-500">
            {ROLE_LABELS[user.role as UserRole]}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
