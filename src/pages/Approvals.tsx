import { Layout } from '../components/Layout'
import { Card, EmptyState, KpiTile, SectionHeading } from '../components/ui'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'
import { formatDateTime, formatRupiah } from '../lib/format'
import type { ApprovalType } from '../types'

const typeLabel: Record<ApprovalType, string> = {
  petty_cash: 'Petty Cash Refill',
  discount: 'Diskon',
  credit_term: 'Kredit Term',
  route_change: 'Perubahan Rute',
  document_exception: 'Pengecualian Dokumen',
}

export default function Approvals() {
  const { approvals, decideApproval } = useAppStore()
  const pending = approvals.filter((a) => a.status === 'pending')
  const decided = approvals.filter((a) => a.status !== 'pending')

  return (
    <Layout title="Approvals" subtitle="Pusat persetujuan lintas fungsi: petty cash, diskon, kredit, rute, dokumen">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiTile label="Menunggu Approval" value={String(pending.length)} tone="warning" />
        <KpiTile label="Disetujui" value={String(approvals.filter((a) => a.status === 'approved').length)} tone="success" />
        <KpiTile label="Ditolak" value={String(approvals.filter((a) => a.status === 'rejected').length)} tone="danger" />
      </div>

      <SectionHeading title={`Menunggu Approval (${pending.length})`} />
      <div className="space-y-3">
        {pending.map((a) => (
          <Card key={a.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill tone="info">{typeLabel[a.type]}</StatusPill>
                  <span className="font-mono text-xs text-ink-400">{a.refLabel}</span>
                </div>
                <p className="mt-1.5 font-bold text-ink-900">{a.title}</p>
                <p className="mt-0.5 text-sm text-ink-600">{a.description}</p>
                <p className="mt-1.5 text-xs text-ink-400">
                  Diajukan oleh {a.requestedBy} · {formatDateTime(a.createdAt)}
                </p>
              </div>
              {a.amount !== null && <p className="shrink-0 text-lg font-extrabold text-ink-900">{formatRupiah(a.amount)}</p>}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => decideApproval(a.id, 'approved')}
                className="flex-1 rounded-md bg-signal-600 py-2 text-sm font-bold text-white hover:bg-signal-700 sm:flex-none sm:px-6"
              >
                Approve
              </button>
              <button
                onClick={() => decideApproval(a.id, 'rejected')}
                className="flex-1 rounded-md border border-crimson-300 py-2 text-sm font-bold text-crimson-600 hover:bg-crimson-50 sm:flex-none sm:px-6"
              >
                Reject
              </button>
            </div>
          </Card>
        ))}
        {pending.length === 0 && <EmptyState text="Tidak ada pengajuan yang menunggu approval." />}
      </div>

      <SectionHeading title="Riwayat Keputusan" />
      <Card className="overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink-200 bg-ink-50 text-left text-[11px] font-bold uppercase tracking-wide text-ink-500">
              <th className="px-3 py-2">Judul</th>
              <th className="px-3 py-2">Tipe</th>
              <th className="px-3 py-2">Diajukan Oleh</th>
              <th className="px-3 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {decided.map((a) => (
              <tr key={a.id} className="border-t border-ink-100">
                <td className="px-3 py-2.5 text-ink-800">{a.title}</td>
                <td className="px-3 py-2.5 text-ink-500">{typeLabel[a.type]}</td>
                <td className="px-3 py-2.5 text-ink-500">{a.requestedBy}</td>
                <td className="px-3 py-2.5">
                  <StatusPill tone={a.status === 'approved' ? 'success' : 'danger'}>
                    {a.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                  </StatusPill>
                </td>
              </tr>
            ))}
            {decided.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-sm text-ink-400">
                  Belum ada riwayat keputusan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </Layout>
  )
}
