const palette = [
  { border: 'border-l-signal-600', chip: 'bg-signal-600', tint: 'bg-signal-50', text: 'text-signal-700' },
  { border: 'border-l-azure-600', chip: 'bg-azure-600', tint: 'bg-azure-50', text: 'text-azure-700' },
  { border: 'border-l-amber-600', chip: 'bg-amber-600', tint: 'bg-amber-50', text: 'text-amber-700' },
  { border: 'border-l-moss-600', chip: 'bg-moss-600', tint: 'bg-moss-50', text: 'text-moss-700' },
  { border: 'border-l-ink-600', chip: 'bg-ink-700', tint: 'bg-ink-100', text: 'text-ink-700' },
  { border: 'border-l-crimson-600', chip: 'bg-crimson-600', tint: 'bg-crimson-50', text: 'text-crimson-700' },
]

export function themeForIndex(index: number) {
  return palette[index % palette.length]
}

export function themeForKey(key: string) {
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return palette[hash % palette.length]
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}
