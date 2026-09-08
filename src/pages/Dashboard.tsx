import { Link } from 'react-router-dom'
import { AlertOctagon, AlertTriangle, CheckSquare, ClipboardList, Info, ListChecks, Navigation2 } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Card, KpiTile, SectionHeading } from '../components/ui'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'
import { themeForKey } from '../lib/fleetTheme'
import { soStatusMeta } from '../lib/soStatus'
import { TODAY } from '../data/constants'

const severityIcon = { critical: AlertOctagon, warning: AlertTriangle, info: Info }

export default function Dashboard() {
  const { vehicles, dispatchPlans, salesOrders, approvals, tasks, alerts } = useAppStore()

  const todayCount = salesOrders.filter((so) => so.deliveryDate === TODAY).length
  const inTransit = salesOrders.filter((so) => so.status === 'in_transit' || so.status === 'loading').length
  const departedVehicles = dispatchPlans.filter((d) => d.status === 'departed').length
  const pendingApprovals = approvals.filter((a) => a.status === 'pending')
  const openTasks = tasks.filter((t) => t.status !== 'done')
  const activeAlerts = alerts.filter((a) => !a.resolved).sort((a, b) => (a.severity === 'critical' ? -1 : b.severity === 'critical' ? 1 : 0))

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label="SO Terjadwal Hari Ini" value={String(todayCount)} hint={`${inTransit} sedang loading/transit`} icon={<ClipboardList size={16} />} tone="brand" />
        <KpiTile label="Armada Berangkat" value={`${departedVehicles}/${vehicles.length}`} hint="hari ini" icon={<Navigation2 size={16} />} tone="brand" />
        <KpiTile label="Menunggu Approval" value={String(pendingApprovals.length)} hint="petty cash, diskon, dll" icon={<CheckSquare size={16} />} tone="warning" />
        <KpiTile label="Task Terbuka" value={String(openTasks.length)} hint={`${openTasks.filter((t) => t.priority === 'high').length} prioritas tinggi`} icon={<ListChecks size={16} />} tone="neutral" />
      </div>

      <SectionHeading
        title="Perlu Perhatian"
        hint={`${activeAlerts.length} alert aktif`}
        action={
          <Link to="/alerts" className="text-xs font-semibold text-signal-700">
            Lihat semua →
          </Link>
        }
      />
      <div className="space-y-2.5">
        {activeAlerts.slice(0, 5).map((alert) => {
          const Icon = severityIcon[alert.severity]
          return (
            <Card key={alert.id} className="flex items-start gap-3 py-3">
              <Icon
                size={16}
                className={`mt-0.5 shrink-0 ${
                  alert.severity === 'critical' ? 'text-crimson-600' : alert.severity === 'warning' ? 'text-amber-600' : 'text-azure-600'
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm text-ink-800">{alert.message}</p>
                <Link to={alert.relatedPath} className="text-xs font-semibold text-signal-700 underline underline-offset-2">
                  {alert.relatedLabel}
                </Link>
              </div>
            </Card>
          )
        })}
        {activeAlerts.length === 0 && <Card className="text-sm text-ink-400">Tidak ada alert aktif. Semua operasional aman.</Card>}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <SectionHeading
            title="Approvals Pending"
            action={
              <Link to="/approvals" className="text-xs font-semibold text-signal-700">
                Buka →
              </Link>
            }
          />
          <Card className="divide-y divide-ink-100 p-0">
            {pendingApprovals.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-800">{a.title}</p>
                  <p className="text-xs text-ink-400">{a.requestedBy}</p>
                </div>
                <StatusPill tone="warning">Pending</StatusPill>
              </div>
            ))}
            {pendingApprovals.length === 0 && <p className="px-4 py-4 text-sm text-ink-400">Tidak ada approval pending.</p>}
          </Card>
        </div>

        <div>
          <SectionHeading
            title="Status Armada"
            action={
              <Link to="/loading-plan" className="text-xs font-semibold text-signal-700">
                Loading Plan →
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-2.5">
            {vehicles.map((vehicle) => {
              const plan = dispatchPlans.find((d) => d.vehicleId === vehicle.id)
              const theme = themeForKey(vehicle.id)
              return (
                <Card key={vehicle.id} className={`border-l-4 ${theme.border}`}>
                  <p className="font-bold text-ink-900">{vehicle.name}</p>
                  <p className="text-xs text-ink-500">{plan?.soIds.length ?? 0} SO</p>
                  <div className="mt-2">
                    {plan?.status === 'departed' ? (
                      <StatusPill tone="success">Berangkat {plan.departedAt}</StatusPill>
                    ) : (
                      <StatusPill tone="neutral">Belum Berangkat</StatusPill>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      <SectionHeading title="Ringkasan Status SO" hint="Distribusi seluruh SO aktif per tahapan" />
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-8">
        {(Object.keys(soStatusMeta) as (keyof typeof soStatusMeta)[]).map((status) => {
          const count = salesOrders.filter((so) => so.status === status).length
          return (
            <Card key={status} className="text-center">
              <p className="text-xl font-extrabold text-ink-900">{count}</p>
              <StatusPill tone={soStatusMeta[status].tone}>{soStatusMeta[status].label}</StatusPill>
            </Card>
          )
        })}
      </div>
    </Layout>
  )
}
