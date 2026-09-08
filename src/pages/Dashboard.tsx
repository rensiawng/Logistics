import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ArrowRight, Snowflake, ThermometerSun, Wallet } from 'lucide-react'
import { Layout } from '../components/Layout'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'
import { fleetTheme, initials } from '../lib/fleetTheme'
import { formatRupiah } from '../lib/format'
import { weeklyDeliveryTrend } from '../data/seed'

export default function Dashboard() {
  const { fleets, assignments, salesOrders, recaps, liveStatus, drivers } = useAppStore()

  const departedCount = assignments.filter((a) => a.status === 'berangkat').length
  const totalLines = salesOrders.flatMap((so) => so.lines).length
  const deliveredLines = salesOrders.flatMap((so) => so.lines).filter((l) => l.statusKirim === 'diterima').length

  const pendingVerifikasi = recaps.filter((r) => r.status === 'perlu_verifikasi')
  const nungguApproval = recaps.filter((r) => r.status === 'nunggu_approval')
  const pettyCashPending = pendingVerifikasi.reduce((s, r) => s + r.items.reduce((x, i) => x + i.amount, 0), 0) +
    nungguApproval.reduce((s, r) => s + r.items.reduce((x, i) => x + i.amount, 0), 0)

  const totalOnTime = weeklyDeliveryTrend.reduce((s, d) => s + d.onTime, 0)
  const totalLate = weeklyDeliveryTrend.reduce((s, d) => s + d.late, 0)
  const onTimeRate = Math.round((totalOnTime / (totalOnTime + totalLate)) * 100)

  const tempAlerts = liveStatus.filter((s) => s.alert)
  const expiringLicenses = drivers.filter((d) => {
    const days = (new Date(d.licenseExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    return days < 45
  })
  const overBudget = recaps.filter((r) => r.items.reduce((s, i) => s + i.amount, 0) > r.budget)

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard
          label="Armada Berangkat"
          value={`${departedCount}/${fleets.length}`}
          hint="hari ini"
          icon={<Snowflake size={18} />}
          tone="info"
        />
        <KpiCard
          label="SO Line Terkirim"
          value={`${deliveredLines}/${totalLines}`}
          hint="progress hari ini"
          icon={<ArrowRight size={18} />}
          tone="success"
        />
        <KpiCard
          label="Petty Cash Pending"
          value={formatRupiah(pettyCashPending)}
          hint={`${pendingVerifikasi.length + nungguApproval.length} rekap`}
          icon={<Wallet size={18} />}
          tone="warning"
        />
        <KpiCard
          label="On-Time Rate"
          value={`${onTimeRate}%`}
          hint="7 hari terakhir"
          icon={<ThermometerSun size={18} />}
          tone="info"
        />
      </div>

      {(tempAlerts.length > 0 || expiringLicenses.length > 0 || overBudget.length > 0) && (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="mb-2 flex items-center gap-2 text-amber-800">
            <AlertTriangle size={18} />
            <p className="font-bold">Perlu Perhatian</p>
          </div>
          <ul className="space-y-1.5 text-sm text-amber-900">
            {tempAlerts.map((s) => {
              const fleet = fleets.find((f) => f.id === s.fleetId)
              return (
                <li key={s.fleetId}>
                  <Link to="/fleet-tracking" className="underline decoration-amber-400 underline-offset-2">
                    {fleet?.name}
                  </Link>{' '}
                  — {s.alert}
                </li>
              )
            })}
            {overBudget.map((r) => {
              const fleet = fleets.find((f) => f.id === r.fleetId)
              const total = r.items.reduce((s, i) => s + i.amount, 0)
              return (
                <li key={r.id}>
                  Petty cash{' '}
                  <Link to="/petty-cash" className="underline decoration-amber-400 underline-offset-2">
                    {fleet?.name} · Rit {r.rit}
                  </Link>{' '}
                  melebihi budget ({formatRupiah(total)} / {formatRupiah(r.budget)})
                </li>
              )
            })}
            {expiringLicenses.map((d) => (
              <li key={d.id}>
                SIM driver{' '}
                <Link to="/drivers" className="underline decoration-amber-400 underline-offset-2">
                  {d.name}
                </Link>{' '}
                akan expired {d.licenseExpiry}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <h3 className="text-base font-bold text-navy-900">Status Armada Hari Ini</h3>
        <Link to="/loading-plan" className="text-sm font-semibold text-brand-600">
          Lihat Loading Plan →
        </Link>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {fleets.map((fleet) => {
          const theme = fleetTheme(fleet.type)
          const assignment = assignments.find((a) => a.fleetId === fleet.id)
          const soCount = assignment?.soIds.length ?? 0
          return (
            <Link
              to="/loading-plan"
              key={fleet.id}
              className={`rounded-xl border-l-4 ${theme.border} bg-white p-4 shadow-sm transition hover:shadow-md`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`flex h-9 w-9 items-center justify-center rounded-full ${theme.avatarBg} text-xs font-bold text-white`}>
                  {initials(fleet.name)}
                </div>
                <div>
                  <p className="font-bold text-navy-900">{fleet.name}</p>
                  <p className="text-xs text-slate-500">{soCount} SO</p>
                </div>
              </div>
              <div className="mt-3">
                {assignment?.status === 'berangkat' ? (
                  <StatusPill tone="success">Berangkat {assignment.departedAt}</StatusPill>
                ) : (
                  <StatusPill tone="neutral">Belum Berangkat</StatusPill>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </Layout>
  )
}

function KpiCard({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string
  value: string
  hint: string
  icon: ReactNode
  tone: 'info' | 'success' | 'warning'
}) {
  const toneStyles = {
    info: 'bg-brand-100 text-brand-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
  }
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${toneStyles[tone]}`}>{icon}</div>
      <p className="text-xl font-extrabold text-navy-900">{value}</p>
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="text-[11px] text-slate-400">{hint}</p>
    </div>
  )
}
