import { Layout } from '../components/Layout'
import { FleetLoadingCard } from '../components/FleetLoadingCard'
import { useAppStore } from '../store/AppStore'
import { formatDateLong } from '../lib/format'
import { TODAY } from '../data/seed'

export default function LoadingPlan() {
  const { fleets, assignments, salesOrders } = useAppStore()

  return (
    <Layout title="Loading Plan" subtitle="Isi qty kirim + driver/helper per armada, lalu Save & Lock">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-500">Tanggal Kirim</label>
          <input
            type="text"
            readOnly
            value={formatDateLong(TODAY)}
            className="w-40 rounded-lg border border-slate-300 px-3 py-1.5 text-right text-sm font-medium text-navy-900"
          />
        </div>
        <p className="mt-1 text-xs text-slate-400">Filter berdasar tanggal kirim yang di-set Route Planner</p>
      </div>

      <div className="mt-4 space-y-5">
        {fleets.map((fleet) => {
          const assignment = assignments.find((a) => a.fleetId === fleet.id)!
          const soList = salesOrders.filter((so) => assignment.soIds.includes(so.id))
          return <FleetLoadingCard key={fleet.id} fleet={fleet} assignment={assignment} soList={soList} />
        })}
      </div>
    </Layout>
  )
}
