import { AlertCircle, Phone } from 'lucide-react'
import { Layout } from '../components/Layout'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'

function daysUntil(iso: string) {
  return Math.round((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
}

export default function Drivers() {
  const { drivers } = useAppStore()
  const sorted = [...drivers].sort((a, b) => b.onTimeRate - a.onTimeRate)

  return (
    <Layout title="Drivers" subtitle="Scorecard performa driver untuk bantu keputusan rotasi rute dan bonus">
      <div className="space-y-3">
        {sorted.map((driver) => {
          const expDays = daysUntil(driver.licenseExpiry)
          const expiringSoon = expDays < 45
          return (
            <div key={driver.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-navy-900">{driver.name}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400">
                    <Phone size={12} /> {driver.phone}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {driver.onTimeRate >= 95 && <StatusPill tone="success">Top Performer</StatusPill>}
                  {driver.incidentCount > 0 && <StatusPill tone="warning">{driver.incidentCount} insiden</StatusPill>}
                  {expiringSoon && <StatusPill tone="danger">SIM {expDays}h lagi</StatusPill>}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Stat label="Total Trip" value={String(driver.totalTrips)} />
                <Stat label="On-Time Rate" value={`${driver.onTimeRate}%`} />
                <Stat label="Rata² Excursion Suhu" value={`${driver.avgTempExcursionMin} menit`} />
                <Stat label="SIM Berlaku s/d" value={driver.licenseExpiry} warn={expiringSoon} />
              </div>

              {expiringSoon && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600">
                  <AlertCircle size={14} />
                  Segera jadwalkan perpanjangan SIM sebelum expired.
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Layout>
  )
}

function Stat({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`text-sm font-bold ${warn ? 'text-red-600' : 'text-navy-900'}`}>{value}</p>
    </div>
  )
}
