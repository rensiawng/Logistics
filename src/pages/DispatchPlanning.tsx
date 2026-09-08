import { Layout } from '../components/Layout'
import { Card, SectionHeading } from '../components/ui'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'
import { formatDateLong } from '../lib/format'
import { themeForIndex } from '../lib/fleetTheme'
import { TODAY } from '../data/constants'

export default function DispatchPlanning() {
  const { vehicles, dispatchPlans, salesOrders, customers, moveSoToVehicle, updateDispatch } = useAppStore()

  const todaySo = salesOrders.filter((so) => so.deliveryDate === TODAY && so.status !== 'on_hold' && so.status !== 'draft')
  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? id
  const vehicleOf = (soId: string) => dispatchPlans.find((d) => d.soIds.includes(soId))?.vehicleId ?? ''

  return (
    <Layout title="Dispatch Planning" subtitle="Rencanakan rute dan armada untuk setiap SO sebelum masuk Loading Plan">
      <div className="rounded-lg border border-ink-200 bg-white p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-ink-500">Tanggal Kirim</span>
          <span className="font-bold text-ink-900">{formatDateLong(TODAY)}</span>
        </div>
      </div>

      <SectionHeading title="Armada Hari Ini" hint="Ringkasan rute dan kapasitas per kendaraan" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {vehicles.map((vehicle, idx) => {
          const theme = themeForIndex(idx)
          const plan = dispatchPlans.find((d) => d.vehicleId === vehicle.id)!
          const lineCount = salesOrders.filter((so) => plan.soIds.includes(so.id)).flatMap((so) => so.lines).length
          return (
            <Card key={vehicle.id} className={`border-l-4 ${theme.border}`}>
              <div className="flex items-center justify-between">
                <p className="font-bold text-ink-900">{vehicle.name}</p>
                <StatusPill tone={plan.status === 'departed' ? 'success' : 'neutral'}>
                  {plan.status === 'departed' ? 'Berangkat' : 'Planning'}
                </StatusPill>
              </div>
              <p className="mt-1 text-xs text-ink-500">{vehicle.plateNumber}</p>
              <label className="mt-3 block text-[10px] font-bold uppercase tracking-wide text-ink-400">Nama Rute</label>
              <input
                value={plan.routeName}
                onChange={(e) => updateDispatch(vehicle.id, { routeName: e.target.value })}
                className="mt-1 w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-sm"
                placeholder="Belum diberi nama"
              />
              <p className="mt-2 text-xs text-ink-500">
                {plan.soIds.length} SO · {lineCount} baris SKU · kapasitas {vehicle.capacityKg}kg
              </p>
            </Card>
          )
        })}
      </div>

      <SectionHeading title="Assign Sales Order" hint="Tentukan armada untuk setiap SO yang dikirim hari ini" />
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500">
                <th className="px-3 py-2">No SO</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Jumlah SKU</th>
                <th className="px-3 py-2">Armada</th>
              </tr>
            </thead>
            <tbody>
              {todaySo.map((so) => (
                <tr key={so.id} className="border-b border-ink-100">
                  <td className="px-3 py-2.5 font-mono text-xs font-semibold text-ink-900">{so.soNumber}</td>
                  <td className="px-3 py-2.5 text-ink-700">{customerName(so.customerId)}</td>
                  <td className="px-3 py-2.5 text-ink-500">{so.lines.length}</td>
                  <td className="px-3 py-2.5">
                    <select
                      value={vehicleOf(so.id)}
                      onChange={(e) => moveSoToVehicle(so.id, e.target.value || null)}
                      className="rounded-md border border-ink-200 px-2.5 py-1.5 text-sm"
                    >
                      <option value="">Belum di-assign</option>
                      {vehicles.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Layout>
  )
}
