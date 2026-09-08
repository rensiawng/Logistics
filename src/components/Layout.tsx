import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Menu,
  MapPinned,
  PackageCheck,
  Truck,
  Wallet,
  Users,
  BarChart3,
  X,
  Snowflake,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/route-planner', label: 'Route Planner', icon: MapPinned },
  { to: '/loading-plan', label: 'Loading Plan', icon: PackageCheck },
  { to: '/fleet-tracking', label: 'Fleet Tracking', icon: Truck },
  { to: '/petty-cash', label: 'Petty Cash', icon: Wallet },
  { to: '/drivers', label: 'Drivers', icon: Users },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
]

export function Layout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f4f6fb]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-navy-950 text-white transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500">
              <Snowflake size={18} />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">SHB Logistics</p>
              <p className="text-[11px] text-white/50 leading-tight">Cold Chain Ops</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={() => setOpen(false)} aria-label="Tutup menu">
            <X size={20} />
          </button>
        </div>
        <nav className="mt-2 flex flex-col gap-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-brand-600 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {open && (
        <button
          aria-label="Tutup menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-4">
          <button
            className="rounded-md p-1.5 text-navy-900 hover:bg-slate-100 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-lg font-bold text-navy-900">{title}</h1>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-5">
          {subtitle && (
            <div className="mb-4">
              <h2 className="text-xl font-bold text-navy-900">{title}</h2>
              <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
