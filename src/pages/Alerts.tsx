import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertOctagon, AlertTriangle, Info } from 'lucide-react'
import { Layout } from '../components/Layout'
import { Card, EmptyState, SectionHeading } from '../components/ui'
import { useAppStore } from '../store/AppStore'
import { formatDateTime } from '../lib/format'
import type { AlertSeverity } from '../types'

const severityMeta: Record<AlertSeverity, { icon: typeof AlertOctagon; classes: string; label: string }> = {
  critical: { icon: AlertOctagon, classes: 'bg-crimson-50 text-crimson-700', label: 'Kritikal' },
  warning: { icon: AlertTriangle, classes: 'bg-amber-50 text-amber-700', label: 'Peringatan' },
  info: { icon: Info, classes: 'bg-azure-50 text-azure-700', label: 'Info' },
}

const categoryLabel: Record<string, string> = {
  cold_chain: 'Cold Chain',
  petty_cash: 'Petty Cash',
  compliance: 'Compliance',
  fleet: 'Fleet',
  sla: 'SLA',
}

export default function Alerts() {
  const { alerts, resolveAlert } = useAppStore()
  const [showResolved, setShowResolved] = useState(false)

  const active = alerts.filter((a) => !a.resolved)
  const resolved = alerts.filter((a) => a.resolved)
  const list = showResolved ? resolved : active

  return (
    <Layout title="Alerts" subtitle="Semua peringatan operasional dalam satu tempat, terurut dari yang paling kritikal">
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setShowResolved(false)}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            !showResolved ? 'bg-ink-900 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
          }`}
        >
          Aktif ({active.length})
        </button>
        <button
          onClick={() => setShowResolved(true)}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            showResolved ? 'bg-ink-900 text-white' : 'border border-ink-200 bg-white text-ink-600 hover:bg-ink-50'
          }`}
        >
          Selesai ({resolved.length})
        </button>
      </div>

      <SectionHeading title={showResolved ? 'Riwayat Selesai' : 'Perlu Tindakan'} />
      <div className="space-y-3">
        {list
          .slice()
          .sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'critical' ? -1 : b.severity === 'critical' ? 1 : 0))
          .map((alert) => {
            const meta = severityMeta[alert.severity]
            const Icon = meta.icon
            return (
              <Card key={alert.id}>
                <div className="flex items-start gap-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${meta.classes}`}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                      <span>{meta.label}</span>
                      <span>·</span>
                      <span>{categoryLabel[alert.category]}</span>
                      <span>·</span>
                      <span>{formatDateTime(alert.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-ink-800">{alert.message}</p>
                    <Link to={alert.relatedPath} className="mt-1 inline-block text-xs font-semibold text-signal-700 underline underline-offset-2">
                      Lihat {alert.relatedLabel} →
                    </Link>
                  </div>
                  {!alert.resolved && (
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="shrink-0 rounded-md border border-ink-200 px-2.5 py-1.5 text-xs font-bold text-ink-600 hover:bg-ink-50"
                    >
                      Tandai Selesai
                    </button>
                  )}
                </div>
              </Card>
            )
          })}
        {list.length === 0 && <EmptyState text={showResolved ? 'Belum ada alert yang diselesaikan.' : 'Tidak ada alert aktif. Semua aman.'} />}
      </div>
    </Layout>
  )
}
