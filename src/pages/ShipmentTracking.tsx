import { AlertTriangle, MapPin, Navigation, ThermometerSnowflake } from 'lucide-react'
import type { ReactNode } from 'react'
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Layout } from '../components/Layout'
import { Card, SectionHeading } from '../components/ui'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'
import { allSoStatuses, soStatusMeta } from '../lib/soStatus'
import { themeForKey } from '../lib/fleetTheme'

export default function ShipmentTracking() {
  const { salesOrders, customers, vehicles, liveStatus, dispatchPlans } = useAppStore()
  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? id
  const columns = allSoStatuses.filter((s) => s !== 'on_hold')

  return (
    <Layout title="Shipment Tracking" subtitle="Papan status pengiriman dan telemetri armada yang sedang jalan">
      <SectionHeading title="Papan Status Pengiriman" hint="Geser untuk lihat seluruh tahapan" />
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-max gap-3">
          {columns.map((status) => {
            const items = salesOrders.filter((so) => so.status === status)
            return (
              <div key={status} className="w-64 shrink-0 rounded-lg border border-ink-200 bg-ink-50/60 p-2.5">
                <div className="mb-2 flex items-center justify-between px-1">
                  <StatusPill tone={soStatusMeta[status].tone}>{soStatusMeta[status].label}</StatusPill>
                  <span className="text-xs font-bold text-ink-400">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map((so) => (
                    <div key={so.id} className="rounded-md border border-ink-200 bg-white p-2.5">
                      <p className="font-mono text-[11px] font-semibold text-ink-900">{so.soNumber}</p>
                      <p className="mt-0.5 truncate text-xs text-ink-600">{customerName(so.customerId)}</p>
                      {so.vehicleId && (
                        <p className="mt-1 text-[11px] font-medium text-signal-700">
                          {vehicles.find((v) => v.id === so.vehicleId)?.name}
                        </p>
                      )}
                    </div>
                  ))}
                  {items.length === 0 && <p className="px-1 py-3 text-center text-xs text-ink-300">Kosong</p>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <SectionHeading title="Telemetri Armada" hint="Posisi, ETA, dan suhu reefer real-time" />
      <div className="space-y-4">
        {vehicles.map((vehicle) => {
          const status = liveStatus.find((s) => s.vehicleId === vehicle.id)
          const plan = dispatchPlans.find((d) => d.vehicleId === vehicle.id)
          const theme = themeForKey(vehicle.id)
          if (!status) return null
          const outOfRange = status.currentTempC > vehicle.maxTempC || status.currentTempC < vehicle.minTempC
          const isMoving = plan?.status === 'departed'

          return (
            <Card key={vehicle.id} className={`border-l-4 ${theme.border}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-md text-xs font-bold text-white ${theme.chip}`}>
                    {vehicle.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-ink-900">{vehicle.name}</p>
                    <p className="text-xs text-ink-500">
                      {vehicle.plateNumber} · target {vehicle.minTempC}° s/d {vehicle.maxTempC}°C
                    </p>
                  </div>
                </div>
                {isMoving ? <StatusPill tone="info">Dalam Perjalanan</StatusPill> : <StatusPill tone="neutral">Standby</StatusPill>}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <MiniStat icon={<MapPin size={14} />} label="Lokasi Terakhir" value={status.lastLocation} sub={`${status.lastUpdateMinutesAgo} menit lalu`} span />
                <MiniStat
                  icon={<ThermometerSnowflake size={14} />}
                  label="Suhu Saat Ini"
                  value={`${status.currentTempC.toFixed(1)}°C`}
                  sub={outOfRange ? 'Di luar target' : 'Dalam target'}
                  alert={outOfRange}
                />
                <MiniStat icon={<Navigation size={14} />} label="Tujuan Berikutnya" value={status.nextStop} sub={`${status.progressPct}% rute`} />
                <div className="flex flex-col justify-center">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
                    <div className={`h-full ${theme.chip}`} style={{ width: `${status.progressPct}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-ink-400">Progress rute hari ini</p>
                </div>
              </div>

              {status.alert && (
                <div className="mt-3 flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  {status.alert}
                </div>
              )}

              {status.tempLog.length > 1 && (
                <div className="mt-3 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={status.tempLog} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#efebe0" />
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#a39c90" />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        stroke="#a39c90"
                        allowDecimals={false}
                        domain={[
                          Math.floor(Math.min(vehicle.minTempC, ...status.tempLog.map((p) => p.tempC)) - 2),
                          Math.ceil(Math.max(vehicle.maxTempC, ...status.tempLog.map((p) => p.tempC)) + 2),
                        ]}
                      />
                      <Tooltip formatter={(v) => [`${v}°C`, 'Suhu']} />
                      <ReferenceLine y={vehicle.maxTempC} stroke="#b9711a" strokeDasharray="4 4" />
                      <ReferenceLine y={vehicle.minTempC} stroke="#b9711a" strokeDasharray="4 4" />
                      <Line type="monotone" dataKey="tempC" stroke="#147361" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </Layout>
  )
}

function MiniStat({
  icon,
  label,
  value,
  sub,
  span,
  alert,
}: {
  icon: ReactNode
  label: string
  value: string
  sub: string
  span?: boolean
  alert?: boolean
}) {
  return (
    <div className={`rounded-md bg-ink-50 p-2.5 ${span ? 'col-span-2 sm:col-span-1' : ''}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
        {icon}
        {label}
      </div>
      <p className={`mt-0.5 truncate text-sm font-bold ${alert ? 'text-crimson-600' : 'text-ink-900'}`}>{value}</p>
      <p className={`text-[11px] ${alert ? 'text-crimson-500' : 'text-ink-400'}`}>{sub}</p>
    </div>
  )
}
