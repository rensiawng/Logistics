import type { ReactNode } from 'react'
import { AlertTriangle, MapPin, Navigation, ThermometerSnowflake } from 'lucide-react'
import { CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Layout } from '../components/Layout'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'
import { fleetTheme, initials } from '../lib/fleetTheme'

export default function FleetTracking() {
  const { fleets, liveStatus, assignments } = useAppStore()

  return (
    <Layout title="Fleet Tracking" subtitle="Pantau posisi, ETA, dan suhu reefer secara real-time untuk jaga cold chain">
      <div className="space-y-4">
        {fleets.map((fleet) => {
          const status = liveStatus.find((s) => s.fleetId === fleet.id)
          const assignment = assignments.find((a) => a.fleetId === fleet.id)
          const theme = fleetTheme(fleet.type)
          if (!status) return null
          const outOfRange = status.currentTempC > fleet.maxTempC || status.currentTempC < fleet.minTempC
          const isMoving = assignment?.status === 'berangkat'

          return (
            <div key={fleet.id} className={`rounded-xl border-l-4 ${theme.border} bg-white p-4 shadow-sm`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${theme.avatarBg} text-xs font-bold text-white`}>
                    {initials(fleet.name)}
                  </div>
                  <div>
                    <p className="font-bold text-navy-900">{fleet.name}</p>
                    <p className="text-xs text-slate-500">{fleet.plateNumber} · target {fleet.minTempC}° s/d {fleet.maxTempC}°C</p>
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
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full ${theme.avatarBg}`} style={{ width: `${status.progressPct}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">Progress rute hari ini</p>
                </div>
              </div>

              {status.alert && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  {status.alert}
                </div>
              )}

              {status.tempLog.length > 1 && (
                <div className="mt-3 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={status.tempLog} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eef1f6" />
                      <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        stroke="#94a3b8"
                        allowDecimals={false}
                        domain={[
                          Math.floor(Math.min(fleet.minTempC, ...status.tempLog.map((p) => p.tempC)) - 2),
                          Math.ceil(Math.max(fleet.maxTempC, ...status.tempLog.map((p) => p.tempC)) + 2),
                        ]}
                      />
                      <Tooltip formatter={(v) => [`${v}°C`, 'Suhu']} />
                      <ReferenceLine y={fleet.maxTempC} stroke="#f59e0b" strokeDasharray="4 4" />
                      <ReferenceLine y={fleet.minTempC} stroke="#f59e0b" strokeDasharray="4 4" />
                      <Line type="monotone" dataKey="tempC" stroke="#5a70ab" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
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
    <div className={`rounded-lg bg-slate-50 p-2.5 ${span ? 'col-span-2 sm:col-span-1' : ''}`}>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {icon}
        {label}
      </div>
      <p className={`mt-0.5 truncate text-sm font-bold ${alert ? 'text-red-600' : 'text-navy-900'}`}>{value}</p>
      <p className={`text-[11px] ${alert ? 'text-red-500' : 'text-slate-400'}`}>{sub}</p>
    </div>
  )
}
