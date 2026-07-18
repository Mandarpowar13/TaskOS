import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format, isPast, startOfToday } from 'date-fns'
import { CalendarDays, CircleAlert, GripVertical, LoaderCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getTasks, updateTask } from '../../services/taskService'

const columns = [
  ['backlog', 'Backlog'],
  ['todo', 'To do'],
  ['in-progress', 'In progress'],
  ['waiting', 'Waiting'],
  ['review', 'Review'],
  ['completed', 'Completed'],
]

const priorityStyles = {
  low: 'border-slate-400',
  medium: 'border-blue-500',
  high: 'border-amber-500',
  critical: 'border-rose-500',
}

function refreshConnectedViews(queryClient) {
  ;['tasks', 'dashboard', 'analytics'].forEach((key) => queryClient.invalidateQueries({ queryKey: [key] }))
}

export default function KanbanPage() {
  const queryClient = useQueryClient()
  const [draggedTaskId, setDraggedTaskId] = useState(null)
  const [activeColumn, setActiveColumn] = useState(null)
  const { data, isLoading, isError } = useQuery({ queryKey: ['tasks'], queryFn: () => getTasks({ limit: 100 }) })
  const moveTask = useMutation({
    mutationFn: updateTask,
    onSuccess: () => refreshConnectedViews(queryClient),
  })
  const tasks = data?.data || []

  function moveToStatus(taskId, status) {
    const task = tasks.find((item) => item._id === taskId)
    if (task && task.status !== status) moveTask.mutate({ taskId, payload: { status } })
  }

  function handleDrop(event, status) {
    event.preventDefault()
    const taskId = event.dataTransfer.getData('text/task-id') || draggedTaskId
    if (taskId) moveToStatus(taskId, status)
    setDraggedTaskId(null)
    setActiveColumn(null)
  }

  return (
    <div className="mx-auto max-w-[1500px]">
      <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">Work flow</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">Kanban board</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Drag cards to update the same tasks used by your dashboard, calendar, analytics, and reports.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/tasks" className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">List view</Link>
          <Link to="/tasks?create=true" className="inline-flex h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"><Plus size={17} />New task</Link>
        </div>
      </section>

      {moveTask.isError && <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">Couldn&apos;t move that task. Please try again.</div>}

      {isLoading ? (
        <div className="grid min-h-80 place-items-center text-slate-400"><LoaderCircle className="animate-spin" /></div>
      ) : isError ? (
        <div className="card grid min-h-80 place-items-center text-center"><div><CircleAlert className="mx-auto mb-3 text-rose-500" /><p className="font-semibold dark:text-white">Couldn&apos;t load the board</p></div></div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-5">
          {columns.map(([status, label]) => {
            const columnTasks = tasks.filter((task) => task.status === status)
            return (
              <section key={status} className="w-72 shrink-0">
                <div className="mb-3 flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</h2>
                  <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-slate-800">{columnTasks.length}</span>
                </div>
                <div
                  onDragOver={(event) => { event.preventDefault(); setActiveColumn(status) }}
                  onDragLeave={() => setActiveColumn(null)}
                  onDrop={(event) => handleDrop(event, status)}
                  className={`min-h-52 space-y-3 rounded-2xl p-2 transition ${activeColumn === status ? 'bg-blue-100 ring-2 ring-blue-500/40 dark:bg-blue-500/10' : 'bg-slate-100/80 dark:bg-slate-900/70'}`}
                >
                  {columnTasks.length === 0 && <p className="px-2 py-5 text-center text-xs text-slate-400">Drop a task here</p>}
                  {columnTasks.map((task) => {
                    const overdue = task.dueDate && task.status !== 'completed' && isPast(new Date(task.dueDate)) && new Date(task.dueDate) < startOfToday()
                    return (
                      <article
                        key={task._id}
                        draggable={!moveTask.isPending}
                        onDragStart={(event) => { event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/task-id', task._id); setDraggedTaskId(task._id) }}
                        onDragEnd={() => { setDraggedTaskId(null); setActiveColumn(null) }}
                        className={`cursor-grab rounded-xl border-l-4 ${priorityStyles[task.priority]} bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing dark:bg-slate-800`}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical size={16} className="mt-0.5 shrink-0 text-slate-300 dark:text-slate-600" />
                          <div className="min-w-0 flex-1">
                            <p className={`text-sm font-semibold ${task.status === 'completed' ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>{task.title}</p>
                            {task.description && <p className="mt-1 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{task.description}</p>}
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
                          <span className="capitalize">{task.priority} priority</span>
                          {task.dueDate && <span className={`inline-flex items-center gap-1 ${overdue ? 'text-rose-600 dark:text-rose-400' : ''}`}><CalendarDays size={12} />{format(new Date(task.dueDate), 'MMM d')}</span>}
                        </div>
                        <p className="mt-2 truncate text-[11px] text-slate-400">{task.project?.name || 'No project'}</p>
                      </article>
                    )
                  })}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}
