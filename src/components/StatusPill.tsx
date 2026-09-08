import type { ReactNode } from 'react'

const styles = {
  neutral: 'bg-slate-100 text-slate-600',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-brand-100 text-brand-700',
} as const

export function StatusPill({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: keyof typeof styles
}) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${styles[tone]}`}>
      {children}
    </span>
  )
}
