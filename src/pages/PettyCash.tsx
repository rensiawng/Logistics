import type { ReactNode } from 'react'
import { Image, Trash2 } from 'lucide-react'
import { Layout } from '../components/Layout'
import { useAppStore } from '../store/AppStore'
import { formatDateShort, formatRupiah } from '../lib/format'
import type { PettyCashRecap } from '../types'

export default function PettyCash() {
  const { recaps, fleets, removePettyCashItem, advanceRecapStatus } = useAppStore()

  const perluVerifikasi = recaps.filter((r) => r.status === 'perlu_verifikasi')
  const siapRefill = recaps.filter((r) => r.status === 'siap_refill')
  const nungguApproval = recaps.filter((r) => r.status === 'nunggu_approval')

  const sum = (list: PettyCashRecap[]) => list.reduce((s, r) => s + r.items.reduce((x, i) => x + i.amount, 0), 0)

  const fleetName = (id: string) => fleets.find((f) => f.id === id)?.name ?? id

  return (
    <Layout title="Petty Cash">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <SummaryCard label="Perlu Verifikasi" value={formatRupiah(sum(perluVerifikasi))} hint={`${perluVerifikasi.length} rekap dari driver`} />
        <SummaryCard label="Siap Refill" value={formatRupiah(sum(siapRefill))} hint={`${siapRefill.length} rekap terverifikasi`} />
        <SummaryCard label="Nunggu Approval Finance" value={formatRupiah(sum(nungguApproval))} hint={`${nungguApproval.length} pengajuan refill`} />
      </div>

      <Section title={`Perlu Verifikasi (${perluVerifikasi.length})`}>
        {perluVerifikasi.map((recap) => (
          <RecapCard key={recap.id} recap={recap} fleetName={fleetName(recap.fleetId)}>
            <ItemList recap={recap} onDelete={(itemId) => removePettyCashItem(recap.id, itemId)} editable />
            <button
              onClick={() => advanceRecapStatus(recap.id, 'siap_refill')}
              className="mt-3 w-full rounded-lg bg-brand-500 py-2.5 text-sm font-bold text-white hover:bg-brand-600 sm:w-auto sm:px-6"
            >
              Verifikasi & Ajukan Refill
            </button>
          </RecapCard>
        ))}
        {perluVerifikasi.length === 0 && <EmptyState text="Tidak ada rekap yang perlu diverifikasi." />}
      </Section>

      <Section title={`Siap Refill (${siapRefill.length})`}>
        {siapRefill.map((recap) => (
          <RecapCard key={recap.id} recap={recap} fleetName={fleetName(recap.fleetId)}>
            <ItemList recap={recap} />
            <button
              onClick={() => advanceRecapStatus(recap.id, 'nunggu_approval')}
              className="mt-3 w-full rounded-lg bg-brand-500 py-2.5 text-sm font-bold text-white hover:bg-brand-600 sm:w-auto sm:px-6"
            >
              Ajukan ke Finance
            </button>
          </RecapCard>
        ))}
        {siapRefill.length === 0 && <EmptyState text="Belum ada rekap terverifikasi yang siap refill." />}
      </Section>

      <Section title={`Nunggu Approval Finance (${nungguApproval.length})`}>
        {nungguApproval.map((recap) => (
          <RecapCard key={recap.id} recap={recap} fleetName={fleetName(recap.fleetId)}>
            <ItemList recap={recap} />
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => advanceRecapStatus(recap.id, 'selesai')}
                className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-bold text-white hover:bg-green-700"
              >
                Approve & Refill
              </button>
              <button
                onClick={() => advanceRecapStatus(recap.id, 'perlu_verifikasi')}
                className="flex-1 rounded-lg border border-red-300 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50"
              >
                Kembalikan
              </button>
            </div>
          </RecapCard>
        ))}
        {nungguApproval.length === 0 && <EmptyState text="Tidak ada pengajuan refill yang menunggu approval." />}
      </Section>
    </Layout>
  )
}

function SummaryCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-navy-900">{value}</p>
      <p className="text-xs text-slate-500">{hint}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 text-base font-bold text-navy-900">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-xl bg-white p-4 text-sm text-slate-400 shadow-sm">{text}</p>
}

function RecapCard({ recap, fleetName, children }: { recap: PettyCashRecap; fleetName: string; children: ReactNode }) {
  const total = recap.items.reduce((s, i) => s + i.amount, 0)
  const overBudget = total > recap.budget
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-bold text-navy-900">
            {fleetName} · Rit {recap.rit} · {formatDateShort(recap.tanggal)} · {recap.picName}
          </p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-extrabold ${overBudget ? 'text-amber-600' : 'text-navy-900'}`}>{formatRupiah(total)}</p>
          <p className="text-xs text-slate-400">/ budget {formatRupiah(recap.budget)}</p>
        </div>
      </div>
      {overBudget && (
        <p className="mt-1 text-xs font-semibold text-amber-600">
          Melebihi budget {formatRupiah(total - recap.budget)} — perlu catatan approval
        </p>
      )}
      {children}
    </div>
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
    <div className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-100">
      {recap.items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400">
            <Image size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-navy-900">{item.label}</p>
            <p className="text-xs capitalize text-slate-400">{item.category}</p>
          </div>
          <p className="shrink-0 text-sm font-bold text-navy-900">{formatRupiah(item.amount)}</p>
          {editable && onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="shrink-0 rounded-md p-1.5 text-red-500 hover:bg-red-50"
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
