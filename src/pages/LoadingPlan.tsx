import { Layout } from '../components/Layout'
import { Card } from '../components/ui'
import { VehicleLoadingCard } from '../components/VehicleLoadingCard'
import { useAppStore } from '../store/AppStore'
import { formatDateLong } from '../lib/format'
import { TODAY } from '../data/constants'

export default function LoadingPlan() {
  const { vehicles, dispatchPlans, salesOrders, customers } = useAppStore()
  const customerNameOf = (id: string) => customers.find((c) => c.id === id)?.name ?? id

  return (
    <Layout title="Loading Plan" subtitle="Isi qty kirim, driver/helper per armada, lalu tandai Armada Berangkat">
      <Card>
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-ink-500">Tanggal Kirim</label>
          <span className="text-sm font-bold text-ink-900">{formatDateLong(TODAY)}</span>
        </div>
        <p className="mt-1 text-xs text-ink-400">Mengikuti tanggal kirim yang ditentukan di Dispatch Planning</p>
      </Card>

      <div className="mt-4 space-y-5">
        {vehicles.map((vehicle, idx) => {
          const plan = dispatchPlans.find((d) => d.vehicleId === vehicle.id)!
          const soList = salesOrders.filter((so) => plan.soIds.includes(so.id))
          return (
            <VehicleLoadingCard
              key={vehicle.id}
              vehicle={vehicle}
              index={idx}
              plan={plan}
              soList={soList}
              customerNameOf={customerNameOf}
            />
          )
        })}
      </div>
    </Layout>
  )
}
