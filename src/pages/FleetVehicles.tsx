import { AlertTriangle } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Card } from '../components/ui'
import { useAppStore } from '../store/AppStore'
import { themeForKey } from '../lib/fleetTheme'
import { daysUntil, formatDateShort } from '../lib/format'

const categoryLabel: Record<string, string> = {
  reefer: 'Reefer (Frozen)',
  chiller: 'Chiller',
  dry_van: 'Dry Van',
  pickup: 'Pickup',
}

export default function FleetVehicles() {
  const { vehicles, personnel } = useAppStore()

  return (
    <Layout title="Fleet & Vehicles" subtitle="Data master kendaraan, dokumen, dan jadwal perawatan">
      <div className="space-y-4">
        {vehicles.map((vehicle) => {
          const theme = themeForKey(vehicle.id)
          const driver = personnel.find((p) => p.id === vehicle.assignedDriverId)
          const docs = [
            { label: 'STNK', date: vehicle.stnkExpiry },
            { label: 'KIR', date: vehicle.kirExpiry },
            { label: 'Asuransi', date: vehicle.insuranceExpiry },
          ]
          const kmToService = vehicle.nextServiceKm - vehicle.odometerKm
          const serviceSoon = kmToService <= 1000

          return (
            <Card key={vehicle.id} className={`border-l-4 ${theme.border}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-md text-sm font-bold text-white ${theme.chip}`}>
                    {vehicle.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-bold text-ink-900">{vehicle.name}</p>
                    <p className="text-xs text-ink-500">
                      {vehicle.plateNumber} · {categoryLabel[vehicle.category]} · {vehicle.capacityKg}kg
                    </p>
                  </div>
                </div>
                <p className="text-xs text-ink-500">
                  Driver tetap: <span className="font-semibold text-ink-800">{driver?.name ?? '—'}</span>
                </p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {docs.map((doc) => {
                  const days = daysUntil(doc.date)
                  const urgent = days < 45
                  return (
                    <div key={doc.label} className="rounded-md bg-ink-50 p-2.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">{doc.label}</p>
                      <p className={`text-sm font-bold ${urgent ? 'text-crimson-600' : 'text-ink-900'}`}>{formatDateShort(doc.date)}</p>
                      <p className={`text-[11px] ${urgent ? 'text-crimson-500' : 'text-ink-400'}`}>
                        {days >= 0 ? `${days} hari lagi` : 'sudah lewat'}
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-3 rounded-md bg-ink-50 p-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink-500">Odometer</span>
                  <span className="font-bold text-ink-900">{vehicle.odometerKm.toLocaleString('id-ID')} km</span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink-200">
                  <div
                    className={`h-full ${serviceSoon ? 'bg-amber-600' : 'bg-signal-600'}`}
                    style={{ width: `${Math.min(100, (vehicle.odometerKm / vehicle.nextServiceKm) * 100)}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-ink-400">Servis berikutnya di {vehicle.nextServiceKm.toLocaleString('id-ID')} km</p>
              </div>

              {serviceSoon && (
                <div className="mt-3 flex items-center gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                  <AlertTriangle size={14} />
                  Servis rutin tinggal {kmToService.toLocaleString('id-ID')} km lagi — jadwalkan segera.
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </Layout>
  )
}
