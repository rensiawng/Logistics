import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  ClipboardList,
  Route,
  PackageCheck,
  Navigation2,
  Truck,
  Users,
  Wallet,
  FileStack,
  CheckSquare,
  ListChecks,
  Building2,
  BellRing,
  BarChart3,
  Menu,
  X,
  Search,
  Boxes,
} from 'lucide-react'

const navGroups = [
  {
    label: 'Operations',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutGrid },
      { to: '/sales-orders', label: 'Sales Orders', icon: ClipboardList },
      { to: '/dispatch-planning', label: 'Dispatch Planning', icon: Route },
      { to: '/loading-plan', label: 'Loading Plan', icon: PackageCheck },
      { to: '/shipment-tracking', label: 'Shipment Tracking', icon: Navigation2 },
    ],
  },
  {
    label: 'Resources',
    items: [
      { to: '/fleet', label: 'Fleet & Vehicles', icon: Truck },
      { to: '/personnel', label: 'Drivers & Helpers', icon: Users },
    ],
  },
  {
    label: 'Finance',
    items: [{ to: '/petty-cash', label: 'Petty Cash', icon: Wallet }],
  },
  {
    label: 'Compliance',
    items: [
      { to: '/documents', label: 'Documents', icon: FileStack },
      { to: '/approvals', label: 'Approvals', icon: CheckSquare },
    ],
  },
  {
    label: 'Planning',
    items: [
      { to: '/tasks', label: 'Tasks', icon: ListChecks },
      { to: '/alerts', label: 'Alerts', icon: BellRing },
    ],
  },
  {
    label: 'Partners',
    items: [{ to: '/partners', label: 'Customers & Suppliers', icon: Building2 }],
  },
  {
    label: 'Insights',
    items: [{ to: '/reports', label: 'Reports', icon: BarChart3 }],
  },
]

export function Layout({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ink-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform overflow-y-auto border-r border-ink-200 bg-white transition-transform duration-200 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between border-b border-ink-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-ink-900">
              <Boxes size={16} className="text-signal-400" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight text-ink-900">SHB Ops</p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-ink-400">Logistics Console</p>
            </div>
          </div>
          <button className="text-ink-500 lg:hidden" onClick={() => setOpen(false)} aria-label="Tutup menu">
            <X size={20} />
          </button>
        </div>
        <nav className="px-3 py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="px-3 pb-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-400">{group.label}</p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 rounded-md border-l-2 px-2.5 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-l-signal-600 bg-signal-50 text-signal-700'
                          : 'border-l-transparent text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                      }`
                    }
                  >
                    <item.icon size={17} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {open && (
        <button
          aria-label="Tutup menu"
          className="fixed inset-0 z-30 bg-ink-950/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-ink-200 bg-white px-4 py-3">
          <button
            className="rounded-md p-1.5 text-ink-700 hover:bg-ink-50 lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Buka menu"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-bold text-ink-900">{title}</h1>
          <div className="ml-auto hidden items-center gap-2 rounded-md border border-ink-200 bg-ink-50 px-2.5 py-1.5 text-sm text-ink-400 sm:flex">
            <Search size={14} />
            <span className="text-xs">Cari SO, customer, plat nomor…</span>
          </div>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink-800 text-xs font-bold text-white">
            OP
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-5">
          {subtitle && (
            <div className="mb-5">
              <h2 className="text-xl font-bold text-ink-900">{title}</h2>
              <p className="text-sm text-ink-500">{subtitle}</p>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  )
}
