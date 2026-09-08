import { Fragment, useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Card, EmptyState } from '../components/ui'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'
import { formatDateShort } from '../lib/format'
import { allSoStatuses, soStatusMeta } from '../lib/soStatus'
import type { SoStatus } from '../types'

export default function SalesOrders() {
  const { salesOrders, customers, vehicles, updateSoStatus } = useAppStore()
  const [filter, setFilter] = useState<SoStatus | 'all'>('all')
  const [query, setQuery] = useState('')
  const [expanded, setExpanded] = useState<string | null>(null)

  const customerName = (id: string) => customers.find((c) => c.id === id)?.name ?? id
  const vehicleName = (id: string | null) => (id ? vehicles.find((v) => v.id === id)?.name ?? id : '—')

  const filtered = useMemo(() => {
    return salesOrders.filter((so) => {
      if (filter !== 'all' && so.status !== filter) return false
      if (!query.trim()) return true
      const q = query.toLowerCase()
      return so.soNumber.toLowerCase().includes(q) || customerName(so.customerId).toLowerCase().includes(q)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salesOrders, filter, query])

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: salesOrders.length }
    for (const so of salesOrders) map[so.status] = (map[so.status] ?? 0) + 1
    return map
  }, [salesOrders])

  return (
    <Layout title="Sales Orders" subtitle="Pantau seluruh SO dari draft sampai POD diterima">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <FilterChip label={`Semua (${counts.all})`} active={filter === 'all'} onClick={() => setFilter('all')} />
        {allSoStatuses.map((s) => (
          <FilterChip
            key={s}
            label={`${soStatusMeta[s].label} (${counts[s] ?? 0})`}
            active={filter === s}
            onClick={() => setFilter(s)}
          />
        ))}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari No SO atau customer…"
          className="ml-auto w-full rounded-md border border-ink-200 px-3 py-1.5 text-sm sm:w-64"
        />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-ink-200 bg-ink-50 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500">
                <th className="w-8 px-3 py-2"></th>
                <th className="px-3 py-2">No SO</th>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Tgl Order</th>
                <th className="px-3 py-2">Tgl Kirim</th>
                <th className="px-3 py-2">Armada</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((so) => {
                const isOpen = expanded === so.id
                return (
                  <Fragment key={so.id}>
                    <tr
                      className="cursor-pointer border-b border-ink-100 hover:bg-ink-50"
                      onClick={() => setExpanded(isOpen ? null : so.id)}
                    >
                      <td className="px-3 py-2.5 text-ink-400">
                        {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-xs font-semibold text-ink-900">{so.soNumber}</td>
                      <td className="px-3 py-2.5 font-medium text-ink-800">{customerName(so.customerId)}</td>
                      <td className="px-3 py-2.5 text-ink-500">{formatDateShort(so.orderDate)}</td>
                      <td className="px-3 py-2.5 text-ink-500">{formatDateShort(so.deliveryDate)}</td>
                      <td className="px-3 py-2.5 text-ink-500">{vehicleName(so.vehicleId)}</td>
                      <td className="px-3 py-2.5">
                        <StatusPill tone={soStatusMeta[so.status].tone}>{soStatusMeta[so.status].label}</StatusPill>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b border-ink-100 bg-ink-50/60">
                        <td colSpan={7} className="px-3 py-3">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <table className="w-full max-w-2xl text-xs">
                              <thead>
                                <tr className="text-left text-[10px] font-bold uppercase tracking-wide text-ink-400">
                                  <th className="py-1 pr-3">Kode SKU</th>
                                  <th className="py-1 pr-3">Nama SKU</th>
                                  <th className="py-1 pr-3">Qty</th>
                                </tr>
                              </thead>
                              <tbody>
                                {so.lines.map((line) => (
                                  <tr key={line.id} className="border-t border-ink-100">
                                    <td className="py-1.5 pr-3 font-mono text-ink-500">{line.skuCode}</td>
                                    <td className="py-1.5 pr-3 text-ink-700">{line.skuName}</td>
                                    <td className="py-1.5 pr-3 font-semibold text-ink-900">{line.qtyKirim}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <div className="shrink-0">
                              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-ink-400">
                                Ubah Status
                              </label>
                              <select
                                value={so.status}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => updateSoStatus(so.id, e.target.value as SoStatus)}
                                className="rounded-md border border-ink-200 px-2.5 py-1.5 text-xs"
                              >
                                {allSoStatuses.map((s) => (
                                  <option key={s} value={s}>
                                    {soStatusMeta[s].label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          {so.notes && (
                            <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">{so.notes}</p>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-4">
            <EmptyState text="Tidak ada SO yang cocok dengan filter." />
          </div>
        )}
      </Card>
    </Layout>
  )
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
        active ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 border border-ink-200 hover:bg-ink-50'
      }`}
    >
      {label}
    </button>
  )
}
