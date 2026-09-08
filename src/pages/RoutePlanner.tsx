import { Layout } from '../components/Layout'
import { useAppStore } from '../store/AppStore'
import { formatDateLong } from '../lib/format'
import { fleetTheme } from '../lib/fleetTheme'
import { TODAY } from '../data/seed'

export default function RoutePlanner() {
  const { fleets, assignments, salesOrders, moveSoToFleet } = useAppStore()

  const fleetOf = (soId: string) => assignments.find((a) => a.soIds.includes(soId))?.fleetId ?? ''

  return (
    <Layout title="Route Planner" subtitle="Assign setiap SO ke armada untuk tanggal kirim, lalu lanjut ke Loading Plan">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-500">Tanggal Kirim</label>
          <span className="text-sm font-bold text-navy-900">{formatDateLong(TODAY)}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {fleets.map((fleet) => {
          const theme = fleetTheme(fleet.type)
          const count = assignments.find((a) => a.fleetId === fleet.id)?.soIds.length ?? 0
          const totalLines = salesOrders
            .filter((so) => fleetOf(so.id) === fleet.id)
            .flatMap((so) => so.lines).length
          return (
            <div key={fleet.id} className={`rounded-xl border-l-4 ${theme.border} bg-white p-3 shadow-sm`}>
              <p className="text-sm font-bold text-navy-900">{fleet.name}</p>
              <p className="text-xs text-slate-400">
                {count} SO · {totalLines} baris SKU · kapasitas {fleet.capacityKg}kg
              </p>
            </div>
          )
        })}
      </div>

      <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-2.5">Customer / No SO</th>
              <th className="px-4 py-2.5">Jumlah SKU</th>
              <th className="px-4 py-2.5">Armada</th>
            </tr>
          </thead>
          <tbody>
            {salesOrders.map((so) => (
              <tr key={so.id} className="border-t border-slate-100">
                <td className="px-4 py-2.5">
                  <p className="font-semibold text-navy-900">{so.customerName}</p>
                  <p className="text-xs text-slate-400">{so.soNumber}</p>
                </td>
                <td className="px-4 py-2.5 text-slate-600">{so.lines.length}</td>
                <td className="px-4 py-2.5">
                  <select
                    value={fleetOf(so.id)}
                    onChange={(e) => moveSoToFleet(so.id, e.target.value || null)}
                    className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm"
                  >
                    <option value="">Belum di-assign</option>
                    {fleets.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}
