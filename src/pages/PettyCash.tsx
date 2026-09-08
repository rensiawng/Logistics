import type { ReactNode } from 'react'
import { Fuel, ParkingCircle, Receipt, Trash2 } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Card, SectionHeading, EmptyState, KpiTile } from '../components/ui'
import { useAppStore } from '../store/AppStore'
import { formatDateShort, formatRupiah } from '../lib/format'
import type { PettyCashRecap } from '../types'

const categoryIcon: Record<string, ReactNode> = {
  tol: <Receipt size={15} />,
  parkir: <ParkingCircle size={15} />,
  bbm: <Fuel size={15} />,
  lainnya: <Receipt size={15} />,
}

export default function PettyCash() {
  const { recaps, vehicles, removePettyCashItem, advanceRecapStatus } = useAppStore()

  const perluVerifikasi = recaps.filter((r) => r.status === 'perlu_verifikasi')
  const siapRefill = recaps.filter((r) => r.status === 'siap_refill')
  const nungguApproval = recaps.filter((r) => r.status === 'nunggu_approval')

  const sum = (list: PettyCashRecap[]) => list.reduce((s, r) => s + r.items.reduce((x, i) => x + i.amount, 0), 0)
  const vehicleName = (id: string) => vehicles.find((v) => v.id === id)?.name ?? id

  return (
    <Layout title="Petty Cash" subtitle="Alur verifikasi hingga approval refill kas kecil per armada">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiTile label="Perlu Verifikasi" value={formatRupiah(sum(perluVerifikasi))} hint={`${perluVerifikasi.length} rekap dari driver`} tone="warning" />
        <KpiTile label="Siap Refill" value={formatRupiah(sum(siapRefill))} hint={`${siapRefill.length} rekap terverifikasi`} tone="brand" />
        <KpiTile label="Nunggu Approval Finance" value={formatRupiah(sum(nungguApproval))} hint={`${nungguApproval.length} pengajuan refill`} tone="danger" />
      </div>

      <SectionHeading title={`Perlu Verifikasi (${perluVerifikasi.length})`} />
      <div className="space-y-4">
        {perluVerifikasi.map((recap) => (
          <RecapCard key={recap.id} recap={recap} vehicleName={vehicleName(recap.vehicleId)}>
            <ItemList recap={recap} onDelete={(itemId) => removePettyCashItem(recap.id, itemId)} editable />
            <button
              onClick={() => advanceRecapStatus(recap.id, 'siap_refill')}
              className="mt-3 w-full rounded-md bg-signal-600 py-2.5 text-sm font-bold text-white hover:bg-signal-700 sm:w-auto sm:px-6"
            >
              Verifikasi & Ajukan Refill
            </button>
          </RecapCard>
        ))}
        {perluVerifikasi.length === 0 && <EmptyState text="Tidak ada rekap yang perlu diverifikasi." />}
      </div>

      <SectionHeading title={`Siap Refill (${siapRefill.length})`} />
      <div className="space-y-4">
        {siapRefill.map((recap) => (
          <RecapCard key={recap.id} recap={recap} vehicleName={vehicleName(recap.vehicleId)}>
            <ItemList recap={recap} />
            <button
              onClick={() => advanceRecapStatus(recap.id, 'nunggu_approval')}
              className="mt-3 w-full rounded-md bg-signal-600 py-2.5 text-sm font-bold text-white hover:bg-signal-700 sm:w-auto sm:px-6"
            >
              Ajukan ke Finance
            </button>
          </RecapCard>
        ))}
        {siapRefill.length === 0 && <EmptyState text="Belum ada rekap terverifikasi yang siap refill." />}
      </div>

      <SectionHeading title={`Nunggu Approval Finance (${nungguApproval.length})`} hint="Keputusan akhir dilakukan di halaman Approvals" />
      <div className="space-y-4">
        {nungguApproval.map((recap) => (
          <RecapCard key={recap.id} recap={recap} vehicleName={vehicleName(recap.vehicleId)}>
            <ItemList recap={recap} />
          </RecapCard>
        ))}
        {nungguApproval.length === 0 && <EmptyState text="Tidak ada pengajuan refill yang menunggu approval." />}
      </div>
    </Layout>
  )
}

function RecapCard({ recap, vehicleName, children }: { recap: PettyCashRecap; vehicleName: string; children: ReactNode }) {
  const total = recap.items.reduce((s, i) => s + i.amount, 0)
  const overBudget = total > recap.budget
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-bold text-ink-900">
            {vehicleName} · Rit {recap.rit} · {formatDateShort(recap.tanggal)} · {recap.picName}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-extrabold ${overBudget ? 'text-amber-700' : 'text-ink-900'}`}>{formatRupiah(total)}</p>
          <p className="text-xs text-ink-400">/ budget {formatRupiah(recap.budget)}</p>
        </div>
      </div>
      {overBudget && (
        <p className="mt-1 text-xs font-semibold text-amber-700">
          Melebihi budget {formatRupiah(total - recap.budget)} — perlu catatan approval
        </p>
      )}
      {children}
    </Card>
  )
}

function ItemList({
  recap,
  onDelete,
  editable = false,
}: {
  recap: PettyCashRecap
  onDelete?: (itemId: string) => void
  editable?: boolean
}) {
  return (
    <div className="mt-3 divide-y divide-ink-100 rounded-md border border-ink-100">
      {recap.items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink-100 text-ink-500">
            {categoryIcon[item.category]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink-900">{item.label}</p>
            <p className="text-xs capitalize text-ink-400">{item.category}</p>
          </div>
          <p className="shrink-0 text-sm font-bold text-ink-900">{formatRupiah(item.amount)}</p>
          {editable && onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="shrink-0 rounded-md p-1.5 text-crimson-600 hover:bg-crimson-50"
              aria-label="Hapus item"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
