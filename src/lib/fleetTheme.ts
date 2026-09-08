import type { FleetType } from '../types'

interface FleetTheme {
  border: string
  cardBg: string
  avatarBg: string
  text: string
}

const themes: Record<FleetType, FleetTheme> = {
  thermo: {
    border: 'border-l-thermo-700',
    cardBg: 'bg-thermo-50',
    avatarBg: 'bg-thermo-700',
    text: 'text-thermo-700',
  },
  coldspace: {
    border: 'border-l-cold-700',
    cardBg: 'bg-cold-50',
    avatarBg: 'bg-cold-700',
    text: 'text-cold-700',
  },
  luxio: {
    border: 'border-l-luxio-700',
    cardBg: 'bg-luxio-50',
    avatarBg: 'bg-luxio-700',
    text: 'text-luxio-700',
  },
  glacia: {
    border: 'border-l-ambient-700',
    cardBg: 'bg-ambient-50',
    avatarBg: 'bg-ambient-700',
    text: 'text-ambient-700',
  },
}

export function fleetTheme(type: FleetType): FleetTheme {
  return themes[type]
}

export function initials(name: string) {
  return name.slice(0, 2).toUpperCase()
}
