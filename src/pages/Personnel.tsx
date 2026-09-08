import { useState } from 'react'
import { AlertCircle, Phone } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Card } from '../components/ui'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'
import { daysUntil } from '../lib/format'
import type { PersonnelRole } from '../types'

export default function Personnel() {
  const { personnel } = useAppStore()
  const [roleFilter, setRoleFilter] = useState<PersonnelRole | 'all'>('all')

  const filtered = personnel
    .filter((p) => roleFilter === 'all' || p.role === roleFilter)
    .sort((a, b) => b.onTimeRate - a.onTimeRate)

  return (
    <Layout title="Drivers & Helpers" subtitle="Data personel dan scorecard performa untuk rotasi rute & bonus">
      <div className="mb-4 flex gap-2">
        {(['all', 'driver', 'helper'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
              roleFilter === r ? 'bg-ink-900 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
            }`}
          >
            {r === 'all' ? 'Semua' : r === 'driver' ? 'Driver' : 'Helper'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((p) => {
          const expDays = p.licenseExpiry ? daysUntil(p.licenseExpiry) : null
          const expiringSoon = expDays !== null && expDays < 45
          return (
            <Card key={p.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-ink-900">
                    {p.name} <span className="ml-1 text-xs font-medium capitalize text-ink-400">· {p.role}</span>
                  </p>
                  <p className="flex items-center gap-1 text-xs text-ink-400">
                    <Phone size={12} /> {p.phone}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {p.onTimeRate >= 95 && <StatusPill tone="success">Top Performer</StatusPill>}
                  {p.incidentCount > 0 && <StatusPill tone="warning">{p.incidentCount} insiden</StatusPill>}
                  {expiringSoon && <StatusPill tone="danger">SIM {expDays}h lagi</StatusPill>}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Total Trip" value={String(p.totalTrips)} />
                <Stat label="On-Time Rate" value={`${p.onTimeRate}%`} />
                <Stat label="Rata² Excursion Suhu" value={`${p.avgTempExcursionMin} menit`} />
                <Stat label="SIM Berlaku s/d" value={p.licenseExpiry ?? '— (helper)'} warn={expiringSoon} />
              </div>

              {expiringSoon && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-crimson-50 px-3 py-2 text-xs font-semibold text-crimson-600">
                  <AlertCircle size={14} />
                  Segera jadwalkan perpanjangan SIM sebelum expired.
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </Layout>
  )
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-md bg-ink-50 p-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{label}</p>
      <p className={`text-sm font-bold ${warn ? 'text-crimson-600' : 'text-ink-900'}`}>{value}</p>
    </div>
  )
}
