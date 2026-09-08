import { Layout } from '../components/Layout'
import { Card, KpiTile, SectionHeading } from '../components/ui'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'
import { allDocumentStatuses, documentStatusMeta, documentTypeLabel } from '../lib/docMeta'
import { formatDateShort } from '../lib/format'
import type { DocumentStatus } from '../types'

export default function Documents() {
  const { documents, salesOrders, customers, updateDocumentStatus } = useAppStore()

  const customerName = (soId: string) => {
    const so = salesOrders.find((s) => s.id === soId)
    return so ? customers.find((c) => c.id === so.customerId)?.name ?? '' : ''
  }
  const missingCount = documents.filter((d) => d.status === 'missing').length
  const draftCount = documents.filter((d) => d.status === 'draft').length
  const issuedOrReceived = documents.filter((d) => d.status === 'issued' || d.status === 'received').length

  const soIds = Array.from(new Set(documents.map((d) => d.soId)))

  return (
    <Layout title="Documents" subtitle="Pastikan kelengkapan dokumen pengiriman sebelum armada berangkat">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiTile label="Dokumen Missing" value={String(missingCount)} hint="butuh tindakan segera" tone="danger" />
        <KpiTile label="Dokumen Draft" value={String(draftCount)} hint="menunggu diterbitkan" tone="warning" />
        <KpiTile label="Issued / Received" value={String(issuedOrReceived)} hint="sudah lengkap" tone="success" />
      </div>

      <SectionHeading title="Kelengkapan Dokumen per SO" />
      <div className="space-y-4">
        {soIds.map((soId) => {
          const so = salesOrders.find((s) => s.id === soId)!
          const docs = documents.filter((d) => d.soId === soId)
          return (
            <Card key={soId}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-mono text-xs font-semibold text-ink-900">{so.soNumber}</p>
                  <p className="text-sm font-bold text-ink-800">{customerName(soId)}</p>
                </div>
                <p className="text-xs text-ink-400">Tgl kirim {formatDateShort(so.deliveryDate)}</p>
              </div>
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-ink-400">
                      <th className="py-1.5 pr-3">Jenis Dokumen</th>
                      <th className="py-1.5 pr-3">Due Date</th>
                      <th className="py-1.5 pr-3">Status</th>
                      <th className="py-1.5 pr-3">Ubah</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((doc) => (
                      <tr key={doc.id} className="border-t border-ink-100">
                        <td className="py-2 pr-3 font-medium text-ink-800">{documentTypeLabel[doc.type]}</td>
                        <td className="py-2 pr-3 text-ink-500">{formatDateShort(doc.dueDate)}</td>
                        <td className="py-2 pr-3">
                          <StatusPill tone={documentStatusMeta[doc.status].tone}>{documentStatusMeta[doc.status].label}</StatusPill>
                        </td>
                        <td className="py-2 pr-3">
                          <select
                            value={doc.status}
                            onChange={(e) => updateDocumentStatus(doc.id, e.target.value as DocumentStatus)}
                            className="rounded-md border border-ink-200 px-2 py-1 text-xs"
                          >
                            {allDocumentStatuses.map((s) => (
                              <option key={s} value={s}>
                                {documentStatusMeta[s].label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {docs.some((d) => d.note) && (
                  <div className="mt-2 space-y-1">
                    {docs
                      .filter((d) => d.note)
                      .map((d) => (
                        <p key={d.id} className="rounded-md bg-amber-50 px-3 py-1.5 text-xs text-amber-700">
                          {documentTypeLabel[d.type]}: {d.note}
                        </p>
                      ))}
                  </div>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </Layout>
  )
}
