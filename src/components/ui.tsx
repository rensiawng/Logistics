import type { ReactNode } from 'react'

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-ink-200 bg-white p-4 ${className}`}>{children}</div>
}

export function SectionHeading({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-ink-800">{title}</h3>
        {hint && <p className="text-xs text-ink-400">{hint}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ text }: { text: string }) {
  return <p className="rounded-lg border border-dashed border-ink-200 bg-ink-50 p-6 text-center text-sm text-ink-400">{text}</p>
}

export function KpiTile({
  label,
  value,
  hint,
  icon,
  tone = 'neutral',
}: {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
  tone?: 'neutral' | 'brand' | 'warning' | 'danger' | 'success'
}) {
  const toneStyles = {
    neutral: 'bg-ink-100 text-ink-700',
    brand: 'bg-signal-100 text-signal-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-crimson-50 text-crimson-700',
    success: 'bg-moss-50 text-moss-700',
  }
  return (
    <Card>
      {icon && <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-md ${toneStyles[tone]}`}>{icon}</div>}
      <p className="text-xl font-extrabold text-ink-900">{value}</p>
      <p className="text-xs font-semibold text-ink-600">{label}</p>
      {hint && <p className="text-[11px] text-ink-400">{hint}</p>}
    </Card>
  )
}

export function Avatar({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white ${className}`}>
      {label}
    </div>
  )
}
