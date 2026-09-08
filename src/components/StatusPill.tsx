import type { ReactNode } from 'react'

const dot = {
  neutral: 'bg-ink-400',
  success: 'bg-moss-600',
  warning: 'bg-amber-600',
  danger: 'bg-crimson-600',
  info: 'bg-azure-600',
  brand: 'bg-signal-600',
} as const

const text = {
  neutral: 'text-ink-600 bg-ink-100',
  success: 'text-moss-700 bg-moss-50',
  warning: 'text-amber-700 bg-amber-50',
  danger: 'text-crimson-700 bg-crimson-50',
  info: 'text-azure-700 bg-azure-50',
  brand: 'text-signal-700 bg-signal-50',
} as const

export function StatusPill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: keyof typeof dot
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap ${text[tone]}`}
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot[tone]}`} />
      {children}
    </span>
  )
}
