import { Layout } from '../components/Layout'
import { Card, SectionHeading } from '../components/ui'
import { StatusPill } from '../components/StatusPill'
import { useAppStore } from '../store/AppStore'
import { formatDateShort } from '../lib/format'
import type { TaskCategory, TaskPriority, TaskStatus } from '../types'

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To Do' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'done', label: 'Done' },
]

const categoryLabel: Record<TaskCategory, string> = {
  dispatch: 'Dispatch',
  documentation: 'Dokumen',
  finance: 'Finance',
  fleet: 'Fleet',
  customer: 'Customer',
  general: 'Umum',
}

const priorityDot: Record<TaskPriority, string> = {
  high: 'bg-crimson-600',
  medium: 'bg-amber-600',
  low: 'bg-ink-400',
}

const nextStatus: Record<TaskStatus, TaskStatus | null> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: null,
}

export default function Tasks() {
  const { tasks, updateTaskStatus } = useAppStore()

  return (
    <Layout title="Tasks" subtitle="Pantau pekerjaan operasional lintas tim sampai selesai">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {columns.map((col) => {
          const items = tasks.filter((t) => t.status === col.status)
          return (
            <div key={col.status}>
              <SectionHeading title={`${col.label} (${items.length})`} />
              <div className="space-y-3">
                {items.map((task) => {
                  const advance = nextStatus[task.status]
                  return (
                    <Card key={task.id}>
                      <div className="flex items-start gap-2">
                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${priorityDot[task.priority]}`} />
                        <p className="text-sm font-semibold text-ink-900">{task.title}</p>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <StatusPill tone="neutral">{categoryLabel[task.category]}</StatusPill>
                        {task.linkedSoNumber && (
                          <span className="rounded-md bg-signal-50 px-2 py-1 text-[11px] font-semibold text-signal-700">
                            {task.linkedSoNumber}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-ink-500">
                        {task.assignee} · due {formatDateShort(task.dueDate)}
                      </p>
                      {advance && (
                        <button
                          onClick={() => updateTaskStatus(task.id, advance)}
                          className="mt-3 w-full rounded-md border border-ink-200 py-1.5 text-xs font-bold text-ink-700 hover:bg-ink-50"
                        >
                          Pindah ke {columns.find((c) => c.status === advance)?.label} →
                        </button>
                      )}
                    </Card>
                  )
                })}
                {items.length === 0 && <p className="rounded-lg border border-dashed border-ink-200 p-4 text-center text-xs text-ink-400">Kosong</p>}
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  )
}
